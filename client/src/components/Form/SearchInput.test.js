import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import SearchInput from './SearchInput';

// Mocking dependencies
jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockSetValues = jest.fn();
jest.mock('../../context/search', () => ({
  useSearch: jest.fn(() => [{ keyword: '' }, mockSetValues])
}));

const { useSearch } = require('../../context/search');

describe('SearchInput Component - Member 1 Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Member 1 - Test 5: Equivalence Partitioning - Search input updates keyword state correctly
  it('should update keyword state when user types in search input', () => {
    useSearch.mockReturnValue([{ keyword: '' }, mockSetValues]);

    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <SearchInput />
      </MemoryRouter>
    );

    const searchInput = getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'laptop' } });

    expect(mockSetValues).toHaveBeenCalled();
  });

  // Member 1 - Test 6: Decision Table - Search submission with valid keyword
  it('should call API and navigate when search form is submitted with keyword', async () => {
    const mockResults = [
      { _id: '1', name: 'Product 1', price: 100 },
      { _id: '2', name: 'Product 2', price: 200 }
    ];

    useSearch.mockReturnValue([{ keyword: 'laptop' }, mockSetValues]);
    axios.get.mockResolvedValueOnce({ data: mockResults });

    const { getByRole } = render(
      <MemoryRouter>
        <SearchInput />
      </MemoryRouter>
    );

    const form = getByRole('search');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/v1/product/search/laptop');
    });

    await waitFor(() => {
      expect(mockSetValues).toHaveBeenCalledWith({ keyword: 'laptop', results: mockResults });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });

  // Member 1 - Test 7: Boundary Value Analysis - Empty search keyword
  it('should still submit form with empty keyword', async () => {
    useSearch.mockReturnValue([{ keyword: '' }, mockSetValues]);
    axios.get.mockResolvedValueOnce({ data: [] });

    const { getByRole } = render(
      <MemoryRouter>
        <SearchInput />
      </MemoryRouter>
    );

    const form = getByRole('search');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/v1/product/search/');
    });
  });
});
