import React from "react";
import prismadb from "@/lib/primsadb";
import { format } from "date-fns";
import { ColorColumn } from "./components/columns";
import ColorClient from "./components/Client";

async function BillBoardsPage({
  params: { storeId },
}: {
  params: { storeId: string };
}) {
  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
}

export default BillBoardsPage;
