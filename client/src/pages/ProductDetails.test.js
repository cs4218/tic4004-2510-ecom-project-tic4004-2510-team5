import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import ProductDetails from './ProductDetails';

// Mocking dependencies
jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../components/Layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="layout">{children}</div>;
  };
});

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

describe('ProductDetails Component - Member 2 Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Member 2 - Test 14: Decision Table - Product details load correctly with valid slug
  it('should load and display product details when valid slug is provided', async () => {
    const mockProduct = {
      _id: '123',
      name: 'Test Product',
      description: 'This is a test product description',
      price: 99.99,
      category: {
        _id: 'cat1',
        name: 'Electronics'
      }
    };

    const mockRelatedProducts = [];

    axios.get
      .mockResolvedValueOnce({ data: { product: mockProduct } })
      .mockResolvedValueOnce({ data: { products: mockRelatedProducts } });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/product/test-product']}>
        <Routes>
          <Route path="/product/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/v1/product/get-product/test-product');
    });

    await waitFor(() => {
      expect(getByText('Test Product')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByText('This is a test product description')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByText('Electronics')).toBeInTheDocument();
    });
  });

  // Member 2 - Test 15: Equivalence Partitioning - Related products display for product category
  it('should load and display related products when available', async () => {
    const mockProduct = {
      _id: '123',
      name: 'Laptop',
      description: 'A great laptop',
      price: 999.99,
      category: {
        _id: 'cat1',
        name: 'Electronics'
      }
    };

    const mockRelatedProducts = [
      {
        _id: '456',
        name: 'Mouse',
        description: 'Wireless mouse for your computer needs',
        price: 29.99,
        slug: 'wireless-mouse'
      },
      {
        _id: '789',
        name: 'Keyboard',
        description: 'Mechanical keyboard with RGB lighting',
        price: 79.99,
        slug: 'mechanical-keyboard'
      }
    ];

    axios.get
      .mockResolvedValueOnce({ data: { product: mockProduct } })
      .mockResolvedValueOnce({ data: { products: mockRelatedProducts } });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/product/laptop']}>
        <Routes>
          <Route path="/product/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/v1/product/related-product/123/cat1');
    });

    await waitFor(() => {
      expect(getByText('Mouse')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByText('Keyboard')).toBeInTheDocument();
    });
  });

  // Member 2 - Test 16: Boundary Value Analysis - No related products found
  it('should display message when no related products are found', async () => {
    const mockProduct = {
      _id: '123',
      name: 'Unique Product',
      description: 'One of a kind product',
      price: 599.99,
      category: {
        _id: 'cat1',
        name: 'Unique Category'
      }
    };

    axios.get
      .mockResolvedValueOnce({ data: { product: mockProduct } })
      .mockResolvedValueOnce({ data: { products: [] } });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/product/unique-product']}>
        <Routes>
          <Route path="/product/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('No Similar Products found')).toBeInTheDocument();
    });
  });

  // Member 2 - Test 17: Error Handling - Product fetch failure
  it('should handle error when product fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/product/invalid-product']}>
        <Routes>
          <Route path="/product/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    consoleLogSpy.mockRestore();
  });
});
