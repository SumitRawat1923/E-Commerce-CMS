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
    const color = await prismadb.color.create({
      data: {
        storeId,
        name,
        value,
      },
    });
    return NextResponse.json(color, { status: 201 });
  } catch (error) {
    console.log("[COLORS_POST]", error);
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

    const colors = await prismadb.color.findMany({
      where: {
        storeId,
      },
    });
    return NextResponse.json(colors, { status: 200 });
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}
