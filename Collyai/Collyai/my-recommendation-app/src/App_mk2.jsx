// App.jsx
import { useState, useEffect } from "react";

// 레이더 차트 컴포넌트
function RadarChart({ data, language = 'ko' }) {
  const labels = language === 'ko' ? [
    { key: 'problemSolving', label: '문제해결능력' },
    { key: 'communication', label: '의사소통능력' },
    { key: 'ethics', label: '도덕성' },
    { key: 'emotionalMaturity', label: '정서적 성숙도' },
    { key: 'selfDirectedLearning', label: '자기주도적\n학습능력' }
  ] : [
    { key: 'problemSolving', label: 'Problem\nSolving' },
    { key: 'communication', label: 'Communication' },
    { key: 'ethics', label: 'Ethics' },
    { key: 'emotionalMaturity', label: 'Emotional\nMaturity' },
    { key: 'selfDirectedLearning', label: 'Self-Directed\nLearning' }
  ];
  
  const maxScore = 5;
  const size = 400;
  const center = size / 2;
  const radius = 140;
  const levels = 5;
  
  // 각 축의 각도 계산 (오각형이므로 72도씩)
  const angleStep = (Math.PI * 2) / labels.length;
  
  // 점수를 좌표로 변환
  const getPoint = (value, index) => {
    const angle = angleStep * index - Math.PI / 2; // -90도에서 시작
    const normalizedValue = (value / maxScore) * radius;
    return {
      x: center + normalizedValue * Math.cos(angle),
      y: center + normalizedValue * Math.sin(angle)
    };
  };
  
  // 축의 끝 점 계산
  const getAxisPoint = (index) => {
    const angle = angleStep * index - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };
  
  // 레이블 위치 계산
  const getLabelPoint = (index) => {
    const angle = angleStep * index - Math.PI / 2;
    const labelRadius = radius + 40;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle)
    };
  };
  
  // 데이터 포인트 생성
  const dataPoints = labels.map((label, i) => getPoint(data[label.key] || 0, i));
  const pathData = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={size} height={size} style={{ maxWidth: '100%', height: 'auto' }}>
        {/* 배경 레벨 그리기 */}
        {[...Array(levels)].map((_, level) => {
          const levelRadius = (radius / levels) * (level + 1);
          const points = labels.map((_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            return {
              x: center + levelRadius * Math.cos(angle),
              y: center + levelRadius * Math.sin(angle)
            };
          });
          const levelPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          
          return (
            <path
              key={level}
              d={levelPath}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}
        
        {/* 축 그리기 */}
        {labels.map((_, index) => {
          const point = getAxisPoint(index);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#d1d5db"
              strokeWidth="1"
            />
          );
        })}
        
        {/* 데이터 영역 */}
        <path
          d={pathData}
          fill="rgba(239, 68, 68, 0.2)"
          stroke="#ef4444"
          strokeWidth="3"
        />
        
        {/* 데이터 포인트 */}
        {dataPoints.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#dc2626"
              stroke="white"
              strokeWidth="2"
            />
            {/* 점수 표시 */}
            <text
              x={point.x}
              y={point.y - 15}
              textAnchor="middle"
              fill="#991b1b"
              fontSize="14"
              fontWeight="bold"
            >
              {data[labels[i].key] || 0}
            </text>
          </g>
        ))}
        
        {/* 레이블 */}
        {labels.map((label, index) => {
          const point = getLabelPoint(index);
          const lines = label.label.split('\n');
          
          return (
            <text
              key={index}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#374151"
              fontSize="13"
              fontWeight="600"
            >
              {lines.map((line, i) => (
                <tspan key={i} x={point.x} dy={i === 0 ? 0 : 16}>{line}</tspan>
              ))}
            </text>
          );
        })}
        
        {/* 중앙 점 */}
        <circle cx={center} cy={center} r="3" fill="#dc2626" />
      </svg>
    </div>
  );
}

// 스타일 객체들
const styles = {
  // 공통
  gradient: {
    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
  },
  gradientRed: {
    background: 'linear-gradient(to right, #ef4444, #dc2626)',
  },
  gradientPink: {
    background: 'linear-gradient(to right, #ec4899, #f43f5e)',
  },
  gradientEmerald: {
    background: 'linear-gradient(to right, #ef4444, #dc2626)',
  },
  
  // 컨테이너
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fef2f2 0%, #ffe4e6 50%, #fff1f2 100%)',
  },
  
  // 로그인/회원가입 카드
  authCard: {
    maxWidth: '450px',
    width: '100%',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '2rem',
  },
  
  // 네비게이션
  nav: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #e5e7eb',
  },
  
  // 입력 필드
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  
  // 버튼
  button: {
    width: '100%',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  // 카드
  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    padding: '2rem',
    marginBottom: '2rem',
  },
};

