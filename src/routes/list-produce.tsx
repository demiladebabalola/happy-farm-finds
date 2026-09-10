import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { createProduct } from "@/lib/api";

export const Route = createFileRoute("/list-produce")({
  head: () => ({
    meta: [
      { title: "List New Produce | FarmDirect for Farmers" },
      {
        name: "description",
        content:
          "Create a new product listing on FarmDirect: name your produce, set a price in naira and reach buyers directly.",
      },
      { property: "og:title", content: "List New Produce | FarmDirect" },
      {
        property: "og:description",
        content: "Add your fresh harvest to FarmDirect and start receiving buyer offers.",
      },
    ],
  }),
  component: ListProducePage,
});

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Tubers",
  "Pantry",
  "Honey & Jams",
  "Protein",
];

function ListProducePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<string>("Vegetables");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError(null);
    try {
      const description = String(form.get("description") ?? "");
      const image = String(form.get("image") ?? "");
      const result = await createProduct({
        name: String(form.get("name") ?? ""),
        category,
        price: Number(form.get("price") ?? 0),
        unit: String(form.get("unit") ?? ""),
        location: String(form.get("location") ?? ""),
        stock: String(form.get("stock") ?? ""),
        ...(description ? { description } : {}),
        ...(image ? { image } : {}),
      });
      console.log("createProduct response:", result);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["farmerDashboard"] });
      setSuccess("Listing created! Taking you to your dashboard...");
      setTimeout(() => {
        navigate({ to: "/dashboard/farmer" });
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full h-12 px-4 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg transition-all font-body-md text-body-md placeholder:text-outline-variant outline-none";

  const fieldGroup = "flex flex-col gap-xs";

  const labelClass = "font-label-md text-label-md text-on-surface ml-1";

  const icon = "material-symbols-outlined absolute left-3 text-outline text-[20px]";

  if (success) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center px-margin-mobile">
        <div className="max-w-md text-center flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
          <p className="font-headline-md text-headline-md-mobile text-primary">Listing created!</p>
          <p className="font-body-md text-body-md text-on-surface-variant">{success}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen pb-xl">
      <header className="sticky top-0 z-40 glass-header border-b border-outline-variant/40">
        <div className="max-w-2xl mx-auto px-margin-mobile md:px-gutter h-16 flex items-center gap-sm">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors shrink-0"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Farmer dashboard</p>
            <p className="font-label-md text-body-md">List new produce</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-margin-mobile md:px-gutter py-md">
        <form
          className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 custom-shadow p-md flex flex-col gap-sm"
          onSubmit={handleSubmit}
        >
          <div className={fieldGroup}>
            <label className={labelClass} htmlFor="name">
              Product name
            </label>
            <div className="relative flex items-center">
              <span className={icon}>shopping_basket</span>
              <input
                className={field.replace("px-4", "pl-10 pr-4")}
                id="name"
                name="name"
                placeholder="e.g. Fresh Ugu Leaves"
                type="text"
                required
              />
            </div>
          </div>

          <div className={fieldGroup}>
            <label className={labelClass} htmlFor="category">
              Category
            </label>
            <div className="relative flex items-center">
              <span className={icon}>category</span>
              <select
                className="w-full h-12 pl-10 pr-10 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg appearance-none transition-all font-body-md text-body-md outline-none"
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 text-outline pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className={fieldGroup}>
              <label className={labelClass} htmlFor="price">
                Price (₦)
              </label>
              <div className="relative flex items-center">
                <span className={icon}>payments</span>
                <input
                  className={field.replace("px-4", "pl-10 pr-4")}
                  id="price"
                  name="price"
                  min="0"
                  step="any"
                  placeholder="1500"
                  type="number"
                  required
                />
              </div>
            </div>

            <div className={fieldGroup}>
              <label className={labelClass} htmlFor="unit">
                Unit
              </label>
              <input
                className={field}
                id="unit"
                name="unit"
                placeholder='e.g. "kg", "bundle"'
                type="text"
                required
              />
            </div>
          </div>

          <div className={fieldGroup}>
            <label className={labelClass} htmlFor="location">
              Location
            </label>
            <div className="relative flex items-center">
              <span className={icon}>location_on</span>
              <input
                className={field.replace("px-4", "pl-10 pr-4")}
                id="location"
                name="location"
                placeholder="e.g. Kuje, Abuja"
                type="text"
                required
              />
            </div>
          </div>

          <div className={fieldGroup}>
            <label className={labelClass} htmlFor="stock">
              Stock
            </label>
            <div className="relative flex items-center">
              <span className={icon}>inventory_2</span>
              <input
                className={field.replace("px-4", "pl-10 pr-4")}
                id="stock"
                name="stock"
                placeholder='e.g. "40 kg available"'
                type="text"
                required
              />
            </div>
          </div>

          <div className={fieldGroup}>
            <label className={labelClass} htmlFor="description">
              Description
            </label>
            <textarea
              className="w-full min-h-24 p-4 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg transition-all font-body-md text-body-md placeholder:text-outline-variant outline-none resize-y"
              id="description"
              name="description"
              placeholder="Describe your produce — freshness, harvest date, packaging..."
            />
          </div>

          <div className={fieldGroup}>
            <label className={labelClass} htmlFor="image">
              Image URL <span className="text-on-surface-variant">(optional)</span>
            </label>
            <div className="relative flex items-center">
              <span className={icon}>image</span>
              <input
                className={field.replace("px-4", "pl-10 pr-4")}
                id="image"
                name="image"
                placeholder="https://example.com/photo.jpg"
                type="url"
              />
            </div>
          </div>

          {error ? (
            <p className="font-label-md text-label-md text-error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            className="mt-sm w-full h-14 bg-primary text-on-primary font-label-md text-body-lg rounded-full shadow-sm hover:bg-primary-container active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            <span className="material-symbols-outlined">add</span>
            {loading ? "Creating listing..." : "Create listing"}
          </button>

          <p className="font-label-sm text-label-sm text-on-surface-variant text-center">
            Your listing will be reviewed before it appears to buyers.
          </p>
        </form>
      </main>
    </div>
  );
}
