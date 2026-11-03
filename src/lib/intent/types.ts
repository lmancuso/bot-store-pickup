import type { Category } from "@/data/types";

export type IntentResult =
  | { kind: "category"; category: Category }
  | { kind: "ambiguous"; candidates: Category[] }
  | { kind: "unknown"; text: string }
  | { kind: "none" };

/** Interfaz intercambiable (keywords hoy, LLM mañana). */
export interface IntentDetector {
  detectCategory(text: string): IntentResult;
}
