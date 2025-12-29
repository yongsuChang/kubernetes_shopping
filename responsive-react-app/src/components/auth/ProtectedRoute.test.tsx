import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '../../store/useAuthStore';

// Mock Zustand store
vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock Spinner component to avoid CSS issues in tests
vi.mock('../common/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows spinner while verifying', async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: 'mock-token', role: 'ROLE_USER' });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner')).toBeDefined();
    expect(screen.getByText(/Verifying authentication/i)).toBeDefined();
  });

  it('redirects to login when not authenticated', async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: null, role: null });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for verifyToken timeout
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeDefined();
    }, { timeout: 2000 });
  });

  it('redirects to home when role is unauthorized', async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: 'mock-token', role: 'ROLE_USER' });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
                <div>Admin Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeDefined();
    }, { timeout: 2000 });
  });

  it('renders children when authenticated and authorized', async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: 'mock-token', role: 'ROLE_USER' });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute allowedRoles={['ROLE_USER']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeDefined();
    }, { timeout: 2000 });
  });
});
