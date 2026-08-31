export type Role = "customer" | "farmer";

const KEY = "farmdirect.role";

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

export const dashboardPath = (role: Role) =>
  role === "farmer" ? "/dashboard/farmer" : "/dashboard/customer";
