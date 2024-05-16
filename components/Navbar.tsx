import { UserButton, auth } from "@clerk/nextjs";
import React from "react";
import MainNavbar from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/primsadb";
import { ModeToggle } from "./theme-toggle";

async function Navbar() {
  const { userId } = auth();
  if (!userId) redirect("sign-in");
  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <div className="border">
      <div className="flex items-center h-16 px-4">
        <StoreSwitcher items={stores} />
        <MainNavbar className="ml-6" />
        <div className="flex items-center space-x-4 ml-auto">
          <ModeToggle  />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
