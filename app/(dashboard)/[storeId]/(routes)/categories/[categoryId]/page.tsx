import prismadb from "@/lib/primsadb";
import React from "react";
import CategoryForm from "./components/category-form";

const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

async function CategoryPage({
  params: { categoryId, storeId },
}: {
  params: { categoryId: string; storeId: string };
}) {
  let category = null;

  if (isValidObjectId(categoryId)) {
    category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  }

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 py-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
}

export default CategoryPage;
