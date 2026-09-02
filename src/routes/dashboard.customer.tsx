import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { CustomerBottomNav } from "@/components/CustomerBottomNav";
import { fetchCustomerDashboard } from "@/lib/api";
import { customerDashboard, getProduct, naira, products } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/customer")({
  head: () => ({
    meta: [
      { title: "My Basket & Orders | FarmDirect Customer" },
      {
        name: "description",
        content:
          "Track your farm orders, revisit favourite harvests and pick up open price negotiations with Nigerian farmers.",
      },
      { property: "og:title", content: "My Basket & Orders | FarmDirect" },
      {
        property: "og:description",
        content: "Your orders, recommended harvests and live negotiations in one place.",
      },
    ],
  }),
  component: CustomerDashboard,
});

const statusStyle = (status: string) =>
  status === "Delivered"
    ? "bg-primary-container text-on-primary-container"
    : "bg-tertiary-container text-on-tertiary-container";

function CustomerDashboard() {
  const mock = customerDashboard;
  const { data, isLoading, error } = useQuery({
    queryKey: ["customerDashboard"],
    queryFn: fetchCustomerDashboard,
  });

  const name = data?.name ?? mock.name;
  const avatar = data?.avatar ?? mock.avatar;
  const recentOrders = Array.isArray(data?.recentOrders) ? data.recentOrders : mock.recentOrders;

  const recommended = mock.recommended
    .map((item) => ({ ...item, product: getProduct(item.productId) }))
    .filter((item) => item.product);

  if (isLoading) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center pb-28 md:pb-xl">
        <div className="flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          <p className="font-label-md text-label-md text-on-surface-variant">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center px-margin-mobile pb-28 md:pb-xl">
        <div className="max-w-md text-center">
          <p className="font-headline-md text-headline-md-mobile text-error mb-2">Could not load dashboard</p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">{error.message}</p>
          <Link
            to="/browse"
            className="inline-flex h-12 px-6 rounded-full bg-primary text-on-primary font-label-md text-label-md items-center gap-2"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen pb-28 md:pb-xl">
      <header className="sticky top-0 z-40 glass-header border-b border-outline-variant/40">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-gutter h-16 flex items-center gap-sm">
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 min-w-0">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Welcome back</p>
            <p className="font-label-md text-body-md truncate">{name}</p>
          </div>
          <Link
            to="/browse"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">search</span>
          </Link>
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined">shopping_basket</span>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error text-on-error font-label-sm text-[10px] flex items-center justify-center">
              {mock.cart.items}
            </span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-margin-mobile md:px-gutter py-md flex flex-col gap-md">
        <section className="p-md rounded-3xl bg-primary-container text-on-primary-container flex flex-wrap items-center gap-sm justify-between">
          <div>
            <p className="font-label-sm text-label-sm uppercase opacity-80">Basket total</p>
            <p className="font-display-lg text-headline-lg-mobile md:text-headline-lg">
              {naira(mock.cart.total)}
            </p>
            <p className="font-label-md text-label-md opacity-90">{mock.cart.items} items ready for checkout</p>
          </div>
          <Link
            to="/browse"
            className="h-12 px-6 rounded-full bg-surface text-primary font-label-md text-label-md flex items-center gap-2"
          >
            Keep shopping
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-sm">
            <h2 className="font-headline-md text-headline-md-mobile">Recent orders</h2>
            <Link to="/browse" className="font-label-md text-label-md text-primary">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-sm">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-sm p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 custom-shadow"
              >
                <img src={order.image} alt={order.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-body-md truncate">{order.name}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Order {order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-label-md text-body-md">{naira(order.total)}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${statusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md-mobile mb-sm">Recommended for you</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
            {recommended.map(({ product, label }) => (
              <Link
                key={product!.id}
                to="/product/$productId"
                params={{ productId: product!.id }}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/40 custom-shadow"
              >
                <div className="relative">
                  <img src={product!.image} alt={product!.name} className="w-full aspect-square object-cover" />
                  {label ? (
                    <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">
                      {label}
                    </span>
                  ) : null}
                </div>
                <div className="p-3">
                  <p className="font-label-md text-body-md line-clamp-1">{product!.name}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant line-clamp-1">
                    {product!.farmer}
                  </p>
                  <p className="font-label-md text-body-md text-primary mt-1">
                    {naira(product!.price)}/{product!.unit}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md-mobile mb-sm">Open negotiations</h2>
          <div className="flex flex-col gap-sm">
            {products.slice(6, 8).map((product) => (
              <Link
                key={product.id}
                to="/negotiate/$productId"
                params={{ productId: product.id }}
                className="flex items-center gap-sm p-3 rounded-2xl bg-surface-container-low border border-outline-variant/40 hover:bg-surface-container-high transition-colors"
              >
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-body-md truncate">{product.name}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    with {product.farmer} • asking {naira(product.price)}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <CustomerBottomNav />
    </div>
  );
}
