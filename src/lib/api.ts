const API_URL = "https://swimwear-mastiff-olympics.ngrok-free.dev/api";

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
