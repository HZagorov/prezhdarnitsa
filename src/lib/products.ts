import { createServerFn } from "@tanstack/react-start";
import pamuchnaRozova from "@/assets/products/pamuchna-rozova.jpg";
import plushenaSinya from "@/assets/products/plushena-sinya.jpg";
import makrameLavandula from "@/assets/products/makrame-lavandula.jpg";
//import chantaPayeti from "@/assets/products/chanta-payeti.png.asset.json";
//import chantaPayeti2 from "@/assets/products/chanta-payeti-2.png.asset.json";
import chantaPayeti from "@/assets/products/chanta-payeti.png";
import chantaPayeti2 from "@/assets/products/chanta-payeti-2.png";
import chantaSini from "@/assets/products/chanta-sini.png.asset.json";
import chantaSini2 from "@/assets/products/chanta-sini-2.png.asset.json";
import chantaCherna from "@/assets/products/chanta-cherna.png.asset.json";
import chantaCherna2 from "@/assets/products/chanta-cherna-2.png.asset.json";
//import chantaSharenoKare from "@/assets/products/chanta-shareno-kare.png.asset.json";
import chantaSharenoKare from "@/assets/products/chanta-shareno-kare.png";
import kuki from "@/assets/products/kuki.jpg";
import bebeMenta from "@/assets/products/bebe-menta.jpg";
import gazzalBabyCotton from "@/assets/products/gazzal-baby-cotton.jpg";
import tekstilnaKoral from "@/assets/products/tekstilna-koral.jpg";
import drazhki from "@/assets/products/drazhki.jpg";
import genesis2012 from "@/assets/products/genesis-2012.jpg";
import genesis2013 from "@/assets/products/genesis-2013.jpg";
import genesis2015 from "@/assets/products/genesis-2015.jpg";
import genesis2018 from "@/assets/products/genesis-2018.jpg";
import genesis2026 from "@/assets/products/genesis-2026.jpg";
import genesis2032 from "@/assets/products/genesis-2032.jpg";
import genesis2051 from "@/assets/products/genesis-2051.jpg";
import genesis2055 from "@/assets/products/genesis2055.jpg";
import genesis2058 from "@/assets/products/genesis-2058.jpg";
import genesis2071 from "@/assets/products/genesis-2071.jpg";
import genesis2079 from "@/assets/products/genesis-2079.jpg";
import genesis2115 from "@/assets/products/genesis-2115.jpg";
import genesis2131 from "@/assets/products/genesis2131.jpg";
import genesis2134 from "@/assets/products/genesis2134.jpg";
import genesis2137 from "@/assets/products/genesis-2137.jpg";
import genesis2159 from "@/assets/products/genesis-2159.jpg";
import genesis2178 from "@/assets/products/genesis-2178.jpg";
import genesis2214 from "@/assets/products/genesis-2214.jpg";
import genesis3000 from "@/assets/products/genesis-3000.jpg";
import genesis3001 from "@/assets/products/genesis-3001.jpg";
import genesis30021 from "@/assets/products/genesis-3002-1.jpg";
import genesis3003 from "@/assets/products/genesis3003.jpg";
import genesis2007 from "@/assets/products/genesis-2007.jpg";
import genesis2001 from "@/assets/products/genesis-2001.jpg";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Category = "prezhdi" | "makrame" | "gotovi" | "aksesoari";

export const CATEGORIES: { id: Category; name: string; description: string }[] = [
  { id: "prezhdi", name: "Прежди", description: "Памучна, плюшена, бебешка и текстилна прежда" },
  { id: "makrame", name: "Макраме", description: "Памучно и полиестерово макраме в красиви цветове" },
  { id: "gotovi", name: "Готови артикули", description: "Ръчно плетени чанти и други артикули" },
  { id: "aksesoari", name: "Аксесоари", description: "Куки, дръжки, основи и всичко за вашите проекти" },
];

export const YARN_SUBCATEGORIES: { id: string; name: string }[] = [
  { id: "pamuk", name: "100% памук" },
  { id: "vlna", name: "100% вълна" },
];

export interface Product {
  id: string;
  name: string;
  category: Category;
  sub?: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery?: string[];
  description?: string;
  details: string[];
  badge?: "Ново" | "Хит" | "Промоция";
}

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

const IMAGE_URLS: Record<string, string> = {
  pamuchnaRozova,
  plushenaSinya,
  makrameLavandula,
  chantaPayeti: chantaPayeti,
  chantaPayeti2: chantaPayeti2,
  chantaSini: chantaSini.url,
  chantaSini2: chantaSini2.url,
  chantaCherna: chantaCherna.url,
  chantaCherna2: chantaCherna2.url,
  chantaSharenoKare: chantaSharenoKare,
  kuki,
  bebeMenta,
  gazzalBabyCotton,
  tekstilnaKoral,
  drazhki,
  genesis2001,
  genesis2007,
  genesis2012,
  genesis2013,
  genesis2015,
  genesis2018,
  genesis2026,
  genesis2032,
  genesis2051,
  genesis2055,
  genesis2058,
  genesis2071,
  genesis2079,
  genesis2115,
  genesis2131,
  genesis2134,
  genesis2137,
  genesis2159,
  genesis2178,
  genesis2214,
  genesis3000,
  genesis3001,
  genesis30021,
  genesis3003,
};

function resolveImage(imageKey: string): string {
  return IMAGE_URLS[imageKey] ?? imageKey;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Category,
    ...(row.subcategory ? { sub: row.subcategory } : {}),
    price: row.price,
    ...(row.old_price !== null ? { oldPrice: row.old_price } : {}),
    image: resolveImage(row.image_key),
    ...(row.gallery_keys.length > 0
      ? { gallery: row.gallery_keys.map(resolveImage) }
      : {}),
    ...(row.description ? { description: row.description } : {}),
    details: row.details,
    ...(row.badge ? { badge: row.badge as Product["badge"] } : {}),
  };
}

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("name");

  if (error) throw new Error(`Could not load products: ${error.message}`);
  return data.map(toProduct);
});

export const getProductById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw new Error(`Could not load product: ${error.message}`);
    return data ? toProduct(data) : undefined;
  });

export function formatPrice(priceEur: number): string {
  return `${priceEur.toFixed(2).replace(".", ",")} €`;
}
