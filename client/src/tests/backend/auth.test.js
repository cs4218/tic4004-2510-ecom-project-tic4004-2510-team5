import { validateLogin } from "../../utils/authUtils"; // adjust path if needed

describe("Authentication Logic", () => {
  test("should pass for valid credentials", () => {
    const result = validateLogin("user@example.com", "password123");
    expect(result).toBe(true);
  });

  test("should fail for incorrect password", () => {
    const result = validateLogin("user@example.com", "wrongpass");
    expect(result).toBe(false);
  });

  test("should fail for empty username", () => {
    const result = validateLogin("", "password123");
    expect(result).toBe(false);
  });

  test("empty password should fail", () => {
    expect(validateLogin("user@example.com", "")).toBe(false);
  });

  test("both username and password empty should fail", () => {
    expect(validateLogin("", "")).toBe(false);
  });

  test("invalid email format should fail", () => {
    expect(validateLogin("userexample.com", "password123")).toBe(false);
  });

  test("SQL injection attempt should fail", () => {
    expect(validateLogin("user@example.com' OR 1=1 --", "password123")).toBe(
      false
    );
  });

  test("password with special characters should pass", () => {
    expect(validateLogin("user@example.com", "P@ssw0rd!")).toBe(true);
  });
});
