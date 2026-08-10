"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { CheckoutPaymentForm } from "@/components/checkout-payment-form";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

type ShippingAddress = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const emptyAddress: ShippingAddress = {
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export function CheckoutClient({ userEmail }: { userEmail: string }) {
  const items = useCartStore((s) => s.items);
  const subtotal = cartSubtotal(items);

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [discountCode, setDiscountCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [checkoutData, setCheckoutData] = useState<{
    clientSecret: string;
    orderId: string;
    subtotal: number;
    discountAmount: number;
    total: number;
  } | null>(null);

  if (items.length === 0 && !checkoutData) {
    return (
      <div className="mt-16 text-center">
        <p className="text-sm text-taupe">
          Your bag is empty — nothing to check out yet.
        </p>
        <Link
          href="/#collection"
          className="eyebrow mt-6 inline-block border-b border-ivory/40 pb-1 text-xs text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          Enter the collection
        </Link>
      </div>
    );
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        shippingAddress: address,
        discountCode: discountCode || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message ?? "Something went wrong — please try again.");
      setSubmitting(false);
      return;
    }

    setCheckoutData({
      clientSecret: data.clientSecret,
      orderId: data.orderId,
      subtotal: data.subtotal,
      discountAmount: data.discountAmount,
      total: data.total,
    });
    setSubmitting(false);
  }

  const displaySubtotal = checkoutData?.subtotal ?? subtotal;
  const displayDiscount = checkoutData?.discountAmount ?? 0;
  const displayTotal = checkoutData?.total ?? subtotal;

  return (
    <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_380px]">
      <div>
        {!checkoutData ? (
          <form onSubmit={handleContinue} className="flex flex-col gap-8">
            <div>
              <p className="eyebrow text-xs text-taupe">Contact</p>
              <p className="mt-2 text-sm text-ivory">{userEmail}</p>
            </div>

            <div>
              <p className="eyebrow text-xs text-taupe">Shipping address</p>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={address.name}
                  onChange={(v) => setAddress({ ...address, name: v })}
                  className="sm:col-span-2"
                />
                <Field
                  label="Address"
                  value={address.line1}
                  onChange={(v) => setAddress({ ...address, line1: v })}
                  className="sm:col-span-2"
                />
                <Field
                  label="Apartment, suite, etc. (optional)"
                  value={address.line2}
                  onChange={(v) => setAddress({ ...address, line2: v })}
                  required={false}
                  className="sm:col-span-2"
                />
                <Field
                  label="City"
                  value={address.city}
                  onChange={(v) => setAddress({ ...address, city: v })}
                />
                <Field
                  label="State / Province"
                  value={address.state}
                  onChange={(v) => setAddress({ ...address, state: v })}
                />
                <Field
                  label="Postal code"
                  value={address.postalCode}
                  onChange={(v) => setAddress({ ...address, postalCode: v })}
                />
                <Field
                  label="Country"
                  value={address.country}
                  onChange={(v) => setAddress({ ...address, country: v })}
                />
              </div>
            </div>

            <div>
              <p className="eyebrow text-xs text-taupe">Discount code</p>
              <div className="mt-4 max-w-xs">
                <Field
                  label="Code (optional)"
                  value={discountCode}
                  onChange={setDiscountCode}
                  required={false}
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="eyebrow w-full border border-ivory/40 py-4 text-xs text-ivory transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-12"
            >
              {submitting ? "Preparing payment…" : "Continue to payment"}
            </button>
          </form>
        ) : stripePromise ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: checkoutData.clientSecret,
              appearance: {
                theme: "night",
                variables: {
                  colorPrimary: "#c9a96a",
                  colorBackground: "#15201b",
                  colorText: "#ede7db",
                  fontFamily: "var(--font-jost)",
                  borderRadius: "0px",
                },
              },
            }}
          >
            <CheckoutPaymentForm orderId={checkoutData.orderId} />
          </Elements>
        ) : (
          <p className="text-sm text-taupe">
            Payment isn&apos;t connected yet. The atelier is finishing this
            part — please check back shortly.
          </p>
        )}
      </div>

      <div className="border-t border-ivory/10 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
        <p className="eyebrow text-xs text-taupe">Order summary</p>
        <ul className="mt-6 flex flex-col gap-5">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-4">
              <div className="relative h-20 w-14 shrink-0 overflow-hidden bg-surface">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-sm text-ivory">{item.name}</p>
                <p className="mt-1 text-xs text-taupe">
                  {item.color} — {item.size} × {item.quantity}
                </p>
              </div>
              <p className="text-sm text-ivory">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-2 border-t border-ivory/10 pt-6 text-sm">
          <div className="flex items-center justify-between text-taupe">
            <span>Subtotal</span>
            <span className="text-ivory">{formatPrice(displaySubtotal)}</span>
          </div>
          {displayDiscount > 0 && (
            <div className="flex items-center justify-between text-taupe">
              <span>Discount</span>
              <span className="text-gold">−{formatPrice(displayDiscount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-taupe">
            <span>Shipping</span>
            <span className="text-ivory">Free</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-ivory/10 pt-4 text-base">
            <span className="text-ivory">Total</span>
            <span className="text-ivory">{formatPrice(displayTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = true,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow text-[11px] text-taupe">
        {label}
      </label>
      <input
        id={id}
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory focus:border-gold focus:outline-none"
      />
    </div>
  );
}
