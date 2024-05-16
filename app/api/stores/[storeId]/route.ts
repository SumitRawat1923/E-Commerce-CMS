import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name } = await req.json();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!storeId)
      return new NextResponse("StoreId is required", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 401 });
    const store = await prismadb.store.update({
      where: {
        id: storeId,
        userId,
      },
      data: { name },
    });
    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!storeId)
      return new NextResponse("StoreId is required", { status: 401 });
    const store = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userId,
      },
    });
    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
