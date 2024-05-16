import React from "react";
import prismadb from "@/lib/primsadb";
import { format } from "date-fns";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import ProductClient from "./components/Client";

async function ProductsPage({
  params: { storeId },
}: {
  params: { storeId: string };
}) {
  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
    include: { category: true, color: true, size: true },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    category: item.category.name,
    size: item.size.name,
    color: item.color.name,

    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}

export default ProductsPage;
