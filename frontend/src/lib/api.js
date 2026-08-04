const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "dalleo_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const formatDetail = (detail, fallback) => {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg ?? String(e)).join(" ");
  return fallback;
};

export async function adminFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    clearToken();
    if (!window.location.pathname.includes("/admin/login")) {
      window.location.href = "/admin/login";
    }
    throw new Error("Not authenticated");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(formatDetail(body.detail, "Request failed"));
  return body;
}

export async function loginRequest(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(formatDetail(body.detail, "Login failed"));
  return body;
}

export async function fetchPublic(domain) {
  const res = await fetch(`${API}/public/${domain}?_=${Date.now()}`, { cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  return body.data ?? null;
}
