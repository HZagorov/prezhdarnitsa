import { createServerFn } from "@tanstack/react-start";
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
  familyKey?: string;
  familyName?: string;
  variantLabel?: string;
}

export function getProductFamilyKey(product: Pick<Product, "familyKey">): string | undefined {
  return product.familyKey;
}

export function getProductFamilyName(product: Pick<Product, "familyName" | "name">): string {
  return product.familyName ?? product.name;
}

export function getProductVariantLabel(product: Pick<Product, "variantLabel" | "name">): string {
  return product.variantLabel ?? product.name;
}

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
type ProductWithVariantsRow = ProductRow & { product_variants: ProductVariantRow[] };

const IMAGE_URLS: Record<string, string> = {
  pamuchnaRozova: "/products/pamuchna-rozova.jpg",
  plushenaSinya: "/products/plushena-sinya.jpg",
  makrameLavandula: "/products/makrame-lavandula.jpg",
  chantaPayeti: "/products/chanta-payeti.png",
  chantaPayeti2: "/products/chanta-payeti-2.png",
  chantaSini: "/products/chanta-sini.png",
  chantaSini2: "/products/chanta-sini-2.png",
  chantaCherna: "/products/chanta-cherna.png",
  chantaCherna2: "/products/chanta-cherna-2.png",
  chantaSharenoKare: "/products/chanta-shareno-kare.png",
  kuki: "/products/kuki.jpg",
  bebeMenta: "/products/bebe-menta.jpg",
  gazzalBabyCotton: "/products/gazzal-baby-cotton.jpg",
  tekstilnaKoral: "/products/tekstilna-koral.jpg",
  drazhki: "/products/drazhki.jpg",
  genesis2001: "/products/genesis/genesis-2001.jpg",
  genesis2007: "/products/genesis/genesis-2007.jpg",
  genesis2012: "/products/genesis/genesis-2012.jpg",
  genesis2013: "/products/genesis/genesis-2013.jpg",
  genesis2015: "/products/genesis/genesis-2015.jpg",
  genesis2018: "/products/genesis/genesis-2018.jpg",
  genesis2026: "/products/genesis/genesis-2026.jpg",
  genesis2032: "/products/genesis/genesis-2032.jpg",
  genesis2051: "/products/genesis/genesis-2051.jpg",
  genesis2055: "/products/genesis/genesis-2055.jpg",
  genesis2058: "/products/genesis/genesis-2058.jpg",
  genesis2071: "/products/genesis/genesis-2071.jpg",
  genesis2079: "/products/genesis/genesis-2079.jpg",
  genesis2115: "/products/genesis/genesis-2115.jpg",
  genesis2131: "/products/genesis/genesis-2131.jpg",
  genesis2134: "/products/genesis/genesis-2134.jpg",
  genesis2137: "/products/genesis/genesis-2137.jpg",
  genesis2159: "/products/genesis/genesis-2159.jpg",
  genesis2178: "/products/genesis/genesis-2178.jpg",
  genesis2214: "/products/genesis/genesis-2214.jpg",
  genesis3000: "/products/genesis/genesis-3000.jpg",
  genesis3001: "/products/genesis/genesis-3001.jpg",
  genesis30021: "/products/genesis/genesis-3002-1.jpg",
  genesis3003: "/products/genesis/genesis-3003.jpg",
};

function resolveImage(imageKey: string): string {
  return IMAGE_URLS[imageKey] ?? imageKey;
}

function toProduct(row: ProductRow, variant?: ProductVariantRow): Product {
  return {
    id: variant?.id ?? row.id,
    name: variant?.name ?? row.name,
    category: row.category as Category,
    ...(row.subcategory ? { sub: row.subcategory } : {}),
    price: row.price,
    ...(row.old_price !== null ? { oldPrice: row.old_price } : {}),
    image: resolveImage(variant?.image_key ?? row.image_key),
    ...(row.gallery_keys.length > 0
      ? { gallery: row.gallery_keys.map(resolveImage) }
      : {}),
    ...(row.description ? { description: row.description } : {}),
    details: row.details,
    ...(row.badge ? { badge: row.badge as Product["badge"] } : {}),
    ...(variant
      ? { familyKey: row.id, familyName: row.name, variantLabel: variant.name }
      : {}),
  };
}

function toProducts(row: ProductWithVariantsRow): Product[] {
  const variants = row.product_variants.filter((variant) => variant.is_active);
  return variants.length > 0 ? variants.map((variant) => toProduct(row, variant)) : [toProduct(row)];
}

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const [{ data, error }, { data: variants, error: variantsError }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .order("name"),
    supabase
      .from("product_variants")
      .select("id, product_id, name, image_key, is_active")
      .eq("is_active", true),
  ]);

  if (error) throw new Error(`Could not load products: ${error.message}`);
  if (variantsError) throw new Error(`Could not load product variants: ${variantsError.message}`);

  const variantsByProduct = new Map<string, ProductVariantRow[]>();
  for (const variant of variants ?? []) {
    const productVariants = variantsByProduct.get(variant.product_id) ?? [];
    productVariants.push(variant);
    variantsByProduct.set(variant.product_id, productVariants);
  }

  return data.flatMap((row) =>
    toProducts({ ...row, product_variants: variantsByProduct.get(row.id) ?? [] }),
  );
});

export const getProductById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const products = await getProducts();
    return products.find((product) => product.id === id);
  });

export function formatPrice(priceEur: number): string {
  return `${priceEur.toFixed(2).replace(".", ",")} €`;
}
