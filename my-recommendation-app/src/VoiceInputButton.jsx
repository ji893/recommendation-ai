import React, { useState, useRef } from 'react';

const TRANSLATIONS = {
  ko: {
    startRecording: '🎤 음성 입력',
    stopRecording: '⏸️ 녹음 중지',
    processing: '변환 중...',
    errorMic: '❌ 마이크 권한이 거부되었습니다.\n브라우저 설정에서 마이크 접근을 허용해주세요.',
    errorRecording: '녹음 시작 실패',
    errorUpload: '❌ 음성 변환 실패:',
    errorProcess: '음성 변환 실패',
    success: '✅ 음성 변환 완료!\n각 항목이 자동으로 채워졌습니다.',
  },
  en: {
    startRecording: '🎤 Voice Input',
    stopRecording: '⏸️ Stop Recording',
    processing: 'Converting...',
    errorMic: '❌ Microphone permission denied.\nPlease allow microphone access in your browser settings.',
    errorRecording: 'Failed to start recording',
    errorUpload: '❌ Voice conversion failed:',
    errorProcess: 'Voice conversion failed',
    success: '✅ Voice conversion complete!\nAll fields have been automatically filled.',
  },
};

/**
 * 음성 입력 버튼 컴포넌트
 * 사용자의 음성을 녹음하고, 서버에서 텍스트로 변환 후 필드별로 분류
 */
function VoiceInputButton({ onFieldsReceived, language = 'ko' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ko;
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  /**
   * 녹음 시작
   */
  const startRecording = async () => {
    try {
      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 음성 데이터 수집
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 녹음 종료 시 서버로 전송
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await uploadAudio(audioBlob);
        
        // 스트림 정리
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log('녹음 시작');
    } catch (error) {
      console.error('마이크 접근 오류:', error);
      alert(t.errorMic);
    }
  };

  /**
   * 녹음 중지
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('녹음 중지');
    }
  };

  /**
   * 음성 파일을 서버로 전송하고 텍스트 변환 + 필드 분류
   */
  const uploadAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.webm');

      console.log('음성 파일 전송 중...');
      const response = await fetch('http://localhost:8000/parse-voice-input', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t.errorProcess);
      }

      const data = await response.json();
      console.log('✅ 변환된 텍스트:', data.transcribed_text);
      console.log('✅ 분류된 필드:', data.fields);

      // 부모 컴포넌트로 데이터 전달
      if (onFieldsReceived) {
        onFieldsReceived(data.fields, data.transcribed_text);
      }

      alert(t.success);
    } catch (error) {
      console.error('❌ 음성 업로드 오류:', error);
      alert(`${t.errorUpload} ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'inline-block' }}>
      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={isProcessing}
          style={{
            padding: '10px 20px',
            background: isProcessing 
              ? '#ccc' 
              : 'linear-gradient(135deg, #9370DB 0%, #6A5ACD 50%, #FFD700 100%)',
            color: 'white',
            border: isProcessing ? 'none' : '1px solid #9370DB',
            borderRadius: '10px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isProcessing ? 'none' : '0 4px 12px rgba(147, 112, 219, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!isProcessing) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #FFD700 0%, #9370DB 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(147, 112, 219, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isProcessing) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #9370DB 0%, #6A5ACD 50%, #FFD700 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(147, 112, 219, 0.4)';
            }
          }}
        >
          <span>{isProcessing ? t.processing : t.startRecording}</span>
        </button>
      ) : (
        <button
          onClick={stopRecording}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            color: 'white',
            border: '1px solid #dc2626',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
            animation: 'pulse 1.5s infinite'
          }}
        >
          <span style={{ 
            width: '10px', 
            height: '10px', 
            backgroundColor: 'white', 
            borderRadius: '50%',
            animation: 'blink 1s infinite'
          }}></span>
          <span>{t.stopRecording}</span>
        </button>
      )}

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}

export default VoiceInputButton;

