import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

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
        console.log("서버에서 히스토리 로드됨:", data.history);
        if (email) {
          console.log(`이메일 ${email}로 검색된 히스토리:`, data.history.length, "개");
        }
      }
    } catch (error) {
      console.error("히스토리 로드 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSearch = async () => {
    if (!searchEmail.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    
    setIsSearching(true);
    await loadHistoryFromServer(searchEmail.trim());
    setIsSearching(false);
  };

  const handleShowAllHistory = async () => {
    setIsSearching(true);
    setSearchEmail("");
    await loadHistoryFromServer();
    setIsSearching(false);
  };

  const deleteHistoryItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete-history/${id}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        // 서버에서 최신 히스토리 다시 로드
        await loadHistoryFromServer(searchEmail || null);
        alert("해당 히스토리가 삭제되었습니다.");
      } else {
        alert("히스토리 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("히스토리 삭제 오류:", error);
      alert("히스토리 삭제 중 오류가 발생했습니다.");
    }
  };

  const clearHistory = async () => {
    if (!confirm("모든 히스토리를 삭제하시겠습니까?")) {
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8000/clear-history", {
        method: "DELETE"
      });
      
      if (response.ok) {
        setHistory([]);
        alert("모든 히스토리가 삭제되었습니다.");
      } else {
        alert("히스토리 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("히스토리 삭제 오류:", error);
      alert("히스토리 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            ← 홈으로
          </button>
          <h1 className="text-3xl font-bold">전체 추천서 히스토리</h1>
          <div className="w-24"></div> {/* 제목 중앙 정렬을 위한 공간 */}
        </div>

        {/* 검색 및 관리 */}
        <div className="mb-6 flex flex-col gap-4 items-center">
          {/* 이메일 검색 */}
          <div className="flex gap-2 items-center">
            <input
              type="email"
              placeholder="이메일로 히스토리 검색"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="border p-2 rounded w-64"
              onKeyPress={(e) => e.key === 'Enter' && handleEmailSearch()}
            />
            <button
              onClick={handleEmailSearch}
              disabled={isSearching}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {isSearching ? "검색 중..." : "검색"}
            </button>
            <button
              onClick={handleShowAllHistory}
              disabled={isSearching}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
            >
              전체 보기
            </button>
          </div>
          
          {/* 관리 버튼 */}
          {history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              전체 삭제
            </button>
          )}
        </div>

        {/* 히스토리 목록 */}
        {history.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
            {searchEmail ? `"${searchEmail}"에 대한 검색 결과가 없습니다.` : "아직 생성된 추천서가 없습니다."}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {searchEmail ? 
                `"${searchEmail}" 검색 결과 (${history.length}개)` : 
                `전체 추천서 기록 (${history.length}개)`
              }
            </h2>
            
            {history.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      {item.form.requester_name}님의 추천서
                    </h3>
                    <p className="text-sm text-gray-500">{item.timestamp}</p>
                    <p className="text-sm text-gray-600">
                      추천자: {item.form.recommender_email} | 톤: {item.form.tone}
                    </p>
                    {item.form.requester_email && (
                      <p className="text-sm text-gray-600">
                        이메일: {item.form.requester_email}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
                <div className="whitespace-pre-wrap border-t pt-4">
                  <p>{item.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
