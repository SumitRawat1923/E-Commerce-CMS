import React from "react";
import prismadb from "@/lib/primsadb";
import { format } from "date-fns";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import ProductClient from "./components/Client";

async function ProductsPage({
  params: { storeId },
}: {
  params: { storeId: string };
}) {
  const orders = await prismadb.order.findMany({
    where: {
      storeId,
    },
    include: { orderItems: { include: { product: true } } },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    isPaid: item.isPaid,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce(
        (totalPrice, item) => totalPrice + Number(item.product.price),
        0
      )
    ),

    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedOrders} />
      </div>
    </div>
  );
}

export default ProductsPage;
