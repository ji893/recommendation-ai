// App.jsx
import { useState, useEffect } from "react";

// 로그인 컴포넌트
function LoginForm({ onLogin, onToggleMode }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

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
      if (!response.ok) {
        throw new Error(data.detail || "로그인 실패");
      }
      onLogin(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={onToggleMode}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            회원가입하기
          </button>
        </div>
      </div>
    </div>
  );
}

// 회원가입 컴포넌트
function RegisterForm({ onRegister, onToggleMode }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    nickname: "",
  });
  const [loading, setLoading] = useState(false);

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
      if (!response.ok) {
        throw new Error(data.detail || "회원가입 실패");
      }
      onRegister(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
            <div>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이름"
              />
            </div>
            <div>
              <input
                type="text"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="닉네임 (선택)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={onToggleMode}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}

// 네비게이션 컴포넌트
function Navigation({ user, onLogout }) {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">AI 추천서</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">홈</a>
            <a href="#lookup" className="text-gray-600 hover:text-blue-600">조회</a>
            <a href="#generate" className="text-gray-600 hover:text-blue-600">생성</a>
            {user && (
              <>
                <span className="text-sm text-gray-700">
                  {user.name} ({user.email})
                </span>
                <button
                  onClick={onLogout}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  // ===== 모든 상태를 최상단에 선언 =====
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [form, setForm] = useState({
    recommender_name: "",
    requester_name: "",
    requester_email: "",
    reason: "",
    strengths: "",
    highlight: "",
    tone: "Formal",
    selected_score: "1", // 기본 1점 선택
    workspace_id: "", // 워크스페이스 ID
  });

  // 로그인한 사용자 정보로 추천자 정보 자동 설정
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        recommender_name: user.nickname || "",
      }));
    }
  }, [user]);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(""); // 선택 점수 1개만 저장
  const [selectedUser, setSelectedUser] = useState(null);
  const [userWorkspaces, setUserWorkspaces] = useState([]);
  const [nickname, setNickname] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookup, setLookup] = useState(null);
  const [showAllReferences, setShowAllReferences] = useState(false);
  const [allReferences, setAllReferences] = useState([]);
  const [loadingReferences, setLoadingReferences] = useState(false);

  // 토큰이 있으면 사용자 정보 로드
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      // 토큰 유효성 검사
      try {
        const tokenData = JSON.parse(atob(savedToken.split('.')[1]));
        const expiration = tokenData.exp * 1000; // JWT exp는 초 단위
        
        if (expiration > Date.now()) {
          setToken(savedToken);
          fetchUserData(savedToken);
        } else {
          // 토큰이 만료되었으면 로그아웃
          handleLogout();
        }
      } catch (error) {
        // 토큰 파싱 실패 시 로그아웃
        handleLogout();
      }
    }
  }, []);

  // 사용자 정보 가져오기
  const fetchUserData = async (currentToken) => {
    try {
      const response = await fetch("http://localhost:8000/me", {
        headers: {
          "Authorization": `Bearer ${currentToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  };

  // 로그인 처리
  const handleLogin = (data) => {
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("token", data.access_token);
  };

  // 회원가입 처리
  const handleRegister = (data) => {
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("token", data.access_token);
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setRecommendation("");
    try {
      const response = await fetch("http://localhost:8000/generate-recommendation", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "추천서 생성 실패");
      }
      
      const data = await response.json();
      setRecommendation(data.recommendation); // 선택 점수 추천서
    } catch (error) {
      alert(error.message || "서버 연결 오류");
    }
    setLoading(false);
  };

  // 인증이 필요한 경우 로그인/회원가입 화면 표시
  if (!user) {
    return authMode === "login" ? (
      <LoginForm
        onLogin={handleLogin}
        onToggleMode={() => setAuthMode("register")}
      />
    ) : (
      <RegisterForm
        onRegister={handleRegister}
        onToggleMode={() => setAuthMode("login")}
      />
    );
  }
      const doLookup = async () => {
    setLookupLoading(true);
    setLookup(null);
    setSelectedUser(null);
    setUserWorkspaces([]);
    setShowAllReferences(false);
    setAllReferences([]);
    try {
      const res = await fetch("http://localhost:8000/lookup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ search: nickname }),
      });
      const data = await res.json();
      setLookup(data);
      
      if (data.exists && data.users && data.users.length > 0) {
        // 첫 번째 사용자를 기본 선택
        const firstUser = data.users[0];
        setSelectedUser(firstUser);
        setUserWorkspaces(firstUser.workspaces || []);
        
        // 사용자 정보를 폼에 자동 입력
        setForm(prev => ({
          ...prev,
          requester_name: firstUser.nickname || "",
          requester_email: firstUser.email || "",
        }));
      }
    } catch {
      setLookup({ exists: false, message: "서버 연결 오류" });
    } finally {
      setLookupLoading(false);
    }
  };

  // 전체 추천서 기록 가져오기
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Navigation user={user} onLogout={handleLogout} />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">AI 추천서 생성기</span>
            <span className="block text-blue-600 text-2xl sm:text-3xl mt-3">
              전문적인 추천서를 손쉽게 작성하세요
            </span>
          </h1>
        </div>

        {/* ===== 조회 박스 ===== */}
        <div id="lookup" className="grid gap-3 w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mb-8 transition-all hover:shadow-xl">
          <h2 className="text-xl font-semibold">요청자 데이터 조회</h2>
          <div className="flex gap-2">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="요청자 닉네임"
              className="border p-2 rounded w-full"
            />
            <button
              onClick={doLookup}
              disabled={lookupLoading || !nickname.trim()}
              className="bg-emerald-500 text-white px-4 rounded hover:bg-emerald-600"
            >
              {lookupLoading ? "조회 중..." : "확인"}
            </button>
          </div>

          {lookup && lookup.exists === false && (
            <div className="p-3 rounded bg-red-50 text-red-600">
              {lookup.message || "DB에 없는 데이터입니다."}
            </div>
          )}

          {lookup && lookup.exists && lookup.users && lookup.users.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">사용자 선택</h3>
              <div className="grid gap-2">
                {lookup.users.map((user, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedUser(user);
                      setForm(prev => ({
                        ...prev,
                        requester_name: user.nickname,
                        requester_email: user.email
                      }));
                    }}
                    className={`p-3 rounded-lg border ${
                      selectedUser?.email === user.email 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{user.nickname}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                      {selectedUser?.email === user.email && (
                        <div className="text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedUser && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="block text-sm text-gray-500">닉네임</strong>
                  <span>{selectedUser.nickname || "-"}</span>
                </div>
                <div>
                  <strong className="block text-sm text-gray-500">이메일</strong>
                  <span>{selectedUser.email || "-"}</span>
                </div>
              </div>

              {selectedUser.workspaces?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">워크스페이스 / 직책</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 text-sm font-medium text-gray-900">워크스페이스</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-900">역할</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-900">선택</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedUser.workspaces.map((w, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="p-3">{w.name || "-"}</td>
                            <td className="p-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${w.role === "슈퍼리더" ? "bg-purple-100 text-purple-800" :
                                  w.role === "리더" ? "bg-blue-100 text-blue-800" :
                                  w.role === "지원자" ? "bg-yellow-100 text-yellow-800" :
                                  w.role === "대기" ? "bg-gray-100 text-gray-800" :
                                  "bg-green-100 text-green-800"}`}>
                                {w.role || "멤버"}
                              </span>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => setForm(prev => ({ ...prev, workspace_id: w.id }))}
                                className={`px-3 py-1 rounded text-sm
                                  ${form.workspace_id === w.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                              >
                                {form.workspace_id === w.id ? "선택됨" : "선택"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 최근 추천서 */}
              {selectedUser.recent_references?.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">최근 추천서</h3>
                    {selectedUser.reference_info?.has_more && (
                      <button
                        onClick={() => fetchAllReferences(selectedUser.id)}
                        disabled={loadingReferences}
                        className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
                      >
                        {loadingReferences ? "로딩 중..." : `더 보기 (${selectedUser.reference_info.total_count - selectedUser.reference_info.showing_count}개 더)`}
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {(showAllReferences ? allReferences : selectedUser.recent_references).map((ref, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-sm text-gray-500">From: {ref.from_name}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-sm text-gray-500">To: {ref.to_name}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(ref.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{ref.content}</p>
                      </div>
                    ))}
                  </div>
                  {showAllReferences && (
                    <div className="mt-3 text-center">
                      <button
                        onClick={() => setShowAllReferences(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        접기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ===== 추천서 입력 폼 ===== */}
      <div id="generate" className="grid gap-6 w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900">추천서 작성</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">추천자 이름</label>
            <input
              name="recommender_name"
              placeholder="추천자 이름을 입력하세요"
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">추천서 받을 사람</label>
            <input
              name="requester_name"
              placeholder="추천서 받을 사람의 이름"
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input
            name="requester_email"
            type="email"
            placeholder="요청자의 이메일 주소"
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">추천 이유 / 관계</label>
          <textarea
            name="reason"
            placeholder="추천하게 된 이유나 관계를 설명해주세요"
            onChange={handleChange}
            rows="3"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">주요 역량 / 성과</label>
          <textarea
            name="strengths"
            placeholder="주요 역량이나 성과를 자세히 설명해주세요"
            onChange={handleChange}
            rows="3"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">특별히 강조할 점</label>
          <textarea
            name="highlight"
            placeholder="특별히 강조하고 싶은 점을 작성해주세요"
            onChange={handleChange}
            rows="3"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">작성 톤</label>
            <select
              name="tone"
              value={form.tone}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
            >
              <option value="Formal">공식적</option>
              <option value="Friendly">친근/부드럽게</option>
              <option value="Concise">간결/직관적</option>
              <option value="Persuasive">설득/강조</option>
              <option value="Neutral">중립적</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">추천 점수</label>
            <select
              name="selected_score"
              value={form.selected_score}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3"
            >
              <option value="1">1점</option>
              <option value="2">2점</option>
              <option value="3">3점</option>
              <option value="4">4점</option>
              <option value="5">5점</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {loading ? "추천서 생성 중..." : "추천서 생성하기"}
        </button>
      </div>

      {/* ===== 추천서 출력 ===== */}
      {recommendation && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-8 mb-12 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              생성된 추천서 <span className="text-blue-600">({form.selected_score}점)</span>
            </h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(recommendation);
                alert('추천서가 클립보드에 복사되었습니다.');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              복사하기
            </button>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
