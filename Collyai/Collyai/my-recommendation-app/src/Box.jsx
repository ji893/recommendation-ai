import { useEffect, useState } from "react";

/**
 * Box.jsx (보관함 화면)
 * - 작성한 추천서만 표시
 * - 요청자 검색 및 삭제 기능 포함
 */

const styles = {
  page: { width: "100%" },
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
    padding: "1.25rem",
    marginBottom: "1rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 800,
    marginBottom: "0.75rem",
    background: "linear-gradient(to right, #ef4444, #dc2626)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  muted: { color: "#6b7280" },
  button: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
  primaryBtn: {
    background: "linear-gradient(to right, #ef4444, #dc2626)",
    color: "white",
  },
  accordionHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
    marginBottom: "0.75rem",
  },
  listItem: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "8px",
    background: "#ffffff",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  tag: {
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "12px",
    fontWeight: 700,
  },
  searchInput: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    fontSize: "14px",
    marginBottom: "1rem",
  },
  deleteButton: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "12px",
    fontWeight: 600,
    marginLeft: "8px",
  },
};

function Accordion({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={styles.card}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={styles.accordionHeader}
      >
        <span style={styles.sectionTitle}>{title}</span>
        <span style={{ color: "#9ca3af", fontWeight: 700 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function RecommendationItem({ compactTitle, meta, content, onDelete, itemId }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("정말 이 추천서를 삭제하시겠습니까?")) return;
    setDeleting(true);
    try {
      await onDelete(itemId);
    } catch {
      alert("삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={styles.listItem}>
      <div style={styles.listHeader} onClick={() => setOpen(!open)}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <span style={styles.tag}>{meta}</span>
          <strong style={{ fontSize: 14 }}>{compactTitle}</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              ...styles.deleteButton,
              opacity: deleting ? 0.5 : 1,
              cursor: deleting ? "not-allowed" : "pointer",
            }}
          >
            {deleting ? "삭제 중..." : "삭제"}
          </button>
          <span style={{ color: "#9ca3af", fontWeight: 700 }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#1f2937" }}>
          {content}
        </div>
      )}
    </div>
  );
}

export default function Box({ user, token, onBackHome }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 데이터 로드
  useEffect(() => {
    if (!token || !user?.email) return;
    const fetchSent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8000/my-recommendations/sent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setSent(json?.items || []);
      } catch {
        setError("보관함 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchSent();
  }, [token, user?.email]);

  // 삭제 핸들러
  const handleDelete = async (itemId) => {
    const res = await fetch(`http://localhost:8000/delete-history/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "삭제 실패");
    }
    // 삭제 후 목록에서 제거
    setSent((prev) => prev.filter((item) => item.id !== itemId));
    alert("추천서가 삭제되었습니다.");
  };

  // 검색 필터링
  const filteredSent = sent.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const requesterName = (item.requester_name || item.to || "").toLowerCase();
    return requesterName.includes(query);
  });

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, background: "linear-gradient(to right,#ef4444,#dc2626)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          보관함
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onBackHome && onBackHome()}
            style={{ ...styles.button, background: "white", border: "2px solid #e5e7eb", borderRadius: 10 }}
          >
            홈으로
          </button>
        </div>
      </div>

      {loading && <div style={{ ...styles.card }}>불러오는 중...</div>}
      {error && <div style={{ ...styles.card, color: "#b91c1c" }}>{error}</div>}

      {/* 작성한 추천서 */}
      <div id="archive-sent">
        <Accordion title="작성한 추천서" defaultOpen={true}>
          {/* 검색 입력 */}
          <input
            type="text"
            placeholder="요청자 이름으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />

          <div style={{ marginBottom: 8, color: "#6b7280" }}>
            로그인한 계정으로 작성한 추천서 목록입니다. 각 항목을 클릭하면 내용이 펼쳐집니다.
          </div>
          {filteredSent.length === 0 && (
            <div style={{ ...styles.card }}>
              {searchQuery ? "검색 결과가 없습니다." : "작성한 추천서가 없습니다."}
            </div>
          )}
          {filteredSent.map((it) => (
            <RecommendationItem
              key={it.id}
              itemId={it.id}
              meta={new Date(it.created_at).toLocaleString()}
              compactTitle={`요청자: ${it.requester_name || it.to || "대상자"}`}
              content={it.content || it.recommendation || ""}
              onDelete={handleDelete}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
}
