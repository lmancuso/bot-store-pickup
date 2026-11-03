import { describe, expect, it } from "vitest";
import { haversineKm, nearestOpenVendor } from "@/lib/haversine";
import { DEFAULT_USER_LOCATION, vendorsByCategory } from "@/data/vendors";

describe("haversine", () => {
  it("returns 0 for the same point", () => {
    const p = { lat: -34.6037, lng: -58.3816 };
    expect(haversineKm(p, p)).toBe(0);
  });

  it("computes a sane distance Obelisco → approx 1km north", () => {
    const a = { lat: -34.6037, lng: -58.3816 };
    const b = { lat: -34.5947, lng: -58.3816 };
    const d = haversineKm(a, b);
    expect(d).toBeGreaterThan(0.9);
    expect(d).toBeLessThan(1.2);
  });

  it("picks the nearest OPEN pizza vendor near Obelisco", () => {
    const pizzas = vendorsByCategory("pizza");
    const nearest = nearestOpenVendor(DEFAULT_USER_LOCATION, pizzas);
    expect(nearest).not.toBeNull();
    expect(nearest!.isOpen).toBe(true);
    expect(nearest!.category).toBe("pizza");
    // Don Tomás is the closest open one in the mock
    expect(nearest!.id).toBe("pizza-don-tomas");
  });

  it("ignores closed vendors", () => {
    const onlyClosed = [
      {
        id: "a",
        lat: -34.6037,
        lng: -58.3816,
        isOpen: false,
      },
      {
        id: "b",
        lat: -34.61,
        lng: -58.39,
        isOpen: true,
      },
    ];
    const nearest = nearestOpenVendor(DEFAULT_USER_LOCATION, onlyClosed);
    expect(nearest?.id).toBe("b");
  });

  it("returns null when all closed", () => {
    const allClosed = vendorsByCategory("pizza").map((v) => ({ ...v, isOpen: false }));
    expect(nearestOpenVendor(DEFAULT_USER_LOCATION, allClosed)).toBeNull();
  });

  it("breaks ties by id", () => {
    const user = { lat: 0, lng: 0 };
    const vendors = [
      { id: "z", lat: 0, lng: 0.01, isOpen: true },
      { id: "a", lat: 0, lng: 0.01, isOpen: true },
    ];
    expect(nearestOpenVendor(user, vendors)?.id).toBe("a");
  });
});
