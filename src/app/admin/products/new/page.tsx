import { createProduct } from "@/app/actions/admin-products";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="font-display text-3xl font-light">New product</h1>

      {error && (
        <p role="alert" className="mt-6 text-sm text-red-400">
          {error}
        </p>
      )}

      <form action={createProduct} className="mt-10 flex max-w-xl flex-col gap-6">
        <TextField label="Name" name="name" required />
        <TextField label="Slug (optional — derived from name)" name="slug" />
        <TextField label="Category" name="categoryName" required />
        <div>
          <label className="eyebrow text-[11px] text-taupe">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            className="mt-2 w-full border border-ivory/20 bg-transparent p-3 text-sm text-ivory focus:border-gold focus:outline-none"
          />
        </div>
        <TextField label="Base price (USD)" name="basePrice" type="number" step="0.01" required />
        <div>
          <label className="eyebrow text-[11px] text-taupe">
            Image URLs (one per line)
          </label>
          <textarea
            name="images"
            required
            rows={3}
            placeholder="https://..."
            className="mt-2 w-full border border-ivory/20 bg-transparent p-3 text-sm text-ivory focus:border-gold focus:outline-none"
          />
        </div>
        <label className="flex items-center gap-3 text-sm text-ivory">
          <input type="checkbox" name="published" className="h-4 w-4" />
          Published
        </label>

        <button
          type="submit"
          className="eyebrow mt-2 w-fit border border-ivory/40 px-8 py-3 text-xs hover:border-gold hover:text-gold"
        >
          Create product
        </button>
      </form>
    </div>
  );
}

function TextField({
  label,
  name,
  type = "text",
  required = false,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow text-[11px] text-taupe">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        required={required}
        className="mt-2 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory focus:border-gold focus:outline-none"
      />
    </div>
  );
}
