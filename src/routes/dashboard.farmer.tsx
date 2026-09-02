import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { fetchFarmerDashboard } from "@/lib/api";
import { farmerDashboard, getProduct, naira, products } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/farmer")({
  head: () => ({
    meta: [
      { title: "Farm Dashboard | FarmDirect for Farmers" },
      {
        name: "description",
        content:
          "Manage your listings, fulfil customer orders and respond to price offers on FarmDirect's farmer dashboard.",
      },
      { property: "og:title", content: "Farm Dashboard | FarmDirect" },
      {
        property: "og:description",
        content: "Sales, pending orders and live buyer offers for your farm at a glance.",
      },
    ],
  }),
  component: FarmerDashboard,
});

const statusStyle = (status: string) => {
  if (status === "Delivered") return "bg-primary-container text-on-primary-container";
  if (status === "Ready for Pickup") return "bg-secondary-container text-on-secondary-container";
  return "bg-tertiary-container text-on-tertiary-container";
};

function FarmerDashboard() {
  const mock = farmerDashboard;
  const { data, isLoading, error } = useQuery({
    queryKey: ["farmerDashboard"],
    queryFn: fetchFarmerDashboard,
  });

  const farm = String(data?.farm ?? mock.farm);
  const avatar = String(data?.avatar ?? mock.avatar);
  const stats = {
    products: Number(data?.stats?.products ?? mock.stats.products),
    pendingOrders: Number(data?.stats?.pendingOrders ?? mock.stats.pendingOrders),
    negotiations: Number(data?.stats?.negotiations ?? mock.stats.negotiations),
    sales: Number(data?.stats?.sales ?? mock.stats.sales),
  };
  const recentOrders = Array.isArray(data?.recentOrders) ? data.recentOrders : mock.recentOrders;
  const bids = Array.isArray(data?.bids) ? data.bids : mock.bids;

  const myProducts = products.filter((product) => product.farmer === farm);

  const statCards = [
    { label: "Products", value: String(stats.products), icon: "inventory_2" },
    { label: "Pending orders", value: String(stats.pendingOrders), icon: "pending_actions" },
    { label: "Negotiations", value: String(stats.negotiations), icon: "handshake" },
    { label: "Total sales", value: naira(stats.sales), icon: "payments" },
  ];

  if (isLoading) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center pb-xl">
        <div className="flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          <p className="font-label-md text-label-md text-on-surface-variant">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center px-margin-mobile pb-xl">
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
    <div className="bg-background text-on-surface min-h-screen pb-xl">
      <header className="sticky top-0 z-40 glass-header border-b border-outline-variant/40">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-gutter h-16 flex items-center gap-sm">
          <img src={avatar} alt={farm} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 min-w-0">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Farmer dashboard</p>
            <p className="font-label-md text-body-md truncate">{farm}</p>
          </div>
          <Link
            to="/browse"
            className="h-10 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            List produce
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-margin-mobile md:px-gutter py-md flex flex-col gap-md">
        <section className="relative overflow-hidden rounded-3xl">
          <img src={data.heroImage} alt="Farm harvest" className="w-full h-36 md:h-48 object-cover" />
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute bottom-0 left-0 p-md">
            <p className="font-label-sm text-label-sm text-white/80 uppercase">This month</p>
            <p className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-white">
              {naira(data.stats.sales)} in sales
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-sm">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 custom-shadow"
            >
              <span className="material-symbols-outlined text-primary">{stat.icon}</span>
              <p className="font-headline-md text-headline-md-mobile mt-1">{stat.value}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md-mobile mb-sm">Buyer offers awaiting reply</h2>
          <div className="flex flex-col gap-sm">
            {data.bids.map((bid) => {
              const product = getProduct(bid.productId);
              if (!product) return null;
              return (
                <div
                  key={bid.productId}
                  className="flex items-center gap-sm p-3 rounded-2xl bg-surface-container-low border border-outline-variant/40"
                >
                  <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-body-md truncate">{product.name}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {bid.buyer} offers {naira(bid.offer)} • you ask {naira(product.price)}
                    </p>
                  </div>
                  <Link
                    to="/negotiate/$productId"
                    params={{ productId: product.id }}
                    className="h-10 px-4 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md flex items-center shrink-0"
                  >
                    Respond
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-sm">
            <h2 className="font-headline-md text-headline-md-mobile">Recent orders</h2>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {data.recentOrders.length} this week
            </span>
          </div>
          <div className="grid gap-sm md:grid-cols-2">
            {data.recentOrders.map((order) => (
              <div
                key={order.ref}
                className="flex items-center gap-sm p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 custom-shadow"
              >
                <img src={order.image} alt={order.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-body-md truncate">{order.name}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{order.ref}</p>
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
          <h2 className="font-headline-md text-headline-md-mobile mb-sm">My listings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
            {myProducts.map((product) => (
              <Link
                key={product.id}
                to="/product/$productId"
                params={{ productId: product.id }}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/40 custom-shadow"
              >
                <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <p className="font-label-md text-body-md line-clamp-1">{product.name}</p>
                  <p className="font-label-sm text-label-sm text-primary">
                    {naira(product.price)}/{product.unit}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{product.stock}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Link
          to="/"
          className="self-start font-label-md text-label-md text-primary flex items-center gap-1 hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Switch account
        </Link>
      </main>
    </div>
  );
}
