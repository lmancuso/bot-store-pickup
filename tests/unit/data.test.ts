import { describe, expect, it } from "vitest";
import { CATEGORIES, vendors, vendorsByCategory } from "@/data";

describe("mock data integrity", () => {
  it("has exactly 5 categories", () => {
    expect(CATEGORIES).toEqual([
      "pizza",
      "empanadas",
      "hamburguesas",
      "sushi",
      "helado",
    ]);
  });

  it("has 3 vendors per category", () => {
    for (const category of CATEGORIES) {
      expect(vendorsByCategory(category)).toHaveLength(3);
    }
  });

  it("vendors have unique ids, coords near BA, menu with ARS prices", () => {
    const ids = new Set<string>();
    for (const v of vendors) {
      expect(ids.has(v.id)).toBe(false);
      ids.add(v.id);
      expect(v.name.length).toBeGreaterThan(2);
      expect(v.lat).toBeGreaterThan(-35);
      expect(v.lat).toBeLessThan(-34);
      expect(v.lng).toBeGreaterThan(-59);
      expect(v.lng).toBeLessThan(-58);
      expect(v.address.length).toBeGreaterThan(5);
      expect(v.hours.length).toBeGreaterThan(3);
      expect(typeof v.isOpen).toBe("boolean");
      expect(v.menu.length).toBeGreaterThanOrEqual(2);
      for (const m of v.menu) {
        expect(m.priceArs).toBeGreaterThan(0);
        expect(Number.isInteger(m.priceArs)).toBe(true);
      }
    }
    expect(vendors).toHaveLength(15);
  });
});
