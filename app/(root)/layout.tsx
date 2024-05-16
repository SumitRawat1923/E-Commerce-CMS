import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

async function RootLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });
  if (store) redirect(`/${store.id}`);
  return <>{children}</>;
}

export default RootLayout;
