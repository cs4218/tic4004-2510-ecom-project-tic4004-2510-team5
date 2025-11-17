import { addToCart, removeFromCart } from "../../utils/cartUtils";

describe("Cart Functionality", () => {
  test("should add product to cart", () => {
    const cart = [];
    const updated = addToCart(cart, { id: 1, name: "Laptop" });
    expect(updated.length).toBe(1);
  });

  test("should remove product from cart", () => {
    const cart = [{ id: 1, name: "Laptop" }];
    const updated = removeFromCart(cart, 1);
    expect(updated.length).toBe(0);
  });

  test("adding duplicate product increments count", () => {
    const cart = [{ id: 1, name: "Laptop", qty: 1 }];
    const updated = addToCart(cart, { id: 1, name: "Laptop" });
    expect(updated[0].qty).toBe(2);
  });

  test("removing non-existent product does nothing", () => {
    const cart = [{ id: 1, name: "Laptop" }];
    const updated = removeFromCart(cart, 2);
    expect(updated.length).toBe(1);
  });

  test("adding invalid product object should not change cart", () => {
    const cart = [];
    const updated = addToCart(cart, {});
    expect(updated.length).toBe(0);
  });
});
