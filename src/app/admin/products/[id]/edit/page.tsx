import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import {
  updateProduct,
  addVariant,
  updateVariant,
  deleteVariant,
} from "@/app/actions/admin-products";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: { orderBy: [{ color: "asc" }, { size: "asc" }] } },
  });
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-light">{product.name}</h1>

      {error && (
        <p role="alert" className="mt-6 text-sm text-red-400">
          {error}
        </p>
      )}

      <section className="mt-10 max-w-xl">
        <p className="eyebrow text-xs text-taupe">Product details</p>
        <form action={updateProduct} className="mt-4 flex flex-col gap-6">
          <input type="hidden" name="id" value={product.id} />

          <TextField label="Name" name="name" defaultValue={product.name} required />
          <TextField label="Slug" name="slug" defaultValue={product.slug} required />
          <TextField
            label="Category"
            name="categoryName"
            defaultValue={product.category.name}
            required
          />
          <div>
            <label className="eyebrow text-[11px] text-taupe">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={product.description}
              className="mt-2 w-full border border-ivory/20 bg-transparent p-3 text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <TextField
            label="Base price (USD)"
            name="basePrice"
            type="number"
            step="0.01"
            defaultValue={(product.basePrice / 100).toFixed(2)}
            required
          />
          <div>
            <label className="eyebrow text-[11px] text-taupe">
              Image URLs (one per line)
            </label>
            <textarea
              name="images"
              required
              rows={3}
              defaultValue={product.images.join("\n")}
              className="mt-2 w-full border border-ivory/20 bg-transparent p-3 text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-ivory">
            <input
              type="checkbox"
              name="published"
              defaultChecked={product.published}
              className="h-4 w-4"
            />
            Published
          </label>

          <button
            type="submit"
            className="eyebrow mt-2 w-fit border border-ivory/40 px-8 py-3 text-xs hover:border-gold hover:text-gold"
          >
            Save changes
          </button>
        </form>
      </section>

      <section className="mt-16">
        <p className="eyebrow text-xs text-taupe">Variants</p>

        <table className="mt-4 w-full max-w-3xl border-collapse text-left text-sm">
          <thead>
            <tr className="eyebrow border-b border-ivory/10 text-[11px] text-taupe">
              <th className="py-3 font-normal">Color</th>
              <th className="py-3 font-normal">Size</th>
              <th className="py-3 font-normal">SKU</th>
              <th className="py-3 font-normal">Price</th>
              <th className="py-3 font-normal">Stock</th>
              <th className="py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {product.variants.map((variant) => (
              <tr key={variant.id} className="border-b border-ivory/10">
                <td className="py-3 text-ivory">{variant.color}</td>
                <td className="py-3 text-ivory">{variant.size}</td>
                <td className="py-3 text-taupe">{variant.sku}</td>
                <td className="py-3">
                  <form
                    action={updateVariant}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="id" value={variant.id} />
                    <input type="hidden" name="productId" value={product.id} />
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      defaultValue={(variant.price / 100).toFixed(2)}
                      className="w-20 border-b border-ivory/30 bg-transparent py-1 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                    <input
                      type="number"
                      name="stock"
                      defaultValue={variant.stock}
                      className="w-16 border-b border-ivory/30 bg-transparent py-1 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="text-xs text-taupe hover:text-gold"
                    >
                      Save
                    </button>
                  </form>
                </td>
                <td />
                <td className="py-3 text-right">
                  <form action={deleteVariant}>
                    <input type="hidden" name="id" value={variant.id} />
                    <input type="hidden" name="productId" value={product.id} />
                    <button type="submit" className="text-xs text-taupe hover:text-red-400">
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <form
          action={addVariant}
          className="mt-8 flex max-w-3xl flex-wrap items-end gap-4"
        >
          <input type="hidden" name="productId" value={product.id} />
          <MiniField label="Color" name="color" />
          <MiniField label="Size" name="size" />
          <MiniField label="SKU" name="sku" />
          <MiniField label="Price (USD)" name="price" type="number" step="0.01" />
          <MiniField label="Stock" name="stock" type="number" />
          <button
            type="submit"
            className="eyebrow border border-ivory/40 px-5 py-2.5 text-xs hover:border-gold hover:text-gold"
          >
            Add variant
          </button>
        </form>
      </section>

      <p className="mt-10 text-xs text-taupe">
        Base price shown to shoppers: {formatPrice(product.basePrice)}
      </p>
    </div>
  );
}

function TextField({
  label,
  name,
  type = "text",
  required = false,
  step,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  step?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="mt-2 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory focus:border-gold focus:outline-none"
      />
    </div>
  );
}

function MiniField({
  label,
  name,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={`new-${name}`} className="eyebrow text-[11px] text-taupe">
        {label}
      </label>
      <input
        id={`new-${name}`}
        name={name}
        type={type}
        step={step}
        required
        className="mt-2 w-24 border-b border-ivory/30 bg-transparent py-1.5 text-sm text-ivory focus:border-gold focus:outline-none"
      />
    </div>
  );
}
