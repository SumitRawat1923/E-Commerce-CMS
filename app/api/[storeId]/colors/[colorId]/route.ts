import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { colorId } }: { params: { colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!colorId)
      return new NextResponse("colorId is required", { status: 401 });
    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log("COLOR_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { colorId, storeId },
  }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name, value } = await req.json();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!colorId)
      return new NextResponse("ColorId is required", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 401 });
    if (!value) return new NextResponse("Value is required", { status: 401 });

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });

    const color = await prismadb.color.update({
      where: {
        id: colorId,
      },
      data: { name, value },
    });
    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { colorId, storeId },
  }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!colorId) {
      return new NextResponse("ColorId is required", { status: 401 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });
    const color = await prismadb.color.deleteMany({
      where: {
        id: colorId,
      },
    });
    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log("[COLOR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
