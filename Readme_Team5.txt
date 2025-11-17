RUNNING THE TESTS

UNIT TESTS:

Run all unit tests:
npm test

Run specific component tests:
npm test -- Login.test.js
npm test -- SearchInput.test.js
npm test -- CartPage.test.js
npm test -- Profile.test.js
npm test -- ProductDetails.test.js
npm test -- Search.test.js

Run with coverage:
npm test -- --coverage

---

UI TESTS:

Ensure servers are running first

Terminal 1 - Backend:
npm run server

Terminal 2 - Frontend:
cd client && npm start

Terminal 3 - Run Playwright tests:
npx playwright test

Run specific test file:
npx playwright test tests/auth.spec.js
npx playwright test tests/shopping.spec.js

View test report:
npx playwright show-report



TESTS BREAKDOWNW
UNIT TESTS (20 TOTAL)

Login Component (4 tests)
File: client/src/pages/Auth/Login.test.js

1. Test 1 - Boundary Value Analysis: Empty email field validation
2. Test 2 - Boundary Value Analysis: Empty password field validation
3. Test 3 - Equivalence Partitioning: Invalid email format validation
4. Test 4 - Decision Table: Forgot password navigation

SearchInput Component (3 tests)
File: client/src/components/Form/SearchInput.test.js

5. Test 5 - Equivalence Partitioning: Search input updates keyword state
6. Test 6 - Decision Table: Search submission with valid keyword
7. Test 7 - Boundary Value Analysis: Empty search keyword

CartPage Component (3 tests)
File: client/src/pages/CartPage.test.js

8. Test 8 - Equivalence Partitioning: Empty cart display
9. Test 9 - Boundary Value Analysis: Total price calculation with multiple items
10. Test 10 - State Management: Remove item from cart

Profile Component (3 tests)
File: client/src/pages/user/Profile.test.js

11. Test 11 - State Management: Profile form pre-populates with user data
12. Test 12 - Decision Table: Successful profile update
13. Test 13 - Error Handling: Profile update failure

ProductDetails Component (4 tests)
File: client/src/pages/ProductDetails.test.js

14. Test 14 - Decision Table: Product details load correctly with valid slug
15. Test 15 - Equivalence Partitioning: Related products display for product category
16. Test 16 - Boundary Value Analysis: No related products found
17. Test 17 - Error Handling: Product fetch failure

Search Results Component (3 tests)
File: client/src/pages/Search.test.js

18. Test 18 - Boundary Value Analysis: Empty search results display
19. Test 19 - Equivalence Partitioning: Display correct count of search results
20. Test 20 - Equivalence Partitioning: Product cards render for results

========================================================

UI TESTS BREAKDOWN (6 TOTAL)

3 UI TESTS
File: tests/auth.spec.js

1. UI-1: Complete user registration flow successfully
   - Tests full registration process from form fill to submission

2. UI-2: Login with valid credentials and access dashboard
   - Creates a test account via registration, then verifies successful login and navigation

3. UI-3: Show error when login with invalid credentials
   - Tests error handling for failed login attempts

---
3 UI TESTS
File: tests/shopping.spec.js

4. UI-4: Browse products and view product details
   - Tests navigation from homepage to product details page

5. UI-5: Search functionality and display results
   - Tests search input, submission, and results display

6. UI-6: Add product to cart and verify cart page
   - Tests add to cart flow and cart page display
