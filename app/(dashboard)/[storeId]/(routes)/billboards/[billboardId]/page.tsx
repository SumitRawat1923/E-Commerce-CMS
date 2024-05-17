import prismadb from "@/lib/primsadb";
import React from "react";
import BillBoardForm from "./components/billboard-form";

const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

async function BillBoardPage({
  params: { billboardId },
}: {
  params: { billboardId: string };
}) {
  let billboard = null;

  if (isValidObjectId(billboardId)) {
    billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 py-6">
        <BillBoardForm initialData={billboard} />
      </div>
    </div>
  );
}

export default BillBoardPage;
