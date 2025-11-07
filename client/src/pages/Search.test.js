import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Search from './Search';

// Mocking dependencies
jest.mock('../components/Layout', () => {
  return function MockLayout({ children, title }) {
    return <div data-testid="layout" data-title={title}>{children}</div>;
  };
});

const mockSetValues = jest.fn();
jest.mock('../context/search', () => ({
  useSearch: jest.fn(() => [{ results: [] }, mockSetValues])
}));

const { useSearch } = require('../context/search');

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

describe('Search Component - Member 2 Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Member 2 - Test 18: Boundary Value Analysis - Empty search results
  it('should display "No Products Found" when search results are empty', () => {
    useSearch.mockReturnValue([{ results: [] }, mockSetValues]);

    const { getByText } = render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    expect(getByText('No Products Found')).toBeInTheDocument();
  });

  // Member 2 - Test 19: Equivalence Partitioning - Display correct count of search results
  it('should display correct count when search results are available', () => {
    const mockResults = [
      {
        _id: '1',
        name: 'Laptop',
        description: 'High performance laptop for professionals',
        price: 999
      },
      {
        _id: '2',
        name: 'Mouse',
        description: 'Wireless ergonomic mouse',
        price: 29
      },
      {
        _id: '3',
        name: 'Keyboard',
        description: 'Mechanical keyboard with RGB',
        price: 79
      }
    ];

    useSearch.mockReturnValue([{ results: mockResults }, mockSetValues]);

    const { getByText } = render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    expect(getByText('Found 3')).toBeInTheDocument();
  });

  // Member 2 - Test 20: Equivalence Partitioning - Product cards render for results
  it('should render product cards when search results are available', () => {
    const mockResults = [
      {
        _id: '1',
        name: 'Test Product 1',
        description: 'This is test product 1 with a long description',
        price: 100
      },
      {
        _id: '2',
        name: 'Test Product 2',
        description: 'This is test product 2 with another long description',
        price: 200
      }
    ];

    useSearch.mockReturnValue([{ results: mockResults }, mockSetValues]);

    const { getByText, getAllByText } = render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    expect(getByText('Test Product 1')).toBeInTheDocument();
    expect(getByText('Test Product 2')).toBeInTheDocument();
    expect(getByText('$ 100')).toBeInTheDocument();
    expect(getByText('$ 200')).toBeInTheDocument();
    expect(getAllByText('More Details')).toHaveLength(2);
    expect(getAllByText('ADD TO CART')).toHaveLength(2);
  });
});
