const API_URL = (import.meta.env.BACKEND_API_URL || "").replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_URL}${path}`;
}
