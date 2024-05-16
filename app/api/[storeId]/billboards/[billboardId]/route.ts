import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { billboardId } }: { params: { billboardId: string } }
) {
  try {
    if (!billboardId)
      return new NextResponse("BillBoardId is required", { status: 401 });
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { billboardId, storeId },
  }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const { label, imageUrl } = await req.json();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!billboardId)
      return new NextResponse("BillBoard Id is required", { status: 401 });
    if (!label) return new NextResponse("Label is required", { status: 401 });
    if (!imageUrl)
      return new NextResponse("Image URL is required", { status: 401 });

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });

    const billboard = await prismadb.billboard.update({
      where: {
        id: billboardId,
      },
      data: { label, imageUrl },
    });
    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { billboardId, storeId },
  }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!billboardId) {
      return new NextResponse("BillBoardId is required", { status: 401 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });
    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: billboardId,
      },
    });
    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
