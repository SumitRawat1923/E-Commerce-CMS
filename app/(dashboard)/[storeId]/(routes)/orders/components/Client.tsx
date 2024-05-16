"use client";

import Heading from "@/components/ui/heading";
import React from "react";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";

interface OrderClientProps {
  data: OrderColumn[];
}

function ProductClient({ data }: OrderClientProps) {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store."
      />
      <Separator/>
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
}

export default ProductClient;
