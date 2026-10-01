import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/kontakti")({
  head: () => ({
    meta: [
      { title: "Контакти — Преждарница" },
      { name: "description", content: "Свържете се с Преждарница — телефон, имейл и форма за запитване." },
      { property: "og:title", content: "Контакти — Преждарница" },
      { property: "og:description", content: "Свържете се с нас по телефон, имейл или чрез формата за запитване." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const inputClass =
    "mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-extrabold">Контакти</h1>
      <p className="mt-2 text-muted-foreground">Имате въпрос за прежда или поръчка? Пишете ни — отговаряме бързо.</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: Phone, label: "Телефон", value: "0888 123 456" },
            { icon: Mail, label: "Имейл", value: "zdrasti@prezhdarnitsa.bg" },
            { icon: MapPin, label: "Адрес", value: "гр. София, ул. Плетачка 12" },
            { icon: Clock, label: "Работно време", value: "Пон–Пет: 10:00–18:00, Съб: 10:00–14:00" },
          ].map((item) => (
            <div key={item.label} className="flex gap-4 rounded-3xl border border-border bg-card p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary">
                <item.icon className="h-5 w-5 text-secondary-foreground" />
              </span>
              <div>
                <div className="font-display font-extrabold">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-3 font-display text-xl font-extrabold">Съобщението е изпратено!</h2>
              <p className="mt-2 text-sm text-muted-foreground">Ще ви отговорим в рамките на един работен ден.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <h2 className="font-display text-xl font-extrabold">Напишете ни</h2>
              <label className="mt-4 block text-sm font-bold">
                Вашето име
                <input required className={inputClass} placeholder="Мария Иванова" />
              </label>
              <label className="mt-4 block text-sm font-bold">
                Имейл
                <input required type="email" className={inputClass} placeholder="maria@email.bg" />
              </label>
              <label className="mt-4 block text-sm font-bold">
                Съобщение
                <textarea required rows={5} className={inputClass} placeholder="Здравейте, имам въпрос за..." />
              </label>
              <button
                type="submit"
                className="mt-5 w-full rounded-full bg-primary px-6 py-3 font-extrabold text-primary-foreground transition-transform hover:scale-105"
              >
                Изпрати
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
