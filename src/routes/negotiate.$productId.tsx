import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";

import {
  defaultNegotiation,
  getProduct,
  naira,
  type NegotiationMessage,
} from "@/lib/mock-data";

export const Route = createFileRoute("/negotiate/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product, negotiation: defaultNegotiation(params.productId) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Negotiation unavailable | FarmDirect" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `Negotiate ${product.name} with ${product.farmer} | FarmDirect`;
    const description = `Send offers and counter-offers on ${product.name} (${naira(product.price)}/${product.unit}) directly to ${product.farmer} in ${product.location}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 158) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 158) },
        { property: "og:image", content: product.image },
        { name: "twitter:image", content: product.image },
      ],
    };
  },
  component: NegotiatePage,
  notFoundComponent: NegotiateNotFound,
});

function NegotiateNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-sm px-margin-mobile text-center">
      <h1 className="font-headline-lg text-headline-lg-mobile">Negotiation not found</h1>
      <Link
        to="/browse"
        className="h-12 px-6 flex items-center rounded-full bg-primary text-on-primary font-label-md text-label-md"
      >
        Browse produce
      </Link>
    </div>
  );
}

const clock = () =>
  new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true });

function NegotiatePage() {
  const { product, negotiation } = Route.useLoaderData();

  const [messages, setMessages] = useState<NegotiationMessage[]>(negotiation.messages);
  const [status, setStatus] = useState<string>(negotiation.status);
  const [yourOffer, setYourOffer] = useState<number>(negotiation.buyerOffer);
  const [farmerAsk, setFarmerAsk] = useState<number>(negotiation.farmerAsk);
  const [draft, setDraft] = useState("");
  const [settled, setSettled] = useState<number | null>(null);

  const push = (side: NegotiationMessage["side"], text: string) =>
    setMessages((prev) => [...prev, { id: prev.length + 1, side, text, type: undefined, time: clock() } as NegotiationMessage]);

  const sendOffer = (event: React.FormEvent) => {
    event.preventDefault();
    if (!yourOffer || settled !== null) return;
    push("buyer", `New offer: ${naira(yourOffer)} per ${product.unit}.`);
    setStatus("Offer Sent");

    const counter = Math.max(yourOffer, Math.round((yourOffer + farmerAsk) / 2));
    setTimeout(() => {
      if (yourOffer >= farmerAsk) {
        push("farmer", `Deal! ${naira(yourOffer)} per ${product.unit} works. I'll pack it today.`);
        setStatus("Accepted");
        setSettled(yourOffer);
      } else {
        setFarmerAsk(counter);
        push("farmer", `I can meet you at ${naira(counter)} per ${product.unit}. Final from my side.`);
        setStatus("Counter-Offer Received");
      }
    }, 700);
  };

  const acceptFarmerAsk = () => {
    push("buyer", `Accepted at ${naira(farmerAsk)} per ${product.unit}. Please pack ${product.name}.`);
    setStatus("Accepted");
    setSettled(farmerAsk);
    setYourOffer(farmerAsk);
  };

  const rejectFarmerAsk = () => {
    push("buyer", "That's still above my budget — I'll pass for now.");
    setStatus("Rejected");
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    push("buyer", draft.trim());
    setDraft("");
    setTimeout(() => push("farmer", "Noted — let me confirm with the harvest team and get back to you."), 800);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass-header border-b border-outline-variant/40">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-gutter h-16 flex items-center gap-sm">
          <Link
            to="/product/$productId"
            params={{ productId: product.id }}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <img src={product.farmerAvatar} alt={product.farmer} className="w-10 h-10 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="font-label-md text-body-md truncate">{product.farmer}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{status}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-margin-mobile md:px-gutter py-md flex flex-col gap-md">
        <section className="flex items-center gap-sm p-3 rounded-2xl bg-surface-container-low border border-outline-variant/40">
          <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <p className="font-label-md text-body-md truncate">{product.name}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Listed at {naira(product.price)}/{product.unit} • {product.location}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-sm">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 custom-shadow">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Your offer</p>
            <p className="font-headline-lg text-headline-md text-primary">{naira(yourOffer)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 custom-shadow">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Farmer asks</p>
            <p className="font-headline-lg text-headline-md text-tertiary">{naira(farmerAsk)}</p>
          </div>
        </section>

        {settled !== null ? (
          <div className="p-4 rounded-2xl bg-primary-container text-on-primary-container flex items-center gap-sm">
            <span className="material-symbols-outlined">check_circle</span>
            <p className="font-label-md text-body-md">
              Deal agreed at {naira(settled)} per {product.unit}.
            </p>
          </div>
        ) : (
          <section className="flex flex-col gap-sm">
            <form onSubmit={sendOffer} className="flex flex-col sm:flex-row gap-sm">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant">
                  ₦
                </span>
                <input
                  type="number"
                  min={1}
                  value={yourOffer}
                  onChange={(event) => setYourOffer(Number(event.target.value))}
                  className="w-full h-14 pl-9 pr-4 bg-surface-container-low border border-outline-variant rounded-2xl outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md"
                  aria-label={`Your offer per ${product.unit}`}
                />
              </div>
              <button
                type="submit"
                className="h-14 px-6 rounded-2xl bg-primary text-on-primary font-label-md text-body-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <span className="material-symbols-outlined">send</span>
                Send offer
              </button>
            </form>

            <div className="flex gap-sm">
              <button
                onClick={acceptFarmerAsk}
                className="flex-1 h-12 rounded-2xl bg-primary-container text-on-primary-container font-label-md text-label-md"
              >
                Accept {naira(farmerAsk)}
              </button>
              <button
                onClick={rejectFarmerAsk}
                className="flex-1 h-12 rounded-2xl border border-error text-error font-label-md text-label-md"
              >
                Decline
              </button>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-sm">
          {messages.map((message) => (
            <div
              key={`${message.id}-${message.time}`}
              className={message.side === "buyer" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  message.side === "buyer"
                    ? "chat-bubble-right max-w-[80%] px-4 py-3 bg-primary text-on-primary"
                    : "chat-bubble-left max-w-[80%] px-4 py-3 bg-surface-container-high text-on-surface"
                }
              >
                <p className="font-body-md text-body-md">{message.text}</p>
                <p className="font-label-sm text-label-sm opacity-70 mt-1">{message.time}</p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <form
        onSubmit={sendMessage}
        className="sticky bottom-0 bg-surface bottom-nav-shadow px-margin-mobile md:px-gutter py-3 pb-safe"
      >
        <div className="max-w-3xl mx-auto flex items-center gap-sm">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Message the farmer..."
            className="flex-1 h-12 px-4 bg-surface-container-low border border-outline-variant rounded-full outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md"
          />
          <button
            type="submit"
            className="w-12 h-12 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
