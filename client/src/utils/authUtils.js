export function validateLogin(email, password) {
  const validEmail = "user@example.com";
  const validPassword = "password123";

  if (!email || !password) return false;
  return email === validEmail && password === validPassword;
}
