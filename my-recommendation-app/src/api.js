// api.js - API 호출 헬퍼 함수
const API_BASE_URL = "http://localhost:8000";

/**
 * Authorization 헤더 생성
 */
export function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * 공통 fetch 래퍼
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // 401 에러 처리 (인증 실패)
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }

    // 응답이 JSON이 아닌 경우 (예: PDF 다운로드)
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }
      return response;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || `HTTP 오류: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API 호출 실패 [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * GET 요청
 */
export async function apiGet(endpoint, includeAuth = true) {
  return apiFetch(endpoint, {
    method: "GET",
    headers: {
      ...(includeAuth ? getAuthHeader() : {}),
    },
  });
}

/**
 * POST 요청
 */
export async function apiPost(endpoint, body, includeAuth = true) {
  return apiFetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(includeAuth ? getAuthHeader() : {}),
    },
    body: JSON.stringify(body),
  });
}

/**
 * PUT 요청
 */
export async function apiPut(endpoint, body, includeAuth = true) {
  return apiFetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(includeAuth ? getAuthHeader() : {}),
    },
    body: JSON.stringify(body),
  });
}

/**
 * PATCH 요청
 */
export async function apiPatch(endpoint, body, includeAuth = true) {
  return apiFetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(includeAuth ? getAuthHeader() : {}),
    },
    body: JSON.stringify(body),
  });
}

/**
 * DELETE 요청
 */
export async function apiDelete(endpoint, includeAuth = true) {
  return apiFetch(endpoint, {
    method: "DELETE",
    headers: {
      ...(includeAuth ? getAuthHeader() : {}),
    },
  });
}

/**
 * 파일 업로드 (FormData)
 */
export async function apiUpload(endpoint, formData, includeAuth = true) {
  return apiFetch(endpoint, {
    method: "POST",
    headers: {
      ...(includeAuth ? getAuthHeader() : {}),
      // Content-Type은 브라우저가 자동으로 설정 (boundary 포함)
    },
    body: formData,
  });
}


