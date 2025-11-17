export function addToCart(cart, product) {
  return [...cart, product];
}

export function removeFromCart(cart, productId) {
  return cart.filter(item => item.id !== productId);
}
