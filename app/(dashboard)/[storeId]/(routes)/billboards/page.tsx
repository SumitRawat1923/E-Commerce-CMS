import React from "react";
import BillBoardClient from "./components/Client";
import prismadb from "@/lib/primsadb";
import { format } from "date-fns";
import { BillboardColumn } from "./components/columns";

async function BillBoardsPage({
  params: { storeId },
}: {
  params: { storeId: string };
}) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardClient data={formattedBillboards} />
      </div>
    </div>
  );
}

export default BillBoardsPage;
