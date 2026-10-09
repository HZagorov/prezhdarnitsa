import { createContext, useContext, type ReactNode } from "react";
import type { Product } from "./products";

const ProductsContext = createContext<Product[] | null>(null);

export function ProductsProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  return <ProductsContext.Provider value={products}>{children}</ProductsContext.Provider>;
}

export function useProducts(): Product[] {
  const products = useContext(ProductsContext);
  if (!products) throw new Error("useProducts must be used within ProductsProvider");
  return products;
}
