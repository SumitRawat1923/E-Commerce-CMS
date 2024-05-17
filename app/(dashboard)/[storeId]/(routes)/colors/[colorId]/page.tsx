import prismadb from "@/lib/primsadb";
import React from "react";
import ColorForm from "./components/color-form";

const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

async function BillBoardPage({
  params: { colorId },
}: {
  params: { colorId: string };
}) {
  let color = null;
  if (isValidObjectId(colorId)) {
    color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 py-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
}

export default BillBoardPage;
