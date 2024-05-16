import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { sizeId } }: { params: { sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!sizeId) return new NextResponse("SizeId is required", { status: 401 });
    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.log("SIZE_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { sizeId, storeId },
  }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name, value } = await req.json();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!sizeId) return new NextResponse("SizeId is required", { status: 401 });
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

    const size = await prismadb.size.update({
      where: {
        id: sizeId,
      },
      data: { name, value },
    });
    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { sizeId, storeId },
  }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!sizeId) {
      return new NextResponse("SizeId is required", { status: 401 });
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("unauthorized", { status: 403 });
    const size = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
      },
    });
    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
