# server.py
import os
import json
import jwt
from passlib.context import CryptContext
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import uvicorn
from datetime import datetime, timedelta

# ▼ DB 연결
from sqlalchemy import create_engine, text

# .env에서 키/DB 정보 로드
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다!")

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://app:app@localhost:3306/collyai_dev")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24시간

# OAuth2 설정
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# 비밀번호 해싱 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 성별 enum
class Gender(Enum):
    NONE = 0
    MALE = 1
    FEMALE = 2

# 워크스페이스 등급
class WorkspaceGrade(Enum):
    SUPER_LEADER = 1
    LEADER = 2
    MEMBER = 3
    APPLICANT = 4
    WAITING = 5

# 요청 타입
class RequestType(Enum):
    REFERENCE = 1  # 추천서

# GPT 모델
llm = ChatOpenAI(model="gpt-4o", temperature=0, api_key=api_key)

# DB 엔진
engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중에는 모든 origin 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# ===== 추천서 요청 =====
class RecommendationRequest(BaseModel):
    recommender_email: str
    requester_name: str
    requester_email: str
    reason: str
    strengths: str
    highlight: str
    tone: str  # "Formal", "Friendly", "Concise", "Persuasive", "Neutral"
    selected_score: str  # 1~5점 (문자열로 받음)
    workspace_id: Optional[str] = None  # 워크스페이스 ID (선택, 문자열로 받음)

def generate_single_score_recommendation(inputs: RecommendationRequest, score: int) -> str:
    """
    선택한 점수에 맞춰 추천서 생성
    """
    prompt = f"""
당신은 전문 추천서 작성 AI입니다.
아래 입력값을 기반으로 요청자를 평가하는 추천서를 작성하세요.

점수: {score}점
추천서 톤: {inputs.tone}

추천자 이메일: {inputs.recommender_email}
요청자 이름: {inputs.requester_name}
요청자 이메일: {inputs.requester_email}
추천 이유/관계: {inputs.reason}
주요 역량/성과: {inputs.strengths}
특별히 강조할 점: {inputs.highlight}

작성 규칙:
1. 요청자 이름과 추천자 이름은 절대 변경하지 마세요.
2. 점수에 맞게 평가를 조정: 1점은 낮게, 5점은 매우 우수하게 표현
3. 문단 구성: 도입 → 추천 이유/경험 → 역량/성과 → 강조 포인트 → 마무리 인사
4. 윤리적으로 작성: 과장, 차별, 비하, 폭력, 정치적 발언 금지
"""
    result = llm.invoke(prompt)
    return getattr(result, "content", str(result))


# ===== 인증 관련 모델 =====
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    nickname: str
    gender: Optional[int] = None
    birth: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    address_detail: Optional[str] = None
    address_code: Optional[str] = None
    avatar_img: Optional[str] = None

# ===== 모델 정의 =====
class UserBase(BaseModel):
    email: EmailStr
    nickname: str
    gender: Optional[int] = None
    birth: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    address_detail: Optional[str] = None
    address_code: Optional[str] = None
    avatar_img: Optional[str] = None

class WorkspaceBase(BaseModel):
    name: str
    serial_number: Optional[str] = None
    is_public: bool = False

