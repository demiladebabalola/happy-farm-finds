import { IMG } from "./images";
import uguAsset from "@/assets/ugu-leaves.png.asset.json";
import yamTubersAsset from "@/assets/yam-tubers.png.asset.json";
import honeyAsset from "@/assets/honey-bottle.png.asset.json";


export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  farmer: string;
  farmerAvatar: string;
  location: string;
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  stock: string;
  description: string;
  badge?: string;
};

export const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

export const products: Product[] = [
  {
    id: "garri",
    name: "Garri (Ijebu, Bulk)",
    category: "Pantry",
    price: 450,
    unit: "module",
    farmer: "Green Valley Farm",
    farmerAvatar: IMG.s3_3,
    location: "Kuje, Abuja",
    image: IMG.s3_2,
    gallery: [IMG.s3_2, IMG.s2_3, IMG.s2_5],
    rating: 4.8,
    reviews: 124,
    stock: "24 modules available",
    description:
      "Stone-free Ijebu garri, sun-dried and sieved the traditional way. Sharp, crisp and ready for eba or soaking. Milled weekly on our family-owned farm in Kuje.",
    badge: "Best Seller",
  },
  {
    id: "tomatoes",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 2000,
    unit: "kg",
    farmer: "Gwagwalada Farms",
    farmerAvatar: IMG.s3_5,
    location: "Gwagwalada, Abuja",
    image: IMG.s3_4,
    gallery: [IMG.s3_4, IMG.s2_7, IMG.s2_2],
    rating: 4.9,
    reviews: 96,
    stock: "40 kg available",
    description:
      "Firm, deep-red field tomatoes picked at dawn and moved straight to market. Perfect for stew, jollof or fresh salads — no cold-store storage, no waxing.",
  },
  {
    id: "pure-honey",
    name: "Pure Honey",
    category: "Honey & Jams",
    price: 1200,
    unit: "500g",
    farmer: "Kuje Honey Farm",
    farmerAvatar: IMG.s3_7,
    location: "Kuje, Abuja",
    image: IMG.s3_6,
    gallery: [IMG.s3_6, IMG.s5_6, IMG.s2_4],
    rating: 5.0,
    reviews: 58,
    stock: "18 jars available",
    description:
      "Raw, unfiltered wildflower honey harvested from our own hives. Nothing added, nothing heated — just thick amber honey straight from the comb.",
    badge: "Top Rated",
  },
  {
    id: "smoked-catfish",
    name: "Smoked Catfish",
    category: "Protein",
    price: 2500,
    unit: "250g",
    farmer: "Usman Farms",
    farmerAvatar: IMG.s3_9,
    location: "Lugbe, Abuja",
    image: IMG.s3_8,
    gallery: [IMG.s3_8, IMG.s5_13, IMG.s4_5],
    rating: 4.7,
    reviews: 42,
    stock: "12 packs available",
    description:
      "Whole catfish smoked slowly over hardwood until firm and deeply aromatic. Ideal for pepper soup, egusi and banga.",
  },
  {
    id: "strawberries",
    name: "Sweet Summer Strawberries",
    category: "Fruits",
    price: 3000,
    unit: "kg",
    farmer: "Berry Bliss Farm",
    farmerAvatar: IMG.s3_11,
    location: "Jos, Plateau",
    image: IMG.s3_10,
    gallery: [IMG.s3_10, IMG.s2_2, IMG.s2_4],
    rating: 4.9,
    reviews: 71,
    stock: "9 kg available",
    description:
      "Highland strawberries grown in the cool Jos plateau climate. Sweet, aromatic and hand-packed the same morning they are picked.",
    badge: "Just In",
  },
  {
    id: "sweet-potato",
    name: "Organic Sweet Potato",
    category: "Tubers",
    price: 1250,
    unit: "kg",
    farmer: "Green Valley Farm",
    farmerAvatar: IMG.s1_2,
    location: "Kuje, Abuja",
    image: IMG.s1_1,
    gallery: [IMG.s1_1, IMG.s5_5, IMG.s2_5],
    rating: 4.8,
    reviews: 63,
    stock: "35 kg available",
    description:
      "Sweet, orange-fleshed potatoes grown without synthetic fertiliser. Great roasted, fried or boiled — a customer favourite for bulk orders.",
  },
  {
    id: "ugu-leaves",
    name: "Fresh Ugu Leaves (Bulk)",
    category: "Vegetables",
    price: 550,
    unit: "bundle",
    farmer: "Green Valley Farm",
    farmerAvatar: IMG.s5_9,
    location: "Nyanya, Abuja",
    image: uguAsset.url,
    gallery: [uguAsset.url, IMG.s5_2, IMG.s3_2],
    rating: 4.7,
    reviews: 88,
    stock: "60 bundles available",
    description:
      "Fluted pumpkin leaves cut and bundled to order. Crisp stems, dark leaves, and washed with clean borehole water before packing.",
  },
  {
    id: "habanero",
    name: "Habanero Peppers (Atarodo)",
    category: "Vegetables",
    price: 620,
    unit: "cup",
    farmer: "Sunny Acres",
    farmerAvatar: IMG.s5_11,
    location: "Karu, Nasarawa",
    image: IMG.s5_10,
    gallery: [IMG.s5_10, IMG.s5_7, IMG.s3_4],
    rating: 4.6,
    reviews: 54,
    stock: "50 cups available",
    description:
      "Fiery red atarodo sorted by hand for size and ripeness. Sold by the cup, with bulk basket pricing open to negotiation.",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const categories = [
  { label: "Ugu Leaves", image: IMG.s5_2 },
  { label: "Agbalumo", image: "/images/agbalumo.png" },
  { label: "Oils", image: IMG.s5_4 },
  { label: "Tubers", image: yamTubersAsset.url },
  { label: "Pantry", image: honeyAsset.url },
  { label: "Specials", image: IMG.s5_7 },
];


export const browseFilters = [
  "All Produce",
  "Vegetables",
  "Fruits",
  "Tubers",
  "Pantry",
  "Honey & Jams",
  "Protein",
];

export type NegotiationMessage = {
  id: number;
  side: "buyer" | "farmer";
  text: string;
  time: string;
};

export type Negotiation = {
  productId: string;
  status: "Counter-Offer Received" | "Offer Sent" | "Accepted" | "Rejected";
  buyerOffer: number;
  farmerAsk: number;
  messages: NegotiationMessage[];
};

export const negotiations: Negotiation[] = [
  {
    productId: "ugu-leaves",
    status: "Offer Sent",
    buyerOffer: 500,
    farmerAsk: 550,
    messages: [
      { id: 1, side: "buyer", text: "Good morning. Can I get 20 bundles at ₦500 each?", time: "09:12 AM" },
      { id: 2, side: "farmer", text: "Morning! Let me check what we cut today and revert.", time: "09:20 AM" },
    ],
  },
  {
    productId: "habanero",
    status: "Counter-Offer Received",
    buyerOffer: 560,
    farmerAsk: 620,
    messages: [
      { id: 1, side: "buyer", text: "I'd like 30 cups at ₦560 per cup.", time: "10:24 AM" },
      { id: 2, side: "farmer", text: "I can't go that low for 30, but I can do ₦620 per cup.", time: "10:45 AM" },
    ],
  },
];

export const defaultNegotiation = (productId: string): Negotiation => {
  const existing = negotiations.find((n) => n.productId === productId);
  if (existing) return existing;
  const product = getProduct(productId);
  const ask = product?.price ?? 1000;
  return {
    productId,
    status: "Counter-Offer Received",
    buyerOffer: Math.round(ask * 0.85),
    farmerAsk: ask,
    messages: [
      {
        id: 1,
        side: "buyer",
        text: `Hi, I'd like to offer ${naira(Math.round(ask * 0.85))} per ${product?.unit ?? "unit"} for a bulk order.`,
        time: "10:24 AM",
      },
      {
        id: 2,
        side: "farmer",
        text: `I can't go that low on a bulk order, but I can do ${naira(ask)}.`,
        time: "10:45 AM",
      },
    ],
  };
};

/* ── Customer dashboard mock data ── */
export const customerDashboard = {
  name: "Demilade",
  avatar: IMG.s5_1,
  cart: { items: 3, total: 24500 },
  recentOrders: [
    { id: "FD-4410", name: "Agbalumo (Star Apple)", image: IMG.s5_3, total: 4280, status: "Delivered" },
    { id: "FD-4392", name: "Pure Red Palm Oil (1L)", image: IMG.s5_12, total: 12000, status: "In Transit" },
    { id: "FD-4361", name: "White Yam Tubers", image: IMG.s5_5, total: 3500, status: "Delivered" },
  ],
  recommended: [
    { productId: "pure-honey", label: "Best Seller" },
    { productId: "sweet-potato", label: "Just In" },
    { productId: "smoked-catfish" as const, label: undefined as string | undefined },
  ],
};

/* ── Farmer dashboard mock data ── */
export const farmerDashboard = {
  farm: "Green Valley Farm",
  avatar: IMG.s4_1,
  stats: {
    products: 24,
    pendingOrders: 5,
    negotiations: 3,
    sales: 1240000,
  },
  recentOrders: [
    { name: "Fresh Tomatoes (5kg)", ref: "#HD-9021", image: IMG.s4_2, total: 24050, status: "Processing" },
    { name: "Smoked Catfish (1kg)", ref: "#HD-8954", image: IMG.s4_3, total: 5000, status: "Ready for Pickup" },
    { name: "Organic Sweet Potato", ref: "#HD-8821", image: IMG.s4_4, total: 12000, status: "Delivered" },
    { name: "Fresh Ugu Leaves (Bulk)", ref: "#HD-8711", image: IMG.s4_5, total: 6000, status: "Processing" },
  ],
  bids: [
    { productId: "ugu-leaves", buyer: "Adaeze O.", offer: 500 },
    { productId: "habanero", buyer: "Chinedu M.", offer: 560 },
  ],
  heroImage: IMG.s4_6,
};
