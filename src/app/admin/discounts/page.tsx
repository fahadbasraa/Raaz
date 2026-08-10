import { prisma } from "@/lib/prisma";
import { createDiscountCode, toggleDiscountCode } from "@/app/actions/admin-discounts";

export default async function AdminDiscountsPage() {
  const codes = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-light">Discount codes</h1>

      <table className="mt-10 w-full max-w-2xl border-collapse text-left text-sm">
        <thead>
          <tr className="eyebrow border-b border-ivory/10 text-[11px] text-taupe">
            <th className="py-3 font-normal">Code</th>
            <th className="py-3 font-normal">Off</th>
            <th className="py-3 font-normal">Expires</th>
            <th className="py-3 font-normal">Status</th>
            <th className="py-3 font-normal" />
          </tr>
        </thead>
        <tbody>
          {codes.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-taupe">
                No codes yet.
              </td>
            </tr>
          )}
          {codes.map((c) => (
            <tr key={c.id} className="border-b border-ivory/10">
              <td className="py-3 text-ivory">{c.code}</td>
              <td className="py-3 text-taupe">{c.percentOff}%</td>
              <td className="py-3 text-taupe">
                {c.expiresAt
                  ? new Date(c.expiresAt).toLocaleDateString("en-US")
                  : "Never"}
              </td>
              <td className="py-3">
                <span
                  className={`eyebrow text-[10px] ${c.active ? "text-gold" : "text-taupe"}`}
                >
                  {c.active ? "Active" : "Disabled"}
                </span>
              </td>
              <td className="py-3 text-right">
                <form action={toggleDiscountCode}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="active" value={String(c.active)} />
                  <button type="submit" className="text-xs text-taupe hover:text-gold">
                    {c.active ? "Disable" : "Enable"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        action={createDiscountCode}
        className="mt-10 flex max-w-2xl flex-wrap items-end gap-4"
      >
        <div>
          <label htmlFor="code" className="eyebrow text-[11px] text-taupe">
            Code
          </label>
          <input
            id="code"
            name="code"
            required
            placeholder="QUIETLY10"
            className="mt-2 w-40 border-b border-ivory/30 bg-transparent py-1.5 text-sm text-ivory focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="percentOff" className="eyebrow text-[11px] text-taupe">
            Percent off
          </label>
          <input
            id="percentOff"
            name="percentOff"
            type="number"
            min="1"
            max="90"
            required
            className="mt-2 w-24 border-b border-ivory/30 bg-transparent py-1.5 text-sm text-ivory focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="expiresAt" className="eyebrow text-[11px] text-taupe">
            Expires (optional)
          </label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="date"
            className="mt-2 border-b border-ivory/30 bg-transparent py-1.5 text-sm text-ivory focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="eyebrow border border-ivory/40 px-5 py-2.5 text-xs hover:border-gold hover:text-gold"
        >
          Create code
        </button>
      </form>
    </div>
  );
}
