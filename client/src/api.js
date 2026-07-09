// client/src/api.js
import { auth } from "./firebase";

// Uses REACT_APP_API_URL if set (e.g. in Vercel's environment variables),
// otherwise falls back to localhost for local development.
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001/api";

/**
 * Wrapper around fetch that automatically attaches the current user's
 * Firebase ID token as a Bearer token. Use this for every call to the
 * RenalEase backend (except /health, which is public).
 */
async function apiRequest(path, options = {}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not logged in");
  }

  const idToken = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  get: (path) => apiRequest(path, { method: "GET" }),
  post: (path, body) =>
    apiRequest(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    apiRequest(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => apiRequest(path, { method: "DELETE" }),
};
