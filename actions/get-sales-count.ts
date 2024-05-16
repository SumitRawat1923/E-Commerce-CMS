import prismadb from "@/lib/primsadb";

export default async function getSalesCount(storeId: string) {
  const salesCount = await prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return salesCount;
}
