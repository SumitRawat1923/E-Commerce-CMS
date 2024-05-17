import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { categoryId } }: { params: { categoryId: string } }
) {
  try {
    if (!categoryId)
      return new NextResponse("CategoryId is required", { status: 401 });
    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
      include: { billboard: true },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("CATEGORY_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { categoryId, storeId },
  }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name, billboardId } = await req.json();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 401 });
    if (!billboardId)
      return new NextResponse("BillboardId is required", { status: 401 });

    if (!categoryId)
      return new NextResponse("CategoryId is required", { status: 401 });
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });

    const category = await prismadb.category.update({
      where: {
        id: categoryId,
      },
      data: { name, billboardId },
    });
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { categoryId, storeId },
  }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!categoryId) {
      return new NextResponse("categoryId is required", { status: 401 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });
    const category = await prismadb.category.deleteMany({
      where: {
        id: categoryId,
      },
    });
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
