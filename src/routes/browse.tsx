import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CustomerBottomNav } from "@/components/CustomerBottomNav";
import { fetchProducts } from "@/lib/api";
import { IMG } from "@/lib/images";
import { browseFilters, categories, naira } from "@/lib/mock-data";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse Fresh Farm Produce | FarmDirect" },
      {
        name: "description",
        content:
          "Browse tomatoes, ugu leaves, yam, honey, smoked catfish and more — priced in naira, straight from Nigerian farms.",
      },
      { property: "og:title", content: "Browse Fresh Farm Produce | FarmDirect" },
      {
        property: "og:description",
        content: "Shop the latest harvest from verified farms and negotiate bulk prices.",
      },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const [filter, setFilter] = useState("All Produce");
  const [query, setQuery] = useState("");

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const visible = useMemo(
    () =>
      (products ?? []).filter((product: { category: string; name: string; farmer: string; location: string }) => {
        const matchesFilter = filter === "All Produce" || product.category === filter;
        const matchesQuery =
          query.trim() === "" ||
          `${product.name} ${product.farmer} ${product.location}`.toLowerCase().includes(query.toLowerCase());
        return matchesFilter && matchesQuery;
      }),
    [filter, query, products],
  );

  return (
    <div className="bg-background text-on-surface min-h-screen pb-28 md:pb-xl">
      <header className="sticky top-0 z-40 glass-header border-b border-outline-variant/40">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-gutter py-sm flex items-center gap-sm">
          <Link
            to="/dashboard/customer"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors shrink-0"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search produce, farms or towns"
              className="w-full h-11 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-full outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md"
            />
          </div>
          <Link
            to="/negotiate/$productId"
            params={{ productId: "habanero" }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container shrink-0"
          >
            <span className="material-symbols-outlined">forum</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-margin-mobile md:px-gutter pb-sm flex gap-2 overflow-x-auto hide-scrollbar">
          {browseFilters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={
                filter === item
                  ? "shrink-0 h-9 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md"
                  : "shrink-0 h-9 px-4 rounded-full bg-surface-container-low border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors"
              }
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-margin-mobile md:px-gutter py-md flex flex-col gap-md">
        <section className="relative overflow-hidden rounded-3xl">
          <img
            src="/images/browse-banner.png"
            alt="Farmers harvesting in the field"
            className="w-full h-40 md:h-56 object-cover object-center"
          />
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute bottom-0 left-0 right-0 p-margin-mobile md:p-md">
            <p className="font-label-sm text-label-sm text-white/80 uppercase">Today at the farm gate</p>
            <h1 className="font-headline-md text-headline-md-mobile md:text-headline-lg text-white">
              Fresh from {(products ?? []).length} local harvests
            </h1>
          </div>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md-mobile mb-sm">Categories</h2>
          <div className="flex gap-sm overflow-x-auto hide-scrollbar pb-1">
            {categories.map((category) => (
              <div key={category.label} className="shrink-0 w-24 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-outline-variant/60">
                  <img src={category.image} alt={category.label} className="w-full h-full object-cover" />
                </div>
                <span className="font-label-sm text-label-sm text-center text-on-surface-variant">
                  {category.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-sm">
            <h2 className="font-headline-md text-headline-md-mobile">All Produce</h2>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {visible.length} item{visible.length === 1 ? "" : "s"}
            </span>
          </div>

          {isLoading ? (
            <p className="py-lg text-center font-body-md text-body-md text-on-surface-variant">Loading produce...</p>
          ) : error ? (
            <p className="py-lg text-center font-body-md text-body-md text-error" role="alert">
              Could not load products. Please try again.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-sm md:gap-md">
              {visible.map((product: { id: string; name: string; farmer: string; location: string; image: string; badge?: string; price: number; unit: string; rating: number }) => (
                <Link
                  key={product.id}
                  to="/product/$productId"
                  params={{ productId: product.id }}
                  className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/40 custom-shadow hover:-translate-y-1 transition-transform duration-200"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge ? (
                      <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">
                        {product.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="p-3 flex flex-col gap-1">
                    <h3 className="font-label-md text-body-md line-clamp-1">{product.name}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant line-clamp-1">
                      {product.farmer} • {product.location}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-headline-md text-body-lg text-primary">
                        {naira(product.price)}
                        <span className="font-label-sm text-label-sm text-on-surface-variant">/{product.unit}</span>
                      </span>
                      <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                        <span
                          className="material-symbols-outlined text-[16px] text-tertiary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && !error && visible.length === 0 ? (
            <p className="py-lg text-center font-body-md text-body-md text-on-surface-variant">
              No produce matches that search yet.
            </p>
          ) : null}
        </section>
      </main>

      <CustomerBottomNav />
    </div>
  );
}
