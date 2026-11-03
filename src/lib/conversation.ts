import { getVendorById, vendors, vendorsByCategory } from "@/data/vendors";
import type { Category, MenuItem, Vendor } from "@/data/types";
import { CATEGORIES } from "@/data/types";
import {
  addToCart,
  cartTotal,
  clearCart,
  formatArs,
  removeFromCart,
  type CartItem,
} from "@/lib/cart";
import { nearestOpenVendor, type LatLng } from "@/lib/haversine";
import {
  defaultIntentDetector,
  type IntentDetector,
} from "@/lib/intent";
import {
  buildOrderConfirmation,
  formatOrderMessage,
  type OrderConfirmation,
} from "@/lib/order";

export type SessionState = {
  category: Category | null;
  vendorId: string | null;
  cart: CartItem[];
  /** Si hay carrito y el usuario pidió otra categoría, esperamos sí/no */
  pendingCategory: Category | null;
  lastOrder: OrderConfirmation | null;
  userLocation: LatLng;
};

export type BotAction =
  | { type: "messages"; texts: string[] }
  | { type: "show_menu"; vendorId: string };

export type TurnResult = {
  state: SessionState;
  replies: string[];
  /** Ítems de menú para botones rápidos (vendor actual) */
  menuButtons: MenuItem[] | null;
};

export function initialSession(userLocation: LatLng): SessionState {
  return {
    category: null,
    vendorId: null,
    cart: [],
    pendingCategory: null,
    lastOrder: null,
    userLocation,
  };
}

function categoryList(): string {
  return CATEGORIES.join(", ");
}

function menuText(vendor: Vendor): string {
  const lines = vendor.menu.map(
    (m, i) => `${i + 1}. ${m.name} — ${formatArs(m.priceArs)}\n   ${m.description}`,
  );
  return [
    `Te recomiendo *${vendor.name}* (${vendor.isOpen ? "abierto" : "cerrado"}).`,
    vendor.address,
    `Horario: ${vendor.hours}`,
    "",
    "Menú:",
    ...lines,
    "",
    "Podés decir «agregar 1», «quitar muzzarella», usar los botones, o «confirmar pedido».",
  ].join("\n");
}

function findMenuItem(vendor: Vendor, text: string): MenuItem | null {
  const n = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // por número
  const num = n.match(/\b(\d{1,2})\b/);
  if (num) {
    const idx = Number(num[1]) - 1;
    if (idx >= 0 && idx < vendor.menu.length) return vendor.menu[idx]!;
  }
  // por nombre (substring)
  let best: MenuItem | null = null;
  for (const m of vendor.menu) {
    const name = m.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (n.includes(name) || name.split(" ").some((w) => w.length > 3 && n.includes(w))) {
      best = m;
      break;
    }
  }
  return best;
}

function isAffirmative(text: string): boolean {
  const n = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return /^(si|sí|ok|dale|confirmo|claro|yes|de una|vamos|vacio|vaciar|si vaciar|si,?\s*vaciar)\b/.test(
    n,
  ) || n === "s";
}

function isNegative(text: string): boolean {
  const n = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return /^(no|nop|nel|cancel|cancelar|mejor no|dejal[oa]|dejar)\b/.test(n) || n === "n";
}

function isConfirmOrder(text: string): boolean {
  const n = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return /\b(confirmar|confirm[oá]|cerrar pedido|finalizar|listo el pedido|hacer pedido)\b/.test(
    n,
  );
}

function isAdd(text: string): boolean {
  const n = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return /\b(agregar|agrega|suma|sumar|quiero|dame|pon[eé]|meter)\b/.test(n);
}

function isRemove(text: string): boolean {
  const n = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return /\b(quitar|quita|sacar|saca|eliminar|borra|borrar)\b/.test(n);
}

