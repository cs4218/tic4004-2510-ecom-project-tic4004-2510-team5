import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import toast from 'react-hot-toast';
import CartPage from './CartPage';

// Mocking dependencies
jest.mock('axios');
jest.mock('react-hot-toast');
jest.mock('braintree-web-drop-in-react', () => {
  return function MockDropIn() {
    return <div data-testid="braintree-dropin">Braintree Drop In</div>;
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockSetAuth = jest.fn();
const mockSetCart = jest.fn();

jest.mock('../context/auth', () => ({
  useAuth: jest.fn(() => [null, mockSetAuth])
}));

jest.mock('../context/cart', () => ({
  useCart: jest.fn(() => [[], mockSetCart])
}));

const mockSetValues = jest.fn();
jest.mock('../context/search', () => ({
  useSearch: jest.fn(() => [{ keyword: '' }, mockSetValues])
}));

const { useAuth } = require('../context/auth');
const { useCart } = require('../context/cart');

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

describe('CartPage Component - Member 1 Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Member 1 - Test 8: Equivalence Partitioning - Empty cart display
  it('should display "Your Cart Is Empty" when cart is empty', () => {
    useAuth.mockReturnValue([null, mockSetAuth]);
    useCart.mockReturnValue([[], mockSetCart]);

    const { getByText } = render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    expect(getByText('Your Cart Is Empty')).toBeInTheDocument();
  });

  // Member 1 - Test 9: Boundary Value Analysis - Total price calculation with multiple items
  it('should calculate total price correctly for multiple items', () => {
    const mockCart = [
      { _id: '1', name: 'Product 1', price: 100, description: 'Description 1' },
      { _id: '2', name: 'Product 2', price: 200, description: 'Description 2' },
      { _id: '3', name: 'Product 3', price: 150, description: 'Description 3' }
    ];

    useAuth.mockReturnValue([null, mockSetAuth]);
    useCart.mockReturnValue([mockCart, mockSetCart]);

    const { getByText } = render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    // Total should be $450.00
    expect(getByText(/Total : \$450.00/i)).toBeInTheDocument();
  });

  // Member 1 - Test 10: State Management - Remove item from cart
  it('should remove item from cart and update localStorage', () => {
    const mockCart = [
      { _id: '1', name: 'Product 1', price: 100, description: 'Description 1' },
      { _id: '2', name: 'Product 2', price: 200, description: 'Description 2' }
    ];

    useAuth.mockReturnValue([null, mockSetAuth]);
    useCart.mockReturnValue([mockCart, mockSetCart]);

    const { getAllByText } = render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    const removeButtons = getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(mockSetCart).toHaveBeenCalled();
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });
});