// ----- 다국어 지원 -----
const TRANSLATIONS = {
  ko: {
    tones: {
      Formal: "공식적",
      Friendly: "친근한",
      Concise: "간결한",
      Persuasive: "설득형",
      Neutral: "중립적",
    },
    login: {
      title: "AI 추천서",
      subtitle: "전문적인 추천서를 손쉽게 작성하세요",
      email: "이메일",
      password: "비밀번호",
      loginButton: "로그인",
      loggingIn: "로그인 중...",
      noAccount: "계정이 없으신가요?",
      signup: "회원가입",
    },
    register: {
      title: "회원가입",
      subtitle: "AI 추천서와 함께 시작하세요",
      email: "이메일",
      password: "비밀번호",
      name: "이름",
      nickname: "닉네임 (선택)",
      registerButton: "회원가입",
      registering: "가입 중...",
      haveAccount: "이미 계정이 있으신가요?",
      login: "로그인",
    },
    nav: {
      home: "홈",
      lookup: "조회",
      generate: "생성",
      logout: "로그아웃",
    },
    main: {
      title: "AI 추천서 생성기",
      subtitle: "전문적이고 설득력 있는 추천서를 AI가 자동으로 작성해드립니다",
    },
    lookup: {
      title: "사용자 조회",
      subtitle: "닉네임/이름으로 DB 존재 여부를 확인하세요",
      placeholder: "닉네임 또는 이름 입력...",
      search: "확인",
      searching: "조회 중...",
      notFound: "DB에 없는 데이터입니다.",
      searchResults: "검색 결과",
      workspace: "워크스페이스",
      role: "역할",
      viewDetails: "📋 상세 정보 보기",
      loading: "로딩 중...",
      userDetails: "사용자 상세 정보",
      close: "닫기",
      noDetails: "등록된 상세 정보가 없습니다.",
      references: "추천서 히스토리",
      totalReferences: "개의 추천서",
      viewAll: "전체 보기",
      allReferences: "전체 추천서 목록",
      abilities: {
        title: "추천인 능력 평가",
        subtitle: "논문 분석 기반 핵심 역량 평가 (5점 만점)",
        edit: "편집",
        save: "저장",
        saving: "저장 중...",
        cancel: "취소",
        noData: "⚠️ 등록된 평가 데이터가 없습니다. 아래는 샘플 데이터입니다.",
        editTitle: "능력 평가 편집",
        itemsTitle: "평가 항목 설명:",
        problemSolving: "문제해결능력",
        problemSolvingDesc: "복잡한 문제를 분석하고 창의적으로 해결하는 능력",
        communication: "의사소통능력",
        communicationDesc: "효과적으로 소통하고 팀원들과 협업하는 능력",
        ethics: "도덕성",
        ethicsDesc: "윤리적 판단력과 사회적 책임감",
        emotionalMaturity: "정서적 성숙도",
        emotionalMaturityDesc: "감정 조절 및 원만한 대인관계 능력",
        selfDirectedLearning: "자기주도적 학습능력",
        selfDirectedLearningDesc: "스스로 학습 목표를 설정하고 성장하는 능력",
        researchNote: "논문 분석에 따르면, 합격자들은 문제해결능력, 의사소통능력, 도덕성, 정서적 성숙도에서 높은 평가를 받았으며, 자기주도적 학습능력은 최종 합격에 유의미한 영향을 미치는 것으로 나타났습니다."
      },
      experiences: {
        title: "경력",
        company: "회사명",
        position: "직책",
        period: "기간",
        description: "업무 내용",
        current: "현재"
      },
      awards: {
        title: "수상 이력",
        awardName: "수상명",
        organization: "수여 기관",
        awardDate: "수상일",
        description: "설명"
      },
      certifications: {
        title: "자격증",
        certName: "자격증명",
        issuer: "발급 기관",
        issueDate: "발급일",
        expiryDate: "만료일",
        number: "번호",
        unlimited: "무제한"
      },
      strengths: {
        title: "강점",
        category: "카테고리",
        strength: "강점",
        description: "설명",
        general: "일반"
      },
      reputations: {
        title: "평판",
        anonymous: "익명"
      },
      projects: {
        title: "프로젝트",
        role: "역할",
        achievement: "성과",
        technologies: "기술",
        projectLink: "프로젝트 링크 →",
        ongoing: "진행중"
      }
    },
    form: {
      title: "추천서 작성",
      subtitle: "모든 필드를 정확히 입력해주세요",
      recommenderName: "작성자 이름",
      requesterName: "요청자 이름",
      requesterEmail: "요청자 이메일",
      majorField: "전공 분야 (선택)",
      majorFieldPlaceholder: "예: 컴퓨터공학, 경영학 등",
      relationship: "요청자와의 관계",
      relationshipPlaceholder: "예: 3년간 함께 근무한 동료, 2년간 지도한 학생 등",
      strengths: "장점",
      strengthsPlaceholder: "요청자의 주요 강점과 역량을 구체적으로 작성하세요",
      memorable: "특별히 기억나는 내용",
      memorablePlaceholder: "함께한 프로젝트, 특별한 성과, 인상 깊었던 순간 등",
      additionalInfo: "추가 내용",
      additionalInfoPlaceholder: "추가로 전달하고 싶은 내용이나 특이사항을 자유롭게 작성하세요",
      tone: "작성 톤",
      score: "평가 점수",
      wordCount: "목표 글자 수 (선택)",
      wordCountPlaceholder: "예: 1000 (비워두면 자동)",
      template: "참고 양식 (선택)",
      templateNone: "양식 없음",
      includeDetails: "요청자의 상세 정보를 AI 추천서에 포함",
      includeDetailsDesc: "체크하면 요청자의 경력, 수상, 자격증, 강점, 프로젝트 등의 정보가 AI 추천서 생성 시 자동으로 반영됩니다.",
      generateButton: "추천서 생성하기",
      generating: "생성 중...",
      generatedTitle: "생성된 추천서",
      preview: "📄 미리보기",
      edit: "✏️ 편집",
      copy: "복사하기",
      save: "저장하기",
      saving: "저장 중...",
      downloadPdf: "📥 PDF 다운로드",
      downloading: "다운로드 중...",
      share: "🔗 공유하기",
      sharing: "공유 중...",
      editNote: "* 생성된 추천서를 자유롭게 수정하신 후 \"저장하기\" 버튼을 클릭하세요.",
      improvementNotes: "AI에게 고칠점 / 개선사항 (선택)",
      improvementNotesPlaceholder: "추천서에서 고치고 싶은 부분이나 개선하고 싶은 사항을 자유롭게 작성하세요. 비워두면 AI가 전체적으로 다듬어줍니다. 예: 더 구체적인 예시 추가, 톤 조정, 특정 부분 강조 등",
      finalizeButton: "최종 완성",
      finalizing: "최종 완성 중...",
    },
  },
  en: {
    tones: {
      Formal: "Formal",
      Friendly: "Friendly",
      Concise: "Concise",
      Persuasive: "Persuasive",
      Neutral: "Neutral",
    },
    login: {
      title: "AI Recommendation",
      subtitle: "Create professional recommendation letters with ease",
      email: "Email",
      password: "Password",
      loginButton: "Login",
      loggingIn: "Logging in...",
      noAccount: "Don't have an account?",
      signup: "Sign Up",
    },
    register: {
      title: "Sign Up",
      subtitle: "Get started with AI Recommendation",
      email: "Email",
      password: "Password",
      name: "Name",
      nickname: "Nickname (Optional)",
      registerButton: "Sign Up",
      registering: "Signing up...",
      haveAccount: "Already have an account?",
      login: "Login",
    },
    nav: {
      home: "Home",
      lookup: "Lookup",
      generate: "Generate",
      logout: "Logout",
    },
    main: {
      title: "AI Recommendation Generator",
      subtitle: "AI automatically creates professional and persuasive recommendation letters for you",
    },
    lookup: {
      title: "User Lookup",
      subtitle: "Check if a user exists in the database by nickname/name",
      placeholder: "Enter nickname or name...",
      search: "Search",
      searching: "Searching...",
      notFound: "User not found in database.",
      searchResults: "Search Results",
      workspace: "Workspace",
      role: "Role",
      viewDetails: "📋 View Details",
      loading: "Loading...",
      userDetails: "User Details",
      close: "Close",
      noDetails: "No detailed information registered.",
      references: "Recommendation History",
      totalReferences: "recommendations",
      viewAll: "View All",
      allReferences: "All Recommendations",
      abilities: {
        title: "Ability Assessment",
        subtitle: "Core competency evaluation based on research (max 5.0)",
        edit: "Edit",
        save: "Save",
        saving: "Saving...",
        cancel: "Cancel",
        noData: "⚠️ No assessment data registered. Sample data is shown below.",
        editTitle: "Edit Ability Assessment",
        itemsTitle: "Assessment Items:",
        problemSolving: "Problem Solving",
        problemSolvingDesc: "Ability to analyze and creatively solve complex problems",
        communication: "Communication",
        communicationDesc: "Ability to communicate effectively and collaborate with team members",
        ethics: "Ethics",
        ethicsDesc: "Ethical judgment and social responsibility",
        emotionalMaturity: "Emotional Maturity",
        emotionalMaturityDesc: "Emotional regulation and interpersonal skills",
        selfDirectedLearning: "Self-Directed Learning",
        selfDirectedLearningDesc: "Ability to set learning goals and grow independently",
        researchNote: "Research Note: According to research, successful candidates received high evaluations in problem solving, communication, ethics, and emotional maturity, and self-directed learning ability had a significant impact on final acceptance."
      },
      experiences: {
        title: "Experience",
        company: "Company",
        position: "Position",
        period: "Period",
        description: "Description",
        current: "Present"
      },
      awards: {
        title: "Awards",
        awardName: "Award Name",
        organization: "Organization",
        awardDate: "Award Date",
        description: "Description"
      },
      certifications: {
        title: "Certifications",
        certName: "Certification",
        issuer: "Issuer",
        issueDate: "Issue Date",
        expiryDate: "Expiry Date",
        number: "Number",
        unlimited: "Unlimited"
      },
      strengths: {
        title: "Strengths",
        category: "Category",
        strength: "Strength",
        description: "Description",
        general: "General"
      },
      reputations: {
        title: "Reputation",
        anonymous: "Anonymous"
      },
      projects: {
        title: "Projects",
        role: "Role",
        achievement: "Achievement",
        technologies: "Technologies",
        projectLink: "Project Link →",
        ongoing: "Ongoing"
      }
    },
    form: {
      title: "Write Recommendation",
      subtitle: "Please fill in all fields accurately",
      recommenderName: "Recommender Name",
      requesterName: "Requester Name",
      requesterEmail: "Requester Email",
      majorField: "Major Field (Optional)",
      majorFieldPlaceholder: "e.g., Computer Science, Business Administration, etc.",
      relationship: "Relationship with Requester",
      relationshipPlaceholder: "e.g., Colleague for 3 years, Student mentored for 2 years, etc.",
      strengths: "Strengths",
      strengthsPlaceholder: "Describe the requester's key strengths and capabilities in detail",
      memorable: "Memorable Content",
      memorablePlaceholder: "Projects together, special achievements, impressive moments, etc.",
      additionalInfo: "Additional Information",
      additionalInfoPlaceholder: "Feel free to add any additional information or special notes",
      tone: "Writing Tone",
      score: "Evaluation Score",
      wordCount: "Target Word Count (Optional)",
      wordCountPlaceholder: "e.g., 1000 (leave blank for auto)",
      template: "Reference Template (Optional)",
      templateNone: "No Template",
      includeDetails: "📋 Include requester's detailed information in AI recommendation",
      includeDetailsDesc: "If checked, the requester's career, awards, certifications, strengths, projects, etc. will be automatically included in the AI recommendation.",
      generateButton: "Generate Recommendation",
      generating: "Generating...",
      generatedTitle: "Generated Recommendation",
      preview: "📄 Preview",
      edit: "✏️ Edit",
      copy: "Copy",
      save: "Save",
      saving: "Saving...",
      downloadPdf: "📥 Download PDF",
      downloading: "Downloading...",
      share: "🔗 Share",
      sharing: "Sharing...",
      editNote: "* Feel free to edit the generated recommendation and click the \"Save\" button.",
      improvementNotes: "Improvement Notes for AI (Optional)",
      improvementNotesPlaceholder: "Describe what you'd like to improve in the recommendation. Leave blank for general refinement. e.g., Add more specific examples, adjust tone, emphasize certain aspects, etc.",
      finalizeButton: "Finalize",
      finalizing: "Finalizing...",
    },
  },
};

