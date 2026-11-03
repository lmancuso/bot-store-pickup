import type { ChatMessage } from "@/lib/chat-storage";

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

function Ticks({ status }: { status?: ChatMessage["status"] }) {
  if (!status) return null;
  const label =
    status === "read" ? "Leído" : status === "delivered" ? "Entregado" : "Enviado";
  const color =
    status === "read" ? "text-sky-300" : "text-chat-bubble-user-muted";
  return (
    <span className={`ml-1 inline-flex tracking-tighter ${color}`} aria-label={label}>
      {status === "sent" ? "✓" : "✓✓"}
    </span>
  );
}

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
      data-testid={isUser ? "bubble-user" : "bubble-assistant"}
    >
      <div
        className={[
          "max-w-[85%] rounded-2xl px-3 py-2 text-[15px] leading-snug shadow-sm",
          isUser
            ? "rounded-br-md bg-chat-bubble-user text-chat-bubble-user-fg"
            : "rounded-bl-md bg-chat-bubble-bot text-chat-bubble-bot-fg",
        ].join(" ")}
        role="article"
        aria-label={isUser ? "Tu mensaje" : "Mensaje del asistente"}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <div
          className={[
            "mt-1 flex items-center justify-end gap-0.5 text-[11px]",
            isUser ? "text-chat-bubble-user-muted" : "text-chat-bubble-bot-muted",
          ].join(" ")}
        >
          <time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
          {isUser ? <Ticks status={message.status} /> : null}
        </div>
      </div>
    </div>
  );
}
