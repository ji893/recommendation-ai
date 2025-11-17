# 🎤 음성 입력 기능 통합 가이드

## 📦 파일 구조
```
my-recommendation-app/src/
├── App.jsx                      ← 메인 앱 (여기에 통합)
├── VoiceInputButton.jsx         ← 새로 생성된 음성 입력 컴포넌트
└── ...
```

## 🔧 통합 방법

### 1단계: VoiceInputButton 컴포넌트 import

`App.jsx` 파일 상단에 추가:

```jsx
import VoiceInputButton from './VoiceInputButton.jsx';
```

### 2단계: 음성 입력 핸들러 함수 추가

`MainApp` 컴포넌트 내부에 다음 함수를 추가:

```jsx
// 음성 입력으로 받은 필드를 폼에 자동 채우는 함수
const handleVoiceInput = (fields, transcribedText) => {
  console.log('음성 입력 받음:', fields);
  console.log('원본 텍스트:', transcribedText);
  
  // 기존 값이 있으면 유지, 없으면 음성 입력값으로 채움
  setForm(prev => ({
    ...prev,
    relationship: fields.relationship || prev.relationship,
    strengths: fields.strengths || prev.strengths,
    memorable: fields.memorable || prev.memorable,
    additional_info: fields.additional_info || prev.additional_info
  }));
};
```

### 3단계: UI에 음성 입력 버튼 추가

**위치**: "추천서 작성" 제목 옆 (2454번 줄 근처)

**기존 코드**:
```jsx
<h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
  {t.form.title}
</h2>
<p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>
  {t.form.subtitle}
</p>
```

**변경 후**:
```jsx
<div style={{ 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  marginBottom: "1rem",
  flexWrap: "wrap",
  gap: "12px"
}}>
  <div>
    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
      {t.form.title}
    </h2>
    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
      {t.form.subtitle}
    </p>
  </div>
  
  {/* 🎤 음성 입력 버튼 */}
  <VoiceInputButton onFieldsReceived={handleVoiceInput} />
</div>
```

### 4단계: 다국어 지원 (선택사항)

음성 입력 버튼 텍스트를 다국어로 지원하려면:

**TRANSLATIONS 객체에 추가**:
```jsx
const TRANSLATIONS = {
  ko: {
    // ... 기존 코드
    form: {
      // ... 기존 필드들
      voiceInput: "🎤 음성 입력",
      voiceProcessing: "처리 중...",
      voiceRecording: "⏹️ 녹음 중지",
    }
  },
  en: {
    // ... 기존 코드
    form: {
      // ... 기존 필드들
      voiceInput: "🎤 Voice Input",
      voiceProcessing: "Processing...",
      voiceRecording: "⏹️ Stop Recording",
    }
  }
};
```

**VoiceInputButton에 props 전달**:
```jsx
<VoiceInputButton 
  onFieldsReceived={handleVoiceInput}
  language={language}
  translations={t.form}
/>
```

## 📝 완전한 통합 예시

```jsx
// App.jsx의 MainApp 컴포넌트 내부

import VoiceInputButton from './VoiceInputButton.jsx';

function MainApp({ user, onLogout, token, language, onLanguageChange }) {
  // ... 기존 state들
  
  // ✅ 음성 입력 핸들러 추가
  const handleVoiceInput = (fields, transcribedText) => {
    console.log('✅ 음성 입력 받음:', fields);
    
    setForm(prev => ({
      ...prev,
      relationship: fields.relationship || prev.relationship,
      strengths: fields.strengths || prev.strengths,
      memorable: fields.memorable || prev.memorable,
      additional_info: fields.additional_info || prev.additional_info
    }));
  };

  return (
    <div style={styles.pageContainer}>
      {/* ... 네비게이션 등 기존 코드 ... */}

      {/* 추천서 작성 섹션 */}
      <div id="generate" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={styles.card}>
          {/* ✅ 제목과 음성 버튼을 같은 줄에 배치 */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {t.form.title}
              </h2>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {t.form.subtitle}
              </p>
            </div>
            
            {/* 🎤 음성 입력 버튼 */}
            <VoiceInputButton onFieldsReceived={handleVoiceInput} />
          </div>

          {/* 기존 폼 필드들... */}
          <div style={{ marginTop: "1.5rem" }}>
            <label>요청자와의 관계</label>
            <textarea
              value={form.relationship}
              onChange={(e) => setForm({ ...form, relationship: e.target.value })}
            />
          </div>
          
          {/* ... 나머지 필드들 ... */}
        </div>
      </div>
    </div>
  );
}
```

## 🎯 사용자 플로우

```
1. 사용자가 "🎤 음성 입력" 버튼 클릭
   ↓
2. 마이크 권한 요청
   ↓
3. 녹음 시작 (버튼이 "⏹️ 녹음 중지"로 변경)
   ↓
4. 사용자 발화: 
   "저는 김철수 교수이고, 이 학생은 제 연구실에서 2년간 
    근무했어요. 정말 성실하고 책임감이 강하며..."
   ↓
5. 녹음 중지 버튼 클릭
   ↓
6. 서버로 전송 → STT → AI 분석
   ↓
7. 각 필드에 자동으로 채워짐:
   - relationship: "연구실에서 2년간 지도한 제자"
   - strengths: "성실함, 책임감"
   - memorable: (음성 내용에 따라)
   - additional_info: (애매한 내용)
   ↓
8. 사용자가 내용 확인 및 수정
   ↓
9. "추천서 생성" 버튼 클릭
```

## 🧪 테스트

### 로컬 테스트
```bash
# 1. 백엔드 실행
cd Collyai
python server.py

# 2. 프론트엔드 실행
cd my-recommendation-app
npm run dev

# 3. 브라우저에서 http://localhost:5173 접속
# 4. 로그인 후 음성 입력 버튼 클릭
```

### 주의사항
- ✅ Chrome/Edge 최신 버전 권장
- ✅ 마이크 권한 허용 필요
- ✅ OPENAI_API_KEY가 .env에 설정되어 있어야 함
- ✅ 로컬에서는 http://localhost 허용됨 (HTTPS 불필요)

## 🎨 UI 커스터마이징

버튼 스타일을 변경하려면 `VoiceInputButton.jsx`의 style 객체를 수정:

```jsx
// 녹음 시작 버튼
<button
  style={{
    padding: '10px 20px',
    backgroundColor: '#4CAF50',  // ← 색상 변경
    color: 'white',
    borderRadius: '8px',          // ← 둥글기 조절
    fontSize: '15px',             // ← 크기 조절
    // ...
  }}
>
```

## 🚀 다음 단계

- [ ] 실시간 STT (WebSocket 기반)
- [ ] 음성 파형 시각화
- [ ] 녹음 시간 표시
- [ ] 여러 언어 지원 (영어, 중국어 등)
- [ ] 음성 미리듣기 기능


