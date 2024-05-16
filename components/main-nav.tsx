"use client";
import prismadb from "@/lib/primsadb";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

function MainNavbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { storeId } = useParams();

  const routes = [
    {
      href: `/${storeId}`,
      label: "Dashboard",
      active: pathname === `/${storeId}`,
    },
    {
      href: `/${storeId}/billboards`,
      label: "Billboards",
      active: pathname.startsWith(`/${storeId}/billboards`),
    },
    {
      href: `/${storeId}/categories`,
      label: "Categories",
      active: pathname.startsWith(`/${storeId}/categories`),
    },
    {
      href: `/${storeId}/sizes`,
      label: "Sizes",
      active: pathname.startsWith(`/${storeId}/sizes`),
    },
    {
      href: `/${storeId}/products`,
      label: "Products",
      active: pathname.startsWith(`/${storeId}/Products`),
    },
    {
      href: `/${storeId}/orders`,
      label: "Orders",
      active: pathname.startsWith(`/${storeId}/orders`),
    },
    {
      href: `/${storeId}/colors`,
      label: "Colors",
      active: pathname.startsWith(`/${storeId}/colors`),
    },
    {
      href: `/${storeId}/settings`,
      label: "Settings",
      active: pathname === `/${storeId}/settings`,
    },
  ];
  return (
    <div className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          className={cn(
            "text-sm font-medium transition-colors hover:text-black dark:hover:text-slate-600 ",
            route.active ? "text-black dark:text-white" : "text-slate-500"
          )}
          key={route.href}
          href={route.href}
        >
          {route.label}
        </Link>
      ))}
    </div>
  );
}

export default MainNavbar;
