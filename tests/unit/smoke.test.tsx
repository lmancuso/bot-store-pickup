import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("renders a component", () => {
    render(<h1>Store Pickup</h1>);
    expect(screen.getByRole("heading", { name: "Store Pickup" })).toBeInTheDocument();
  });
});
