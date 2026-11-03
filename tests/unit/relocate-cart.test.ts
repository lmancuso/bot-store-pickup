import { describe, expect, it } from "vitest";
import { DEFAULT_USER_LOCATION } from "@/data/vendors";
import { initialSession, processUserText, relocateUser } from "@/lib/conversation";

describe("relocate with cart (TC-09 style)", () => {
  it("asks before switching vendor when cart has items", () => {
    let state = initialSession({
      lat: DEFAULT_USER_LOCATION.lat,
      lng: DEFAULT_USER_LOCATION.lng,
    });
    state = processUserText(state, "pizza").state;
    expect(state.vendorId).toBe("pizza-don-tomas");
    state = processUserText(state, "agregar 1").state;
    expect(state.cart.length).toBeGreaterThan(0);

    // Cerca de La Nona de Palermo
    const nearNona = { lat: -34.5895, lng: -58.3972 };
    const ask = relocateUser(state, nearNona);
    expect(ask.state.pendingRelocate?.vendorId).toBe("pizza-nona-palermo");
    expect(ask.state.vendorId).toBe("pizza-don-tomas");
    expect(ask.state.cart.length).toBeGreaterThan(0);
    expect(ask.state.userLocation).toEqual(state.userLocation);
    expect(ask.replies.join(" ")).toMatch(/vaciar/i);

    const no = processUserText(ask.state, "no");
    expect(no.state.pendingRelocate).toBeNull();
    expect(no.state.vendorId).toBe("pizza-don-tomas");
    expect(no.state.cart.length).toBeGreaterThan(0);
    expect(no.state.userLocation).toEqual(state.userLocation);

    const ask2 = relocateUser(no.state, nearNona);
    const yes = processUserText(ask2.state, "sí");
    expect(yes.state.pendingRelocate).toBeNull();
    expect(yes.state.vendorId).toBe("pizza-nona-palermo");
    expect(yes.state.cart).toEqual([]);
    expect(yes.state.userLocation).toEqual(nearNona);
  });

  it("switches immediately when cart is empty", () => {
    let state = initialSession({
      lat: DEFAULT_USER_LOCATION.lat,
      lng: DEFAULT_USER_LOCATION.lng,
    });
    state = processUserText(state, "pizza").state;
    const nearNona = { lat: -34.5895, lng: -58.3972 };
    const moved = relocateUser(state, nearNona);
    expect(moved.state.pendingRelocate).toBeNull();
    expect(moved.state.vendorId).toBe("pizza-nona-palermo");
    expect(moved.state.userLocation).toEqual(nearNona);
  });
});
