import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";

type CardProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  inStock: boolean;
};

export function ProductCard({ product }: { product: CardProduct }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(20,30,20,0.35)]">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface-2"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-cream">
            Под заказ
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.slug}`} className="hover:text-blush">
          <h3 className="font-display text-xl leading-tight text-ink">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="whitespace-nowrap text-lg font-semibold text-ink tabular-nums">
            {formatPrice(product.price)}
          </span>
          <AddToCartButton
            className="w-full sm:w-auto"
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
            }}
          />
        </div>
      </div>
    </div>
  );
}
