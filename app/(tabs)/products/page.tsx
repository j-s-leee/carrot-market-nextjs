import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import { PAGE_SIZE } from "@/lib/constants";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

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
  const products = await getProducts();
  return (
    <div>
      <ProductList initialProducts={products} />
    </div>
  );
}
