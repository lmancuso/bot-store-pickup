import { beforeEach, describe, expect, it } from "vitest";
import {
  CHAT_STORAGE_KEY,
  createWelcomeMessage,
  parseStoredMessages,
  parseStoredPayload,
  savePayload,
  loadPayload,
} from "@/lib/chat-storage";
import { initialSession } from "@/lib/conversation";
import { DEFAULT_USER_LOCATION } from "@/data/vendors";

describe("chat persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("parses a valid message array", () => {
    const msg = createWelcomeMessage(new Date("2026-11-03T12:00:00.000Z"));
    const parsed = parseStoredMessages(JSON.stringify([msg]));
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.text).toContain("Store Pickup");
  });

  it("tolerates corrupt JSON", () => {
    expect(parseStoredMessages("{not-json")).toEqual([]);
    expect(parseStoredMessages("null")).toEqual([]);
    expect(parseStoredMessages('"hola"')).toEqual([]);
    expect(parseStoredPayload("{{")).toEqual({
      messages: [],
      session: expect.objectContaining({
        category: null,
        cart: [],
      }),
    });
  });

  it("drops invalid message shapes", () => {
    const raw = JSON.stringify([
      { id: "1", role: "user", text: "hola", createdAt: "2026-11-03T12:00:00.000Z" },
      { id: "2", role: "alien", text: "x", createdAt: "2026-11-03T12:00:00.000Z" },
      { foo: true },
    ]);
    expect(parseStoredMessages(raw)).toHaveLength(1);
  });

  it("round-trips payload in localStorage", () => {
    const messages = [createWelcomeMessage()];
    const session = initialSession({
      lat: DEFAULT_USER_LOCATION.lat,
      lng: DEFAULT_USER_LOCATION.lng,
    });
    savePayload({ messages, session });
    expect(window.localStorage.getItem(CHAT_STORAGE_KEY)).toBeTruthy();
    const loaded = loadPayload();
    expect(loaded.messages).toHaveLength(1);
    expect(loaded.session.userLocation.lat).toBeCloseTo(DEFAULT_USER_LOCATION.lat);
  });
});
