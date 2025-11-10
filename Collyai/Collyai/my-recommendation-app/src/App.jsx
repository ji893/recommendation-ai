// App.jsx
import React, { useState, useEffect, useRef } from "react";
import SignUp from "./SignUp.jsx";
import Profile from "./Profile.jsx";
import Box from "./Box.jsx"; // ✅ Profile 연결

// -----------------------------
// 스타일 객체
// -----------------------------
const styles = {
  // 공통
  gradient: { background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" },
  gradientRed: { background: "linear-gradient(to right, #ef4444, #dc2626)" },
  gradientPink: { background: "linear-gradient(to right, #ec4899, #f43f5e)" },
  gradientEmerald: { background: "linear-gradient(to right, #ef4444, #dc2626)" },

  // 컨테이너
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fef2f2 0%, #ffe4e6 50%, #fff1f2 100%)",
  },

  // 로그인/회원가입 카드
  authCard: {
    maxWidth: "450px",
    width: "100%",
    background: "white",
    borderRadius: "20px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "2rem",
  },

  // 네비게이션
  nav: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    width: "100%",
    top: 0,
    zIndex: 1000,
    borderBottom: "1px solid #e5e7eb",
  },

  // 입력 필드
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    transition: "all 0.2s",
  },

  // 버튼
  button: {
    width: "100%",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // 카드
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
    padding: "2rem",
    marginBottom: "2rem",
  },
};

