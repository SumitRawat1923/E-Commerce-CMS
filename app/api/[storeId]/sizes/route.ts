import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name, value } = await req.json();

    if (!storeId)
      return NextResponse.json("storeId is needed", { status: 400 });
    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });
    if (!name) return NextResponse.json("Name is required", { status: 400 });
    if (!value) return NextResponse.json("Value is required", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });
    const size = await prismadb.size.create({
      data: {
        storeId,
        name,
        value,
      },
    });
    return NextResponse.json(size, { status: 201 });
  } catch (error) {
    console.log("[SIZES_POST]", error);
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

    const sizes = await prismadb.size.findMany({
      where: {
        storeId,
      },
    });
    return NextResponse.json(sizes, { status: 200 });
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}
