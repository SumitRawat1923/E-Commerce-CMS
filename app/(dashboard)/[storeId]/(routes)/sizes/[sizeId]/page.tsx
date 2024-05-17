import prismadb from "@/lib/primsadb";
import React from "react";
import SizeForm from "./components/size-form";

const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

async function BillBoardPage({ params }: { params: { sizeId: string } }) {
  let size = null;

  if (isValidObjectId(params.sizeId)) {
    size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 py-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
}

export default BillBoardPage;
