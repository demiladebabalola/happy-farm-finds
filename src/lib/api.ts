import { getToken } from "@/lib/session";
import type { NegotiationMessage } from "@/lib/mock-data";

const API_URL = "https://swimwear-mastiff-olympics.ngrok-free.dev/api";

export type CustomerDashboardData = {
  name?: string | undefined;
  avatar?: string | undefined;
  recentOrders?:
    | {
        id?: string | number | undefined;
        ref?: string | undefined;
        name?: string | undefined;
        image?: string | undefined;
        total?: number | undefined;
        status?: string | undefined;
      }[]
    | undefined;
};

export type FarmerDashboardData = {
  farm?: string | undefined;
  avatar?: string | undefined;
  stats?:
    | {
        products?: number | undefined;
        pendingOrders?: number | undefined;
        negotiations?: number | undefined;
        sales?: number | undefined;
      }
    | undefined;
  recentOrders?:
    | {
        ref?: string | undefined;
        name?: string | undefined;
        image?: string | undefined;
        total?: number | undefined;
        status?: string | undefined;
      }[]
    | undefined;
  bids?:
    | {
        productId?: string | undefined;
        buyer?: string | undefined;
        offer?: number | undefined;
      }[]
    | undefined;
};

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

async function parseApiError(res: Response, fallback: string): Promise<never> {
  const payload = await res.json().catch(() => null);
  throw new Error(parseLaravelError(payload, fallback));
}

function authHeaders() {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function normalizeNegotiation(data: unknown): {
  id: number;
  productId: string;
  status: string;
  buyerOffer: number;
  farmerAsk: number;
  settledPrice: number | null;
  messages: NegotiationMessage[];
} {
  if (typeof data !== "object" || data === null) {
    return {
      id: 0,
      productId: "",
      status: "",
      buyerOffer: 0,
      farmerAsk: 0,
      settledPrice: null,
      messages: [],
    };
  }

  const d = data as Record<string, unknown>;
  const rawMessages = Array.isArray(d["messages"]) ? d["messages"] : [];

  const messages = rawMessages.map((m: unknown) => {
    if (typeof m !== "object" || m === null) {
      return { id: 0, side: "buyer" as const, text: "", time: "" };
    }
    const msg = m as Record<string, unknown>;
    return {
      id: Number(msg["id"] ?? 0),
      side: String(msg["side"] ?? "buyer") as "buyer" | "farmer",
      text: String(msg["text"] ?? ""),
      time: String(msg["time"] ?? ""),
    };
  });

  return {
    id: Number(d["id"] ?? 0),
    productId: String(d["product_id"] ?? d["productId"] ?? ""),
    status: String(d["status"] ?? ""),
    buyerOffer: Number(d["buyer_offer"] ?? d["buyerOffer"] ?? 0),
    farmerAsk: Number(d["farmer_ask"] ?? d["farmerAsk"] ?? 0),
    settledPrice:
      d["settled_price"] != null || d["settledPrice"] != null
        ? Number(d["settled_price"] ?? d["settledPrice"])
        : null,
    messages,
  };
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
    await parseApiError(res, "Registration failed");
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
    await parseApiError(res, "Login failed");
  }
  return res.json();
}

export async function fetchNegotiation(productId: string) {
  const res = await fetch(`${API_URL}/products/${productId}/negotiation`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    await parseApiError(res, "Failed to fetch negotiation");
  }
  const data = await res.json();
  return normalizeNegotiation(data);
}

export async function sendOffer(negotiationId: number, offer: number) {
  const res = await fetch(`${API_URL}/negotiations/${negotiationId}/offer`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ offer }),
  });
  if (!res.ok) {
    await parseApiError(res, "Failed to send offer");
  }
  return res.json();
}

export async function acceptOffer(negotiationId: number) {
  const res = await fetch(`${API_URL}/negotiations/${negotiationId}/accept`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) {
    await parseApiError(res, "Failed to accept offer");
  }
  return res.json();
}

export async function sendChatMessage(negotiationId: number, text: string) {
  const res = await fetch(`${API_URL}/negotiations/${negotiationId}/message`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    await parseApiError(res, "Failed to send message");
  }
  return res.json();
}

function normalizeCustomerDashboard(data: unknown): CustomerDashboardData {
  if (typeof data !== "object" || data === null) return {};
  const d = data as Record<string, unknown>;
  const rawOrders = Array.isArray(d["recent_orders"]) ? d["recent_orders"] : d["recentOrders"];
  const orders = Array.isArray(rawOrders)
    ? rawOrders.map((o) => normalizeOrder(o))
    : undefined;
  return {
    name: d["name"] as string | undefined,
    avatar: d["avatar"] as string | undefined,
    recentOrders: orders,
  };
}

function normalizeFarmerDashboard(data: unknown): FarmerDashboardData {
  if (typeof data !== "object" || data === null) return {};
  const d = data as Record<string, unknown>;
  const rawStats =
    typeof d["stats"] === "object" && d["stats"] !== null
      ? (d["stats"] as Record<string, unknown>)
      : {};
  const rawOrders = Array.isArray(d["recent_orders"]) ? d["recent_orders"] : d["recentOrders"];
  const rawBids = Array.isArray(d["bids"]) ? d["bids"] : undefined;
  return {
    farm: d["farm"] as string | undefined,
    avatar: d["avatar"] as string | undefined,
    stats: {
      products: rawStats["products"] as number | undefined,
      pendingOrders: rawStats["pending_orders"] as number | undefined,
      negotiations: rawStats["negotiations"] as number | undefined,
      sales: rawStats["sales"] as number | undefined,
    },
    recentOrders: Array.isArray(rawOrders) ? rawOrders.map((o) => normalizeOrder(o)) : undefined,
    bids: Array.isArray(rawBids)
      ? rawBids.map((b) => {
          if (typeof b !== "object" || b === null) return {};
          const bid = b as Record<string, unknown>;
          return {
            productId: bid["product_id"] as string | undefined,
            buyer: bid["buyer"] as string | undefined,
            offer: bid["offer"] as number | undefined,
          };
        })
      : undefined,
  };
}

function normalizeOrder(o: unknown): {
  id?: string | number;
  ref?: string;
  name?: string;
  image?: string;
  total?: number;
  status?: string;
} {
  if (typeof o !== "object" || o === null) return {};
  const order = o as Record<string, unknown>;
  return {
    id: order["id"] as string | number | undefined,
    ref: order["ref"] as string | undefined,
    name: order["name"] as string | undefined,
    image: order["image"] as string | undefined,
    total: order["total"] as number | undefined,
    status: order["status"] as string | undefined,
  };
}

export async function fetchCustomerDashboard() {
  const res = await fetch(`${API_URL}/dashboard/customer`, { headers: authHeaders() });
  if (!res.ok) {
    await parseApiError(res, "Failed to fetch dashboard");
  }
  const payload = await res.json();
  return normalizeCustomerDashboard(payload);
}

export async function fetchFarmerDashboard() {
  const res = await fetch(`${API_URL}/dashboard/farmer`, { headers: authHeaders() });
  if (!res.ok) {
    await parseApiError(res, "Failed to fetch dashboard");
  }
  const payload = await res.json();
  return normalizeFarmerDashboard(payload);
}
