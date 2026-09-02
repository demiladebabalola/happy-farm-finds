import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { acceptOffer, fetchNegotiation, sendChatMessage, sendOffer } from "@/lib/api";
import { getProduct, naira } from "@/lib/mock-data";

export const Route = createFileRoute("/negotiate/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
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
  const { product } = Route.useLoaderData();
  const { productId } = Route.useParams();
  const queryClient = useQueryClient();

  const { data: negotiation, isLoading, error } = useQuery({
    queryKey: ["negotiation", productId],
    queryFn: () => fetchNegotiation(productId),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const [yourOffer, setYourOffer] = useState<number>(product.price);
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<NegotiationMessage[]>([]);

  useEffect(() => {
    if (negotiation) {
      setYourOffer(negotiation.buyerOffer);
    }
  }, [negotiation?.buyerOffer]);

  const settled = useMemo(() => {
    if (negotiation?.status === "Accepted") {
      return negotiation.settledPrice ?? negotiation.farmerAsk;
    }
    return null;
  }, [negotiation]);

  const allMessages = useMemo(
    () => [...(negotiation?.messages ?? []), ...localMessages],
    [negotiation?.messages, localMessages]
  );

  const offerMutation = useMutation({
    mutationFn: async (offer: number) => {
      if (!negotiation) throw new Error("Negotiation not loaded");
      return sendOffer(negotiation.id, offer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["negotiation", productId] });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!negotiation) throw new Error("Negotiation not loaded");
      return acceptOffer(negotiation.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["negotiation", productId] });
    },
  });

  const sendOfferForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (!yourOffer || settled !== null || offerMutation.isPending || !negotiation) return;
    offerMutation.mutate(yourOffer);
  };

  const acceptFarmerAsk = () => {
    if (settled !== null || acceptMutation.isPending || !negotiation) return;
    acceptMutation.mutate();
  };

  const rejectFarmerAsk = () => {
    setLocalMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        side: "buyer",
        text: "That's still above my budget — I'll pass for now.",
        time: clock(),
      },
    ]);
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setLocalMessages((prev) => [
      ...prev,
      { id: Date.now(), side: "buyer", text: draft.trim(), time: clock() },
    ]);
    setDraft("");
    setTimeout(() => {
      setLocalMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          side: "farmer",
          text: "Noted — let me confirm with the harvest team and get back to you.",
          time: clock(),
        },
      ]);
    }, 800);
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
            <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
              {isLoading ? "Loading..." : negotiation?.status ?? "Unavailable"}
            </p>
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

        {error && (
          <div className="p-4 rounded-2xl bg-error-container text-on-error-container flex items-center gap-sm">
            <span className="material-symbols-outlined">error</span>
            <p className="font-body-md text-body-md">
              {error instanceof Error ? error.message : "Failed to load negotiation"}
            </p>
          </div>
        )}

        <section className="grid grid-cols-2 gap-sm">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 custom-shadow">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Your offer</p>
            <p className="font-headline-lg text-headline-md text-primary">{naira(yourOffer)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 custom-shadow">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Farmer asks</p>
            <p className="font-headline-lg text-headline-md text-tertiary">
              {naira(negotiation?.farmerAsk ?? product.price)}
            </p>
          </div>
        </section>

        {settled !== null ? (
          <div className="p-4 rounded-2xl bg-primary-container text-on-primary-container flex items-center gap-sm">
            <span className="material-symbols-outlined">check_circle</span>
            <p className="font-label-md text-body-md">
              Deal agreed at {naira(settled)} per {product.unit}.
            </p>
          </div>
        ) : isLoading ? (
          <div className="p-4 rounded-2xl bg-surface-container-low text-on-surface-variant font-body-md text-body-md">
            Loading negotiation...
          </div>
        ) : (
          <section className="flex flex-col gap-sm">
            <form onSubmit={sendOfferForm} className="flex flex-col sm:flex-row gap-sm">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant">
                  ₦
                </span>
                <input
                  type="number"
                  min={1}
                  value={yourOffer}
                  onChange={(event) => setYourOffer(Number(event.target.value))}
                  disabled={offerMutation.isPending}
                  className="w-full h-14 pl-9 pr-4 bg-surface-container-low border border-outline-variant rounded-2xl outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md disabled:opacity-60"
                  aria-label={`Your offer per ${product.unit}`}
                />
              </div>
              <button
                type="submit"
                disabled={offerMutation.isPending}
                className="h-14 px-6 rounded-2xl bg-primary text-on-primary font-label-md text-body-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                <span className="material-symbols-outlined">send</span>
                Send offer
              </button>
            </form>

            <div className="flex gap-sm">
              <button
                onClick={acceptFarmerAsk}
                disabled={acceptMutation.isPending || !negotiation}
                className="flex-1 h-12 rounded-2xl bg-primary-container text-on-primary-container font-label-md text-label-md disabled:opacity-60"
              >
                Accept {naira(negotiation?.farmerAsk ?? product.price)}
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
          {allMessages.map((message) => (
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
