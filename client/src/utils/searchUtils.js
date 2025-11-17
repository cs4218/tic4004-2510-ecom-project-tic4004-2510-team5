export function searchProducts(products, query) {
  const q = query.toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(q));
}