// ----- 톤 한국어 매핑 (하위 호환) -----
const TONE_LABELS = {
  Formal: "공식적",
  Friendly: "친근한",
  Concise: "간결한",
  Persuasive: "설득형",
  Neutral: "중립적",
};

// ----- 초기 상태 -----
const INITIAL_FORM = {
  recommender_name: "",
  requester_name: "",
  requester_email: "",
  major_field: "",
  relationship: "",
  strengths: "",
  memorable: "",
  additional_info: "",
  tone: "Formal",
  selected_score: "1",
  workspace_id: "",
  include_user_details: false,
  word_count: "",
  template_id: "",
};

// 로그인 컴포넌트
function LoginForm({ onLogin, onToggleMode, language, onLanguageChange }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "로그인 실패");
      onLogin(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.pageContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
      {/* 다국어 버튼 */}
      <button
        onClick={() => onLanguageChange(language === 'ko' ? 'en' : 'ko')}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#ef4444',
          background: 'white',
          border: '2px solid #ef4444',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#ef4444';
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'white';
          e.target.style.color = '#ef4444';
        }}
      >
        🌐 {language === 'ko' ? 'EN' : '한'}
      </button>
      
      <div style={styles.authCard}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            ...styles.gradientRed, 
            width: '64px', 
            height: '64px', 
            borderRadius: '16px', 
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(to right, #ef4444, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            {t.login.title}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>{t.login.subtitle}</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>{t.login.email}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>{t.login.password}</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...styles.gradientRed,
              color: 'white',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? t.login.loggingIn : t.login.loginButton}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <button type="button" onClick={onToggleMode} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
            {t.login.noAccount} <span style={{ textDecoration: 'underline' }}>{t.login.signup}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 회원가입 컴포넌트