# ===== 인증 관련 함수 =====
def hash_password(password: str) -> str:
    """비밀번호를 해시화하는 함수 (72바이트 제한 처리)"""
    # 비밀번호를 72바이트로 제한
    password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        # 토큰 디코딩 시도
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
            
        # 토큰 만료 시간 확인
        exp = payload.get("exp")
        if exp is None:
            raise HTTPException(status_code=401, detail="Token has no expiration")
            
        if datetime.fromtimestamp(exp) < datetime.utcnow():
            raise HTTPException(status_code=401, detail="Token has expired")
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    # 데이터베이스에서 사용자 정보 조회
    try:
        with engine.connect() as conn:
            user_sql = text("""
                SELECT id, email, nickname 
                FROM users 
                WHERE email = :email AND deletedAt IS NULL
                LIMIT 1
            """)
            user_result = conn.execute(user_sql, {"email": email}).first()
            
            if not user_result:
                raise HTTPException(status_code=401, detail="User not found")
            
            return {
                "id": user_result._mapping.get("id"),
                "email": user_result._mapping.get("email"),
                "nickname": user_result._mapping.get("nickname")
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error")

# 히스토리 파일 경로
HISTORY_FILE = "recommendation_history.json"

def load_history():
    """히스토리 파일에서 데이터 로드"""
    try:
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    except Exception as e:
        print(f"히스토리 로드 오류: {e}")
        return []

def save_history(history_data):
    """히스토리 파일에 데이터 저장"""
    try:
        with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
            json.dump(history_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"히스토리 저장 오류: {e}")

# ===== 추천서 생성 API =====
@app.post("/generate-recommendation")
async def generate(request: RecommendationRequest):
    # 선택 점수만 생성 (문자열을 정수로 변환)
    score = int(request.selected_score)
    recommendation = generate_single_score_recommendation(request, score)
    
    # 데이터베이스에 저장
    try:
        with engine.connect() as conn:
            # 1. 추천자 ID 조회/생성 (닉네임 기준으로 변경)
            from_user_sql = text("""
                SELECT id FROM users 
                WHERE email = :email
                LIMIT 1
            """)
            from_user = conn.execute(from_user_sql, {
                "email": request.recommender_email
            }).first()
            
            if not from_user:
                # 추천자 생성 (고유 이메일 생성)
                from_user_email = request.recommender_email
                insert_user_sql = text("""
                    INSERT INTO users (email, nickname, password, createdAt, updatedAt) 
                    VALUES (:email, :nickname, :password, NOW(), NOW())
                """)
                result = conn.execute(insert_user_sql, {
                    "email": from_user_email,
                    "nickname": request.recommender_email.split('@')[0],  # 이메일에서 @ 앞부분을 닉네임으로 사용
                    "password": hash_password("password123")
                })
                from_user_id = result.lastrowid
            else:
                from_user_id = from_user.id
                
            # 2. 요청자 ID 조회/생성 (이메일 우선, 없으면 닉네임 기준)
            if request.requester_email and request.requester_email.strip():
                # 이메일이 있으면 이메일로 조회
                to_user_sql = text("""
                    SELECT id FROM users 
                    WHERE email = :email
                    LIMIT 1
                """)
                to_user = conn.execute(to_user_sql, {
                    "email": request.requester_email
                }).first()
                
                if not to_user:
                    # 이메일로 사용자 생성
                    insert_user_sql = text("""
                        INSERT INTO users (email, nickname, password, createdAt, updatedAt) 
                        VALUES (:email, :nickname, :password, NOW(), NOW())
                    """)
                    result = conn.execute(insert_user_sql, {
                        "email": request.requester_email,
                        "nickname": request.requester_name,
                        "password": hash_password("password123")
                    })
                    to_user_id = result.lastrowid
                else:
                    to_user_id = to_user.id
            else:
                # 이메일이 없으면 닉네임으로 조회
                to_user_sql = text("""
                    SELECT id FROM users 
                    WHERE nickname = :nickname
                    LIMIT 1
                """)
                to_user = conn.execute(to_user_sql, {
                    "nickname": request.requester_name
                }).first()
                
                if not to_user:
                    # 닉네임으로 사용자 생성 (고유 이메일 생성)
                    to_user_email = f"{request.requester_name}_{int(datetime.now().timestamp())}@temp.com"
                    insert_user_sql = text("""
                        INSERT INTO users (email, nickname, password, createdAt, updatedAt) 
                        VALUES (:email, :nickname, :password, NOW(), NOW())
                    """)
                    result = conn.execute(insert_user_sql, {
                        "email": to_user_email,
                        "nickname": request.requester_name,
                        "password": hash_password("password123")
                    })
                    to_user_id = result.lastrowid
                else:
                    to_user_id = to_user.id
                
            # 3. 추천서 저장
            insert_letter_sql = text("""
                INSERT INTO referenceLetters 
                (fromUserId, toUserId, content, isDraft, createdAt, updatedAt)
                VALUES (:from_id, :to_id, :content, false, NOW(), NOW())
            """)
            result = conn.execute(insert_letter_sql, {
                "from_id": from_user_id,
                "to_id": to_user_id,
                "content": recommendation
            })
            
            conn.commit()
            print(f"추천서 DB 저장 완료 - ID: {result.lastrowid}")
            
    except Exception as e:
        print(f"데이터베이스 저장 오류: {e}")
        # DB 저장 실패 시 JSON 파일로 백업 저장
        history_item = {
            "id": int(datetime.now().timestamp() * 1000),
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "form": {
                "recommender_email": request.recommender_email,
                "requester_name": request.requester_name,
                "requester_email": request.requester_email,
                "reason": request.reason,
                "strengths": request.strengths,
                "highlight": request.highlight,
                "tone": request.tone
            },
            "recommendation": recommendation
        }
        
        history = load_history()
        history.insert(0, history_item)
        if len(history) > 100:
            history = history[:100]
        save_history(history)
        print("JSON 파일로 백업 저장됨")
    
    print(f"추천서 생성 완료 - 추천자: {request.recommender_email}, 피추천자: {request.requester_name}")
    
    return {"recommendation": recommendation}

# ===== 히스토리 조회 API =====
@app.get("/history")
async def get_history(email: str = None):
    """저장된 히스토리 조회 (이메일 필터링 가능)"""
    try:
        with engine.connect() as conn:
            # 이메일이 있으면 해당 이메일의 추천서만 조회, 없으면 전체 조회
            if email:
                history_sql = text("""
                    SELECT 
                        rl.id,
                        rl.content,
                        rl.createdAt,
                        u_from.email AS from_email,
                        u_to.nickname AS to_name,
                        u_to.email AS to_email
                    FROM referenceLetters rl
                    JOIN users u_from ON u_from.id = rl.fromUserId
                    JOIN users u_to ON u_to.id = rl.toUserId
                    WHERE rl.deletedAt IS NULL
                    AND u_to.email = :email
                    ORDER BY rl.createdAt DESC
                    LIMIT 3
                """)
                result = conn.execute(history_sql, {"email": email}).fetchall()
            else:
                # 전체 히스토리 조회
                history_sql = text("""
                    SELECT 
                        rl.id,
                        rl.content,
                        rl.createdAt,
                        u_from.email AS from_email,
                        u_to.nickname AS to_name,
                        u_to.email AS to_email
                    FROM referenceLetters rl
                    JOIN users u_from ON u_from.id = rl.fromUserId
                    JOIN users u_to ON u_to.id = rl.toUserId
                    WHERE rl.deletedAt IS NULL
                    ORDER BY rl.createdAt DESC
                    LIMIT 100
                """)
                result = conn.execute(history_sql).fetchall()
            
            history = []
            for row in result:
                history.append({
                    "id": row._mapping.get("id"),
                    "timestamp": row._mapping.get("createdAt").strftime('%Y-%m-%d %H:%M:%S') if row._mapping.get("createdAt") else "",
                    "form": {
                        "recommender_email": row._mapping.get("from_email"),
                        "requester_name": row._mapping.get("to_name"),
                        "requester_email": row._mapping.get("to_email"),
                        "reason": "",
                        "strengths": "",
                        "highlight": "",
                        "tone": "공식적"
                    },
                    "recommendation": row._mapping.get("content")
                })
            
            return {"history": history}
            
    except Exception as e:
        print(f"데이터베이스 조회 오류: {e}")
        # DB 조회 실패 시 JSON 파일에서 로드
        history = load_history()
        return {"history": history}

@app.delete("/clear-history")
async def clear_history():
    """모든 히스토리 삭제"""
    try:
        with engine.connect() as conn:
            # 데이터베이스에서 모든 추천서 삭제 (soft delete)
            delete_sql = text("""
                UPDATE referenceLetters 
                SET deletedAt = NOW() 
                WHERE deletedAt IS NULL
            """)
            conn.execute(delete_sql)
            conn.commit()
            
        # JSON 파일도 삭제
        if os.path.exists(HISTORY_FILE):
            os.remove(HISTORY_FILE)
            
        return {"message": "히스토리가 삭제되었습니다."}
    except Exception as e:
        print(f"히스토리 삭제 오류: {e}")
        raise HTTPException(status_code=500, detail="히스토리 삭제 실패")

@app.delete("/delete-history/{item_id}")
async def delete_history_item(item_id: int):
    """특정 히스토리 아이템 삭제"""
    try:
        with engine.connect() as conn:
            # 데이터베이스에서 해당 추천서 삭제 (soft delete)
            delete_sql = text("""
                UPDATE referenceLetters 
                SET deletedAt = NOW() 
                WHERE id = :item_id AND deletedAt IS NULL
            """)
            result = conn.execute(delete_sql, {"item_id": item_id})
            conn.commit()
            
            if result.rowcount == 0:
                raise HTTPException(status_code=404, detail="해당 히스토리를 찾을 수 없습니다.")
                
        return {"message": "히스토리 아이템이 삭제되었습니다."}
    except HTTPException:
        raise
    except Exception as e:
        print(f"히스토리 아이템 삭제 오류: {e}")
        raise HTTPException(status_code=500, detail="히스토리 아이템 삭제 실패")

# ===== 인증 API =====
@app.post("/register")
async def register(user: UserRegister):
    with engine.connect() as conn:
        # 이메일 중복 체크
        existing_user = conn.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": user.email}
        ).first()
        
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # 비밀번호 해시화
        hashed_password = hash_password(user.password)
        
        # 사용자 생성
        result = conn.execute(
            text("""
                INSERT INTO users (email, password, nickname, gender, birth, 
                                phoneNumber, address, addressDetail, addressCode, 
                                avatarImg, isOnboarded, createdAt, updatedAt)
                VALUES (:email, :password, :nickname, :gender, :birth,
                        :phone_number, :address, :address_detail, :address_code,
                        :avatar_img, true, NOW(), NOW())
            """),
            {
                "email": user.email,
                "password": hashed_password,
                "nickname": user.nickname,
                "gender": user.gender,
                "birth": user.birth,
                "phone_number": user.phone_number,
                "address": user.address,
                "address_detail": user.address_detail,
                "address_code": user.address_code,
                "avatar_img": user.avatar_img
            }
        )
        conn.commit()
        
        # 토큰 생성
        access_token = create_access_token({"sub": user.email})
        return Token(
            access_token=access_token,
            token_type="bearer",
            user={
                "email": user.email,
                "nickname": user.nickname
            }
        )

