type ChatHeaderProps = {
  name?: string;
  subtitle?: string;
};

export function ChatHeader({
  name = "Store Pickup",
  subtitle = "en línea",
}: ChatHeaderProps) {
  return (
    <header
      className="flex shrink-0 items-center gap-3 border-b border-chat-header-border bg-chat-header px-3 py-2.5 text-chat-header-fg"
      role="banner"
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full bg-chat-accent text-sm font-semibold text-white"
        aria-hidden="true"
      >
        SP
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold leading-tight">{name}</h1>
        <p className="truncate text-xs text-chat-header-muted">{subtitle}</p>
      </div>
    </header>
  );
}
