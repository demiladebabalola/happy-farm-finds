export type Role = "customer" | "farmer";

const KEY = "farmdirect.role";
const TOKEN_KEY = "farmdirect.token";
const USER_KEY = "farmdirect.user";

export const setRole = (role: Role) => {
  try {
    localStorage.setItem(KEY, role);
  } catch {
    /* demo-only, storage is optional */
  }
};

export const getRole = (): Role => {
  try {
    return localStorage.getItem(KEY) === "farmer" ? "farmer" : "customer";
  } catch {
    return "customer";
  }
};

export const normalizeRole = (role: unknown): Role =>
  String(role).toLowerCase() === "farmer" ? "farmer" : "customer";

export const saveSession = (token: unknown, user: unknown): Role => {
  const role = normalizeRole((user as { role?: unknown } | null)?.role);
  try {
    if (token) localStorage.setItem(TOKEN_KEY, String(token));
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(KEY, role);
  } catch {
    /* storage is optional */
  }
  return role;
};

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const getUser = <T = Record<string, unknown>>(): T | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* storage is optional */
  }
};

export const dashboardPath = (role: Role) =>
  role === "farmer" ? "/dashboard/farmer" : "/dashboard/customer";
