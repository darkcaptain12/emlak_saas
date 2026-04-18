import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, readOrders } from "@/lib/db";
import type { OrderStatus } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const orders = readOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const { status } = await request.json() as { status: OrderStatus };
    const validStatuses: OrderStatus[] = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Geçersiz durum" }, { status: 400 });
    }
    const updated = updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