function selectVendorForCategory(
  state: SessionState,
  category: Category,
): { state: SessionState; replies: string[]; menuButtons: MenuItem[] | null } {
  const list = vendorsByCategory(category);
  const nearest = nearestOpenVendor(state.userLocation, list);
  if (!nearest) {
    return {
      state: { ...state, category, vendorId: null, cart: clearCart(), pendingCategory: null },
      replies: [
        `No hay locales de ${category} abiertos cerca tuyo ahora. Probá otra categoría: ${categoryList()}.`,
      ],
      menuButtons: null,
    };
  }
  const next: SessionState = {
    ...state,
    category,
    vendorId: nearest.id,
    cart: clearCart(),
    pendingCategory: null,
    lastOrder: null,
  };
  return {
    state: next,
    replies: [
      `Busqué ${category} cerca tuyo.`,
      menuText(nearest).replace(/\*/g, ""),
    ],
    menuButtons: nearest.menu,
  };
}

export function processUserText(
  state: SessionState,
  text: string,
  detector: IntentDetector = defaultIntentDetector,
): TurnResult {
  const trimmed = text.trim();

  // Confirmación de vaciar carrito
  if (state.pendingCategory) {
    if (isAffirmative(trimmed)) {
      return {
        ...selectVendorForCategory(state, state.pendingCategory),
      };
    }
    if (isNegative(trimmed)) {
      const vendor = state.vendorId ? getVendorById(state.vendorId) : null;
      return {
        state: { ...state, pendingCategory: null },
        replies: [
          `Dale, dejamos el pedido en ${vendor?.name ?? "el local actual"}. Seguí agregando o decí «confirmar pedido».`,
        ],
        menuButtons: vendor?.menu ?? null,
      };
    }
    return {
      state,
      replies: [
        `Tu carrito tiene ítems de ${state.category}. ¿Querés vaciarlo para pasar a ${state.pendingCategory}? Respondé sí o no.`,
      ],
      menuButtons: null,
    };
  }

  // Confirmar pedido
  if (isConfirmOrder(trimmed)) {
    if (!state.vendorId || state.cart.length === 0) {
      return {
        state,
        replies: [
          "No puedo confirmar: el carrito está vacío. Elegí una categoría y agregá ítems del menú.",
        ],
        menuButtons: state.vendorId
          ? (getVendorById(state.vendorId)?.menu ?? null)
          : null,
      };
    }
    const vendor = getVendorById(state.vendorId)!;
    const order = buildOrderConfirmation(vendor, cartTotal(state.cart));
    return {
      state: {
        ...state,
        lastOrder: order,
        cart: clearCart(),
      },
      replies: [formatOrderMessage(order)],
      menuButtons: null,
    };
  }

  // Agregar / quitar con vendor actual
  if (state.vendorId && (isAdd(trimmed) || isRemove(trimmed) || /^\d+$/.test(trimmed))) {
    const vendor = getVendorById(state.vendorId);
    if (vendor) {
      const item = findMenuItem(vendor, trimmed);
      if (!item && (isAdd(trimmed) || isRemove(trimmed))) {
        return {
          state,
          replies: [
            `No encontré ese ítem. Probá con el número o el nombre del menú.\n\nTotal actual: ${formatArs(cartTotal(state.cart))}`,
          ],
          menuButtons: vendor.menu,
        };
      }
      if (item) {
        if (isRemove(trimmed)) {
          const cart = removeFromCart(state.cart, item.id, 1);
          return {
            state: { ...state, cart },
            replies: [
              `Listo, quité 1× ${item.name}. Total: ${formatArs(cartTotal(cart))}`,
            ],
            menuButtons: vendor.menu,
          };
        }
        // add (o solo número)
        const cart = addToCart(state.cart, {
          menuItemId: item.id,
          name: item.name,
          priceArs: item.priceArs,
        });
        return {
          state: { ...state, cart },
          replies: [
            `Sumé 1× ${item.name} (${formatArs(item.priceArs)}). Total: ${formatArs(cartTotal(cart))}`,
          ],
          menuButtons: vendor.menu,
        };
      }
    }
  }

  const intent = detector.detectCategory(trimmed);

  if (intent.kind === "ambiguous") {
    return {
      state,
      replies: [
        `¿Cuál de estas categorías querés: ${intent.candidates.join(", ")}?`,
      ],
      menuButtons: null,
    };
  }

  if (intent.kind === "unknown") {
    return {
      state,
      replies: [
        `No estoy seguro. Podés pedir: ${categoryList()}.`,
      ],
      menuButtons: null,
    };
  }

  if (intent.kind === "category") {
    const nextCat = intent.category;
    if (state.cart.length > 0 && state.category && state.category !== nextCat) {
      return {
        state: { ...state, pendingCategory: nextCat },
        replies: [
          `Tenés ítems de ${state.category} en el carrito. ¿Querés vaciarlo para pedir ${nextCat}? (sí / no)`,
        ],
        menuButtons: null,
      };
    }
    if (state.category === nextCat && state.vendorId) {
      const vendor = getVendorById(state.vendorId)!;
      return {
        state,
        replies: [`Seguimos con ${vendor.name}.`, menuText(vendor).replace(/\*/g, "")],
        menuButtons: vendor.menu,
      };
    }
    return selectVendorForCategory(state, nextCat);
  }

  // sin intención clara
  if (!state.vendorId) {
    return {
      state,
      replies: [
        `Decime qué querés comer: ${categoryList()}. También podés tocar el mapa para marcar tu ubicación.`,
      ],
      menuButtons: null,
    };
  }

  const vendor = getVendorById(state.vendorId);
  return {
    state,
    replies: [
      `No te seguí. Podés agregar del menú, decir «confirmar pedido», o pedir otra categoría (${categoryList()}).\nTotal: ${formatArs(cartTotal(state.cart))}`,
    ],
    menuButtons: vendor?.menu ?? null,
  };
}

