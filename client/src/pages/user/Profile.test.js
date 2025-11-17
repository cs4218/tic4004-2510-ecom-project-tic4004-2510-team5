import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import toast from 'react-hot-toast';
import Profile from './Profile';

// Mocking dependencies
jest.mock('axios');
jest.mock('react-hot-toast');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockSetAuth = jest.fn();
jest.mock('../../context/auth', () => ({
  useAuth: jest.fn(() => [
    {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main Street'
      },
      token: 'mockToken123'
    },
    mockSetAuth
  ])
}));

jest.mock('../../components/UserMenu', () => {
  return function MockUserMenu() {
    return <div data-testid="user-menu">User Menu</div>;
  };
});

const mockSetCart = jest.fn();
jest.mock('../../context/cart', () => ({
  useCart: jest.fn(() => [[], mockSetCart])
}));

const mockSetValues = jest.fn();
jest.mock('../../context/search', () => ({
  useSearch: jest.fn(() => [{ keyword: '' }, mockSetValues])
}));

const { useAuth } = require('../../context/auth');

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: jest.fn(),
    getItem: jest.fn(() => JSON.stringify({
      user: { name: 'John Doe', email: 'john@example.com' },
      token: 'mockToken123'
    })),
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

describe('Profile Component - Member 2 Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Member 2 - Test 11: State Management - Profile form pre-populates with user data
  it('should pre-populate form fields with user data from context', () => {
    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(getByPlaceholderText('Enter Your Name').value).toBe('John Doe');
    expect(getByPlaceholderText('Enter Your Email').value).toBe('john@example.com');
    expect(getByPlaceholderText('Enter Your Phone').value).toBe('1234567890');
    expect(getByPlaceholderText('Enter Your Address').value).toBe('123 Main Street');
  });

  // Member 2 - Test 12: Decision Table - Successful profile update
  it('should update profile successfully and show success message', async () => {
    const updatedUser = {
      name: 'John Updated',
      email: 'john@example.com',
      phone: '9876543210',
      address: '456 New Street'
    };

    axios.put.mockResolvedValueOnce({
      data: {
        success: true,
        updatedUser: updatedUser
      }
    });

    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Wait for form to be populated first
    await waitFor(() => {
      expect(getByPlaceholderText('Enter Your Name').value).toBe('John Doe');
    });

    // Now update the fields
    const nameInput = getByPlaceholderText('Enter Your Name');
    const phoneInput = getByPlaceholderText('Enter Your Phone');
    const addressInput = getByPlaceholderText('Enter Your Address');

    fireEvent.change(nameInput, { target: { value: 'John Updated' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    fireEvent.change(addressInput, { target: { value: '456 New Street' } });

    fireEvent.click(getByText('UPDATE'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/v1/auth/profile', {
        name: 'John Updated',
        email: 'john@example.com',
        password: '',
        phone: '9876543210',
        address: '456 New Street'
      });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Profile Updated Successfully');
    });

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
  });

  // Member 2 - Test 13: Error Handling - Profile update failure
  it('should display error message when profile update fails', async () => {
    axios.put.mockRejectedValueOnce(new Error('Update failed'));

    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Enter Your Name'), { target: { value: 'John Updated' } });
    fireEvent.click(getByText('UPDATE'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });
  });
});