function RegisterForm({ onRegister, onToggleMode, language, onLanguageChange }) {
  const [form, setForm] = useState({ email: "", password: "", name: "", nickname: "" });
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "회원가입 실패");
      onRegister(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.pageContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
      {/* 다국어 버튼 */}
      <button
        onClick={() => onLanguageChange(language === 'ko' ? 'en' : 'ko')}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#ec4899',
          background: 'white',
          border: '2px solid #ec4899',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#ec4899';
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'white';
          e.target.style.color = '#ec4899';
        }}
      >
        🌐 {language === 'ko' ? 'EN' : '한'}
      </button>
      
      <div style={styles.authCard}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            ...styles.gradientPink, 
            width: '64px', 
            height: '64px', 
            borderRadius: '16px', 
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(to right, #ec4899, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            {t.register.title}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>{t.register.subtitle}</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>{t.register.email}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>{t.register.password}</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>{t.register.name}</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input}
              placeholder={language === 'ko' ? '홍길동' : 'John Doe'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>{t.register.nickname}</label>
            <input
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              style={styles.input}
              placeholder={language === 'ko' ? '닉네임을 입력하세요' : 'Enter your nickname'}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...styles.gradientPink,
              color: 'white',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? t.register.registering : t.register.registerButton}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <button type="button" onClick={onToggleMode} style={{ background: 'none', border: 'none', color: '#ec4899', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
            {t.register.haveAccount} <span style={{ textDecoration: 'underline' }}>{t.register.login}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 네비게이션 컴포넌트
function Navigation({ user, onLogout, language, onLanguageChange }) {
  const t = TRANSLATIONS[language];
  return (
    <nav style={styles.nav}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ ...styles.gradientRed, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(to right, #ef4444, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.login.title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500' }}>{t.nav.home}</a>
          <a href="#lookup" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500' }}>{t.nav.lookup}</a>
          <a href="#generate" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500' }}>{t.nav.generate}</a>
          
          {/* 다국어 버튼 */}
          <button
            onClick={() => onLanguageChange(language === 'ko' ? 'en' : 'ko')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ef4444',
              background: 'white',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ef4444';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#ef4444';
            }}
          >
            🌐 {language === 'ko' ? 'EN' : '한'}
          </button>
          
          {user && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'linear-gradient(to right, #fee2e2, #fecaca)', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                <div style={{ ...styles.gradientRed, width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '14px' }}>
                  {user.name?.[0] || user.nickname?.[0] || "U"}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{user.name || user.nickname}</span>
              </div>
              <button type="button" onClick={onLogout} style={{ padding: '8px 16px', fontSize: '14px', fontWeight: '500', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>
                {t.nav.logout}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [nickname, setNickname] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookup, setLookup] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAllReferences, setShowAllReferences] = useState(false);
  const [allReferences, setAllReferences] = useState([]);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [editedRecommendation, setEditedRecommendation] = useState("");
  const [currentRecommendationId, setCurrentRecommendationId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [improvementNotes, setImprovementNotes] = useState("");
  const [refining, setRefining] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ko';
  });
  const [editingAbilities, setEditingAbilities] = useState(false);
  const [abilitiesForm, setAbilitiesForm] = useState({
    problemSolving: 0,
    communication: 0,
    ethics: 0,
    emotionalMaturity: 0,
    selfDirectedLearning: 0
  });
  const [savingAbilities, setSavingAbilities] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [sharingLink, setSharingLink] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [templates, setTemplates] = useState([]);
  const [signatureData, setSignatureData] = useState(null);
  const [signatureType, setSignatureType] = useState(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  
  const t = TRANSLATIONS[language];
  
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  // 추천서 내용을 파싱하여 정렬된 JSX로 변환
  const formatRecommendation = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    let result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 제목 (첫 줄 "추천서")
      if (i === 0 && line === '추천서') {
        result.push(<div key={i} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1rem' }}>{line}</div>);
        continue;
      }
      
      // 빈 줄
      if (!line) {
        result.push(<div key={i} style={{ height: '0.5rem' }}></div>);
        continue;
      }
      
      // 날짜 패턴 (예: "2024년 10월 31일")
      if (/^\d{4}년\s+\d{1,2}월\s+\d{1,2}일$/.test(line)) {
        result.push(<div key={i} style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '0.5rem' }}>{line}</div>);
        continue;
      }
      
      // 서명 줄 처리 (서명: ___ 형태를 실제 서명 이미지로 교체)
      if (line.startsWith('서명:')) {
        result.push(
          <div key={i} style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <span>서명:</span>
            {signatureData ? (
              <img 
                src={signatureData} 
                alt="서명" 
                style={{ 
                  maxWidth: '150px', 
                  height: 'auto',
                  maxHeight: '60px'
                }} 
              />
            ) : (
              <span>___________________</span>
            )}
          </div>
        );
        continue;
      }
      
      // 작성자 정보 (작성자:, 소속/직위:, 연락처:)
      if (line.startsWith('작성자:') || line.startsWith('소속/직위:') || 
          line.startsWith('연락처:')) {
        result.push(<div key={i} style={{ textAlign: 'center' }}>{line}</div>);
        continue;
      }
      
      // 본문
      if (line.length > 0) {
        result.push(<div key={i} style={{ textAlign: 'left', marginBottom: '0.5rem' }}>{line}</div>);
      }
    }
    
    return result;
  };

  const resetAllUiStates = () => {
    setForm({ ...INITIAL_FORM });
    setRecommendation("");
    setNickname("");
    setLookup(null);
    setLookupLoading(false);
    setSelectedUser(null);
    setShowAllReferences(false);
    setAllReferences([]);
    setEditedRecommendation("");
    setCurrentRecommendationId(null);
    setIsEditing(false);
    setUserDetails(null);
    setShowUserDetails(false);
    setImprovementNotes("");
    setRefining(false);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchUserData(savedToken);
    }
    // 양식 목록 로드
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("http://localhost:8000/templates");
      const data = await response.json();
      if (response.ok) {
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error("양식 목록 로드 실패:", error);
    }
  };

  useEffect(() => {
    if (user?.email) resetAllUiStates();
  }, [user?.email]);

  const fetchUserData = async (currentToken) => {
    try {
      const response = await fetch("http://localhost:8000/me", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // 사용자 서명 불러오기
        fetchUserSignature(data.user.id, currentToken);
      } else {
        handleLogout();
      }
    } catch (e) {
      handleLogout();
    }
  };

  const fetchUserSignature = async (userId, currentToken) => {
    try {
      const response = await fetch(`http://localhost:8000/user-signature/${userId}`, {
        headers: { Authorization: `Bearer ${currentToken || token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setSignatureData(data.signature_data);
          setSignatureType(data.signature_type);
          console.log("서명 불러오기 성공:", data.signature_type);
        }
      }
    } catch (e) {
      console.error("서명 불러오기 실패:", e);
    }
  };

  const handleLogin = (data) => {
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("token", data.access_token);
    // 로그인 시 폼 초기화하고 작성자 이름 설정
    setForm({ ...INITIAL_FORM, recommender_name: data.user.nickname || data.user.name || "" });
    // 다른 상태들 초기화
    setRecommendation("");
    setNickname("");
    setLookup(null);
    setLookupLoading(false);
    setSelectedUser(null);
    setShowAllReferences(false);
    setAllReferences([]);
    setEditedRecommendation("");
    setCurrentRecommendationId(null);
    setIsEditing(false);
    setUserDetails(null);
    setShowUserDetails(false);
    setImprovementNotes("");
    setRefining(false);
    // 사용자 서명 불러오기
    fetchUserSignature(data.user.id, data.access_token);
  };

  const handleRegister = (data) => {
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("token", data.access_token);
    // 회원가입 시 폼 초기화하고 작성자 이름 설정
    setForm({ ...INITIAL_FORM, recommender_name: data.user.nickname || data.user.name || "" });
    // 다른 상태들 초기화
    setRecommendation("");
    setNickname("");
    setLookup(null);
    setLookupLoading(false);
    setSelectedUser(null);
    setShowAllReferences(false);
    setAllReferences([]);
    setEditedRecommendation("");
    setCurrentRecommendationId(null);
    setIsEditing(false);
    setUserDetails(null);
    setShowUserDetails(false);
    setImprovementNotes("");
    setRefining(false);
  };

  const handleLogout = () => {
    resetAllUiStates();
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    setAuthMode("login");
  };

  const doLookup = async () => {
    setLookupLoading(true);
    setLookup(null);
    setSelectedUser(null);
    setShowAllReferences(false);
    setAllReferences([]);
    try {
      const res = await fetch("http://localhost:8000/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: nickname }),
      });
      const data = await res.json();
      setLookup(data);
      
      if (data?.exists && data?.users?.length > 0) {
        const firstUser = data.users[0];
        setSelectedUser(firstUser);
        setForm((f) => ({
          ...f,
          requester_name: firstUser.nickname || firstUser.name || "",
          requester_email: firstUser.email || "",
        }));
      }
    } catch {
      setLookup({ exists: false, message: "서버 연결 오류" });
    } finally {
      setLookupLoading(false);
    }
  };

  const fetchAllReferences = async (userId) => {
    setLoadingReferences(true);
    try {
      const res = await fetch("http://localhost:8000/reference-history", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      setAllReferences(data.references || []);
      setShowAllReferences(true);
    } catch (error) {
      alert("추천서 기록을 불러오는데 실패했습니다.");
    } finally {
      setLoadingReferences(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoadingUserDetails(true);
    try {
      const res = await fetch(`http://localhost:8000/user-details/${userId}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      setUserDetails(data);
      setShowUserDetails(true);
    } catch (error) {
      alert("사용자 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setRecommendation("");
    setEditedRecommendation("");
    setCurrentRecommendationId(null);
    setIsEditing(false);
    setImprovementNotes("");
    try {
      const response = await fetch("http://localhost:8000/generate-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommender_name: form.recommender_name || user?.nickname || user?.name || "",
          requester_name: form.requester_name,
          requester_email: form.requester_email,
          major_field: form.major_field || null,
          relationship: form.relationship,
          strengths: form.strengths,
          memorable: form.memorable,
          additional_info: form.additional_info || null,
          tone: form.tone,
          selected_score: form.selected_score,
          workspace_id: form.workspace_id || null,
          include_user_details: form.include_user_details || false,
          word_count: form.word_count ? parseInt(form.word_count) : null,
          template_id: form.template_id ? parseInt(form.template_id) : null,
          signature_data: signatureData || null,
          signature_type: signatureType || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "생성 실패");
      
      setRecommendation(data.recommendation);
      setEditedRecommendation(data.recommendation);
      setCurrentRecommendationId(data.id);
      setIsEditing(true);
    } catch (err) {
      console.error("추천서 생성 에러:", err);
      alert("추천서 생성 실패: " + err.message + "\n\n자세한 내용은 콘솔(F12)을 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecommendation = async () => {
    if (!currentRecommendationId) {
      alert("저장할 추천서가 없습니다.");
      return;
    }
    
    setSaveLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/update-recommendation/${currentRecommendationId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          content: editedRecommendation
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "저장 실패");
      alert(language === 'ko' ? "추천서가 저장되었습니다." : "Recommendation saved successfully.");
      setRecommendation(editedRecommendation);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRefineRecommendation = async () => {
    if (!editedRecommendation.trim()) {
      alert(language === 'ko' ? "추천서 내용이 없습니다." : "No recommendation content available.");
      return;
    }
    
    // 개선사항이 비어있으면 기본 메시지 사용
    const notes = improvementNotes.trim() || 
      (language === 'ko' 
        ? "사용자가 수정한 내용을 바탕으로 문법, 표현, 흐름을 자연스럽게 다듬어주세요. 사용자가 수정한 내용은 최대한 보존하면서 전체적인 완성도를 높여주세요."
        : "Please refine the grammar, expressions, and flow naturally based on the user's edits. Preserve the user's modifications as much as possible while improving overall quality.");
    
    setRefining(true);
    try {
      const response = await fetch("http://localhost:8000/refine-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_content: editedRecommendation,
          improvement_notes: notes,
          tone: form.tone,
          selected_score: form.selected_score,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "최종 완성 실패");
      
      setEditedRecommendation(data.refined_content);
      setRecommendation(data.refined_content);
      setImprovementNotes("");
      alert(language === 'ko' ? "추천서가 최종 완성되었습니다!" : "Recommendation has been refined successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setRefining(false);
    }
  };

  const handleSaveAbilities = async () => {
    if (!selectedUser) {
      alert(language === 'ko' ? "사용자를 선택해주세요." : "Please select a user.");
      return;
    }
    
    // 값 검증
    for (const [key, value] of Object.entries(abilitiesForm)) {
      if (value < 0 || value > 5) {
        alert(language === 'ko' ? `${key}의 값은 0~5 사이여야 합니다.` : `${key} must be between 0 and 5.`);
        return;
      }
    }
    
    setSavingAbilities(true);
    try {
      const response = await fetch("http://localhost:8000/user-abilities/update", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          ...abilitiesForm
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "저장 실패");
      
      alert(language === 'ko' ? "능력 평가가 저장되었습니다." : "Abilities saved successfully.");
      setEditingAbilities(false);
      // 상세정보 새로고침
      fetchUserDetails(selectedUser.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingAbilities(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!currentRecommendationId) {
      alert(language === 'ko' ? "다운로드할 추천서가 없습니다." : "No recommendation to download.");
      return;
    }
    
    setDownloadingPdf(true);
    try {
      const response = await fetch(`http://localhost:8000/download-pdf/${currentRecommendationId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "PDF 다운로드 실패");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recommendation_${currentRecommendationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert(language === 'ko' ? "PDF가 다운로드되었습니다." : "PDF downloaded successfully.");
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleShareRecommendation = async () => {
    if (!currentRecommendationId) {
      alert(language === 'ko' ? "공유할 추천서가 없습니다." : "No recommendation to share.");
      return;
    }
    
    setSharingLink(true);
    try {
      const response = await fetch(`http://localhost:8000/share-recommendation/${currentRecommendationId}`, {
        method: "GET"
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "공유 링크 생성 실패");
      
      setShareUrl(data.share_url);
      navigator.clipboard.writeText(data.share_url);
      alert(language === 'ko' ? "공유 링크가 클립보드에 복사되었습니다!" : "Share link copied to clipboard!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSharingLink(false);
    }
  };

  if (!user) {
    return authMode === "login" ? (
      <LoginForm 
        onLogin={handleLogin} 
        onToggleMode={() => setAuthMode("register")}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
    ) : (
      <RegisterForm 
        onRegister={handleRegister} 
        onToggleMode={() => setAuthMode("login")}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  const canGenerate =
    (form.recommender_name.trim() || user?.nickname || user?.name) &&
    form.requester_name.trim() &&
    form.requester_email.trim() &&
    form.relationship.trim() &&
    form.strengths.trim() &&
    // form.memorable은 선택 필드이므로 제거
    form.tone.trim() &&
    form.selected_score.trim();

  return (
    <div style={styles.pageContainer}>
      <Navigation 
        user={user} 
        onLogout={handleLogout}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      
      <div style={{ paddingTop: '100px', maxWidth: '1280px', margin: '0 auto', padding: '100px 1rem 2rem' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in">
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #ef4444, #dc2626, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.main.title}
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            {t.main.subtitle}
          </p>
        </div>

        {/* 조회 섹션 */}
        <div id="lookup" style={{ maxWidth: '900px', margin: '0 auto 2rem' }}>
          <div style={styles.card}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t.lookup.title}</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>{t.lookup.subtitle}</p>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t.lookup.placeholder}
                style={{ ...styles.input, flex: 1 }}
              />
              <button
                onClick={doLookup}
                disabled={lookupLoading || !nickname.trim()}
                style={{
                  ...styles.button,
                  ...styles.gradientRed,
                  width: 'auto',
                  padding: '12px 32px',
                  color: 'white',
                  opacity: lookupLoading || !nickname.trim() ? 0.5 : 1,
                }}
              >
                {lookupLoading ? t.lookup.searching : t.lookup.search}
              </button>
            </div>

            {lookup && lookup.exists === false && (
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#fef2f2', border: '2px solid #fecaca', color: '#dc2626' }}>
                {lookup.message || t.lookup.notFound}
              </div>
            )}

            {lookup && lookup.exists && lookup.users?.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'linear-gradient(to right, #fee2e2, #fecaca)', border: '2px solid #fca5a5' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#991b1b' }}>
                    {t.lookup.searchResults} ({lookup.users.length}{language === 'ko' ? '명' : ''})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {lookup.users.map((c) => (
                      <label
                        key={c.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '1rem',
                          borderRadius: '12px',
                        cursor: 'pointer',
                        background: selectedUser?.id === c.id ? '#fee2e2' : 'white',
                        border: selectedUser?.id === c.id ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        }}
                      >
                        <input
                          type="radio"
                          name="candidate"
                          checked={selectedUser?.id === c.id}
                          onChange={() => {
                            setSelectedUser(c);
                            setForm((f) => ({
                              ...f,
                              requester_name: c.nickname || c.name,
                              requester_email: c.email,
                            }));
                          }}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>
                            {c.name} / {c.nickname}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{c.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedUser && selectedUser.workspaces?.length > 0 && (
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: '#f3f4f6' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t.lookup.workspace}</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#e5e7eb' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.workspace}</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.role}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.workspaces.map((w, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px' }}>{w.name || "-"}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: w.role === "슈퍼리더" ? '#e9d5ff' : w.role === "리더" ? '#dbeafe' : '#d1fae5',
                              color: w.role === "슈퍼리더" ? '#7c3aed' : w.role === "리더" ? '#3b82f6' : '#10b981',
                            }}>
                              {w.role || "멤버"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedUser && (
              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={() => fetchUserDetails(selectedUser.id)}
                  disabled={loadingUserDetails}
                  style={{
                    width: '100%',
                    ...styles.button,
                    ...styles.gradientRed,
                    color: 'white',
                    opacity: loadingUserDetails ? 0.7 : 1,
                  }}
                >
                  {loadingUserDetails ? t.lookup.loading : t.lookup.viewDetails}
                </button>
              </div>
            )}

            {showUserDetails && userDetails && (
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'white', border: '2px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{t.lookup.userDetails}</h3>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    style={{ padding: '8px 16px', fontSize: '0.875rem', background: 'white', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    {t.lookup.close}
                  </button>
                </div>

                {/* 능력 평가 레이더 차트 */}
                <div style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '12px', background: 'linear-gradient(to bottom right, #fee2e2, #fef3c7)', border: '2px solid #fca5a5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#991b1b', textAlign: 'center', flex: 1 }}>📊 {t.lookup.abilities.title}</h4>
                    {!editingAbilities && (
                      <button
                        onClick={() => {
                          const current = userDetails.abilities || {
                            problemSolving: 0,
                            communication: 0,
                            ethics: 0,
                            emotionalMaturity: 0,
                            selfDirectedLearning: 0
                          };
                          setAbilitiesForm(current);
                          setEditingAbilities(true);
                        }}
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#ef4444',
                          background: 'white',
                          border: '2px solid #ef4444',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        ✏️ {t.lookup.abilities.edit}
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', marginBottom: '1.5rem' }}>
                    {t.lookup.abilities.subtitle}
                  </p>
                  {(() => {
                    // abilities 데이터 확인
                    const hasAbilities = userDetails.abilities && 
                      (userDetails.abilities.problemSolving > 0 ||
                       userDetails.abilities.communication > 0 ||
                       userDetails.abilities.ethics > 0 ||
                       userDetails.abilities.emotionalMaturity > 0 ||
                       userDetails.abilities.selfDirectedLearning > 0);
                    
                    // 샘플 데이터 (실제 데이터가 없을 때)
                    const sampleData = {
                      problemSolving: 4.2,
                      communication: 4.5,
                      ethics: 4.8,
                      emotionalMaturity: 4.0,
                      selfDirectedLearning: 4.3
                    };
                    
                    const displayData = hasAbilities ? {
                      problemSolving: userDetails.abilities.problemSolving || 0,
                      communication: userDetails.abilities.communication || 0,
                      ethics: userDetails.abilities.ethics || 0,
                      emotionalMaturity: userDetails.abilities.emotionalMaturity || 0,
                      selfDirectedLearning: userDetails.abilities.selfDirectedLearning || 0,
                    } : sampleData;
                    
                    return (
                      <>
                        {!hasAbilities && (
                          <div style={{ 
                            padding: '0.75rem', 
                            background: '#fef3c7', 
                            borderRadius: '8px', 
                            marginBottom: '1rem',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            color: '#92400e',
                            border: '1px solid #fbbf24'
                          }}>
                            {t.lookup.abilities.noData}
                          </div>
                        )}
                        <RadarChart data={displayData} language={language} />
                      </>
                    );
                  })()}
                  
                  {/* 편집 폼 */}
                  {editingAbilities && (
                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'white', borderRadius: '12px', border: '2px solid #ef4444' }}>
                      <h5 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#991b1b' }}>{t.lookup.abilities.editTitle}</h5>
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {[
                          { key: 'problemSolving', label: `🧩 ${t.lookup.abilities.problemSolving}` },
                          { key: 'communication', label: `💬 ${t.lookup.abilities.communication}` },
                          { key: 'ethics', label: `⚖️ ${t.lookup.abilities.ethics}` },
                          { key: 'emotionalMaturity', label: `🎭 ${t.lookup.abilities.emotionalMaturity}` },
                          { key: 'selfDirectedLearning', label: `📚 ${t.lookup.abilities.selfDirectedLearning}` }
                        ].map(({ key, label }) => (
                          <div key={key}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                              {label} (0.0 ~ 5.0)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={abilitiesForm[key]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setAbilitiesForm({ ...abilitiesForm, [key]: Math.min(5, Math.max(0, value)) });
                              }}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                        <button
                          onClick={handleSaveAbilities}
                          disabled={savingAbilities}
                          style={{
                            flex: 1,
                            padding: '12px 24px',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: 'white',
                            ...styles.gradientRed,
                            border: 'none',
                            borderRadius: '8px',
                            cursor: savingAbilities ? 'not-allowed' : 'pointer',
                            opacity: savingAbilities ? 0.7 : 1
                          }}
                        >
                          {savingAbilities ? t.lookup.abilities.saving : `💾 ${t.lookup.abilities.save}`}
                        </button>
                        <button
                          onClick={() => setEditingAbilities(false)}
                          style={{
                            flex: 1,
                            padding: '12px 24px',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#6b7280',
                            background: 'white',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          ✖️ {t.lookup.abilities.cancel}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'white', borderRadius: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
                    <p style={{ marginBottom: '0.5rem' }}><strong>📋 {t.lookup.abilities.itemsTitle}</strong></p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', listStyleType: 'none' }}>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🧩 {t.lookup.abilities.problemSolving}:</span> {t.lookup.abilities.problemSolvingDesc}
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>💬 {t.lookup.abilities.communication}:</span> {t.lookup.abilities.communicationDesc}
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚖️ {t.lookup.abilities.ethics}:</span> {t.lookup.abilities.ethicsDesc}
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🎭 {t.lookup.abilities.emotionalMaturity}:</span> {t.lookup.abilities.emotionalMaturityDesc}
                      </li>
                      <li>
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>📚 {t.lookup.abilities.selfDirectedLearning}:</span> {t.lookup.abilities.selfDirectedLearningDesc}
                      </li>
                    </ul>
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.8rem', color: '#4b5563' }}>
                      <strong>💡 {language === 'ko' ? '참고' : 'Note'}:</strong> {t.lookup.abilities.researchNote}
                    </div>
                  </div>
                </div>

                {/* 경력 */}
                {userDetails.experiences?.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#ef4444' }}>💼 {t.lookup.experiences.title}</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                          <tr style={{ background: '#f3f4f6' }}>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.experiences.company}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.experiences.position}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.experiences.period}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.experiences.description}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetails.experiences.map((exp, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '10px' }}>{exp.company}</td>
                              <td style={{ padding: '10px' }}>{exp.position}</td>
                              <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{exp.startDate} ~ {exp.endDate === '현재' ? t.lookup.experiences.current : exp.endDate}</td>
                              <td style={{ padding: '10px' }}>{exp.description || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 수상 이력 */}
                {userDetails.awards?.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#ef4444' }}>🏆 {t.lookup.awards.title}</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                          <tr style={{ background: '#f3f4f6' }}>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.awards.awardName}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.awards.organization}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.awards.awardDate}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.awards.description}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetails.awards.map((award, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '10px' }}>{award.title}</td>
                              <td style={{ padding: '10px' }}>{award.organization || '-'}</td>
                              <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{award.awardDate || '-'}</td>
                              <td style={{ padding: '10px' }}>{award.description || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 자격증 */}
                {userDetails.certifications?.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#ef4444' }}>📜 {t.lookup.certifications.title}</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                          <tr style={{ background: '#f3f4f6' }}>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.certifications.certName}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.certifications.issuer}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.certifications.issueDate}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.certifications.expiryDate}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.certifications.number}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetails.certifications.map((cert, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '10px' }}>{cert.name}</td>
                              <td style={{ padding: '10px' }}>{cert.issuer || '-'}</td>
                              <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{cert.issueDate || '-'}</td>
                              <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{cert.expiryDate === '무제한' ? t.lookup.certifications.unlimited : cert.expiryDate}</td>
                              <td style={{ padding: '10px' }}>{cert.certificationNumber || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 강점 */}
                {userDetails.strengths?.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#ef4444' }}>⭐ {t.lookup.strengths.title}</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                          <tr style={{ background: '#f3f4f6' }}>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.strengths.category}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.strengths.strength}</th>
                            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>{t.lookup.strengths.description}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetails.strengths.map((strength, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '10px' }}>
                                <span style={{ padding: '4px 12px', borderRadius: '12px', background: '#fee2e2', color: '#991b1b', fontSize: '0.75rem', fontWeight: '600' }}>
                                  {strength.category || t.lookup.strengths.general}
                                </span>
                              </td>
                              <td style={{ padding: '10px', fontWeight: '600' }}>{strength.strength}</td>
                              <td style={{ padding: '10px' }}>{strength.description || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 평판 */}
                {userDetails.reputations?.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#ef4444' }}>💬 {t.lookup.reputations.title}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {userDetails.reputations.map((rep, i) => (
                        <div key={i} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{rep.fromName === '익명' ? t.lookup.reputations.anonymous : rep.fromName}</span>
                              <span style={{ padding: '2px 8px', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', fontSize: '0.75rem', fontWeight: '600' }}>
                                {rep.category || t.lookup.strengths.general}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {[...Array(rep.rating)].map((_, idx) => (
                                <span key={idx} style={{ color: '#ef4444' }}>★</span>
                              ))}
                              {[...Array(5 - rep.rating)].map((_, idx) => (
                                <span key={idx} style={{ color: '#d1d5db' }}>★</span>
                              ))}
                            </div>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>{rep.comment}</p>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{rep.createdAt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 프로젝트 */}
                {userDetails.projects?.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#ef4444' }}>🚀 {t.lookup.projects.title}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {userDetails.projects.map((proj, i) => (
                        <div key={i} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h5 style={{ fontWeight: '600', fontSize: '0.95rem' }}>{proj.title}</h5>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{proj.startDate} ~ {proj.endDate === '진행중' ? t.lookup.projects.ongoing : proj.endDate}</span>
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            <strong>{t.lookup.projects.role}:</strong> {proj.role || '-'}
                          </div>
                          {proj.description && (
                            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>{proj.description}</p>
                          )}
                          {proj.technologies && (
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                              <strong>{t.lookup.projects.technologies}:</strong> <span style={{ color: '#6b7280' }}>{proj.technologies}</span>
                            </div>
                          )}
                          {proj.achievement && (
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', padding: '8px', background: '#fee2e2', borderRadius: '6px' }}>
                              <strong style={{ color: '#991b1b' }}>{t.lookup.projects.achievement}:</strong> <span style={{ color: '#991b1b' }}>{proj.achievement}</span>
                            </div>
                          )}
                          {proj.url && (
                            <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#ef4444', textDecoration: 'underline' }}>
                              {t.lookup.projects.projectLink}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 데이터가 없는 경우 */}
                {!userDetails.experiences?.length && 
                 !userDetails.awards?.length && 
                 !userDetails.certifications?.length && 
                 !userDetails.strengths?.length && 
                 !userDetails.reputations?.length && 
                 !userDetails.projects?.length && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    {t.lookup.noDetails}
                  </div>
                )}
              </div>
            )}

            {selectedUser && selectedUser.reference_count > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderRadius: '12px', background: 'linear-gradient(to right, #fee2e2, #fecaca)', border: '2px solid #fca5a5' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#991b1b' }}>{t.lookup.references}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#991b1b', marginTop: '4px' }}>
                      {language === 'ko' ? `총 ${selectedUser.reference_count}개의 추천서` : `${selectedUser.reference_count} ${t.lookup.totalReferences}`}
                    </p>
                  </div>
                  <button
                    onClick={() => fetchAllReferences(selectedUser.id)}
                    disabled={loadingReferences}
                    style={{
                      ...styles.gradientRed,
                      padding: '12px 24px',
                      borderRadius: '12px',
                      color: 'white',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer',
                      opacity: loadingReferences ? 0.7 : 1,
                    }}
                  >
                    {loadingReferences ? t.lookup.loading : t.lookup.viewAll}
                  </button>
                </div>
                
                {showAllReferences && (
                  <div style={{ marginTop: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '1rem', background: 'white', borderBottom: '2px solid #e5e7eb', position: 'sticky', top: 0 }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                        {t.lookup.allReferences} ({allReferences.length}{language === 'ko' ? '개' : ''})
                      </h4>
                      <button
                        onClick={() => setShowAllReferences(false)}
                        style={{ padding: '8px 16px', fontSize: '0.875rem', background: 'white', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        {t.lookup.close}
                      </button>
                    </div>
                    {allReferences.map((ref, i) => (
                      <div key={i} style={{ padding: '1.5rem', background: 'white', border: '2px solid #e5e7eb', borderRadius: '12px', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                            From: {ref.from_name} → To: {ref.to_name}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280', background: '#f3f4f6', padding: '4px 12px', borderRadius: '12px' }}>
                            {new Date(ref.created_at).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#1f2937', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{ref.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 추천서 작성 섹션 */}
        <div id="generate" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={styles.card}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t.form.title}</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>{t.form.subtitle}</p>

            <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.recommenderName} * (로그인한 사용자)</label>
                  <input
                    style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                    placeholder={t.form.recommenderName}
                    value={form.recommender_name || user?.nickname || user?.name || ""}
                    readOnly
                    disabled
                  />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.requesterName} *</label>
                <input
                  style={styles.input}
                  placeholder={t.form.requesterName}
                  value={form.requester_name}
                  onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.requesterEmail} *</label>
              <input
                type="email"
                style={styles.input}
                placeholder="requester@email.com"
                value={form.requester_email}
                onChange={(e) => setForm({ ...form, requester_email: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.majorField}</label>
              <input
                style={styles.input}
                placeholder={t.form.majorFieldPlaceholder}
                value={form.major_field}
                onChange={(e) => setForm({ ...form, major_field: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.relationship} *</label>
              <textarea
                rows="3"
                style={{ ...styles.input, resize: 'vertical' }}
                placeholder={t.form.relationshipPlaceholder}
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.strengths} *</label>
              <textarea
                rows="3"
                style={{ ...styles.input, resize: 'vertical' }}
                placeholder={t.form.strengthsPlaceholder}
                value={form.strengths}
                onChange={(e) => setForm({ ...form, strengths: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.memorable} (선택)</label>
              <textarea
                rows="3"
                style={{ ...styles.input, resize: 'vertical' }}
                placeholder={t.form.memorablePlaceholder}
                value={form.memorable}
                onChange={(e) => setForm({ ...form, memorable: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.additionalInfo}</label>
              <textarea
                rows="3"
                style={{ ...styles.input, resize: 'vertical' }}
                placeholder={t.form.additionalInfoPlaceholder}
                value={form.additional_info}
                onChange={(e) => setForm({ ...form, additional_info: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.tone} *</label>
                <select
                  style={{ ...styles.input, cursor: 'pointer' }}
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value })}
                >
                  {Object.entries(t.tones).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.score} *</label>
                <select
                  style={{ ...styles.input, cursor: 'pointer' }}
                  value={form.selected_score}
                  onChange={(e) => setForm({ ...form, selected_score: e.target.value })}
                >
                  {["1", "2", "3", "4", "5"].map((s) => (
                    <option key={s} value={s}>{s}{language === 'ko' ? '점' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.wordCount}</label>
                <input
                  type="number"
                  style={styles.input}
                  placeholder={t.form.wordCountPlaceholder}
                  value={form.word_count}
                  onChange={(e) => setForm({ ...form, word_count: e.target.value })}
                  min="0"
                  step="100"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>{t.form.template}</label>
                <select
                  style={{ ...styles.input, cursor: 'pointer' }}
                  value={form.template_id}
                  onChange={(e) => setForm({ ...form, template_id: e.target.value })}
                >
                  <option value="">{t.form.templateNone}</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>{template.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 상세정보 포함 여부 체크박스 */}
            {selectedUser && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: 'linear-gradient(to right, #fef3c7, #fde68a)', border: '2px solid #fbbf24' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.include_user_details}
                    onChange={(e) => setForm({ ...form, include_user_details: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#ef4444' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
                      {t.form.includeDetails}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#78350f' }}>
                      {t.form.includeDetailsDesc}
                    </div>
                  </div>
                </label>
              </div>
            )}

              {/* 서명 패드 */}
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: '#f9fafb', border: '2px dashed #d1d5db' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                    ✍️ 서명 {signatureData ? '✅' : '(선택사항)'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowSignaturePad(!showSignaturePad)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#ef4444',
                      background: 'white',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {showSignaturePad ? '숨기기' : (signatureData ? '서명 변경' : '서명 추가')}
                  </button>
                </div>
                
                {showSignaturePad && (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>
                      마우스나 터치로 서명을 그려주세요. 한 번 저장하면 다음부터는 자동으로 포함됩니다.
                    </p>
                    <canvas
                      ref={(canvas) => {
                        if (!canvas) return;
                        const ctx = canvas.getContext('2d');
                        let isDrawing = false;
                        let lastX = 0, lastY = 0;
                        
                        canvas.onmousedown = (e) => {
                          isDrawing = true;
                          const rect = canvas.getBoundingClientRect();
                          lastX = e.clientX - rect.left;
                          lastY = e.clientY - rect.top;
                        };
                        
                        canvas.onmousemove = (e) => {
                          if (!isDrawing) return;
                          const rect = canvas.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          ctx.strokeStyle = '#000';
                          ctx.lineWidth = 2;
                          ctx.lineCap = 'round';
                          ctx.beginPath();
                          ctx.moveTo(lastX, lastY);
                          ctx.lineTo(x, y);
                          ctx.stroke();
                          lastX = x;
                          lastY = y;
                        };
                        
                        canvas.onmouseup = () => isDrawing = false;
                        canvas.onmouseleave = () => isDrawing = false;
                        
                        // 터치 지원
                        canvas.ontouchstart = (e) => {
                          e.preventDefault();
                          isDrawing = true;
                          const rect = canvas.getBoundingClientRect();
                          const touch = e.touches[0];
                          lastX = touch.clientX - rect.left;
                          lastY = touch.clientY - rect.top;
                        };
                        
                        canvas.ontouchmove = (e) => {
                          e.preventDefault();
                          if (!isDrawing) return;
                          const rect = canvas.getBoundingClientRect();
                          const touch = e.touches[0];
                          const x = touch.clientX - rect.left;
                          const y = touch.clientY - rect.top;
                          ctx.strokeStyle = '#000';
                          ctx.lineWidth = 2;
                          ctx.lineCap = 'round';
                          ctx.beginPath();
                          ctx.moveTo(lastX, lastY);
                          ctx.lineTo(x, y);
                          ctx.stroke();
                          lastX = x;
                          lastY = y;
                        };
                        
                        canvas.ontouchend = () => isDrawing = false;
                        
                        window.signatureCanvas = canvas;
                      }}
                      width={500}
                      height={150}
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        background: 'white',
                        cursor: 'crosshair',
                        touchAction: 'none'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const canvas = window.signatureCanvas;
                          if (canvas) {
                            const ctx = canvas.getContext('2d');
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            setSignatureData(null);
                            setSignatureType(null);
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: 'white',
                          background: '#f44336',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ 지우기
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const canvas = window.signatureCanvas;
                          if (canvas) {
                            const dataUrl = canvas.toDataURL('image/png');
                            setSignatureData(dataUrl);
                            setSignatureType('draw');
                            setShowSignaturePad(false);
                            alert('서명이 저장되었습니다! 추천서 생성 시 자동으로 포함됩니다.');
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: 'white',
                          background: 'linear-gradient(to right, #667eea, #764ba2)',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        💾 저장
                      </button>
                    </div>
                  </div>
                )}
                
                {signatureData && !showSignaturePad && (
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600', marginBottom: '0.5rem' }}>
                      ✅ 서명이 등록되었습니다
                    </p>
                    <img 
                      src={signatureData} 
                      alt="Signature" 
                      style={{ maxWidth: '300px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white' }} 
                    />
                  </div>
                )}
              </div>

              {/* 디버그 정보 */}
              {!canGenerate && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', border: '2px solid #fbbf24', borderRadius: '8px' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
                    ⚠️ 필수 항목을 모두 입력해주세요:
                  </p>
                  <ul style={{ fontSize: '0.75rem', color: '#78350f', marginLeft: '1.5rem' }}>
                    <li>작성자 이름: {(form.recommender_name.trim() || user?.nickname || user?.name) ? '✅' : '❌ 비어있음'}</li>
                    <li>요청자 이름: {form.requester_name.trim() ? '✅' : '❌ 비어있음'}</li>
                    <li>요청자 이메일: {form.requester_email.trim() ? '✅' : '❌ 비어있음'}</li>
                    <li>요청자와의 관계: {form.relationship.trim() ? '✅' : '❌ 비어있음'}</li>
                    <li>장점: {form.strengths.trim() ? '✅' : '❌ 비어있음'}</li>
                    <li>톤: {form.tone.trim() ? '✅' : '❌ 비어있음'}</li>
                    <li>점수: {form.selected_score.trim() ? '✅' : '❌ 비어있음'}</li>
                  </ul>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !canGenerate}
                style={{
                  ...styles.button,
                  ...styles.gradientRed,
                  color: 'white',
                  fontSize: '1.125rem',
                  padding: '16px 32px',
                  marginTop: '2rem',
                  opacity: loading || !canGenerate ? 0.5 : 1,
                  cursor: loading || !canGenerate ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? t.form.generating : t.form.generateButton}
              </button>
            </form>

            {recommendation && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '12px', background: 'linear-gradient(to bottom right, #fee2e2, #fecaca)', border: '2px solid #fca5a5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#991b1b' }}>
                    {t.form.generatedTitle} ({form.selected_score}{language === 'ko' ? '점' : ''} · {t.tones[form.tone]})
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      style={{ 
                        padding: '8px 16px', 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: showPreview ? 'white' : '#ef4444', 
                        background: showPreview ? 'linear-gradient(to right, #ef4444, #dc2626)' : 'white', 
                        border: '2px solid #fca5a5', 
                        borderRadius: '8px', 
                        cursor: 'pointer' 
                      }}
                    >
                      {showPreview ? t.form.edit : t.form.preview}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(editedRecommendation);
                        alert(language === 'ko' ? "추천서가 클립보드에 복사되었습니다." : "Recommendation copied to clipboard.");
                      }}
                      style={{ padding: '8px 16px', fontSize: '0.875rem', fontWeight: '600', color: '#ef4444', background: 'white', border: '2px solid #fca5a5', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      {t.form.copy}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={downloadingPdf}
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#10b981',
                        background: 'white',
                        border: '2px solid #10b981',
                        borderRadius: '8px',
                        cursor: downloadingPdf ? 'not-allowed' : 'pointer',
                        opacity: downloadingPdf ? 0.7 : 1
                      }}
                    >
                      {downloadingPdf ? t.form.downloading : t.form.downloadPdf}
                    </button>
                    <button
                      type="button"
                      onClick={handleShareRecommendation}
                      disabled={sharingLink}
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#3b82f6',
                        background: 'white',
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        cursor: sharingLink ? 'not-allowed' : 'pointer',
                        opacity: sharingLink ? 0.7 : 1
                      }}
                    >
                      {sharingLink ? t.form.sharing : t.form.share}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveRecommendation}
                      disabled={saveLoading}
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'white',
                        ...styles.gradientRed,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saveLoading ? 'not-allowed' : 'pointer',
                        opacity: saveLoading ? 0.7 : 1
                      }}
                    >
                      {saveLoading ? t.form.saving : t.form.save}
                    </button>
                  </div>
                </div>
                
                {/* 미리보기 모드 */}
                {showPreview ? (
                  <div style={{
                    background: 'white',
                    padding: '3rem 2.5rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    minHeight: '400px',
                    fontFamily: 'serif',
                  }}>
                    <div style={{
                      lineHeight: '2',
                      color: '#1f2937',
                      fontSize: '15px',
                      letterSpacing: '0.3px'
                    }}>
                      {formatRecommendation(editedRecommendation.replace(/<[^>]*>/g, ''))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                      {t.form.editNote}
                    </p>
                    <textarea
                      value={editedRecommendation.replace(/<[^>]*>/g, '')}
                      onChange={(e) => setEditedRecommendation(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '400px',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.7',
                        color: '#1f2937',
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                        resize: 'vertical',
                        textAlign: 'left'
                      }}
                    />
                    
                    {/* 편집 모드에서도 서명 미리보기 */}
                    {signatureData && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                          📝 등록된 서명 (미리보기 및 PDF에서 "서명:" 란에 자동 표시됩니다)
                        </p>
                        <img 
                          src={signatureData} 
                          alt="서명" 
                          style={{ 
                            maxWidth: '150px', 
                            height: 'auto',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            background: 'white',
                            padding: '0.5rem'
                          }} 
                        />
                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                          {form.recommender_name || user?.nickname || user?.name}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* AI 개선사항 입력란 */}
                <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: 'linear-gradient(to right, #dbeafe, #bfdbfe)', border: '2px solid #60a5fa' }}>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
                    💡 {t.form.improvementNotes}
                  </label>
                  <textarea
                    value={improvementNotes}
                    onChange={(e) => setImprovementNotes(e.target.value)}
                    placeholder={t.form.improvementNotesPlaceholder}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #93c5fd',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    onClick={handleRefineRecommendation}
                    disabled={refining}
                    style={{
                      marginTop: '12px',
                      width: '100%',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '16px',
                      border: 'none',
                      cursor: refining ? 'not-allowed' : 'pointer',
                      background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                      color: 'white',
                      opacity: refining ? 0.5 : 1,
                      transition: 'all 0.2s',
                    }}
                  >
                    {refining ? t.form.finalizing : t.form.finalizeButton}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
