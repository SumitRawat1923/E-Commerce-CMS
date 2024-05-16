import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name, billboardId } = await req.json();

    if (!storeId)
      return NextResponse.json("storeId is needed", { status: 400 });
    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });
    if (!name) return NextResponse.json("Name is required", { status: 400 });
    if (!billboardId)
      return NextResponse.json("BillboardId is required", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });
    const category = await prismadb.category.create({
      data: {
        storeId,
        name,
        billboardId,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    if (!storeId)
      return NextResponse.json("storeId is needed", { status: 400 });

    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}
