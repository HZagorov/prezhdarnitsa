import { Link } from "@tanstack/react-router";
import { ShoppingBasket } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

const BADGE_STYLES: Record<string, string> = {
  "Ново": "bg-skyblue text-skyblue-foreground",
  "Хит": "bg-berry text-berry-foreground",
  "Промоция": "bg-sunshine text-sunshine-foreground",
};

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link
        to="/produkt/$id"
        params={{ id: product.id }}
        className="relative block overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={816}
          height={816}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-extrabold ${BADGE_STYLES[product.badge] ?? "bg-muted"}`}
          >
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          to="/produkt/$id"
          params={{ id: product.id }}
          className="font-display text-lg leading-snug font-bold text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-extrabold text-primary">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <button
            onClick={() => add(product.id)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground transition-transform hover:scale-105"
            aria-label={`Добави ${product.name} в количката`}
          >
            <ShoppingBasket className="h-4 w-4" />
            Добави
          </button>
        </div>
      </div>
    </div>
  );
}
