import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";

import { getProduct, naira, products } from "@/lib/mock-data";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produce unavailable | FarmDirect" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — ${naira(product.price)}/${product.unit} | FarmDirect`;
    const description = `${product.name} from ${product.farmer} in ${product.location}. ${product.description}`.slice(
      0,
      158,
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: product.image },
        { name: "twitter:image", content: product.image },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-sm px-margin-mobile text-center">
      <h1 className="font-headline-lg text-headline-lg-mobile">Produce not found</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">
        That item may have sold out. Browse today's harvest instead.
      </p>
      <Link
        to="/browse"
        className="h-12 px-6 flex items-center rounded-full bg-primary text-on-primary font-label-md text-label-md"
      >
        Browse produce
      </Link>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const related = products.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <div className="bg-background text-on-surface min-h-screen pb-32 md:pb-xl">
      <header className="sticky top-0 z-40 glass-header border-b border-outline-variant/40">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-gutter h-16 flex items-center justify-between">
          <Link
            to="/browse"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-label-md text-label-md truncate px-2">{product.name}</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-margin-mobile md:px-gutter py-md grid gap-md md:grid-cols-2 md:gap-lg">
        <section className="flex flex-col gap-sm">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-outline-variant/40">
            <img
              src={product.gallery[activeImage] ?? product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge ? (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">
                {product.badge}
              </span>
            ) : null}
          </div>
          <div className="flex gap-sm">
            {product.gallery.map((image, index) => (
              <button
                key={image}
                onClick={() => setActiveImage(index)}
                className={
                  index === activeImage
                    ? "w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary"
                    : "w-20 h-20 rounded-2xl overflow-hidden border border-outline-variant/60 opacity-80 hover:opacity-100"
                }
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-md">
          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              {product.category}
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg">{product.name}</h2>
            <div className="flex items-center gap-sm">
              <span className="font-display-lg text-headline-lg text-primary">{naira(product.price)}</span>
              <span className="font-body-md text-body-md text-on-surface-variant">per {product.unit}</span>
            </div>
            <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
              <span
                className="material-symbols-outlined text-[18px] text-tertiary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              {product.rating} ({product.reviews} reviews) • {product.stock}
            </div>
          </div>

          <div className="flex items-center gap-sm p-3 rounded-2xl bg-surface-container-low border border-outline-variant/40">
            <img
              src={product.farmerAvatar}
              alt={product.farmer}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-label-md text-body-md">{product.farmer}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {product.location}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm">
              Verified
            </span>
          </div>

          <div>
            <h3 className="font-headline-md text-headline-md-mobile mb-2">About this produce</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{product.description}</p>
          </div>

          <div className="flex items-center gap-md">
            <span className="font-label-md text-label-md text-on-surface-variant">Quantity</span>
            <div className="flex items-center gap-sm bg-surface-container-low border border-outline-variant rounded-full px-2 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="w-8 text-center font-label-md text-body-md">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
            <span className="font-label-md text-body-md text-primary ml-auto">
              {naira(product.price * quantity)}
            </span>
          </div>

          <div className="hidden md:flex gap-sm">
            <Link
              to="/negotiate/$productId"
              params={{ productId: product.id }}
              className="flex-1 h-14 rounded-2xl border border-primary text-primary font-label-md text-body-lg flex items-center justify-center gap-2 hover:bg-primary-container/10 transition-colors"
            >
              <span className="material-symbols-outlined">handshake</span>
              Negotiate
            </Link>
            <button className="flex-1 h-14 rounded-2xl bg-primary text-on-primary font-label-md text-body-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              <span className="material-symbols-outlined">shopping_basket</span>
              Add to Basket
            </button>
          </div>
        </section>

        <section className="md:col-span-2">
          <h3 className="font-headline-md text-headline-md-mobile mb-sm">More from local farms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
            {related.map((item) => (
              <Link
                key={item.id}
                to="/product/$productId"
                params={{ productId: item.id }}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/40 custom-shadow"
              >
                <img src={item.image} alt={item.name} className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <p className="font-label-md text-body-md line-clamp-1">{item.name}</p>
                  <p className="font-label-sm text-label-sm text-primary">
                    {naira(item.price)}/{item.unit}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full md:hidden bg-surface bottom-nav-shadow px-margin-mobile py-3 pb-safe flex gap-sm z-50">
        <Link
          to="/negotiate/$productId"
          params={{ productId: product.id }}
          className="flex-1 h-14 rounded-2xl border border-primary text-primary font-label-md text-body-md flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">handshake</span>
          Negotiate
        </Link>
        <button className="flex-1 h-14 rounded-2xl bg-primary text-on-primary font-label-md text-body-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <span className="material-symbols-outlined">shopping_basket</span>
          Add
        </button>
      </div>
    </div>
  );
}
