import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, HeartHandshake, Sparkles, ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Преждарница — прежди и ръчно плетени артикули" },
      {
        name: "description",
        content:
          "Прежди, макраме, аксесоари за плетене и ръчно плетени артикули с доставка в цяла България. Всичко за вашите креативни проекти!",
      },
      { property: "og:title", content: "Преждарница — прежди и ръчно плетени артикули" },
      {
        property: "og:description",
        content: "Всичко за вашите креативни проекти — прежди, макраме, аксесоари и готови ръчно плетени артикули.",
      },
    ],
  }),
  component: HomePage,
});

const CATEGORY_COLORS: Record<string, string> = {
  prezhdi: "bg-secondary",
  makrame: "bg-skyblue",
  gotovi: "bg-berry",
  aksesoari: "bg-sunshine",
};

function HomePage() {
  const featured = PRODUCTS.filter((p) => p.badge).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-extrabold text-secondary-foreground">
              <Sparkles className="h-4 w-4" /> Добре дошли в Преждарница
            </span>
            <h1 className="mt-4 font-display text-4xl leading-tight font-extrabold text-foreground md:text-5xl">
              Прежди и ръчно плетени артикули, <span className="text-primary">направени с любов</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Тук ще намерите всичко за вашите креативни проекти — от мека памучна прежда до готови плетени съкровища.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/katalog"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-extrabold text-primary-foreground transition-transform hover:scale-105"
              >
                Пазарувай <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/katalog"
                search={{ kategoriq: "gotovi" }}
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-extrabold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Готови артикули
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={hero}
              alt="Цветни кълбета прежда с игли за плетене"
              width={1920}
              height={1088}
              className="w-full rounded-[2.5rem] border-4 border-card object-cover shadow-xl"
            />
            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-sunshine px-4 py-2 font-display text-sm font-extrabold text-sunshine-foreground shadow-md rotate-[-3deg]">
              Доставка в цяла България 🇧🇬
            </div>
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-display text-3xl font-extrabold text-foreground">Разгледай по категория</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/katalog"
              search={{ kategoriq: cat.id }}
              className={`rounded-3xl p-6 transition-transform hover:-translate-y-1 hover:shadow-lg ${CATEGORY_COLORS[cat.id]}`}
            >
              <h3 className="font-display text-xl font-extrabold text-foreground">{cat.name}</h3>
              <p className="mt-2 text-sm text-foreground/70">{cat.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-foreground">
                Разгледай <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Популярни */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-extrabold text-foreground">Най-любими 🧡</h2>
          <Link to="/katalog" className="text-sm font-extrabold text-primary hover:underline">
            Виж всички →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Предимства */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 rounded-[2.5rem] bg-card p-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-skyblue">
              <Truck className="h-7 w-7 text-skyblue-foreground" />
            </span>
            <h3 className="mt-3 font-display text-lg font-extrabold">Бърза доставка</h3>
            <p className="mt-1 text-sm text-muted-foreground">С Еконт и Спиди до цяла България за 1–2 дни.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-berry">
              <HeartHandshake className="h-7 w-7 text-berry-foreground" />
            </span>
            <h3 className="mt-3 font-display text-lg font-extrabold">Ръчна изработка</h3>
            <p className="mt-1 text-sm text-muted-foreground">Всеки готов артикул е плетен на ръка с внимание към детайла.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sunshine">
              <Sparkles className="h-7 w-7 text-sunshine-foreground" />
            </span>
            <h3 className="mt-3 font-display text-lg font-extrabold">Качествени материали</h3>
            <p className="mt-1 text-sm text-muted-foreground">Подбираме само прежди, които с удоволствие бихме използвали сами.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
