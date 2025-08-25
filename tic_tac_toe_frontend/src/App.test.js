import { render, screen } from '@testing-library/react';
import App from './App';

test('renders status and control buttons', () => {
  render(<App />);
  // Status should initially show "Turn: X"
  expect(screen.getByText(/Turn: X/i)).toBeInTheDocument();
  // Control buttons present
  expect(screen.getByRole('button', { name: /Reset Game/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Reset All/i })).toBeInTheDocument();
});
