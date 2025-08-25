import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Modern, minimal Tic Tac Toe game:
 * - Responsive 3x3 board
 * - 2-player local mode (same device)
 * - Turn / winner / draw display
 * - Session score tracking
 * - Game reset (board-only) and Full reset (board + scores)
 * - Light modern theme and centered layout using CSS variables
 */

// Constants for theme colors (mirrors CSS variables)
const THEME = {
  primary: '#1976d2',
  secondary: '#ffffff',
  accent: '#f50057',
};

// All possible winning lines for the 3x3 board
const WIN_LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6],
];

// PUBLIC_INTERFACE
function App() {
  /**
   * Game state
   */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [theme, setTheme] = useState('light'); // Keep theme hook from template

  // Apply theme attribute for possible future theming
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  /**
   * Compute winner and winning line
   */
  const { winner, line } = useMemo(() => {
    for (const [a, b, c] of WIN_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: [] };
  }, [board]);

  const isBoardFull = useMemo(() => board.every((cell) => cell !== null), [board]);
  const isDraw = !winner && isBoardFull;

  /**
   * Handle a move
   */
  const handleSquareClick = (index) => {
    if (board[index] || winner) return; // Ignore if already filled or game over

    const nextBoard = board.slice();
    nextBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext((prev) => !prev);
  };

  /**
   * Side effect: update scores when a winner appears
   */
  useEffect(() => {
    if (winner) {
      setScores((s) => ({ ...s, [winner]: s[winner] + 1 }));
    }
  }, [winner]);

  /**
   * PUBLIC_INTERFACE
   * Reset only the board, keep scores
   */
  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  /**
   * PUBLIC_INTERFACE
   * Reset both the board and the scores
   */
  const resetAll = () => {
    resetBoard();
    setScores({ X: 0, O: 0 });
  };

  /**
   * Status message
   */
  const statusMessage = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "It's a draw";
    return `Turn: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, isDraw, xIsNext]);

  /**
   * Render helpers
   */
  const renderSquare = (index) => {
    const value = board[index];
    const isWinning = line.includes(index);
    return (
      <button
        key={index}
        className={`square ${isWinning ? 'square-winning' : ''}`}
        onClick={() => handleSquareClick(index)}
        aria-label={`Square ${index + 1} ${value ? `with ${value}` : 'empty'}`}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="App">
      <header className="t3-navbar">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-text">Tic Tac Toe</span>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={toggleTheme} aria-label="Toggle color mode">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className="t3-container">
        <section className="panel">
          <div className="panel-row">
            <div className="score-card">
              <div className="score-title">Player X</div>
              <div className="score-value" style={{ color: THEME.primary }}>{scores.X}</div>
            </div>
            <div className="status">
              <div className={`status-pill ${winner ? 'won' : isDraw ? 'draw' : 'turn'}`}>
                {statusMessage}
              </div>
            </div>
            <div className="score-card">
              <div className="score-title">Player O</div>
              <div className="score-value" style={{ color: THEME.accent }}>{scores.O}</div>
            </div>
          </div>

          <div className="board" role="grid" aria-label="Tic Tac Toe Board">
            {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
          </div>

          <div className="panel-row controls">
            <button className="btn" onClick={resetBoard} aria-label="Reset current game">
              Reset Game
            </button>
            <button className="btn danger" onClick={resetAll} aria-label="Reset game and scores">
              Reset All
            </button>
          </div>
        </section>
      </main>

      <footer className="t3-footer">
        <span>2-Player Local • Modern Minimal UI</span>
      </footer>
    </div>
  );
}

export default App;
