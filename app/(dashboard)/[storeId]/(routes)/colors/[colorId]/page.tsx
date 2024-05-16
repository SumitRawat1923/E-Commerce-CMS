import prismadb from "@/lib/primsadb";
import React from "react";
import ColorForm from "./components/color-form";

async function BillBoardPage({ params }: { params: { colorId: string } }) {
  const color = await prismadb.color.findUnique({
    where: {
      id: params.colorId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 py-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
}

export default BillBoardPage;
