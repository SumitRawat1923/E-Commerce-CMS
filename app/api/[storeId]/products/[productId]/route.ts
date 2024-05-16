import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { productId } }: { params: { productId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!productId)
      return new NextResponse("ProductId is required", { status: 401 });
    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        Image: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[GET_PRODUCT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { productId, storeId },
  }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!productId) {
      return new NextResponse("ProductId is required", { status: 401 });
    }
    const {
      name,
      price,
      categoryId,
      sizeId,
      Image,
      colorId,
      isFeatured,
      isArchived,
    } = await req.json();

    if (!storeId)
      return NextResponse.json("storeId is needed", { status: 400 });
    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });
    if (!name) return NextResponse.json("Name is required", { status: 400 });
    if (!price) return NextResponse.json("Price is required", { status: 400 });
    if (!Image.length)
      return NextResponse.json("Images are required", { status: 400 });
    if (!categoryId)
      return NextResponse.json("CategoryId is required", { status: 400 });
    if (!colorId)
      return NextResponse.json("ColorId is required", { status: 400 });
    if (!sizeId)
      return NextResponse.json("SizeId is required", { status: 400 });

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        Image: {
          deleteMany: {},
        },
        isArchived,
        isFeatured,
      },
    });
    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        Image: {
          createMany: {
            data: [...Image.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { productId, storeId },
  }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!productId) {
      return new NextResponse("ProductId is required", { status: 401 });
    }
    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });
    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
      },
    });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
