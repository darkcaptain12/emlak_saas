import { NextRequest, NextResponse } from "next/server";
import { createOrder, readOrders } from "@/lib/db";
import type { Order } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const orders = readOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Siparişler alınamadı" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customer || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Geçersiz sipariş verisi" }, { status: 400 });
    }

    const order: Order = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: "pending",
      customer: body.customer,
      items: body.items,
      total: body.total,
    };

    const saved = createOrder(order);
    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 });
  }
}
