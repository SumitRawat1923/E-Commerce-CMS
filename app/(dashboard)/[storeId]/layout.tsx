import Navbar from "@/components/Navbar";
import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

async function DashBoardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  if (!isValidObjectId(params.storeId)) {
    redirect("/");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });
  if (!store) redirect("/");
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default DashBoardLayout;
