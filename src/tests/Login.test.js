import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';

test('debería renderizar inputs de login', () => {
  render(
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});
