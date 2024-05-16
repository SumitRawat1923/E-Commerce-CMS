import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import SettingsForm from "./components/settings-form";
interface SettingsPageProps {
  params: {
    storeId: string;
  };
}
async function SettingsPage({ params: { storeId } }: SettingsPageProps) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const store = await prismadb.store.findUnique({
    where: {
      userId,
      id: storeId,
    },
  });
  if (!store) redirect("/");

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
}

export default SettingsPage;
