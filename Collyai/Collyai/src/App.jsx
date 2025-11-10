import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import HistoryPage from "./HistoryPage";

function MainApp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    recommender_email: "", // 추천자 이메일 (한 번 설정하면 고정)
    requester_name: "",
    requester_email: "",
    reason: "",
    strengths: "",
    highlight: "",
    tone: "공식적",
  });
  
  const [isRecommenderEmailSet, setIsRecommenderEmailSet] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [history, setHistory] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // 컴포넌트 마운트 시 히스토리 로드
  useEffect(() => {
    loadHistoryFromServer();
  }, []);

  const loadHistoryFromServer = async (email = null) => {
    try {
      const url = email ? `http://localhost:8000/history?email=${encodeURIComponent(email)}` : "http://localhost:8000/history";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error("히스토리 로드 오류:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 로그인 관련 함수들
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoggedIn(true);
        
        // 로그인 성공 시 추천자 이메일을 사용자 닉네임으로 자동 설정
        setForm({ ...form, recommender_email: data.user.nickname });
        setIsRecommenderEmailSet(true);
        
        alert(`로그인 성공! ${data.user.nickname}님 환영합니다.`);
      } else {
        alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setForm({ ...form, recommender_email: "" });
    setIsRecommenderEmailSet(false);
    setLoginForm({ email: "", password: "" });
  };

  const handleLoginFormChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!isRecommenderEmailSet || !form.recommender_email.trim()) {
      alert("먼저 로그인해주세요.");
      return;
    }
    
    setLoading(true);
    setRecommendation("");
    try {
      const response = await fetch("http://localhost:8000/generate-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          selected_score: "5",
          workspace_id: null
        }),
      });
      
      if (!response.ok) {
        throw new Error("추천서 생성 실패");
      }
      
      const data = await response.json();
      setRecommendation(data.recommendation);
      await loadHistoryFromServer();
    } catch (error) {
      console.error("Error:", error);
      alert("서버 연결 오류: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">AI 추천서 생성기</h1>
        <button
          onClick={() => navigate('/history')}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 font-semibold shadow-md"
        >
          📜 추천서 히스토리
        </button>
      </div>

      {/* 로그인 섹션 */}
      {!isLoggedIn ? (
        <div className="mb-6 bg-white p-6 rounded-2xl shadow max-w-md">
          <h2 className="text-xl font-bold mb-4 text-center">로그인</h2>
          <div className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="이메일"
              value={loginForm.email}
              onChange={handleLoginFormChange}
              className="w-full border p-2 rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={loginForm.password}
              onChange={handleLoginFormChange}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              로그인
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-white p-4 rounded-2xl shadow max-w-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">안녕하세요, {user.nickname}님!</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}

      {/* 추천서 생성 폼 - 로그인한 사용자만 */}
      {isLoggedIn && (
        <div className="grid gap-3 w-full max-w-xl bg-white p-6 rounded-2xl shadow">
          <div className="flex gap-2 items-center">
            <input 
              name="recommender_email" 
              value={form.recommender_email}
              placeholder="추천자 이메일" 
              disabled 
              className="border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed flex-1" 
            />
          </div>
          <input name="requester_name" placeholder="추천서 받을 사람 이름" onChange={handleChange} className="border p-2 rounded" />
          <input name="requester_email" placeholder="요청자 이메일" onChange={handleChange} className="border p-2 rounded" />
          <textarea name="reason" placeholder="추천 이유 / 관계" onChange={handleChange} className="border p-2 rounded" />
          <textarea name="strengths" placeholder="주요 역량 / 성과" onChange={handleChange} className="border p-2 rounded" />
          <textarea name="highlight" placeholder="특별히 강조할 점" onChange={handleChange} className="border p-2 rounded" />
          <select name="tone" value={form.tone} onChange={handleChange} className="border p-2 rounded">
            <option value="공식적">공식적</option>
            <option value="친근">친근</option>
            <option value="창의적">창의적</option>
          </select>

          <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600" disabled={loading}>
            {loading ? "생성 중..." : "추천서 생성"}
          </button>
        </div>
      )}

      {isLoggedIn && recommendation && (
        <div className="max-w-xl bg-white p-6 rounded-2xl shadow mt-6 whitespace-pre-wrap">
          <h2 className="text-xl font-bold mb-3">생성된 추천서</h2>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}
