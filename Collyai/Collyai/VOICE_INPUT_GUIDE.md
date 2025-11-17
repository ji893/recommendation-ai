# 🎤 음성 입력 기능 사용 가이드

## 📋 개요
추천서 작성 폼에서 음성으로 입력하면 AI가 자동으로 각 필드에 분류해서 채워주는 기능입니다.

## 🔧 백엔드 API

### 엔드포인트
```
POST /parse-voice-input
```

### 요청
- **Content-Type**: `multipart/form-data`
- **파라미터**: `audio_file` (File)
- **지원 포맷**: webm, mp3, wav, m4a 등

### 응답
```json
{
  "success": true,
  "transcribed_text": "저는 김철수 교수이고, 이 학생은 제 연구실에서 2년간...",
  "fields": {
    "relationship": "연구실에서 2년간 지도한 제자",
    "strengths": "성실함, 책임감이 강함",
    "memorable": "AI 프로젝트를 독립적으로 완성",
    "additional_info": "김철수 교수 연구실 소속"
  }
}
```

## 💻 프론트엔드 구현 예시

### React 컴포넌트 (MediaRecorder API 사용)

```jsx
import React, { useState, useRef } from 'react';

function VoiceInputButton({ onFieldsReceived }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await uploadAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('마이크 접근 오류:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.webm');

      const response = await fetch('http://localhost:8000/parse-voice-input', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('음성 처리 실패');
      }

      const data = await response.json();
      console.log('변환된 텍스트:', data.transcribed_text);
      console.log('분류된 필드:', data.fields);

      // 부모 컴포넌트로 데이터 전달
      onFieldsReceived(data.fields);

      alert('음성 입력이 완료되었습니다! 내용을 확인하고 수정해주세요.');
    } catch (error) {
      console.error('음성 업로드 오류:', error);
      alert('음성 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={isProcessing}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🎤 {isProcessing ? '처리 중...' : '음성 입력'}
        </button>
      ) : (
        <button
          onClick={stopRecording}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            animation: 'pulse 1s infinite'
          }}
        >
          ⏹️ 녹음 중지
        </button>
      )}
    </div>
  );
}

export default VoiceInputButton;
```

### 메인 폼에서 사용

```jsx
import VoiceInputButton from './VoiceInputButton';

function RecommendationForm() {
  const [form, setForm] = useState({
    relationship: '',
    strengths: '',
    memorable: '',
    additional_info: ''
  });

  const handleVoiceInput = (fields) => {
    setForm(prev => ({
      ...prev,
      relationship: fields.relationship || prev.relationship,
      strengths: fields.strengths || prev.strengths,
      memorable: fields.memorable || prev.memorable,
      additional_info: fields.additional_info || prev.additional_info
    }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>추천서 작성</h2>
        <VoiceInputButton onFieldsReceived={handleVoiceInput} />
      </div>

      <form>
        <div>
          <label>요청자와의 관계</label>
          <input
            type="text"
            value={form.relationship}
            onChange={(e) => setForm({ ...form, relationship: e.target.value })}
          />
        </div>

        <div>
          <label>주요 강점</label>
          <textarea
            value={form.strengths}
            onChange={(e) => setForm({ ...form, strengths: e.target.value })}
          />
        </div>

        <div>
          <label>기억에 남는 일</label>
          <textarea
            value={form.memorable}
            onChange={(e) => setForm({ ...form, memorable: e.target.value })}
          />
        </div>

        <div>
          <label>추가 정보</label>
          <textarea
            value={form.additional_info}
            onChange={(e) => setForm({ ...form, additional_info: e.target.value })}
          />
        </div>

        <button type="submit">추천서 생성</button>
      </form>
    </div>
  );
}
```

## 🎨 CSS 애니메이션 (녹음 중 표시)

```css
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
```

## 🧪 테스트 방법

### 1. 서버 실행
```bash
cd Collyai
python server.py
```

### 2. 음성 테스트 (curl)
```bash
curl -X POST http://localhost:8000/parse-voice-input \
  -F "audio_file=@test_audio.webm"
```

### 3. 예상 발화 예시
```
"안녕하세요, 저는 서울대학교 컴퓨터공학과의 김철수 교수입니다.
이 학생 박민수는 제 연구실에서 2년간 근무한 대학원생입니다.
이 학생은 특히 성실하고 책임감이 강하며, 주어진 업무를 완벽하게 처리합니다.
기억에 남는 일로는 작년에 AI 기반 추천 시스템 프로젝트를 혼자서 완성했던 것입니다.
그 외에도 연구실 내에서 후배들을 잘 지도하며, 팀워크가 뛰어납니다."
```

### 예상 분류 결과
```json
{
  "relationship": "서울대학교 컴퓨터공학과 연구실에서 2년간 지도한 대학원생",
  "strengths": "성실함, 책임감, 완벽한 업무 처리 능력",
  "memorable": "AI 기반 추천 시스템 프로젝트를 독립적으로 완성",
  "additional_info": "후배 지도 및 팀워크가 뛰어남"
}
```

## ⚠️ 주의사항

1. **OPENAI_API_KEY 필수**: `.env` 파일에 설정 필요
2. **브라우저 호환성**: Chrome, Edge, Firefox 최신 버전 권장
3. **HTTPS 필요**: 실제 배포 시 HTTPS 환경에서만 마이크 접근 가능 (로컬은 http://localhost 허용)
4. **비용**: OpenAI Whisper API는 사용량에 따라 과금됨 (분당 $0.006)

## 🚀 개선 아이디어

- [ ] 녹음 시간 표시
- [ ] 음성 파형 시각화
- [ ] 녹음 전 테스트 기능
- [ ] 여러 언어 지원
- [ ] 실시간 STT (WebSocket)


