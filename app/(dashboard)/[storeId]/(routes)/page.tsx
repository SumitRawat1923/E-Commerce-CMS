import getGraphRevenue from "@/actions/get-graph-revenue";
import getSalesCount from "@/actions/get-sales-count";
import getStockCount from "@/actions/get-stock-count";
import getTotalRevenue from "@/actions/get-total-revenue";
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { Box, CreditCard, DollarSign } from "lucide-react";
import React from "react";

async function DashboardPage({
  params: { storeId },
}: {
  params: { storeId: string };
}) {
  const totalRevenue = await getTotalRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);
  const graphData = await getGraphRevenue(storeId);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store." />
        <Separator />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card>
            <CardHeader className=" flex flex-row  items-center justify-between   pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className=" flex flex-row  items-center justify-between   pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className=" flex flex-row  items-center justify-between   pb-2">
              <CardTitle className="text-sm font-medium">
                Products in Stock
              </CardTitle>
              <Box className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-1 sm:col-span-2 md:col-span-3">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
