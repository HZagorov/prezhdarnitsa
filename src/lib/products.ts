import pamuchnaRozova from "@/assets/products/pamuchna-rozova.jpg";
import plushenaSinya from "@/assets/products/plushena-sinya.jpg";
import zaeche from "@/assets/products/zaeche.jpg";
import makrameLavandula from "@/assets/products/makrame-lavandula.jpg";
import shal from "@/assets/products/shal.jpg";
import chanta from "@/assets/products/chanta.jpg";
import kuki from "@/assets/products/kuki.jpg";
import bebeMenta from "@/assets/products/bebe-menta.jpg";
import gazzalBabyCotton from "@/assets/products/gazzal-baby-cotton.jpg";
import shapka from "@/assets/products/shapka.jpg";
import tekstilnaKoral from "@/assets/products/tekstilna-koral.jpg";
import drazhki from "@/assets/products/drazhki.jpg";

export type Category = "prezhdi" | "makrame" | "gotovi" | "aksesoari";

export const CATEGORIES: { id: Category; name: string; description: string }[] = [
  { id: "prezhdi", name: "Прежди", description: "Памучна, плюшена, бебешка и текстилна прежда" },
  { id: "makrame", name: "Макраме", description: "Памучно и полиестерово макраме в красиви цветове" },
  { id: "gotovi", name: "Готови артикули", description: "Ръчно плетени шалове, шапки, чанти и играчки" },
  { id: "aksesoari", name: "Аксесоари", description: "Куки, дръжки, основи и всичко за вашите проекти" },
];

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number; // в лева
  oldPrice?: number;
  image: string;
  description: string;
  details: string[];
  badge?: "Ново" | "Хит" | "Промоция";
}

export const PRODUCTS: Product[] = [
  {
    id: "pamuchna-prezhda-rozova",
    name: "Памучна прежда „Розова нежност“",
    category: "prezhdi",
    price: 6.9,
    image: pamuchnaRozova,
    description:
      "100% памучна прежда в нежно розово — мека, дишаща и издръжлива. Идеална за летни дрехи, бебешки плетива и амигуруми играчки.",
    details: ["100% памук", "50 г / 125 м", "Препоръчителни игли: 3–4 мм", "Пере се в пералня на 30°"],
    badge: "Хит",
  },
  {
    id: "plushena-prezhda-sinya",
    name: "Плюшена прежда „Небесно синьо“",
    category: "prezhdi",
    price: 8.5,
    image: plushenaSinya,
    description:
      "Изключително мека плюшена прежда с кадифено усещане. Перфектна за пухкави одеяла, шапки и плюшени играчки.",
    details: ["100% полиестер", "100 г / 120 м", "Препоръчителни игли: 6–8 мм", "Хипоалергенна"],
    badge: "Ново",
  },
  {
    id: "bebe-prezhda-menta",
    name: "Бебешка прежда „Мента“",
    category: "prezhdi",
    price: 5.9,
    image: bebeMenta,
    description:
      "Премиум бебешка прежда в свежа мента — супер мека и безопасна за нежната бебешка кожа. Пере се лесно и съхне бързо.",
    details: ["100% антипилинг акрил", "50 г / 165 м", "Препоръчителни игли: 3–3.5 мм", "Сертифицирана за бебета"],
  },
  {
    id: "tekstilna-prezhda-koral",
    name: "Текстилна прежда „Корал“",
    category: "prezhdi",
    price: 9.9,
    oldPrice: 12.9,
    image: tekstilnaKoral,
    description:
      "Еластична текстилна прежда в жизнерадостен коралов цвят. Страхотна за чанти, кошници, панери и килимчета.",
    details: ["Рециклиран памук с еластан", "Около 700 г / 120 м", "Кука: 8–10 мм", "Стойна и устойчива"],
    badge: "Промоция",
  },
  {
    id: "makrame-lavandula",
    name: "Памучно макраме „Лавандула“ 3 мм",
    category: "makrame",
    price: 14.9,
    image: makrameLavandula,
    description:
      "Усукано памучно въже за макраме в приказна лавандула. Меко, здраво и лесно за работа — за панери, декорации и чанти.",
    details: ["100% памук", "3 мм / 200 м", "Не се разплита лесно", "Подходящо за начинаещи"],
    badge: "Хит",
  },
  {
    id: "pleteno-zaeche",
    name: "Плетено зайче „Рози“",
    category: "gotovi",
    price: 39.9,
    image: zaeche,
    description:
      "Ръчно плетено зайче амигуруми с розова пелеринка и цветенце. Всяко е уникално и е изработено с много любов — чудесен подарък за малки и големи.",
    details: ["Ръчна изработка", "Височина: 25 см", "Безопасни очи", "Пере се на ръка"],
    badge: "Хит",
  },
  {
    id: "pleten-shal",
    name: "Ръчно плетен шал „Пудрови ивици“",
    category: "gotovi",
    price: 54.9,
    image: shal,
    description:
      "Топъл и мек шал с ресни в розово и кремаво. Плетен на ръка от дебела мека прежда — уютът, който заслужавате през студените дни.",
    details: ["Ръчна изработка", "Дължина: 180 см", "Смесена прежда с вълна", "Пере се на ръка"],
  },
  {
    id: "pletena-chanta",
    name: "Плетена чанта „Лятно небе“",
    category: "gotovi",
    price: 64.9,
    image: chanta,
    description:
      "Елегантна ръчно плетена чанта в синьо и кремаво с дървени дръжки. Стабилна, просторна и с неповторим ръчен чар.",
    details: ["Ръчна изработка", "Памучен шнур", "Дървени дръжки", "Размери: 35 × 30 см"],
    badge: "Ново",
  },
  {
    id: "pletena-shapka",
    name: "Плетена шапка с помпон „Пудра“",
    category: "gotovi",
    price: 29.9,
    image: shapka,
    description:
      "Мека плетена шапка в прашно розово с пухкав помпон. Топла, удобна и много мила — любимият зимен аксесоар.",
    details: ["Ръчна изработка", "Мека акрилна прежда", "Универсален размер", "Пере се на ръка"],
  },
  {
    id: "komplekt-kuki",
    name: "Комплект ергономични куки 2–6 мм",
    category: "aksesoari",
    price: 24.9,
    oldPrice: 29.9,
    image: kuki,
    description:
      "Комплект от 11 ергономични куки с меки пастелни дръжки. Удобни дори при дълго плетене — ръцете ви ще ви благодарят.",
    details: ["11 размера: 2.0–6.0 мм", "Меки силиконови дръжки", "Алуминиеви върхове", "Практичен калъф"],
    badge: "Промоция",
  },
  {
    id: "durveni-druzhki-osnova",
    name: "Дървени дръжки и основа за чанта",
    category: "aksesoari",
    price: 16.9,
    image: drazhki,
    description:
      "Комплект дървени дръжки и кръгла основа от шперплат за плетена чанта, с кожен етикет „Handmade“. Здравина и стил за вашия проект.",
    details: ["Естествено дърво", "Основа Ø 20 см с отвори", "2 дръжки", "Кожен етикет в комплекта"],
  },
];

export function formatPrice(price: number): string {
  return `${price.toFixed(2).replace(".", ",")} лв.`;
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
