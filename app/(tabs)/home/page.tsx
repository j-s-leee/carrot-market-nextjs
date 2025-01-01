import ProductList from "@/components/product-list";
import { PAGE_SIZE } from "@/lib/constants";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";

const getCachedProducts = nextCache(getProducts, ["home-products"]);

async function getProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: PAGE_SIZE,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type IProductList = Prisma.PromiseReturnType<typeof getProducts>;

export default async function Products() {
  const products = await getCachedProducts();
  return (
    <div>
      <ProductList initialProducts={products} />
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed text-white bottom-24 right-8 transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
