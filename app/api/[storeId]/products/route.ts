import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
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
    const product = await prismadb.product.create({
      data: {
        storeId,
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        Image: {
          createMany: {
            data: [...Image.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    if (!storeId)
      return NextResponse.json("storeId is needed", { status: 400 });

    const products = await prismadb.product.findMany({
      where: {
        storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        Image: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}
