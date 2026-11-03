export function TypingIndicator() {
  return (
    <div
      className="flex justify-start"
      data-testid="typing-indicator"
      role="status"
      aria-live="polite"
      aria-label="El asistente está escribiendo"
    >
      <div className="rounded-2xl rounded-bl-md bg-chat-bubble-bot px-4 py-3 text-chat-bubble-bot-muted shadow-sm">
        <span className="sr-only">escribiendo…</span>
        <span className="inline-flex items-center gap-1" aria-hidden="true">
          <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
        </span>
      </div>
    </div>
  );
}
