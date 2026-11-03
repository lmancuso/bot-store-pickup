import type { Vendor } from "@/data/types";

export type OrderConfirmation = {
  code: string;
  vendorId: string;
  vendorName: string;
  address: string;
  hours: string;
  lat: number;
  lng: number;
  totalArs: number;
  createdAt: string;
};

export function generatePickupCode(now = new Date()): string {
  const stamp = now.getTime().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  return `SP-${stamp}${rand}`.slice(0, 11);
}

export function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function buildOrderConfirmation(
  vendor: Vendor,
  totalArs: number,
  now = new Date(),
): OrderConfirmation {
  return {
    code: generatePickupCode(now),
    vendorId: vendor.id,
    vendorName: vendor.name,
    address: vendor.address,
    hours: vendor.hours,
    lat: vendor.lat,
    lng: vendor.lng,
    totalArs,
    createdAt: now.toISOString(),
  };
}

export function formatOrderMessage(order: OrderConfirmation): string {
  const link = directionsUrl(order.lat, order.lng);
  return [
    `¡Listo! Pedido confirmado.`,
    `Código de retiro: ${order.code}`,
    `Local: ${order.vendorName}`,
    `Dirección: ${order.address}`,
    `Horario: ${order.hours}`,
    `Total: ${new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(order.totalArs)}`,
    `Cómo llegar: ${link}`,
  ].join("\n");
}
