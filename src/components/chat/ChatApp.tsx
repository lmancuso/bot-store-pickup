"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MenuItem } from "@/data/types";
import { DEFAULT_USER_LOCATION } from "@/data/vendors";
import { StoreMapDynamic } from "@/components/map/StoreMapDynamic";
import { cartTotal, formatArs } from "@/lib/cart";
import {
  type ChatMessage,
  createWelcomeMessage,
  loadPayload,
  savePayload,
} from "@/lib/chat-storage";
import {
  applyMenuButton,
  initialSession,
  processUserText,
  relocateUser,
  vendorsForMap,
  type SessionState,
} from "@/lib/conversation";
import { nearestOpenVendor, type LatLng } from "@/lib/haversine";
import { BOT_REPLY_DELAY_MS } from "@/lib/bot-reply";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MenuButtons } from "./MenuButtons";
import { MessageList } from "./MessageList";

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function assistantMessages(texts: string[]): ChatMessage[] {
  const now = Date.now();
  return texts.map((text, i) => ({
    id: newId(`bot-${now}-${i}`),
    role: "assistant" as const,
    text,
    createdAt: new Date(now + i).toISOString(),
    status: "read" as const,
  }));
}

export function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<SessionState>(() =>
    initialSession({
      lat: DEFAULT_USER_LOCATION.lat,
      lng: DEFAULT_USER_LOCATION.lng,
    }),
  );
  const [menuButtons, setMenuButtons] = useState<MenuItem[] | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [geoLabel, setGeoLabel] = useState("Ubicación: Obelisco (por defecto)");
  const sessionRef = useRef(session);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      const payload = loadPayload();
      if (payload.messages.length > 0) {
        setMessages(payload.messages);
        setSession(payload.session);
      } else {
        setMessages([createWelcomeMessage()]);
      }
      setHydrated(true);
    }, 0);

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          const loc: LatLng = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setSession((s) => ({ ...s, userLocation: loc }));
          setGeoLabel("Ubicación: GPS del navegador");
        },
        () => {
          if (cancelled) return;
          setGeoLabel("Ubicación: Obelisco (permiso denegado o error)");
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    } else {
      window.setTimeout(() => {
        if (!cancelled) setGeoLabel("Ubicación: Obelisco (sin geolocalización)");
      }, 0);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePayload({ messages, session });
  }, [messages, session, hydrated]);

  useEffect(() => {
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    };
  }, []);

  const mapVendors = useMemo(() => vendorsForMap(session), [session]);
  const highlightedId = useMemo(() => {
    if (!session.category) return session.vendorId;
    return nearestOpenVendor(session.userLocation, mapVendors)?.id ?? session.vendorId;
  }, [session, mapVendors]);

  const enqueueBot = useCallback(
    (texts: string[], nextSession: SessionState, menu: MenuItem[] | null) => {
      setIsTyping(true);
      if (replyTimer.current) clearTimeout(replyTimer.current);
      replyTimer.current = setTimeout(() => {
        setSession(nextSession);
        setMenuButtons(menu);
        setMessages((prev) => [...prev, ...assistantMessages(texts)]);
        setIsTyping(false);
      }, BOT_REPLY_DELAY_MS);
    },
    [],
  );

  const handleSend = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: newId("user"),
        role: "user",
        text,
        createdAt: new Date().toISOString(),
        status: "sent",
      };
      setMessages((prev) => [...prev, { ...userMsg, status: "read" }]);
      const result = processUserText(sessionRef.current, text);
      enqueueBot(result.replies, result.state, result.menuButtons);
    },
    [enqueueBot],
  );

  const handleMenu = useCallback(
    (id: string, action: "add" | "remove") => {
      setMessages((prev) => [
        ...prev,
        {
          id: newId("user"),
          role: "user",
          text: action === "add" ? "Agregar del menú" : "Quitar del menú",
          createdAt: new Date().toISOString(),
          status: "read",
        },
      ]);
      const result = applyMenuButton(sessionRef.current, id, action);
      enqueueBot(result.replies, result.state, result.menuButtons);
    },
    [enqueueBot],
  );

  const handlePickLocation = useCallback(
    (pos: LatLng) => {
      setGeoLabel("Ubicación: elegida en el mapa");
      const result = relocateUser(sessionRef.current, pos);
      setSession(result.state);
      setMenuButtons(result.menuButtons);
      setMessages((prev) => [...prev, ...assistantMessages(result.replies)]);
    },
    [],
  );

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.webdriver) return;
    const w = window as Window & {
      __storePickupPickLocation?: (pos: LatLng) => void;
    };
    w.__storePickupPickLocation = handlePickLocation;
    return () => {
      delete w.__storePickupPickLocation;
    };
  }, [handlePickLocation]);

  const total = cartTotal(session.cart);
  const subtitle = isTyping
    ? "escribiendo…"
    : total > 0
      ? `Carrito ${formatArs(total)} · ${geoLabel}`
      : geoLabel;

  return (
    <div className="flex h-[100dvh] w-full flex-col md:flex-row" data-testid="chat-app">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-chat-wallpaper md:max-w-xl md:border-r md:border-zinc-200 lg:max-w-lg">
        <ChatHeader subtitle={subtitle} />
        <MessageList messages={messages} isTyping={isTyping} />
        {menuButtons ? (
          <MenuButtons
            items={menuButtons}
            disabled={!hydrated || isTyping}
            onAdd={(id) => handleMenu(id, "add")}
            onRemove={(id) => handleMenu(id, "remove")}
          />
        ) : null}
        <ChatInput disabled={!hydrated || isTyping} onSend={handleSend} />
      </section>
      <section className="h-52 shrink-0 border-t border-zinc-200 md:h-auto md:min-h-0 md:flex-1 md:border-t-0">
        <StoreMapDynamic
          user={session.userLocation}
          vendors={mapVendors}
          highlightedVendorId={highlightedId}
          onPickLocation={handlePickLocation}
        />
      </section>
    </div>
  );
}