export function applyMenuButton(
  state: SessionState,
  menuItemId: string,
  action: "add" | "remove",
): TurnResult {
  if (!state.vendorId) {
    return {
      state,
      replies: ["Primero elegí una categoría (por ejemplo «pizza»)."],
      menuButtons: null,
    };
  }
  const vendor = getVendorById(state.vendorId);
  const item = vendor?.menu.find((m) => m.id === menuItemId);
  if (!vendor || !item) {
    return { state, replies: ["Ese ítem no está en el menú actual."], menuButtons: null };
  }
  const cart =
    action === "add"
      ? addToCart(state.cart, {
          menuItemId: item.id,
          name: item.name,
          priceArs: item.priceArs,
        })
      : removeFromCart(state.cart, item.id, 1);
  const verb = action === "add" ? "Sumé" : "Quité";
  return {
    state: { ...state, cart },
    replies: [`${verb} 1× ${item.name}. Total: ${formatArs(cartTotal(cart))}`],
    menuButtons: vendor.menu,
  };
}

export function vendorsForMap(state: SessionState): Vendor[] {
  if (!state.category) return [];
  return vendorsByCategory(state.category);
}

export { vendors };


export function relocateUser(state: SessionState, loc: LatLng): TurnResult {
  const nextBase: SessionState = { ...state, userLocation: loc };
  if (!state.category) {
    return {
      state: nextBase,
      replies: [
        "Marqué tu ubicación en el mapa. Decime qué querés comer: pizza, empanadas, hamburguesas, sushi o helado.",
      ],
      menuButtons: null,
    };
  }
  const list = vendorsByCategory(state.category);
  const nearest = nearestOpenVendor(loc, list);
  if (!nearest) {
    return {
      state: {
        ...nextBase,
        vendorId: null,
        cart: clearCart(),
      },
      replies: [
        `Actualicé tu ubicación. No hay locales de ${state.category} abiertos cerca.`,
      ],
      menuButtons: null,
    };
  }
  if (nearest.id === state.vendorId) {
    return {
      state: nextBase,
      replies: [
        `Actualicé tu ubicación. Seguimos con ${nearest.name} (sigue siendo el más cercano abierto).`,
      ],
      menuButtons: nearest.menu,
    };
  }
  // Cambió el más cercano: reiniciamos carrito del local anterior
  return {
    state: {
      ...nextBase,
      vendorId: nearest.id,
      cart: clearCart(),
      pendingCategory: null,
      lastOrder: null,
    },
    replies: [
      "Actualicé tu ubicación. El local más cercano cambió.",
      menuText(nearest).replace(/\*/g, ""),
    ],
    menuButtons: nearest.menu,
  };
}
