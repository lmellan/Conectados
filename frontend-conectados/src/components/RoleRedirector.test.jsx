import { renderHook, act } from '@testing-library/react'; // renderHook and act now from @testing-library/react
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleRedirector from './RoleRedirector'; // Adjust the path as needed

// --- GLOBAL MOCKS ---
// Mock useAuth to control the rolActivo value
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock useNavigate to spy on navigation calls
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep other actual exports like Link, MemoryRouter, etc.
  useNavigate: () => mockedUseNavigate, // Override useNavigate with our mock
}));

describe('RoleRedirector', () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean state
    jest.clearAllMocks();
    // Ensure mockedUseNavigate is reset and its implementation is clean for each test
    mockedUseNavigate.mockImplementation(() => {});
  });

  // 1. Skips redirection on the first render (initial component mount)
  test('should not redirect on the first render (initial mount)', () => {
    // Simulate a role being present immediately, but the first-run logic should prevent redirect
    useAuth.mockReturnValue({ rolActivo: 'BUSCADOR' });

    // renderHook is perfect for testing components that only use hooks and render null
    const { rerender } = renderHook(() => RoleRedirector());

    // After the first render, navigate should NOT have been called
    expect(mockedUseNavigate).not.toHaveBeenCalled();

    // Trigger a re-render without changing rolActivo (still no redirect expected)
    rerender();
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });

  // 2. Redirects when rolActivo changes after the first render
  test('should redirect to the dashboard of the active role when rolActivo changes after first render', () => {
    // Start with no active role for the initial render
    useAuth.mockReturnValue({ rolActivo: null });

    const { rerender } = renderHook(() => RoleRedirector());

    // Confirm no redirect on first render
    expect(mockedUseNavigate).not.toHaveBeenCalled();

    // Simulate rolActivo changing to 'BUSCADOR'
    // 'act' ensures React updates are processed before assertions
    act(() => {
      useAuth.mockReturnValue({ rolActivo: 'BUSCADOR' });
    });
    rerender(); // Trigger a re-render to run the useEffect with the new prop

    // Expect a redirect to the BUSCADOR dashboard
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard/buscador', { replace: true });
  });

  // 3. Redirects to the dashboard of a different role when rolActivo changes again
  test('should redirect to the dashboard of the new role when rolActivo changes subsequent times', () => {
    // Start with an initial role
    useAuth.mockReturnValue({ rolActivo: 'BUSCADOR' });
    const { rerender } = renderHook(() => RoleRedirector());
    expect(mockedUseNavigate).not.toHaveBeenCalled(); // No redirect on first render

    // Simulate rolActivo changing to 'PRESTADOR'
    act(() => {
      useAuth.mockReturnValue({ rolActivo: 'PRESTADOR' });
    });
    rerender(); // Trigger a re-render

    // Expect a redirect to the PRESTADOR dashboard
    // It's still 1 call because we're testing a single *effective* change after first run.
    // If you had multiple *changes* within one test, this count would increase.
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard/prestador', { replace: true });
  });

  // 4. Does not redirect if rolActivo is null or undefined after the first run (and remains so)
  test('should not redirect if rolActivo is null/undefined after initial run and does not become a role', () => {
    // Start with no role
    useAuth.mockReturnValue({ rolActivo: null });
    const { rerender } = renderHook(() => RoleRedirector());
    expect(mockedUseNavigate).not.toHaveBeenCalled(); // No redirect on first render

    // Simulate rolActivo remaining null (no effective change to trigger redirect)
    act(() => {
      useAuth.mockReturnValue({ rolActivo: null });
    });
    rerender(); // Trigger re-render

    // Still no redirect
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });

  // 5. Ensures `replace: true` is always used for redirection
  test('should always use { replace: true } when redirecting', () => {
    // Start with no role to trigger a redirect on change
    useAuth.mockReturnValue({ rolActivo: null });
    const { rerender } = renderHook(() => RoleRedirector());
    expect(mockedUseNavigate).not.toHaveBeenCalled(); // No redirect on first render

    // Simulate rolActivo changing to a new role
    act(() => {
      useAuth.mockReturnValue({ rolActivo: 'NEW_ROLE' });
    });
    rerender();

    // Verify the redirect call includes the 'replace: true' option
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUseNavigate).toHaveBeenCalledWith(
      '/dashboard/new_role',
      { replace: true } // Crucial check for the 'replace' option
    );
  });
});