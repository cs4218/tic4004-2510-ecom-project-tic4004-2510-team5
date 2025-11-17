import { searchProducts } from "../../utils/searchUtils";

describe("Product Search", () => {
  test("should return matching products", () => {
    const products = [{ name: "Laptop" }, { name: "Phone" }, { name: "Lamp" }];
    const results = searchProducts(products, "lap");
    expect(results).toHaveLength(1);
  });

  test("should be case-insensitive", () => {
    const products = [{ name: "Shoes" }];
    const results = searchProducts(products, "shoes");
    expect(results).toHaveLength(1);
  });

  test("empty search returns empty array", () => {
    const products = [{ name: "Laptop" }];
    expect(searchProducts(products, "")).toEqual([]);
  });

  test("non-matching search returns empty array", () => {
    const products = [{ name: "Lamp" }];
    expect(searchProducts(products, "Phone")).toEqual([]);
  });

  test("partial match in middle of string", () => {
    const products = [{ name: "Table Lamp" }];
    expect(searchProducts(products, "Lamp")).toHaveLength(1);
  });

  test("partial match at start of string", () => {
    const products = [{ name: "Table Lamp" }];
    expect(searchProducts(products, "Table")).toHaveLength(1);
  });
});
