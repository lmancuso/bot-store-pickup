export type CartItem = {
  menuItemId: string;
  name: string;
  priceArs: number;
  qty: number;
};

export function cartTotal(items: readonly CartItem[]): number {
  return items.reduce((sum, i) => sum + i.priceArs * i.qty, 0);
}

export function formatArs(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function addToCart(
  items: readonly CartItem[],
  item: Omit<CartItem, "qty">,
  qty = 1,
): CartItem[] {
  const next = items.map((i) => ({ ...i }));
  const existing = next.find((i) => i.menuItemId === item.menuItemId);
  if (existing) {
    existing.qty += qty;
    return next;
  }
  return [...next, { ...item, qty }];
}

export function removeFromCart(
  items: readonly CartItem[],
  menuItemId: string,
  qty = 1,
): CartItem[] {
  const next: CartItem[] = [];
  for (const i of items) {
    if (i.menuItemId !== menuItemId) {
      next.push({ ...i });
      continue;
    }
    const newQty = i.qty - qty;
    if (newQty > 0) next.push({ ...i, qty: newQty });
  }
  return next;
}

export function clearCart(): CartItem[] {
  return [];
}
