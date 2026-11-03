"use client";

import { useId, useState, type FormEvent, type KeyboardEvent } from "react";

type ChatInputProps = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

export function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputId = useId();

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-end gap-2 border-t border-chat-input-border bg-chat-input-bar px-2 py-2"
      aria-label="Enviar mensaje"
    >
      <label htmlFor={inputId} className="sr-only">
        Escribí tu mensaje
      </label>
      <textarea
        id={inputId}
        name="message"
        rows={1}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribí un mensaje"
        className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-chat-input-border bg-white px-3 py-2.5 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-chat-accent disabled:opacity-60"
        aria-required="true"
        data-testid="chat-input"
      />
      <button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-chat-accent px-4 text-sm font-semibold text-white transition hover:bg-chat-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Enviar"
        data-testid="chat-send"
      >
        Enviar
      </button>
    </form>
  );
}
