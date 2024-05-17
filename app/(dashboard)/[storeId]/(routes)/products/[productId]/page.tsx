import prismadb from "@/lib/primsadb";
import React from "react";
import ProductForm from "./components/product-form";

const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

async function ProductPage({
  params: { productId, storeId },
}: {
  params: { productId: string; storeId: string };
}) {
  let product = null;
  if (isValidObjectId(productId) && isValidObjectId(storeId)) {
    product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        Image: true,
      },
    });
  }

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
  });
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId,
    },
  });
  const colors = await prismadb.color.findMany({
    where: {
      storeId: storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 py-6">
        <ProductForm
          initialData={product}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

export default ProductPage;
