// ============= Full file contents =============

import pamuchnaRozova from "@/assets/products/pamuchna-rozova.jpg";
import plushenaSinya from "@/assets/products/plushena-sinya.jpg";
import makrameLavandula from "@/assets/products/makrame-lavandula.jpg";
import chantaPayeti from "@/assets/products/chanta-payeti.png.asset.json";
import chantaPayeti2 from "@/assets/products/chanta-payeti-2.png.asset.json";
import chantaSini from "@/assets/products/chanta-sini.png.asset.json";
import chantaSini2 from "@/assets/products/chanta-sini-2.png.asset.json";
import chantaCherna from "@/assets/products/chanta-cherna.png.asset.json";
import chantaCherna2 from "@/assets/products/chanta-cherna-2.png.asset.json";
import chantaSharenoKare from "@/assets/products/chanta-shareno-kare.png.asset.json";
import kuki from "@/assets/products/kuki.jpg";
import bebeMenta from "@/assets/products/bebe-menta.jpg";
import gazzalBabyCotton from "@/assets/products/gazzal-baby-cotton.jpg";
import tekstilnaKoral from "@/assets/products/tekstilna-koral.jpg";
import drazhki from "@/assets/products/drazhki.jpg";

export type Category = "prezhdi" | "makrame" | "gotovi" | "aksesoari";

export const CATEGORIES: { id: Category; name: string; description: string }[] = [
  { id: "prezhdi", name: "Прежди", description: "Памучна, плюшена, бебешка и текстилна прежда" },
  { id: "makrame", name: "Макраме", description: "Памучно и полиестерово макраме в красиви цветове" },
  { id: "gotovi", name: "Готови артикули", description: "Ръчно плетени чанти и други артикули" },
  { id: "aksesoari", name: "Аксесоари", description: "Куки, дръжки, основи и всичко за вашите проекти" },
];

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number; // в евро
  oldPrice?: number;
  image: string;
  gallery?: string[]; // допълнителни снимки на артикула
  description?: string;
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
    id: "gazzal-baby-cotton",
    name: "Памучна прежда „GAZZAL Baby Cotton“",
    category: "prezhdi",
    price: 4.0,
    image: gazzalBabyCotton,
    description:
      "Нежна памучна бебешка прежда GAZZAL Baby Cotton — мека, дишаща и приятна на допир. Подходяща за бебешки плетива, летни дрехи, шапки и амигуруми.",
    details: ["100% памук", "50 г / 165 м", "Препоръчителни игли: 3–4 мм", "Пере се на 30°"],
    badge: "Ново",
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
    id: "pletena-chanta-payeti",
    name: "Плетена чанта с пайети „Бежов блясък“",
    category: "gotovi",
    price: 79.9,
    image: chantaPayeti2.url,
    gallery: [chantaPayeti2.url, chantaPayeti.url],
    description:
      "Ефектна ръчно плетена чанта тип торбичка в нежно бежово, украсена с кръгли пайети и кожена връзка. Плетената дръжка с метални вериги придава завършен и елегантен вид.",
    details: [
      "Ръчна изработка",
      "Пайети в бежово и розово злато",
      "Плетена дръжка с метални вериги",
      "Кожена връзка с панделка",
      "Дължина: 30 см",
      "Ширина: 17 см",
      "Височина: 24 см",
    ],
    badge: "Ново",
  },
  {
    id: "pletena-chanta-sini",
    name: "Плетена чанта „Син прибой“",
    category: "gotovi",
    price: 89.9,
    image: chantaSini.url,
    gallery: [chantaSini.url, chantaSini2.url],
    details: [
      "Ръчна изработка",
      "Дебела памучна връв",
      "Плетена дръжка с метални накрайници",
      "Метална пръчка по горния ръб",
      "Дължина: 35 см",
      "Ширина: 15 см",
      "Височина: 24 см",
      "Височина с дръжката: 46 см",
    ],
    badge: "Ново",
  },
  {
    id: "pletena-chanta-cherna",
    name: "Плетена чанта „Черна нощ“",
    category: "gotovi",
    price: 45,
    image: chantaCherna.url,
    gallery: [chantaCherna.url, chantaCherna2.url],
    details: ["Ширина: 37 см", "Дълбочина: 22 см", "Височина с дръжката: 44 см"],
    badge: "Ново",
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

// Всички цени в проекта са в евро
export function formatPrice(priceEur: number): string {
  return `${priceEur.toFixed(2).replace(".", ",")} €`;
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
