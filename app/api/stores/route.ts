import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { name } = await req.json();
    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });
    if (!name) return NextResponse.json("Name is required", { status: 400 });
    const store = await prismadb.store.create({
      data: {
        userId,
        name,
      },
    });
    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.log("[STORES_POST]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}
