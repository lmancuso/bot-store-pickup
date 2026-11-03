import { describe, expect, it } from "vitest";
import { KeywordIntentDetector } from "@/lib/intent";

describe("KeywordIntentDetector", () => {
  const detector = new KeywordIntentDetector();

  it.each([
    ["pizza", "pizza"],
    ["Pizza", "pizza"],
    ["quiero una pizza", "pizza"],
    ["pizzas", "pizza"],
    ["PIZZA", "pizza"],
    ["empanadas", "empanadas"],
    ["unas empanadas salteñas", "empanadas"],
    ["hamburguesa doble", "hamburguesas"],
    ["sushi por favor", "sushi"],
    ["helado de ddl", "helado"],
  ] as const)("detects %s → %s", (text, category) => {
    const result = detector.detectCategory(text);
    expect(result).toEqual({ kind: "category", category });
  });

  it("asks on ambiguity", () => {
    const result = detector.detectCategory("pizza o sushi");
    expect(result.kind).toBe("ambiguous");
    if (result.kind === "ambiguous") {
      expect(result.candidates).toEqual(expect.arrayContaining(["pizza", "sushi"]));
    }
  });

  it("returns unknown for vague food talk", () => {
    const result = detector.detectCategory("algo rico");
    expect(result.kind).toBe("unknown");
  });

  it("returns none for unrelated text", () => {
    expect(detector.detectCategory("hola")).toEqual({ kind: "none" });
  });
});
