"use client";

import type { MenuItem } from "@/data/types";
import { formatArs } from "@/lib/cart";

type MenuButtonsProps = {
  items: MenuItem[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
};

export function MenuButtons({ items, onAdd, onRemove, disabled }: MenuButtonsProps) {
  if (items.length === 0) return null;
  return (
    <div
      className="shrink-0 border-t border-chat-input-border bg-white/90 px-2 py-2"
      role="group"
      aria-label="Acciones del menú"
      data-testid="menu-buttons"
    >
      <p className="mb-1.5 px-1 text-xs font-medium text-zinc-500">Menú rápido</p>
      <ul className="flex max-h-28 flex-col gap-1 overflow-y-auto">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 rounded-xl bg-zinc-50 px-2 py-1.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
              <p className="text-xs text-zinc-500">{formatArs(item.priceArs)}</p>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemove(item.id)}
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
              aria-label={`Quitar ${item.name}`}
            >
              −
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onAdd(item.id)}
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-chat-accent text-lg text-white hover:bg-chat-accent-hover disabled:opacity-50"
              aria-label={`Agregar ${item.name}`}
            >
              +
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
