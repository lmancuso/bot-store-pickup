import type { Category } from "@/data/types";
import type { CartItem } from "@/lib/cart";
import type { OrderConfirmation } from "@/lib/order";
import type { SessionState } from "@/lib/conversation";
import { DEFAULT_USER_LOCATION } from "@/data/vendors";

export type MessageStatus = "sent" | "delivered" | "read";
export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: string;
  status?: MessageStatus;
};

export const CHAT_STORAGE_KEY = "store-pickup-chat:v1";

export type StoredPayload = {
  messages: ChatMessage[];
  session: SessionState;
};

const WELCOME_TEXT =
  "¡Hola! Soy tu asistente de Store Pickup. Decime qué tenés ganas de comer: pizza, empanadas, hamburguesas, sushi o helado. Si querés, tocá el mapa para marcar tu ubicación.";

export function createWelcomeMessage(now = new Date()): ChatMessage {
  return {
    id: `welcome-${now.getTime()}`,
    role: "assistant",
    text: WELCOME_TEXT,
    createdAt: now.toISOString(),
    status: "read",
  };
}

function isMessageStatus(value: unknown): value is MessageStatus {
  return value === "sent" || value === "delivered" || value === "read";
}

function isChatRole(value: unknown): value is ChatRole {
  return value === "user" || value === "assistant";
}

export function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  if (typeof m.id !== "string" || m.id.length === 0) return false;
  if (!isChatRole(m.role)) return false;
  if (typeof m.text !== "string") return false;
  if (typeof m.createdAt !== "string" || Number.isNaN(Date.parse(m.createdAt))) {
    return false;
  }
  if (m.status !== undefined && !isMessageStatus(m.status)) return false;
  return true;
}

export function parseStoredMessages(raw: string | null): ChatMessage[] {
  if (raw == null || raw.trim() === "") return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    // legacy: array of messages
    if (Array.isArray(parsed)) return parsed.filter(isChatMessage);
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as StoredPayload).messages)) {
      return (parsed as StoredPayload).messages.filter(isChatMessage);
    }
    return [];
  } catch {
    return [];
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const i = value as Record<string, unknown>;
  return (
    typeof i.menuItemId === "string" &&
    typeof i.name === "string" &&
    typeof i.priceArs === "number" &&
    typeof i.qty === "number"
  );
}

function parseSession(raw: unknown): SessionState {
  const fallback: SessionState = {
    category: null,
    vendorId: null,
    cart: [],
    pendingCategory: null,
    lastOrder: null,
    userLocation: {
      lat: DEFAULT_USER_LOCATION.lat,
      lng: DEFAULT_USER_LOCATION.lng,
    },
  };
  if (!raw || typeof raw !== "object") return fallback;
  const s = raw as Partial<SessionState>;
  const loc =
    s.userLocation &&
    typeof s.userLocation.lat === "number" &&
    typeof s.userLocation.lng === "number"
      ? s.userLocation
      : fallback.userLocation;
  return {
    category: (s.category as Category | null) ?? null,
    vendorId: typeof s.vendorId === "string" ? s.vendorId : null,
    cart: Array.isArray(s.cart) ? s.cart.filter(isCartItem) : [],
    pendingCategory: (s.pendingCategory as Category | null) ?? null,
    lastOrder: (s.lastOrder as OrderConfirmation | null) ?? null,
    userLocation: loc,
  };
}

export function parseStoredPayload(raw: string | null): StoredPayload {
  const emptySession = parseSession(null);
  if (raw == null || raw.trim() === "") {
    return { messages: [], session: emptySession };
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { messages: parsed.filter(isChatMessage), session: emptySession };
    }
    if (parsed && typeof parsed === "object") {
      const p = parsed as Record<string, unknown>;
      return {
        messages: Array.isArray(p.messages) ? p.messages.filter(isChatMessage) : [],
        session: parseSession(p.session),
      };
    }
    return { messages: [], session: emptySession };
  } catch {
    return { messages: [], session: emptySession };
  }
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPayload(): StoredPayload {
  if (!canUseStorage()) {
    return {
      messages: [],
      session: parseSession(null),
    };
  }
  try {
    return parseStoredPayload(window.localStorage.getItem(CHAT_STORAGE_KEY));
  } catch {
    return { messages: [], session: parseSession(null) };
  }
}

/** @deprecated prefer loadPayload */
export function loadMessages(): ChatMessage[] {
  return loadPayload().messages;
}

export function savePayload(payload: StoredPayload): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  if (!canUseStorage()) return;
  try {
    const current = loadPayload();
    savePayload({ ...current, messages });
  } catch {
    // ignore
  }
}

export function clearMessages(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    // ignore
  }
}
