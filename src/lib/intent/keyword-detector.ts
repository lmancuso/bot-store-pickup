import { CATEGORIES, type Category } from "@/data/types";
import type { IntentDetector, IntentResult } from "./types";

const KEYWORDS: Record<Category, string[]> = {
  pizza: ["pizza", "pizzas", "pizzeria", "pizzería", "muzzarella", "muzza"],
  empanadas: ["empanada", "empanadas", "empandas"],
  hamburguesas: [
    "hamburguesa",
    "hamburguesas",
    "burger",
    "burgers",
    "hamburgesa",
  ],
  sushi: ["sushi", "sashimi", "roll", "rolls", "nigiri"],
  helado: ["helado", "helados", "heladeria", "heladería", "cucurucho"],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export class KeywordIntentDetector implements IntentDetector {
  detectCategory(text: string): IntentResult {
    const n = normalize(text);
    if (!n.trim()) return { kind: "none" };

    const hits = new Set<Category>();
    for (const category of CATEGORIES) {
      for (const kw of KEYWORDS[category]) {
        const needle = normalize(kw);
        // palabra completa o substring con límites simples
        if (
          n === needle ||
          n.includes(` ${needle} `) ||
          n.startsWith(`${needle} `) ||
          n.endsWith(` ${needle}`) ||
          n.includes(needle)
        ) {
          hits.add(category);
          break;
        }
      }
    }

    if (hits.size === 1) {
      return { kind: "category", category: [...hits][0]! };
    }
    if (hits.size > 1) {
      return { kind: "ambiguous", candidates: [...hits] };
    }

    // ¿parece pedido de comida sin categoría conocida?
    const foodish =
      /\b(quiero|pedido|pedir|comer|algo rico|comida|menu|menú)\b/.test(n);
    if (foodish) {
      return { kind: "unknown", text };
    }
    return { kind: "none" };
  }
}

export const defaultIntentDetector: IntentDetector = new KeywordIntentDetector();