// -----------------------------
// 상수
// -----------------------------
const TONE_LABELS = {
  Formal: "공식적",
  Friendly: "친근한",
  Concise: "간결한",
  Persuasive: "설득형",
  Neutral: "중립적",
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
      signaturePreview: "등록된 서명 (미리보기 및 PDF에서 \"서명:\" 란에 자동 표시됩니다)",
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
      signaturePreview: "Registered signature (automatically displayed in preview and PDF at \"Signature:\" section)",
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

// -----------------------------
// 로그인 폼 (하단 토글로 회원가입 전환)
// -----------------------------
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
    <div
      style={{
        ...styles.pageContainer,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
      }}
    >
      {/* 다국어 버튼 */}
      {onLanguageChange && (
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
      )}
      <div style={styles.authCard}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              ...styles.gradientRed,
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              margin: "0 auto 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: "32px", height: "32px", color: "white" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              background: "linear-gradient(to right, #ef4444, #dc2626)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
            }}
          >
            {t.login.title}
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            {t.login.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                color: "#374151",
              }}
            >
              {t.login.email}
            </label>
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
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                color: "#374151",
              }}
            >
              {t.login.password}
            </label>
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
              color: "white",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? t.login.loggingIn : t.login.loginButton}
          </button>
        </form>

        {/* 하단 토글 → 회원가입 화면으로 전환 */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={onToggleMode}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            {t.login.noAccount} <span style={{ textDecoration: "underline" }}>{t.login.signup}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// 사이드바 (접고/펼치기)
// -----------------------------
function Sidebar({
  collapsed,
  setCollapsed,
  user,
  onLogout,
  onGoHome,
  onGoProfile,
  onGoArchive,
  activeMain = "home",   // "home" | "profile" | "archive"
  activeSub = null,      // 하위 탭
  language = "ko",
  onLanguageChange
}) {
  const width = collapsed ? 72 : 260;

  // 색상/타이포
  const cText = "#374151";
  const cIcon = "#374151";
  const cMuted = "#9ca3af";
  const cActive = "#dc2626"; // 활성 강조색
  const fontTop = collapsed ? 12 : 16; // 홈/프로필/보관함
  const fontSub = collapsed ? 12 : 13; // 하위 메뉴(더 작게)

  // ---- Icons (inline SVG) ----
  const iconBase = { width: 20, height: 20, flex: "0 0 auto" };
  const HomeIcon = ({ active }) => (
    <svg style={{ ...iconBase, color: collapsed ? (active ? cActive : cIcon) : cIcon }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10.5l9-7 9 7V20a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9.5z" />
    </svg>
  );
  const UserIcon = ({ active }) => (
    <svg style={{ ...iconBase, color: collapsed ? (active ? cActive : cIcon) : cIcon }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1 1 18.88 6.196 7 7 0 0 0 12 19a7 7 0 0 0-6.879-1.196z" />
    </svg>
  );
  const DrawerIcon = ({ active }) => (
    <svg style={{ ...iconBase, color: collapsed ? (active ? cActive : cIcon) : cIcon }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="6" width="18" height="12" rx="2" ry="2" strokeWidth="2" />
      <path d="M3 10h18" strokeWidth="2" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
    </svg>
  );
  const LogoutIcon = () => (
    <svg style={{ ...iconBase, color: cIcon }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 17l5-5-5-5M20 12H9" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 19a2 2 0 0 0 2 2h5v-2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5V3H6a2 2 0 0 0-2 2v14z" />
    </svg>
  );

  const Item = ({ label, onClick, indent = 0, Icon, active = false, top = false }) => (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: 10,
        padding: `10px ${12 + indent}px`,
        background: "transparent",
        border: "none",
        textAlign: "left",
        cursor: "pointer",
        borderRadius: 8,
        color: collapsed ? cText : (active ? cActive : cText),
        fontWeight: active && !collapsed ? 800 : 500,
        fontSize: top ? fontTop : fontSub,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}
      title={label}
    >
      {Icon && <Icon active={active} />}
      {!collapsed && <span>{label}</span>}
    </button>
  );

  return (
    <aside
      style={{
        width,
        transition: "width .2s ease",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        borderRight: "1px solid #f3f4f6",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        left: 0,
        top: 0,
        height: "100vh",
        zIndex: 10,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 12px",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <div
          style={{
            background: "linear-gradient(to right, #ef4444, #dc2626)",
            width: 36,
            height: 36,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: 16,
            flex: "0 0 auto",
          }}
        >
          AI
        </div>
        {!collapsed && (
          <div style={{ fontSize: 18, fontWeight: 800, background: "linear-gradient(to right,#ef4444,#dc2626)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI 추천서
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label="toggle-sidebar"
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 6,
            borderRadius: 8,
            color: cMuted,
            fontSize: 14
          }}
          title={collapsed ? "펼치기" : "접기"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* 메뉴 */}
      <div style={{ padding: "8px 6px", overflowY: "auto", flex: 1 }}>
        {/* 홈 (상위) */}
        <Item label="홈" Icon={HomeIcon} onClick={onGoHome} active={activeMain === "home"} top />

        {/* 프로필 (상위 + 하위) */}
        <Item label="프로필" Icon={UserIcon} onClick={() => onGoProfile(null)} active={activeMain === "profile"} top />
        {!collapsed && (
          <div style={{ marginTop: 2, marginBottom: 8 }}>
            <Item label="내 정보"        indent={16} onClick={() => onGoProfile("info")}            active={activeMain === "profile" && activeSub === "info"} />
            <Item label="경력"          indent={16} onClick={() => onGoProfile("experience")}      active={activeMain === "profile" && activeSub === "experience"} />
            <Item label="수상이력"       indent={16} onClick={() => onGoProfile("awards")}          active={activeMain === "profile" && activeSub === "awards"} />
            <Item label="자격증"         indent={16} onClick={() => onGoProfile("certifications")}  active={activeMain === "profile" && activeSub === "certifications"} />
            <Item label="프로젝트"       indent={16} onClick={() => onGoProfile("projects")}        active={activeMain === "profile" && activeSub === "projects"} />
            <Item label="강점"          indent={16} onClick={() => onGoProfile("strengths")}        active={activeMain === "profile" && activeSub === "strengths"} />
            <Item label="평판"          indent={16} onClick={() => onGoProfile("reputations")}     active={activeMain === "profile" && activeSub === "reputations"} />
          </div>
        )}

        {/* 보관함 */}
        <Item label="보관함" Icon={DrawerIcon} onClick={() => onGoArchive()} active={activeMain === "archive"} top />
      </div>

      {/* 하단 유저 정보 & 다국어 버튼 & 로그아웃 */}
      <div style={{ borderTop: "1px solid #f3f4f6", padding: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #ef4444, #dc2626)",
              width: 32,
              height: 32,
              borderRadius: 8,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              flex: "0 0 auto",
              fontSize: 14
            }}
          >
            {(user?.name?.[0] || user?.nickname?.[0] || "U").toUpperCase()}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.name || user?.nickname || "-"}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email || "-"}
              </div>
            </div>
          )}
        </div>
        
        {/* 다국어 버튼 */}
        {onLanguageChange && (
          <button
            onClick={() => onLanguageChange(language === 'ko' ? 'en' : 'ko')}
            style={{
              width: "100%",
              padding: collapsed ? "8px 8px" : "10px 12px",
              borderRadius: 10,
              border: "2px solid #ef4444",
              background: "white",
              color: "#ef4444",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: collapsed ? 11 : 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#ef4444";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#ef4444";
            }}
            title={collapsed ? (language === 'ko' ? 'EN' : '한') : (language === 'ko' ? 'English' : '한국어')}
          >
            <span style={{ fontSize: collapsed ? 14 : 16 }}>🌐</span>
            {!collapsed && <span>{language === 'ko' ? 'EN' : '한'}</span>}
          </button>
        )}
        
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: collapsed ? "8px 8px" : "10px 12px",
            borderRadius: 10,
            border: "1px solid #fecaca",
            background: "linear-gradient(to right, #fee2e2, #fecaca)",
            color: "#b91c1c",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: collapsed ? 11 : 14,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
        >
          <LogoutIcon />
          {!collapsed && <span>로그아웃</span>}
        </button>
      </div>
    </aside>
  );
}



// -----------------------------
// 네비게이션
// -----------------------------
function Navigation({ user, onLogout, language, onLanguageChange }) {
  const t = TRANSLATIONS[language];
  return (
    <nav style={styles.nav}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              ...styles.gradientRed,
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: "24px", height: "24px", color: "white" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              background: "linear-gradient(to right, #ef4444, #dc2626)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t.login.title}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <a href="#" style={{ color: "#6b7280", textDecoration: "none", fontWeight: "500" }}>
            {t.nav.home}
          </a>
          <a href="#lookup" style={{ color: "#6b7280", textDecoration: "none", fontWeight: "500" }}>
            {t.nav.lookup}
          </a>
          <a href="#generate" style={{ color: "#6b7280", textDecoration: "none", fontWeight: "500" }}>
            {t.nav.generate}
          </a>
          
          {/* 다국어 버튼 */}
          {onLanguageChange && (
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
          )}

          {user && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  background: "linear-gradient(to right, #fee2e2, #fecaca)",
                  borderRadius: "8px",
                  border: "1px solid #fca5a5",
                }}
              >
                <div
                  style={{
                    ...styles.gradientRed,
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {user.name?.[0] || user.nickname?.[0] || "U"}
                </div>
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                  {user.name || user.nickname}
                </span>
              </div>
              <button
                onClick={onLogout}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#dc2626",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                }}
              >
                {t.nav.logout}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// -----------------------------
// 메인 App
// -----------------------------
export default function App() {
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 추천서 생성/조회용 상태
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [nickname, setNickname] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookup, setLookup] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedRecommendation, setEditedRecommendation] = useState("");
  const [currentRecommendationId, setCurrentRecommendationId] = useState(null);
  const [_isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [improvementNotes, setImprovementNotes] = useState("");
  const [refining, setRefining] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [sharingLink, setSharingLink] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [signatureData, setSignatureData] = useState(null);
  const [signatureType, setSignatureType] = useState(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ko';
  });
  
  const t = TRANSLATIONS[language];

  // 사이드바 접힘 상태
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ✅ 뷰 전환 상태 (홈 / 프로필)
  const [currentView, setCurrentView] = useState("home");
  const [profileSection, setProfileSection] = useState(null);
  const [pendingProfileTarget, setPendingProfileTarget] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // 보관함은 작성한 추천서만 표시

  // ----- 섹션 스크롤 헬퍼 -----
  function scrollToProfileSection(section) {
    const idMap = {
      info: "section-info",
      experience: "section-experience",
      awards: "section-awards",
      certifications: "section-certifications",
      projects: "section-projects",
      strengths: "section-strengths",
      reputations: "section-reputations",
    };
    const el = document.getElementById(idMap[section]);
    if (!el) return;
    const doScroll = () => {
      const top = el.getBoundingClientRect().top + window.scrollY - anchorOffset + SCROLL_FINE_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    };
    requestAnimationFrame(() => requestAnimationFrame(doScroll));
  }


  // 섹션 DOM이 렌더 완료될 때까지 대기 후 스크롤 (최대 ~12프레임)
  function scrollToProfileSectionWhenReady(section, retries = 12) {
    const idMap = {
      info: "section-info",
      experience: "section-experience",
      awards: "section-awards",
      certifications: "section-certifications",
      projects: "section-projects",
      strengths: "section-strengths",
      reputations: "section-reputations",
    };
    const el = document.getElementById(idMap[section]);
    if (el && el.getBoundingClientRect().height > 0) {
      programmaticScrollUntilSettled(() => {
        setTimeout(() => scrollToProfileSection(section), 0);
      });
      return;
    }
    if (retries > 0) {
      requestAnimationFrame(() => scrollToProfileSectionWhenReady(section, retries - 1));
    }
  }
    function scrollToArchiveSection() {
    const el = document.getElementById("archive-sent");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }



  // ----- 스크롤 포지션 기반 스파이 (더 안정적) -----
  const anchorOffset = 350; // 고정 헤더/상단 패딩 보정
  const SCROLL_FINE_OFFSET = 30; // 섹션 클릭 시 살짝 더 내려오게

  const isProgrammaticScroll = useRef(false);
  const scrollRaf = useRef(null);
  const profileLoadStartAt = useRef(0);

  function pickActiveByTop(sections, currentKey, setter) {
    let bestKey = currentKey;
    let bestTop = -Infinity;
    let any = false;
    sections.forEach(({ key, id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const topAdj = rect.top - anchorOffset;
      // 기준선(anchorOffset)을 지나간 섹션 중 "가장 아래(가장 큰 topAdj<=0)"를 활성으로
      if (topAdj <= 0 && topAdj > bestTop) {
        bestTop = topAdj;
        bestKey = key;
        any = true;
      }
    });
    // 아직 어떤 섹션도 기준선을 넘지 않았다면 첫번째 섹션을 활성으로
    if (!any && sections.length) bestKey = sections[0].key;
    if (bestKey !== currentKey) setter(bestKey);
  }

  useEffect(() => {
    const onScroll = () => {
      if (isProgrammaticScroll.current) return;
      if (profileLoading) return; // 로딩 중엔 하이라이트 갱신 금지
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
      scrollRaf.current = requestAnimationFrame(() => {
        if (currentView === "profile") {
          const profileSections = [
            { key: "info",          id: "section-info" },
            { key: "experience",    id: "section-experience" },
            { key: "awards",        id: "section-awards" },
            { key: "certifications",id: "section-certifications" },
            { key: "projects",      id: "section-projects" },
            { key: "strengths",     id: "section-strengths" },
            { key: "reputations",   id: "section-reputations" },
          ];
          pickActiveByTop(profileSections, profileSection, setProfileSection);
        } else if (currentView === "archive") {
          // 보관함은 작성한 추천서만 표시하므로 스크롤 스파이 불필요
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    };
  }, [currentView, profileSection]);

  // 클릭 이동 시 스파이 일시 비활성화 (플리커 방지)
  function programmaticScrollGuard(run) {
    isProgrammaticScroll.current = true
    try { run && run(); } finally {
      setTimeout(() => { isProgrammaticScroll.current = false; }, 600);
    }
  }

  // 스무스 스크롤이 "완전히 멈출 때"까지 스파이를 비활성화하여 하이라이트 깜빡임 방지
  function programmaticScrollUntilSettled(scrollRunner, maxMs = 1200) {
    isProgrammaticScroll.current = true;
    let done = false;
    let stableCount = 0;
    let lastY = window.scrollY;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scroll", onScroll, { passive: true });
      window.removeEventListener("scrollend", onScrollEnd, { passive: true });
      isProgrammaticScroll.current = false;
    };
    const onScroll = () => {
      const y = Math.round(window.scrollY);
      if (Math.abs(y - lastY) <= 1) {
        stableCount++;
        if (stableCount >= 3) finish(); // 3프레임 연속 정지로 판단
      } else {
        stableCount = 0;
      }
      lastY = y;
    };
    const onScrollEnd = () => finish();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd, { passive: true });
    try { scrollRunner && scrollRunner(); } finally {
      setTimeout(finish, maxMs); // 안전망
    }
  }


  const resetAllUiStates = () => {
    setForm({ ...INITIAL_FORM });
    setRecommendation("");
    setNickname("");
    setLookup(null);
    setLookupLoading(false);
    setSelectedUser(null);
    setEditedRecommendation("");
    setCurrentRecommendationId(null);
    setIsEditing(false);
    setUserDetails(null);
    setShowUserDetails(false);
    setImprovementNotes("");
    setRefining(false);
    setShowPreview(false);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  // 토큰 자동 로그인
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
      if (!response.ok) {
        console.error("양식 목록 로드 실패:", response.status, response.statusText);
        return;
      }
      const data = await response.json();
      console.log("양식 목록 로드 성공:", data);
      if (data && data.templates) {
        setTemplates(data.templates);
        console.log("양식 개수:", data.templates.length);
      } else {
        console.warn("양식 데이터 형식이 올바르지 않습니다:", data);
        setTemplates([]);
      }
    } catch (error) {
      console.error("양식 목록 로드 실패:", error);
      setTemplates([]);
    }
  };

  // 사용자 변경 시 UI 초기화
  useEffect(() => {
    if (user?.email) resetAllUiStates();
  }, [user?.email]);

  // 내 정보 조회
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
    } catch {
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
        }
      }
    } catch (e) {
      console.error("서명 불러오기 실패:", e);
    }
  };

  // 로그인 성공 콜백
  const handleLogin = (data) => {
    resetAllUiStates();
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("token", data.access_token);
    // 로그인 시 폼 초기화하고 작성자 이름 설정
    setForm({ ...INITIAL_FORM, recommender_name: data.user.nickname || data.user.name || "" });
    // 사용자 서명 불러오기
    fetchUserSignature(data.user.id, data.access_token);
  
    setCurrentView("home");
    setProfileSection(null);
};

  // 로그아웃
  const handleLogout = () => {
    resetAllUiStates();
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    setAuthMode("login");
  
    setCurrentView("home");
    setProfileSection(null);
};

  // ✅ 라우팅 콜백
  const goHome = () => {
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goProfile = (section = null) => {
    const target = section || "info";
    setPendingProfileTarget(target);
    if (currentView !== "profile") {
      setProfileSection(null);
      setCurrentView("profile");
      setProfileLoading(true);
      profileLoadStartAt.current = Date.now();
    } else {
      // 이미 프로필 화면인 경우: 로딩 표시 없이 바로 해당 섹션으로 이동
      setProfileSection(target);
      programmaticScrollUntilSettled(() => {
        setTimeout(() => scrollToProfileSection(target), 0);
      });
    }
  };
  const goArchive = () => {
    setCurrentView("archive");
    programmaticScrollGuard(() => {
      setTimeout(() => scrollToArchiveSection(), 0);
    });
  };
  // archiveTab 변경은 더 이상 필요 없음 (작성한 추천서만 표시)
  // ----- 스크롤 스파이 (프로필/보관함) -----
  // (replaced with scroll-position based spy below)

  
  // 뷰 전환시 최초 동기화
  useEffect(() => {
    if (isProgrammaticScroll.current || profileLoading || (currentView === "profile" && profileSection)) return;
    setTimeout(() => {
      if (currentView === "profile") {
        const profileSections = [
          { key: "info",          id: "section-info" },
          { key: "experience",    id: "section-experience" },
          { key: "awards",        id: "section-awards" },
          { key: "certifications",id: "section-certifications" },
          { key: "projects",      id: "section-projects" },
          { key: "strengths",     id: "section-strengths" },
          { key: "reputations",   id: "section-reputations" },
        ];
        pickActiveByTop(profileSections, profileSection, setProfileSection);
        } else if (currentView === "archive") {
          // 보관함은 작성한 추천서만 표시하므로 스크롤 스파이 불필요
        }
    }, 50);
  }, [currentView]);

  // ---- 조회/상세/추천서 생성 로직 ----
  const doLookup = async () => {
    setLookupLoading(true);
    setLookup(null);
    setSelectedUser(null);
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

  const fetchUserDetails = async (userId) => {
    setLoadingUserDetails(true);
    try {
      const res = await fetch(`http://localhost:8000/user-details/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setUserDetails(data);
      setShowUserDetails(true);
    } catch {
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
      alert("추천서 생성 실패: " + err.message);
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
      const response = await fetch(
        `http://localhost:8000/update-recommendation/${currentRecommendationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editedRecommendation }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "저장 실패");
      alert("추천서가 저장되었습니다.");
      setRecommendation(editedRecommendation);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRefineRecommendation = async () => {
    if (!editedRecommendation.trim()) {
      alert("추천서 내용이 없습니다.");
      return;
    }
    
    const notes = improvementNotes.trim() || 
      "사용자가 수정한 내용을 바탕으로 문법, 표현, 흐름을 자연스럽게 다듬어주세요. 사용자가 수정한 내용은 최대한 보존하면서 전체적인 완성도를 높여주세요.";
    
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
      alert("추천서가 최종 완성되었습니다!");
    } catch (err) {
      alert(err.message);
    } finally {
      setRefining(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!currentRecommendationId) {
      alert("다운로드할 추천서가 없습니다.");
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
      
      alert("PDF가 다운로드되었습니다.");
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleShareRecommendation = async () => {
    if (!currentRecommendationId) {
      alert("공유할 추천서가 없습니다.");
      return;
    }
    
    setSharingLink(true);
    try {
      const response = await fetch(`http://localhost:8000/share-recommendation/${currentRecommendationId}`, {
        method: "GET"
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "공유 링크 생성 실패");
      
      navigator.clipboard.writeText(data.share_url);
      alert("공유 링크가 클립보드에 복사되었습니다!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSharingLink(false);
    }
  };

  // 추천서 내용을 파싱하여 정렬된 JSX로 변환
  const formatRecommendation = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    let result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (i === 0 && line === '추천서') {
        result.push(<div key={i} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1rem' }}>{line}</div>);
        continue;
      }
      
      if (!line) {
        result.push(<div key={i} style={{ height: '0.5rem' }}></div>);
        continue;
      }
      
      if (/^\d{4}년\s+\d{1,2}월\s+\d{1,2}일$/.test(line)) {
        result.push(<div key={i} style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '0.5rem' }}>{line}</div>);
        continue;
      }
      
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
      
      if (line.startsWith('작성자:') || line.startsWith('소속/직위:') || 
          line.startsWith('연락처:')) {
        result.push(<div key={i} style={{ textAlign: 'center' }}>{line}</div>);
        continue;
      }
      
      if (line.length > 0) {
        result.push(<div key={i} style={{ textAlign: 'left', marginBottom: '0.5rem' }}>{line}</div>);
      }
    }
    
    return result;
  };

  const canGenerate =
    (form.recommender_name.trim() || user?.nickname || user?.name) &&
    form.requester_name.trim() &&
    form.requester_email.trim() &&
    form.relationship.trim() &&
    form.strengths.trim() &&
    form.tone.trim() &&
    form.selected_score.trim();

  // -----------------------------
  // 인증 전/후 렌더링 분기
  // -----------------------------
  if (!token || !user) {
    return authMode === "login" ? (
      <LoginForm
        onLogin={handleLogin}
        onToggleMode={() => setAuthMode("signup")}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
    ) : (
      <div style={{ ...styles.pageContainer, paddingTop: "32px" }}>
        <div style={{ textAlign: "center", paddingTop: "16px" }}>
          <button
            onClick={() => setAuthMode("login")}
            style={{
              background: "none",
              border: "none",
              color: "#ec4899",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "600",
              textDecoration: "underline",
            }}
            title="로그인으로 돌아가기"
          >
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
        <SignUp />
      </div>
    );
  }

  // -----------------------------
  // 로그인 이후 메인 화면
  // -----------------------------
  return (
    <div style={styles.pageContainer}>
      <div style={{ display: "flex" }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          user={user}
          onLogout={handleLogout}
          onGoHome={goHome}
          onGoProfile={goProfile}
          onGoArchive={goArchive}
          activeMain={currentView}
          activeSub={currentView === "profile" ? profileSection : null}
          language={language}
          onLanguageChange={handleLanguageChange}
        />

        <div
          style={{
            paddingTop: "100px",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "100px 1rem 2rem",
            width: "100%"
          }}
        >
          {currentView === "profile" ? (
            <Profile user={user} token={token} initialSection={pendingProfileTarget} loading={profileLoading}
              onLoaded={(ok) => {
                const finish = () => {
                  setProfileLoading(false);
                  if (ok && pendingProfileTarget) {
                    const target = pendingProfileTarget;
                    setProfileSection(target);
                    scrollToProfileSectionWhenReady(target);
                  }
                  setPendingProfileTarget(null);
                };
                const MIN_MS = 1000;
                const elapsed = Date.now() - (profileLoadStartAt.current || 0);
                if (profileLoading && elapsed < MIN_MS) {
                  setTimeout(finish, MIN_MS - elapsed);
                } else {
                  finish();
                }
              }}
            />
          ) : currentView === "archive" ? (
            <Box user={user} token={token} onBackHome={goHome} />
          ) : (
            <>
              {/* 헤더 */}
              <div style={{ textAlign: "center", marginBottom: "3rem" }} className="animate-fade-in">
                <h1
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    background: "linear-gradient(to right, #ef4444, #dc2626, #f43f5e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {t.main.title}
                </h1>
                <p
                  style={{
                    fontSize: "1.25rem",
                    color: "#6b7280",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  {t.main.subtitle}
                </p>
              </div>

              {/* 조회 섹션 */}
              <div id="lookup" style={{ maxWidth: "900px", margin: "0 auto 2rem" }}>
                <div style={styles.card}>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
                    {t.lookup.title}
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1rem" }}>
                    {t.lookup.subtitle}
                  </p>

                  <div style={{ display: "flex", gap: "12px", marginBottom: "1rem" }}>
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
                        width: "auto",
                        padding: "12px 32px",
                        color: "white",
                        opacity: lookupLoading || !nickname.trim() ? 0.5 : 1,
                      }}
                    >
                      {lookupLoading ? t.lookup.searching : t.lookup.search}
                    </button>
                  </div>

                  {lookup && lookup.exists === false && (
                    <div
                      style={{
                        padding: "1rem",
                        borderRadius: "12px",
                        background: "#fef2f2",
                        border: "2px solid #fecaca",
                        color: "#dc2626",
                      }}
                    >
                      {lookup.message || "DB에 없는 데이터입니다."}
                    </div>
                  )}

                  {lookup && lookup.exists && lookup.users?.length > 0 && (
                    <div style={{ marginTop: "1.5rem" }}>
                      <div
                        style={{
                          padding: "1.5rem",
                          borderRadius: "12px",
                          background: "linear-gradient(to right, #fee2e2, #fecaca)",
                          border: "2px solid #fca5a5",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "bold",
                            marginBottom: "1rem",
                            color: "#991b1b",
                          }}
                        >
                          검색 결과 ({lookup.users.length}명)
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {lookup.users.map((c) => (
                            <label
                              key={c.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "1rem",
                                borderRadius: "12px",
                                cursor: "pointer",
                                background: selectedUser?.id === c.id ? "#fee2e2" : "white",
                                border:
                                  selectedUser?.id === c.id
                                    ? "2px solid #ef4444"
                                    : "2px solid #e5e7eb",
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
                                style={{ width: "16px", height: "16px" }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "600", color: "#1f2937" }}>
                                  {c.name} / {c.nickname}
                                </div>
                                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>{c.email}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedUser && selectedUser.workspaces?.length > 0 && (
                    <div
                      style={{
                        marginTop: "1.5rem",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        background: "#f3f4f6",
                        border: "2px solid #e5e7eb",
                      }}
                    >
                      <h3 style={{ 
                        fontSize: "1.125rem", 
                        fontWeight: "bold", 
                        marginBottom: "1rem",
                        color: "#374151"
                      }}>
                        🏢 소속 회사
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {selectedUser.workspaces.map((w, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "12px 16px",
                              background: "white",
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                background: "#e5e7eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#6b7280",
                                fontWeight: "700",
                                fontSize: "16px",
                                flexShrink: 0,
                              }}
                            >
                              🏢
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: "600", color: "#1f2937", fontSize: "0.95rem" }}>
                                {w.name || "-"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedUser && (
                    <div style={{ marginTop: "1.5rem" }}>
                      <button
                        onClick={() => fetchUserDetails(selectedUser.id)}
                        disabled={loadingUserDetails}
                        style={{
                          width: "100%",
                          ...styles.button,
                          ...styles.gradientRed,
                          color: "white",
                          opacity: loadingUserDetails ? 0.7 : 1,
                        }}
                      >
                        {loadingUserDetails ? "로딩 중..." : "📋 상세 정보 보기"}
                      </button>
                    </div>
                  )}

                  {showUserDetails && userDetails && (
                    <div
                      style={{
                        marginTop: "1.5rem",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        background: "white",
                        border: "2px solid #e5e7eb",
                      }}
                    >
                      <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "2px solid #e5e7eb",
                  }}
                >
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>사용자 상세 정보</h3>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    style={{
                      padding: "8px 16px",
                      fontSize: "0.875rem",
                      background: "white",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    닫기
                  </button>
                </div>

                {/* 경력 */}
                {userDetails.experiences?.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        marginBottom: "0.75rem",
                        color: "#ef4444",
                      }}
                    >
                      💼 경력
                    </h4>
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
                      >
                        <thead>
                          <tr style={{ background: "#f3f4f6" }}>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              회사명
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              직책
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              기간
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              업무 내용
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetails.experiences.map((exp, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                              <td style={{ padding: "10px" }}>{exp.company}</td>
                              <td style={{ padding: "10px" }}>{exp.position}</td>
                              <td style={{ padding: "10px", whiteSpace: "nowrap" }}>
                                {exp.startDate} ~ {exp.endDate}
                              </td>
                              <td style={{ padding: "10px" }}>{exp.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 수상 이력 */}
                {userDetails.awards?.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        marginBottom: "0.75rem",
                        color: "#ef4444",
                      }}
                    >
                      🏆 수상 이력
                    </h4>
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
                      >
                        <thead>
                          <tr style={{ background: "#f3f4f6" }}>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              수상명
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              수여 기관
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              수상일
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              설명
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetails.awards.map((award, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                              <td style={{ padding: "10px" }}>{award.title}</td>
                              <td style={{ padding: "10px" }}>{award.organization || "-"}</td>
                              <td style={{ padding: "10px", whiteSpace: "nowrap" }}>
                                {award.awardDate || "-"}
                              </td>
                              <td style={{ padding: "10px" }}>{award.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 자격증 */}
                {userDetails.certifications?.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        marginBottom: "0.75rem",
                        color: "#ef4444",
                      }}
                    >
                      📜 자격증
                    </h4>
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
                      >
                        <thead>
                          <tr style={{ background: "#f3f4f6" }}>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              자격증명
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              발급 기관
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              발급일
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              만료일
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              번호
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetails.certifications.map((cert, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                              <td style={{ padding: "10px" }}>{cert.name}</td>
                              <td style={{ padding: "10px" }}>{cert.issuer || "-"}</td>
                              <td style={{ padding: "10px", whiteSpace: "nowrap" }}>
                                {cert.issueDate || "-"}
                              </td>
                              <td style={{ padding: "10px", whiteSpace: "nowrap" }}>
                                {cert.expiryDate || "-"}
                              </td>
                              <td style={{ padding: "10px" }}>{cert.certificationNumber || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 프로젝트 */}
                {userDetails.projects?.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        marginBottom: "0.75rem",
                        color: "#ef4444",
                      }}
                    >
                      🚀 프로젝트
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {userDetails.projects.map((proj, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "1rem",
                            background: "#f9fafb",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <h5 style={{ fontWeight: "600", fontSize: "0.95rem" }}>{proj.title}</h5>
                            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                              {proj.startDate} ~ {proj.endDate}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                            <strong>역할:</strong> {proj.role || "-"}
                          </div>
                          {proj.description && (
                            <p
                              style={{
                                fontSize: "0.875rem",
                                color: "#4b5563",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {proj.description}
                            </p>
                          )}
                          {proj.technologies && (
                            <div style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                              <strong>기술:</strong>{" "}
                              <span style={{ color: "#6b7280" }}>{proj.technologies}</span>
                            </div>
                          )}
                          {proj.achievement && (
                            <div
                              style={{
                                fontSize: "0.875rem",
                                marginBottom: "0.5rem",
                                padding: "8px",
                                background: "#fee2e2",
                                borderRadius: "6px",
                              }}
                            >
                              <strong style={{ color: "#991b1b" }}>성과:</strong>{" "}
                              <span style={{ color: "#991b1b" }}>{proj.achievement}</span>
                            </div>
                          )}
                          {proj.url && (
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: "0.75rem",
                                color: "#ef4444",
                                textDecoration: "underline",
                              }}
                            >
                              프로젝트 링크 →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 강점 */}
                {userDetails.strengths?.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        marginBottom: "0.75rem",
                        color: "#ef4444",
                      }}
                    >
                      ⭐ 강점
                    </h4>
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
                      >
                        <thead>
                          <tr style={{ background: "#f3f4f6" }}>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              카테고리
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              강점
                            </th>
                            <th style={{ padding: "10px", textAlign: "left", fontWeight: "600" }}>
                              설명
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetails.strengths.map((strength, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                              <td style={{ padding: "10px" }}>
                                <span
                                  style={{
                                    padding: "4px 12px",
                                    borderRadius: "12px",
                                    background: "#fee2e2",
                                    color: "#991b1b",
                                    fontSize: "0.75rem",
                                    fontWeight: "600",
                                  }}
                                >
                                  {strength.category || "일반"}
                                </span>
                              </td>
                              <td style={{ padding: "10px", fontWeight: "600" }}>
                                {strength.strength}
                              </td>
                              <td style={{ padding: "10px" }}>
                                {strength.description || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 평판 */}
                {userDetails.reputations?.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        marginBottom: "0.75rem",
                        color: "#ef4444",
                      }}
                    >
                      💬 평판
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {userDetails.reputations.map((rep, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "1rem",
                            background: "#f9fafb",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <span style={{ fontWeight: "600", fontSize: "0.875rem" }}>
                                {rep.fromName}
                              </span>
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: "8px",
                                  background: "#fee2e2",
                                  color: "#991b1b",
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                }}
                              >
                                {rep.category || "일반"}
                              </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              {[...Array(rep.rating)].map((_, idx) => (
                                <span key={idx} style={{ color: "#ef4444" }}>
                                  ★
                                </span>
                              ))}
                              {[...Array(5 - rep.rating)].map((_, idx) => (
                                <span key={idx} style={{ color: "#d1d5db" }}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "#4b5563",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {rep.comment}
                          </p>
                          <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                            {rep.createdAt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 데이터 없음 */}
                {!userDetails?.experiences?.length &&
                  !userDetails?.awards?.length &&
                  !userDetails?.certifications?.length &&
                  !userDetails?.projects?.length &&
                  !userDetails?.strengths?.length &&
                  !userDetails?.reputations?.length && (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                      {t.lookup.noDetails}
                    </div>
                  )}
              </div>
            )}
                </div>
              </div>

              {/* 추천서 작성 섹션 */}
              <div id="generate" style={{ maxWidth: "900px", margin: "0 auto" }}>
                <div style={styles.card}>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
                    {t.form.title}
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>
                    {t.form.subtitle}
                  </p>

                  <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                  {t.form.recommenderName} * ({language === 'ko' ? '로그인한 사용자' : 'Logged in user'})
                </label>
                <input
                  style={{...styles.input, backgroundColor: "#f3f4f6", cursor: "not-allowed"}}
                  placeholder={t.form.recommenderName}
                  value={form.recommender_name || user?.nickname || user?.name || ""}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                  {t.form.requesterName} *
                </label>
                <input
                  style={styles.input}
                  placeholder={t.form.requesterName}
                  value={form.requester_name}
                  onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                {t.form.requesterEmail} *
              </label>
              <input
                type="email"
                style={styles.input}
                placeholder="requester@email.com"
                value={form.requester_email}
                onChange={(e) => setForm({ ...form, requester_email: e.target.value })}
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                {t.form.majorField}
              </label>
              <input
                style={styles.input}
                placeholder={t.form.majorFieldPlaceholder}
                value={form.major_field}
                onChange={(e) => setForm({ ...form, major_field: e.target.value })}
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                {t.form.relationship} *
              </label>
              <textarea
                rows="3"
                style={{ ...styles.input, resize: "vertical" }}
                placeholder={t.form.relationshipPlaceholder}
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                {t.form.strengths} *
              </label>
              <textarea
                rows="3"
                style={{ ...styles.input, resize: "vertical" }}
                placeholder={t.form.strengthsPlaceholder}
                value={form.strengths}
                onChange={(e) => setForm({ ...form, strengths: e.target.value })}
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                {t.form.memorable} ({language === 'ko' ? '선택' : 'Optional'})
              </label>
              <textarea
                rows="3"
                style={{ ...styles.input, resize: "vertical" }}
                placeholder={t.form.memorablePlaceholder}
                value={form.memorable}
                onChange={(e) => setForm({ ...form, memorable: e.target.value })}
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                {t.form.additionalInfo}
              </label>
              <textarea
                rows="3"
                style={{ ...styles.input, resize: "vertical" }}
                placeholder={t.form.additionalInfoPlaceholder}
                value={form.additional_info}
                onChange={(e) => setForm({ ...form, additional_info: e.target.value })}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                marginTop: "1.5rem",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                  {t.form.tone} *
                </label>
                <select
                  style={{ ...styles.input, cursor: "pointer" }}
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value })}
                >
                  {Object.entries(t.tones).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                  {t.form.score} *
                </label>
                <select
                  style={{ ...styles.input, cursor: "pointer" }}
                  value={form.selected_score}
                  onChange={(e) => setForm({ ...form, selected_score: e.target.value })}
                >
                  {["1", "2", "3", "4", "5"].map((s) => (
                    <option key={s} value={s}>
                      {s}{language === 'ko' ? '점' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                  {t.form.wordCount}
                </label>
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
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>
                  {t.form.template}
                </label>
                <select
                  style={{ ...styles.input, cursor: "pointer" }}
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
              <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "12px", background: "linear-gradient(to right, #fef3c7, #fde68a)", border: "2px solid #fbbf24" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form.include_user_details}
                    onChange={(e) => setForm({ ...form, include_user_details: e.target.checked })}
                    style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#ef4444" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#92400e", marginBottom: "4px" }}>
                      📋 {t.form.includeDetails}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#78350f" }}>
                      {t.form.includeDetailsDesc}
                    </div>
                  </div>
                </label>
              </div>
            )}

            {/* 서명 패드 */}
            <div style={{ marginTop: "1.5rem", padding: "1.5rem", borderRadius: "12px", background: "#f9fafb", border: "2px dashed #d1d5db" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "#374151" }}>
                  ✍️ 서명 {signatureData ? "✅" : "(선택사항)"}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowSignaturePad(!showSignaturePad)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#ef4444",
                    background: "white",
                    border: "1px solid #fca5a5",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  {showSignaturePad ? "숨기기" : (signatureData ? "서명 변경" : "서명 추가")}
                </button>
              </div>
              
              {showSignaturePad && (
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "1rem" }}>
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
                      width: "100%",
                      maxWidth: "500px",
                      border: "2px solid #d1d5db",
                      borderRadius: "8px",
                      background: "white",
                      cursor: "crosshair",
                      touchAction: "none"
                    }}
                  />
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
                        padding: "10px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "white",
                        background: "#f44336",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
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
                        padding: "10px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "white",
                        background: "linear-gradient(to right, #667eea, #764ba2)",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      💾 저장
                    </button>
                  </div>
                </div>
              )}
              
              {signatureData && !showSignaturePad && (
                <div style={{ textAlign: "center", padding: "1rem", background: "white", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.875rem", color: "#059669", fontWeight: "600", marginBottom: "0.5rem" }}>
                    ✅ 서명이 등록되었습니다
                  </p>
                  <img 
                    src={signatureData} 
                    alt="Signature" 
                    style={{ maxWidth: "300px", border: "1px solid #d1d5db", borderRadius: "4px", background: "white" }} 
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !canGenerate}
              style={{
                ...styles.button,
                ...styles.gradientRed,
                color: "white",
                fontSize: "1.125rem",
                padding: "16px 32px",
                marginTop: "2rem",
                opacity: loading || !canGenerate ? 0.5 : 1,
                cursor: loading || !canGenerate ? "not-allowed" : "pointer",
              }}
            >
              {loading ? t.form.generating : t.form.generateButton}
            </button>

            {recommendation && (
              <div
                style={{
                  marginTop: "2rem",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  background: "linear-gradient(to bottom right, #fee2e2, #fecaca)",
                  border: "2px solid #fca5a5",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#991b1b" }}>
                    {t.form.generatedTitle} ({form.selected_score}{language === 'ko' ? '점' : ''} · {t.tones[form.tone]})
                  </h3>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      style={{ 
                        padding: "8px 16px", 
                        fontSize: "0.875rem", 
                        fontWeight: "600", 
                        color: showPreview ? "white" : "#ef4444", 
                        background: showPreview ? "linear-gradient(to right, #ef4444, #dc2626)" : "white", 
                        border: "2px solid #fca5a5", 
                        borderRadius: "8px", 
                        cursor: "pointer" 
                      }}
                    >
                      {showPreview ? t.form.edit : t.form.preview}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(editedRecommendation.replace(/<[^>]*>/g, ''));
                        alert("추천서가 클립보드에 복사되었습니다.");
                      }}
                      style={{
                        padding: "8px 16px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#ef4444",
                        background: "white",
                        border: "2px solid #fca5a5",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      {t.form.copy}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={downloadingPdf}
                      style={{
                        padding: "8px 16px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#10b981",
                        background: "white",
                        border: "2px solid #10b981",
                        borderRadius: "8px",
                        cursor: downloadingPdf ? "not-allowed" : "pointer",
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
                        padding: "8px 16px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#3b82f6",
                        background: "white",
                        border: "2px solid #3b82f6",
                        borderRadius: "8px",
                        cursor: sharingLink ? "not-allowed" : "pointer",
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
                        padding: "8px 16px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "white",
                        ...styles.gradientRed,
                        border: "none",
                        borderRadius: "8px",
                        cursor: saveLoading ? "not-allowed" : "pointer",
                        opacity: saveLoading ? 0.7 : 1,
                      }}
                    >
                      {saveLoading ? t.form.saving : t.form.save}
                    </button>
                  </div>
                </div>

                {/* 미리보기 모드 */}
                {showPreview ? (
                  <div style={{
                    background: "white",
                    padding: "3rem 2.5rem",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    minHeight: "400px",
                    fontFamily: "serif",
                  }}>
                    <div style={{
                      lineHeight: "2",
                      color: "#1f2937",
                      fontSize: "15px",
                      letterSpacing: "0.3px"
                    }}>
                      {formatRecommendation(editedRecommendation.replace(/<[^>]*>/g, ''))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280", fontStyle: "italic", marginBottom: "0.5rem" }}>
                      {t.form.editNote}
                    </p>
                    <textarea
                      value={editedRecommendation.replace(/<[^>]*>/g, '')}
                      onChange={(e) => setEditedRecommendation(e.target.value)}
                      style={{
                        width: "100%",
                        minHeight: "400px",
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.7",
                        color: "#1f2937",
                        background: "white",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontFamily: "inherit",
                        fontSize: "14px",
                        resize: "vertical",
                        textAlign: "left"
                      }}
                    />
                    
                    {/* 편집 모드에서도 서명 미리보기 */}
                    {signatureData && (
                      <div style={{ marginTop: "1rem", padding: "1rem", background: "#f9fafb", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                          📝 {t.form.signaturePreview}
                        </p>
                        <img 
                          src={signatureData} 
                          alt="서명" 
                          style={{ 
                            maxWidth: "150px", 
                            height: "auto",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            background: "white",
                            padding: "0.5rem"
                          }} 
                        />
                        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#6b7280" }}>
                          {form.recommender_name || user?.nickname || user?.name}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* AI 개선사항 입력란 */}
                <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "12px", background: "linear-gradient(to right, #dbeafe, #bfdbfe)", border: "2px solid #60a5fa" }}>
                  <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e40af", marginBottom: "8px" }}>
                    💡 {t.form.improvementNotes}
                  </label>
                  <textarea
                    value={improvementNotes}
                    onChange={(e) => setImprovementNotes(e.target.value)}
                    placeholder={t.form.improvementNotesPlaceholder}
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #93c5fd",
                      fontSize: "14px",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRefineRecommendation}
                    disabled={refining}
                    style={{
                      marginTop: "12px",
                      width: "100%",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "16px",
                      border: "none",
                      cursor: refining ? "not-allowed" : "pointer",
                      background: "linear-gradient(to right, #3b82f6, #2563eb)",
                      color: "white",
                      opacity: refining ? 0.5 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    {refining ? t.form.finalizing : t.form.finalizeButton}
                  </button>
                </div>
              </div>
            )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
