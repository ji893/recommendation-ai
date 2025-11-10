# 사용자 서명 기능 가이드

## 개요
사용자가 자신의 서명을 등록하고, 추천서 작성 시 서명이 자동으로 포함되는 기능입니다.

## DB 마이그레이션

### 실행 방법
```bash
mysql -u [username] -p [database_name] < migrations/add_user_signatures.sql
```

### 추가된 테이블

#### 1. userSignatures
사용자의 서명 정보를 저장하는 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | INT | 기본키 (AUTO_INCREMENT) |
| userId | INT | 사용자 ID (FK: users.id) |
| signatureData | LONGTEXT | Base64 인코딩된 서명 이미지 또는 텍스트 |
| signatureType | VARCHAR(20) | 'image' 또는 'text' |
| createdAt | DATETIME | 생성일시 |
| updatedAt | DATETIME | 수정일시 |
| deletedAt | DATETIME | 삭제일시 (NULL = 활성) |

#### 2. recommendation 테이블 수정
- `signatureData` 컬럼 추가: JSON 형식의 서명 정보 저장

## API 엔드포인트

### 1. 서명 등록/수정
```http
POST /user-signature
Authorization: Bearer {token}
Content-Type: application/json

{
  "signature_data": "data:image/png;base64,iVBORw0KG...",
  "signature_type": "image"
}
```

**응답:**
```json
{
  "success": true,
  "message": "서명이 등록되었습니다.",
  "user_id": 1
}
```

### 2. 내 서명 조회
```http
GET /my-signature
Authorization: Bearer {token}
```

**응답:**
```json
{
  "exists": true,
  "signature_data": "data:image/png;base64,iVBORw0KG...",
  "signature_type": "image",
  "created_at": "2025-11-03"
}
```

### 3. 특정 사용자 서명 조회
```http
GET /user-signature/{user_id}
```

**응답:**
```json
{
  "exists": true,
  "signature_data": "data:image/png;base64,iVBORw0KG...",
  "signature_type": "image",
  "created_at": "2025-11-03"
}
```

### 4. 서명 삭제
```http
DELETE /user-signature
Authorization: Bearer {token}
```

**응답:**
```json
{
  "message": "서명이 삭제되었습니다."
}
```

## 사용 방법

### 1. 서명 이미지 준비
- Canvas API나 서명 패드를 사용하여 서명 이미지 생성
- Base64로 인코딩 (data:image/png;base64,... 형식)

### 2. 서명 등록
```javascript
const signatureCanvas = document.getElementById('signature-canvas');
const signatureData = signatureCanvas.toDataURL('image/png');

const response = await fetch('/user-signature', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    signature_data: signatureData,
    signature_type: 'image'
  })
});
```

### 3. 추천서 생성 시 자동 포함
- 추천서 생성 API(/generate-recommendation) 호출 시
- 작성자의 서명이 자동으로 조회되어 추천서에 포함됨
- PDF 다운로드 시에도 서명 이미지가 포함됨

## 서명 타입

### image (권장)
- Base64 인코딩된 이미지 데이터
- PNG, JPEG 등 지원
- Canvas API 사용 권장

### text
- 텍스트 형식의 서명 (예: "홍길동")
- 간단한 서명이 필요한 경우 사용

## 프론트엔드 구현 예시

### Canvas 서명 패드
```html
<canvas id="signature-canvas" width="400" height="200"></canvas>
<button onclick="clearSignature()">지우기</button>
<button onclick="saveSignature()">저장</button>

<script>
const canvas = document.getElementById('signature-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
  if (!isDrawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function saveSignature() {
  const signatureData = canvas.toDataURL('image/png');
  
  const response = await fetch('/user-signature', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      signature_data: signatureData,
      signature_type: 'image'
    })
  });
  
  const result = await response.json();
  alert(result.message);
}
</script>
```

## 주의사항

1. **서명 이미지 크기**
   - 적절한 크기로 제한 (권장: 400x200px)
   - Base64 인코딩 시 데이터 크기 증가 고려

2. **보안**
   - 인증된 사용자만 서명 등록/수정 가능
   - 본인의 서명만 삭제 가능

3. **PDF 생성**
   - 서명 이미지가 있으면 PDF 하단 오른쪽에 자동 배치
   - 서명 영역 확보를 위해 본문 여백 조정

4. **데이터베이스**
   - LONGTEXT 타입으로 큰 이미지도 저장 가능
   - 정기적인 백업 권장

## 문제 해결

### Q: 서명이 PDF에 표시되지 않아요
A: Base64 데이터 형식을 확인하세요. `data:image/png;base64,` 접두사가 포함되어야 합니다.

### Q: 서명 이미지가 너무 커요
A: Canvas 크기를 줄이거나, 이미지 압축을 고려하세요.

### Q: 여러 개의 서명을 등록할 수 있나요?
A: 현재는 사용자당 하나의 서명만 저장됩니다. 업데이트 시 기존 서명이 덮어씌워집니다.




