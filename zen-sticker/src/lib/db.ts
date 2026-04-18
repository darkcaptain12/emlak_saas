import fs from "fs";
import path from "path";
import type { Order } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, "[]", "utf-8");
  }
}

export function readOrders(): Order[] {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function writeOrders(orders: Order[]): void {
  ensureDataDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export function createOrder(order: Order): Order {
  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
  return order;
}

export function updateOrderStatus(
  id: string,
  status: Order["status"]
): Order | null {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx].status = status;
  writeOrders(orders);
  return orders[idx];
}
