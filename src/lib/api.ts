const API_URL = "https://swimwear-mastiff-olympics.ngrok-free.dev/api";

function parseLaravelError(payload: unknown, fallback: string): string {
  if (typeof payload !== "object" || payload === null) return fallback;

  const obj = payload as Record<string, unknown>;

  if (obj["errors"] && typeof obj["errors"] === "object" && obj["errors"] !== null) {
    const errors = obj["errors"] as Record<string, unknown>;
    for (const key of Object.keys(errors)) {
      const value = errors[key];
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return value[0];
      }
      if (typeof value === "string") {
        return value;
      }
    }
  }

  if (typeof obj["message"] === "string" && obj["message"].length > 0) {
    return obj["message"];
  }

  return fallback;
}

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: "customer" | "farmer";
  farm_name?: string;
  location?: string;
}) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(parseLaravelError(payload, "Registration failed"));
  }
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(parseLaravelError(payload, "Login failed"));
  }
  return res.json();
}
