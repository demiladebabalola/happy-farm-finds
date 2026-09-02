const API_URL = "https://swimwear-mastiff-olympics.ngrok-free.dev/api";

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
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}
