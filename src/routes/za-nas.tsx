import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/za-nas")({
  head: () => ({
    meta: [
      { title: "За нас — Преждарница" },
      {
        name: "description",
        content: "Историята на Преждарница — малък български магазин за прежди и ръчно плетени артикули.",
      },
      { property: "og:title", content: "За нас — Преждарница" },
      { property: "og:description", content: "Историята на малкия ни магазин за прежди и ръчно плетени артикули." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-extrabold">За нас</h1>
      <img
        src={hero}
        alt="Кълбета прежда и игли за плетене"
        loading="lazy"
        width={1920}
        height={1088}
        className="mt-6 w-full rounded-[2rem] object-cover"
      />
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">Преждарница</strong> е малък български магазин, роден от любовта към
          плетенето. Започнахме с едно кълбе прежда и една кука — а днес споделяме тази страст с хиляди плетачи от цяла
          България.
        </p>
        <p>
          Подбираме внимателно всяка прежда, която предлагаме. Пипаме я, плетем с нея и чак тогава решаваме дали
          заслужава да стигне до вас. Същото важи и за готовите ни артикули — всеки шал, шапка и играчка е изработен на
          ръка, бримка по бримка.
        </p>
        <p>
          Вярваме, че ръчно направените неща носят топлина, която машината не може да повтори. Благодарим ви, че сте
          част от тази история.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { num: "5000+", label: "доволни клиенти" },
          { num: "120+", label: "вида прежди" },
          { num: "100%", label: "ръчна изработка" },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl bg-card p-6 text-center">
            <div className="font-display text-3xl font-extrabold text-primary">{s.num}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <Link
        to="/katalog"
        className="mt-10 inline-block rounded-full bg-primary px-6 py-3 font-extrabold text-primary-foreground transition-transform hover:scale-105"
      >
        Разгледай каталога
      </Link>
    </div>
  );
}
