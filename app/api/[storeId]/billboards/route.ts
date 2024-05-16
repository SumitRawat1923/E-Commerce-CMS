import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const { label, imageUrl } = await req.json();

    if (!storeId)
      return NextResponse.json("storeId is needed", { status: 400 });
    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });
    if (!label) return NextResponse.json("Label is required", { status: 400 });
    if (!imageUrl)
      return NextResponse.json("Image URL is required", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });
    const billboard = await prismadb.billboard.create({
      data: {
        storeId,
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard, { status: 201 });
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
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

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId,
      },
    });
    return NextResponse.json(billboards, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}