@app.post("/login")
async def login(user: UserLogin):
    print(f"=== LOGIN ATTEMPT ===")
    print(f"Email: {user.email}")
    print(f"Password: {user.password}")
    print(f"=====================")
    
    try:
        print("Attempting database connection...")
        with engine.connect() as conn:
            print("Database connection successful")
            # 1. 사용자 조회
            user_sql = text("""
                SELECT id, email, nickname, password 
                FROM users 
                WHERE email = :email AND deletedAt IS NULL
                LIMIT 1
            """)
            user_result = conn.execute(user_sql, {"email": user.email}).first()
            conn.commit()  # 커밋 추가
            
            if not user_result:
                print(f"User not found: {user.email}")
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            print(f"User found: {user_result._mapping.get('email')}, nickname: {user_result._mapping.get('nickname')}")
            
            # 2. 비밀번호 검증 (실제로는 해시된 비밀번호와 비교해야 함)
            # 현재는 단순 문자열 비교 (실제 환경에서는 bcrypt 등 사용)
            stored_password = user_result._mapping.get("password")
            print(f"Stored password: '{stored_password}'")
            print(f"Input password: '{user.password}'")
            if user.password != stored_password:
                print(f"Password verification failed for user: {user.email}")
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            # 3. 사용자 데이터 구성
            user_data = {
                "id": user_result._mapping.get("id"),
                "email": user_result._mapping.get("email"),
                "nickname": user_result._mapping.get("nickname")
            }
            
            # 4. 토큰 생성
            access_token = create_access_token({"sub": user.email})
            print(f"Token created successfully for: {user.email}")
            
            return Token(
                access_token=access_token,
                token_type="bearer",
                user=user_data
            )
    except HTTPException as e:
        print(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {
        "user": current_user,
        "workspaces": []
    }

# ===== 비밀번호 해시 생성용 임시 함수 =====
@app.get("/generate-hash/{password}")
async def generate_hash(password: str):
    hashed = hash_password(password)
    print(f"Generated hash for '{password}': {hashed}")
    return {"hash": hashed}

# ===== 이름 기반 조회 =====
class LookupRequest(BaseModel):
    search: str  # 닉네임으로 검색

@app.post("/lookup")
async def lookup(req: LookupRequest):
    # 동명이인을 포함한 모든 사용자 검색
    users_sql = text("""
        SELECT DISTINCT
            u.id       AS user_id,
            u.nickname AS nickname,
            u.email    AS email
        FROM users u
        WHERE u.nickname = :search
        AND u.deletedAt IS NULL
    """)

    # 워크스페이스 정보를 위한 SQL
    workspace_sql = text("""
        SELECT
            w.id             AS workspace_id,
            w.name           AS workspace_name,
            w.registrationNumber AS workspace_serial,
            wu.grade         AS role_grade
        FROM workspaceUsers wu
        JOIN workspaces w ON w.id = wu.workspaceId 
        WHERE wu.userId = :user_id 
        AND wu.deletedAt IS NULL
        AND w.deletedAt IS NULL
    """)
    with engine.connect() as conn:
        # 사용자 목록 조회
        users = conn.execute(users_sql, {"search": req.search}).fetchall()

        if not users:
            return {"exists": False, "message": "DB에 없는 데이터입니다."}

        # 각 사용자의 워크스페이스 정보 조회
        users_data = []
        for user in users:
            user_id = user._mapping.get("user_id")
            
            # 워크스페이스 정보 조회
            workspaces = []
            workspace_rows = conn.execute(workspace_sql, {"user_id": user_id}).fetchall()
            
            for w in workspace_rows:
                grade = w._mapping.get("role_grade", WorkspaceGrade.MEMBER.value)
                role = "일반 멤버"
                if grade == WorkspaceGrade.SUPER_LEADER.value:
                    role = "슈퍼리더"
                elif grade == WorkspaceGrade.LEADER.value:
                    role = "리더"
                elif grade == WorkspaceGrade.APPLICANT.value:
                    role = "지원자"
                elif grade == WorkspaceGrade.WAITING.value:
                    role = "대기"

                workspaces.append({
                    "id": w._mapping.get("workspace_id"),
                    "name": w._mapping.get("workspace_name"),
                    "serial_number": w._mapping.get("workspace_serial"),
                    "role": role,
                    "grade": grade
                })

            # 추천서 정보 조회 (해당 사용자 기준으로 필터링) - 3개만 표시
            # 먼저 referenceLetters 테이블 시도
            ref_sql = text("""
                SELECT DISTINCT
                    rl.id,
                    rl.content,
                    rl.isDraft,
                    rl.createdAt,
                    u_from.nickname AS from_name,
                    u_from.email AS from_email,
                    u_to.nickname AS to_name,
                    u_to.email AS to_email
                FROM referenceLetters rl
                JOIN users u_from ON u_from.id = rl.fromUserId
                JOIN users u_to ON u_to.id = rl.toUserId
                WHERE (
                    (rl.fromUserId = :user_id)
                    OR 
                    (rl.toUserId = :user_id)
                )
                AND rl.deletedAt IS NULL
                ORDER BY rl.createdAt DESC
                LIMIT 3
            """)
            
            # 전체 추천서 개수 조회
            total_ref_sql = text("""
                SELECT COUNT(DISTINCT rl.id) as total_count
                FROM referenceLetters rl
                WHERE (
                    (rl.fromUserId = :user_id)
                    OR 
                    (rl.toUserId = :user_id)
                )
                AND rl.deletedAt IS NULL
            """)
            
            references = []
            ref_rows = conn.execute(ref_sql, {
                "user_id": user_id
            }).fetchall()
            print(f"사용자 {user_id}의 추천서 조회 결과: {len(ref_rows)}개")
            
            total_count_result = conn.execute(total_ref_sql, {
                "user_id": user_id
            }).first()
            total_count = total_count_result._mapping.get("total_count", 0) if total_count_result else 0
            print(f"사용자 {user_id}의 전체 추천서 개수: {total_count}")
            
            for r in ref_rows:
                references.append({
                    "id": r._mapping.get("id"),
                    "content": r._mapping.get("content"),
                    "is_draft": r._mapping.get("isDraft"),
                    "created_at": r._mapping.get("createdAt"),
                    "from_name": r._mapping.get("from_name"),
                    "to_name": r._mapping.get("to_name")
                })

            # 사용자 정보 구성
            users_data.append({
                "id": user_id,
                "email": user._mapping.get("email"),
                "nickname": user._mapping.get("nickname"),
                "workspaces": workspaces,
                "recent_references": references,
                "reference_info": {
                    "total_count": total_count,
                    "has_more": total_count > 3,
                    "showing_count": len(references)
                }
            })

    return {
        "exists": True,
        "users": users_data
    }

# ===== 전체 추천서 기록 조회 =====
class ReferenceHistoryRequest(BaseModel):
    user_id: int

@app.post("/reference-history")
async def get_reference_history(req: ReferenceHistoryRequest):
    """특정 사용자의 전체 추천서 기록을 조회합니다."""
    with engine.connect() as conn:
        # 전체 추천서 정보 조회
        ref_sql = text("""
            SELECT DISTINCT
                rl.id,
                rl.content,
                rl.isDraft,
                rl.createdAt,
                u_from.nickname AS from_name,
                u_from.email AS from_email,
                u_to.nickname AS to_name,
                u_to.email AS to_email
            FROM referenceLetters rl
            JOIN users u_from ON u_from.id = rl.fromUserId
            JOIN users u_to ON u_to.id = rl.toUserId
            WHERE (
                (rl.fromUserId = :user_id)
                OR 
                (rl.toUserId = :user_id)
            )
            AND rl.deletedAt IS NULL
            ORDER BY rl.createdAt DESC
        """)
        
        references = []
        ref_rows = conn.execute(ref_sql, {
            "user_id": req.user_id
        }).fetchall()
        
        for r in ref_rows:
            references.append({
                "id": r._mapping.get("id"),
                "content": r._mapping.get("content"),
                "is_draft": r._mapping.get("isDraft"),
                "created_at": r._mapping.get("createdAt"),
                "from_name": r._mapping.get("from_name"),
                "to_name": r._mapping.get("to_name")
            })

    return {
        "references": references,
        "total_count": len(references)
    }

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    