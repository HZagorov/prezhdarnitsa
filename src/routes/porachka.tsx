import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Banknote } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const FREE_SHIPPING_FROM = 80;
const SHIPPING_COST = 6.9;

type CheckoutForm = {
  customerName: string;
  phone: string;
  email: string;
  city: string;
  postalCode: string;
  address: string;
  note: string;
};

type SavedAddress = Tables<"addresses">;

const emptyForm: CheckoutForm = {
  customerName: "",
  phone: "",
  email: "",
  city: "",
  postalCode: "",
  address: "",
  note: "",
};

export const Route = createFileRoute("/porachka")({
  head: () => ({
    meta: [
      { title: "Поръчка — Преждарница" },
      {
        name: "description",
        content: "Въведете данните си за доставка и завършете поръчката в Преждарница.",
      },
      { property: "og:title", content: "Поръчка — Преждарница" },
      {
        property: "og:description",
        content: "Въведете данните си за доставка и завършете поръчката.",
      },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { detailed, total, clear } = useCart();
  const [done, setDone] = useState(false);
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [session, setSession] =
    useState<Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [form, setForm] = useState<CheckoutForm>(emptyForm);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCheckoutUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data.session);
      setForm((current) => ({ ...current, email: data.session?.user.email ?? "" }));

      if (data.session) {
        const { data: addresses, error: addressesError } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", data.session.user.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });

        if (!mounted) return;

        if (addressesError) {
          setError(addressesError.message);
        } else {
          setSavedAddresses(addresses ?? []);

          const defaultAddress = addresses?.[0];
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            setForm((current) => ({
              ...current,
              customerName: defaultAddress.recipient_name,
              phone: defaultAddress.phone,
              city: defaultAddress.city,
              postalCode: defaultAddress.postal_code,
              address: defaultAddress.address_line,
            }));
          }
        }
      }

      setAuthLoading(false);
    };

    void loadCheckoutUser();

    return () => {
      mounted = false;
    };
  }, []);

  const shipping = total >= FREE_SHIPPING_FROM || total === 0 ? 0 : SHIPPING_COST;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session) {
      setError("Моля, влезте в профила си, за да завършите поръчката.");
      return;
    }

    setSubmitting(true);
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: session.user.id,
        payment_method: payment,
        customer_name: form.customerName.trim(),
        customer_email: session.user.email ?? form.email.trim(),
        customer_phone: form.phone.trim(),
        shipping_city: form.city.trim(),
        shipping_postal_code: form.postalCode.trim(),
        shipping_address: form.address.trim(),
        customer_note: form.note.trim() || null,
        subtotal: total,
        shipping_cost: shipping,
        total: total + shipping,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setSubmitting(false);
      setError(orderError?.message ?? "Поръчката не можа да бъде създадена.");
      return;
    }

    const { error: itemError } = await supabase.from("order_item").insert(
      detailed.map(({ product, qty }) => ({
        order_id: order.id,
        product_id: product.familyKey ?? product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: qty,
      })),
    );

    setSubmitting(false);

    if (itemError) {
      setError(itemError.message);
      return;
    }

    setDone(true);
    clear();
    window.scrollTo({ top: 0 });
  };

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);

    const selectedAddress = savedAddresses.find((address) => address.id === addressId);
    if (!selectedAddress) {
      setForm((current) => ({
        ...current,
        customerName: "",
        phone: "",
        city: "",
        postalCode: "",
        address: "",
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      customerName: selectedAddress.recipient_name,
      phone: selectedAddress.phone,
      city: selectedAddress.city,
      postalCode: selectedAddress.postal_code,
      address: selectedAddress.address_line,
    }));
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-extrabold">Благодарим за поръчката! 🧶</h1>
        <p className="mt-3 text-muted-foreground">
          Получихме я и ще се свържем с вас по телефона за потвърждение. Очаквайте пратката си до
          1–2 работни дни.
        </p>
        <Link
          to="/katalog"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-extrabold text-primary-foreground transition-transform hover:scale-105"
        >
          Обратно в каталога
        </Link>
      </div>
    );
  }

  if (detailed.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold">Количката е празна</h1>
        <p className="mt-2 text-muted-foreground">Добавете продукти, преди да завършите поръчка.</p>
        <Link
          to="/katalog"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-extrabold text-primary-foreground"
        >
          Към каталога
        </Link>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center text-muted-foreground">
        Зареждане…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold">Влезте, за да поръчате</h1>
        <p className="mt-2 text-muted-foreground">
          Вашата количка ще бъде запазена, докато влизате в профила си.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/vhod">Към входа</Link>
        </Button>
      </div>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold">Завършване на поръчката</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-extrabold">Данни за доставка</h2>
            {savedAddresses.length > 0 && (
              <label className="mt-4 block text-sm font-bold">
                Избери запазен адрес
                <select
                  value={selectedAddressId}
                  onChange={(event) => handleAddressSelection(event.target.value)}
                  className={inputClass}
                >
                  <option value="">Въведи нов адрес</option>
                  {savedAddresses.map((savedAddress) => (
                    <option key={savedAddress.id} value={savedAddress.id}>
                      {savedAddress.recipient_name} — {savedAddress.address_line},{" "}
                      {savedAddress.city}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold">
                Име и фамилия
                <input
                  required
                  className={inputClass}
                  value={form.customerName}
                  onChange={(event) => updateField("customerName", event.target.value)}
                />
              </label>
              <label className="text-sm font-bold">
                Телефон
                <input
                  required
                  type="tel"
                  className={inputClass}
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                />
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Имейл
                <input required type="email" className={inputClass} value={form.email} readOnly />
              </label>
              <label className="text-sm font-bold">
                Град
                <input
                  required
                  className={inputClass}
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                />
              </label>
              <label className="text-sm font-bold">
                Пощенски код
                <input
                  required
                  className={inputClass}
                  value={form.postalCode}
                  onChange={(event) => updateField("postalCode", event.target.value)}
                />
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Адрес или офис на куриер
                <input
                  required
                  className={inputClass}
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                />
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Бележка към поръчката (по желание)
                <textarea
                  placeholder="Например: подарък, моля опаковайте празнично 🎁"
                  rows={3}
                  className={inputClass}
                  value={form.note}
                  onChange={(event) => updateField("note", event.target.value)}
                />
              </label>
            </div>
          </section>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-extrabold">Начин на плащане</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPayment("cod")}
                className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                  payment === "cod" ? "border-primary bg-muted" : "border-border"
                }`}
              >
                <Banknote className="h-6 w-6 text-primary" />
                <span>
                  <span className="block font-extrabold">Наложен платеж</span>
                  <span className="block text-xs text-muted-foreground">
                    Плащате при получаване
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPayment("card")}
                className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                  payment === "card" ? "border-primary bg-muted" : "border-border"
                }`}
              >
                <CreditCard className="h-6 w-6 text-primary" />
                <span>
                  <span className="block font-extrabold">Плащане с карта</span>
                  <span className="block text-xs text-muted-foreground">
                    Сигурно онлайн плащане
                  </span>
                </span>
              </button>
            </div>
            {payment === "card" && (
              <p className="mt-3 rounded-xl bg-sunshine px-3 py-2 text-xs font-bold text-sunshine-foreground">
                Плащането с карта все още се настройва. Поръчката ще бъде приета и ще се свържем с
                вас за плащането.
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-extrabold">Вашата поръчка</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {detailed.map(({ product, qty }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {product.name} × {qty}
                </span>
                <span className="font-bold whitespace-nowrap">
                  {formatPrice(product.price * qty)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Доставка</dt>
              <dd className="font-bold">{shipping === 0 ? "Безплатна" : formatPrice(shipping)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="font-display text-lg font-extrabold">Общо</span>
            <span className="font-display text-lg font-extrabold text-primary">
              {formatPrice(total + shipping)}
            </span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-full bg-primary px-6 py-3 font-extrabold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
          >
            {submitting ? "Изпращане…" : "Потвърди поръчката"}
          </button>
        </aside>
      </form>
    </div>
  );
}
