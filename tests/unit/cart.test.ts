import { describe, expect, it } from "vitest";
import { addToCart, cartTotal, clearCart, removeFromCart } from "@/lib/cart";
import { initialSession, processUserText } from "@/lib/conversation";
import { DEFAULT_USER_LOCATION } from "@/data/vendors";

describe("cart", () => {
  it("adds, totals, removes and clears", () => {
    let cart = addToCart([], {
      menuItemId: "a",
      name: "A",
      priceArs: 1000,
    });
    cart = addToCart(cart, { menuItemId: "a", name: "A", priceArs: 1000 });
    cart = addToCart(cart, { menuItemId: "b", name: "B", priceArs: 500 }, 2);
    expect(cartTotal(cart)).toBe(3000);
    cart = removeFromCart(cart, "a", 1);
    expect(cartTotal(cart)).toBe(2000);
    cart = removeFromCart(cart, "a", 5);
    expect(cart.find((i) => i.menuItemId === "a")).toBeUndefined();
    expect(clearCart()).toEqual([]);
  });
});

describe("category switch with cart (TC-09)", () => {
  it("asks before clearing and only clears on yes", () => {
    let state = initialSession({
      lat: DEFAULT_USER_LOCATION.lat,
      lng: DEFAULT_USER_LOCATION.lng,
    });
    state = processUserText(state, "pizza").state;
    state = processUserText(state, "agregar 1").state;
    expect(state.cart.length).toBeGreaterThan(0);

    const ask = processUserText(state, "empanadas");
    expect(ask.state.pendingCategory).toBe("empanadas");
    expect(ask.replies.join(" ")).toMatch(/vaciar/i);
    expect(ask.state.cart.length).toBeGreaterThan(0);

    const no = processUserText(ask.state, "no");
    expect(no.state.pendingCategory).toBeNull();
    expect(no.state.category).toBe("pizza");
    expect(no.state.cart.length).toBeGreaterThan(0);

    const ask2 = processUserText(no.state, "empanadas");
    const yes = processUserText(ask2.state, "sí");
    expect(yes.state.category).toBe("empanadas");
    expect(yes.state.cart).toEqual([]);
    expect(yes.state.vendorId).toBeTruthy();
  });
});
