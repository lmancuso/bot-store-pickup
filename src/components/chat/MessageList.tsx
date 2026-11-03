"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/chat-storage";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

type MessageListProps = {
  messages: ChatMessage[];
  isTyping: boolean;
};

export function MessageList({ messages, isTyping }: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <div
      className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Historial del chat"
      data-testid="message-list"
    >
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      {isTyping ? <TypingIndicator /> : null}
      <div ref={endRef} />
    </div>
  );
}
