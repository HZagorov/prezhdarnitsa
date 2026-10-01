import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, CreditCard, Banknote } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";

const FREE_SHIPPING_FROM = 80;
const SHIPPING_COST = 6.9;

export const Route = createFileRoute("/porachka")({
  head: () => ({
    meta: [
      { title: "Поръчка — Преждарница" },
      { name: "description", content: "Въведете данните си за доставка и завършете поръчката в Преждарница." },
      { property: "og:title", content: "Поръчка — Преждарница" },
      { property: "og:description", content: "Въведете данните си за доставка и завършете поръчката." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { detailed, total, clear } = useCart();
  const [done, setDone] = useState(false);
  const [payment, setPayment] = useState<"cod" | "card">("cod");

  const shipping = total >= FREE_SHIPPING_FROM || total === 0 ? 0 : SHIPPING_COST;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    clear();
    window.scrollTo({ top: 0 });
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-extrabold">Благодарим за поръчката! 🧶</h1>
        <p className="mt-3 text-muted-foreground">
          Получихме я и ще се свържем с вас по телефона за потвърждение. Очаквайте пратката си до 1–2 работни дни.
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

  const inputClass =
    "mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold">Завършване на поръчката</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-extrabold">Данни за доставка</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold">
                Име и фамилия
                <input required className={inputClass} placeholder="Мария Иванова" />
              </label>
              <label className="text-sm font-bold">
                Телефон
                <input required type="tel" className={inputClass} placeholder="0888 123 456" />
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Имейл
                <input required type="email" className={inputClass} placeholder="maria@email.bg" />
              </label>
              <label className="text-sm font-bold">
                Град
                <input required className={inputClass} placeholder="София" />
              </label>
              <label className="text-sm font-bold">
                Пощенски код
                <input required className={inputClass} placeholder="1000" />
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Адрес или офис на куриер
                <input required className={inputClass} placeholder="ул. Плетачка 12 или Еконт офис Център" />
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Бележка към поръчката (по желание)
                <textarea rows={3} className={inputClass} placeholder="Например: подарък, моля опаковайте празнично 🎁" />
              </label>
            </div>
          </section>

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
                  <span className="block text-xs text-muted-foreground">Плащате при получаване</span>
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
                  <span className="block text-xs text-muted-foreground">Сигурно онлайн плащане</span>
                </span>
              </button>
            </div>
            {payment === "card" && (
              <p className="mt-3 rounded-xl bg-sunshine px-3 py-2 text-xs font-bold text-sunshine-foreground">
                Плащането с карта все още се настройва. Поръчката ще бъде приета и ще се свържем с вас за плащането.
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
                <span className="font-bold whitespace-nowrap">{formatPrice(product.price * qty)}</span>
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
            <span className="font-display text-lg font-extrabold text-primary">{formatPrice(total + shipping)}</span>
          </div>
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-primary px-6 py-3 font-extrabold text-primary-foreground transition-transform hover:scale-105"
          >
            Потвърди поръчката
          </button>
        </aside>
      </form>
    </div>
  );
}
