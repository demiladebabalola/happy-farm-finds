import { Link } from "@tanstack/react-router";

type Item = { to: string; icon: string; label: string };

const items: Item[] = [
  { to: "/dashboard/customer", icon: "home", label: "Home" },
  { to: "/browse", icon: "search", label: "Shop" },
  { to: "/negotiate/habanero", icon: "payments", label: "Bids" },
  { to: "/dashboard/farmer", icon: "storefront", label: "Sell" },
  { to: "/", icon: "person", label: "Account" },
];

export function CustomerBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 pb-safe md:hidden bg-surface shadow-lg rounded-t-xl border-t border-outline-variant/10">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full px-3 py-1 active:scale-90 duration-100"
          activeProps={{
            className:
              "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-3 py-1 active:scale-90 duration-100",
          }}
          activeOptions={{ exact: true }}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="font-label-sm text-[10px]">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
