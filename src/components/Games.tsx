import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Trophy, X } from 'lucide-react';

// --- MEMORY GAME ---
export const MemoryGame = () => {
  const icons = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🍉'];
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const init = useCallback(() => {
    const deck = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, i) => ({ id: i, icon, flipped: false, matched: false }));
    setCards(deck);
    setFlipped([]);
    setMoves(0);
  }, []);

  useEffect(() => init(), [init]);

  const handleFlip = (id: number) => {
    if (flipped.length === 2 || cards[id].flipped || cards[id].matched) return;
    
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, matched: true } : c));
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, flipped: false } : c));
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const won = cards.length > 0 && cards.every(c => c.matched);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-xs text-sm font-medium text-slate-500">
        <span>Coups: {moves}</span>
        <button onClick={init} className="hover:text-black transition-colors"><RefreshCw size={16} /></button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map(card => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFlip(card.id)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl cursor-pointer flex items-center justify-center text-3xl transition-all duration-500 preserve-3d ${card.flipped || card.matched ? 'bg-white shadow-md' : 'bg-slate-200'}`}
          >
            {(card.flipped || card.matched) ? card.icon : '?'}
          </motion.div>
        ))}
      </div>
      {won && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-600 font-bold flex items-center gap-2"><Trophy /> Félicitations !</motion.div>}
    </div>
  );
};

// --- TIC TAC TOE ---
export const TicTacToe = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return squares.every(s => s) ? 'Draw' : null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = isX ? 'X' : 'O';
    setBoard(next);
    setIsX(!isX);
    setWinner(checkWinner(next));
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsX(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-lg font-medium">
        {winner ? (winner === 'Draw' ? 'Égalité !' : `Gagnant: ${winner}`) : `Tour de: ${isX ? 'X' : 'O'}`}
      </div>
      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-2 rounded-2xl">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-20 h-20 bg-white rounded-xl text-3xl font-bold flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <span className={val === 'X' ? 'text-indigo-600' : 'text-rose-600'}>{val}</span>
          </button>
        ))}
      </div>
      <button onClick={reset} className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">Rejouer</button>
    </div>
  );
};

// --- REFLEX TEST ---
export const ReflexTest = () => {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const timerRef = React.useRef<any>(null);

  const start = () => {
    setState('waiting');
    const delay = 1000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      setState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      clearTimeout(timerRef.current);
      setState('result');
      setResult(-1); // Too early
    } else if (state === 'ready') {
      const diff = Date.now() - startTime;
      setResult(diff);
      setState('result');
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div 
        onClick={state === 'idle' || state === 'result' ? start : handleClick}
        className={`w-full h-64 rounded-3xl flex flex-center items-center justify-center cursor-pointer transition-colors duration-200 ${
          state === 'idle' ? 'bg-slate-100' : 
          state === 'waiting' ? 'bg-rose-400' : 
          state === 'ready' ? 'bg-emerald-400' : 
          'bg-indigo-100'
        }`}
      >
        <div className="text-center p-8">
          {state === 'idle' && <p className="text-slate-500 font-medium">Cliquez pour commencer</p>}
          {state === 'waiting' && <p className="text-white font-bold text-2xl">Attendez le vert...</p>}
          {state === 'ready' && <p className="text-white font-bold text-4xl">CLIQUEZ !</p>}
          {state === 'result' && (
            <div>
              <p className="text-indigo-600 font-bold text-4xl">
                {result === -1 ? "Trop tôt !" : `${result} ms`}
              </p>
              <p className="text-slate-500 mt-2">Cliquez pour recommencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- CLICKER TEST ---
export const ClickerTest = () => {
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const start = () => {
    setCount(0);
    setTimeLeft(10);
    setIsActive(true);
    setIsFinished(false);
  };

  const handleClick = () => {
    if (isActive) setCount(c => c + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full text-sm font-medium text-slate-500">
        <span>Temps: {timeLeft}s</span>
        <span>Score: {count}</span>
      </div>
      <button
        onMouseDown={!isActive && !isFinished ? start : handleClick}
        className={`w-40 h-40 rounded-full border-8 flex items-center justify-center text-4xl font-bold transition-all ${
          isActive ? 'border-indigo-500 scale-110 active:scale-95' : 'border-slate-200'
        }`}
      >
        {isActive ? count : (isFinished ? 'Fin !' : 'START')}
      </button>
      {isFinished && (
        <div className="text-center">
          <p className="text-slate-600 mb-4">Votre vitesse: {(count / 10).toFixed(1)} clics/sec</p>
          <button onClick={start} className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium">Réessayer</button>
        </div>
      )}
    </div>
  );
};

// --- SIMON SAYS ---
export const SimonSays = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'user' | 'fail'>('idle');

  const colors = ['bg-rose-400', 'bg-sky-400', 'bg-emerald-400', 'bg-amber-400'];

  const nextRound = (currentSeq: number[]) => {
    const next = [...currentSeq, Math.floor(Math.random() * 4)];
    setSequence(next);
    playSequence(next);
  };

  const playSequence = async (seq: number[]) => {
    setStatus('playing');
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setActiveBtn(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setActiveBtn(null);
    }
    setStatus('user');
    setUserSequence([]);
  };

  const handleBtnClick = (idx: number) => {
    if (status !== 'user') return;
    
    setActiveBtn(idx);
    setTimeout(() => setActiveBtn(null), 200);

    const newUserSeq = [...userSequence, idx];
    setUserSequence(newUserSeq);

    if (idx !== sequence[newUserSeq.length - 1]) {
      setStatus('fail');
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setTimeout(() => nextRound(sequence), 1000);
    }
  };

  const start = () => {
    setSequence([]);
    nextRound([]);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-lg font-medium">
        {status === 'idle' && 'Prêt ?'}
        {status === 'playing' && 'Regardez...'}
        {status === 'user' && 'À vous !'}
        {status === 'fail' && `Perdu ! Score: ${sequence.length - 1}`}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {colors.map((color, i) => (
          <button
            key={i}
            onClick={() => handleBtnClick(i)}
            className={`w-24 h-24 rounded-2xl transition-all ${color} ${activeBtn === i ? 'brightness-125 scale-105 shadow-lg' : 'opacity-80'}`}
          />
        ))}
      </div>
      {(status === 'idle' || status === 'fail') && (
        <button onClick={start} className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-slate-800 transition-all">
          {status === 'fail' ? 'Recommencer' : 'Commencer'}
        </button>
      )}
    </div>
  );
};

// --- SNAKE GAME ---
export const SnakeGame = () => {
  const GRID_SIZE = 15;
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const moveSnake = useCallback(() => {
    if (gameOver) return;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || snake.some(s => s.x === head.x && s.y === head.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 1);
      setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }, [snake, dir, food, gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (dir.y === 0) setDir({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (dir.y === 0) setDir({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (dir.x === 0) setDir({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (dir.x === 0) setDir({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm font-medium text-slate-500">Score: {score}</div>
      <div className="grid grid-cols-15 bg-slate-100 p-1 rounded-lg border border-slate-200" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div key={i} className={`w-4 h-4 sm:w-6 sm:h-6 rounded-sm ${isSnake ? 'bg-indigo-500' : isFood ? 'bg-rose-500' : 'bg-transparent'}`} />
          );
        })}
      </div>
      {gameOver && (
        <div className="text-center">
          <p className="text-rose-600 font-bold mb-2">Game Over!</p>
          <button onClick={() => { setSnake([{ x: 7, y: 7 }]); setGameOver(false); setScore(0); }} className="px-4 py-1 bg-black text-white rounded-full text-xs">Rejouer</button>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 mt-4 md:hidden">
        <div />
        <button onClick={() => dir.y === 0 && setDir({ x: 0, y: -1 })} className="p-3 bg-slate-200 rounded-lg"><RefreshCw size={16} className="rotate-0" /></button>
        <div />
        <button onClick={() => dir.x === 0 && setDir({ x: -1, y: 0 })} className="p-3 bg-slate-200 rounded-lg"><RefreshCw size={16} className="-rotate-90" /></button>
        <button onClick={() => dir.y === 0 && setDir({ x: 0, y: 1 })} className="p-3 bg-slate-200 rounded-lg"><RefreshCw size={16} className="rotate-180" /></button>
        <button onClick={() => dir.x === 0 && setDir({ x: 1, y: 0 })} className="p-3 bg-slate-200 rounded-lg"><RefreshCw size={16} className="rotate-90" /></button>
      </div>
    </div>
  );
};

// --- 2048 GAME ---
export const Game2048 = () => {
  const [grid, setGrid] = useState<(number | null)[][]>(Array(4).fill(null).map(() => Array(4).fill(null)));
  const [score, setScore] = useState(0);

  const addTile = (currentGrid: (number | null)[][]) => {
    const empty = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!currentGrid[r][c]) empty.push({ r, c });
    if (empty.length === 0) return currentGrid;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const next = currentGrid.map(row => [...row]);
    next[r][c] = Math.random() > 0.1 ? 2 : 4;
    return next;
  };

  const init = useCallback(() => {
    let g = Array(4).fill(null).map(() => Array(4).fill(null));
    g = addTile(addTile(g));
    setGrid(g);
    setScore(0);
  }, []);

  useEffect(() => init(), [init]);

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    let newGrid = grid.map(row => [...row]);
    let moved = false;

    const rotate = (g: any[][]) => g[0].map((_, i) => g.map(row => row[i]).reverse());
    
    let rotations = 0;
    if (direction === 'up') rotations = 1;
    if (direction === 'right') rotations = 2;
    if (direction === 'down') rotations = 3;

    for (let i = 0; i < rotations; i++) newGrid = rotate(newGrid);

    for (let r = 0; r < 4; r++) {
      let row = newGrid[r].filter(v => v !== null) as number[];
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          setScore(s => s + row[i]);
          row.splice(i + 1, 1);
          moved = true;
        }
      }
      while (row.length < 4) row.push(null as any);
      if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) moved = true;
      newGrid[r] = row;
    }

    for (let i = 0; i < (4 - rotations) % 4; i++) newGrid = rotate(newGrid);

    if (moved) setGrid(addTile(newGrid));
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [grid]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-xs text-sm font-medium text-slate-500">
        <span>Score: {score}</span>
        <button onClick={init}><RefreshCw size={16} /></button>
      </div>
      <div className="grid grid-cols-4 gap-2 bg-slate-200 p-2 rounded-xl">
        {grid.flat().map((val, i) => (
          <div key={i} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center text-2xl font-bold transition-all ${val ? 'bg-white shadow-sm' : 'bg-slate-100/50'}`}>
            {val}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MINESWEEPER ---
export const MinesweeperGame = () => {
  const SIZE = 8;
  const MINES = 10;
  const [board, setBoard] = useState<{ mine: boolean; revealed: boolean; flagged: boolean; count: number }[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const init = useCallback(() => {
    let b = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null).map(() => ({ mine: false, revealed: false, flagged: false, count: 0 })));
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      if (!b[r][c].mine) {
        b[r][c].mine = true;
        placed++;
      }
    }
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r][c].mine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && b[nr][nc].mine) count++;
          }
        }
        b[r][c].count = count;
      }
    }
    setBoard(b);
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => init(), [init]);

  const reveal = (r: number, c: number) => {
    if (gameOver || won || board[r][c].revealed || board[r][c].flagged) return;
    const next = board.map(row => row.map(cell => ({ ...cell })));
    if (next[r][c].mine) {
      setGameOver(true);
      return;
    }
    const flood = (row: number, col: number) => {
      if (row < 0 || row >= SIZE || col < 0 || col >= SIZE || next[row][col].revealed) return;
      next[row][col].revealed = true;
      if (next[row][col].count === 0) {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) flood(row + dr, col + dc);
      }
    };
    flood(r, c);
    setBoard(next);
    if (next.flat().filter(c => !c.mine && !c.revealed).length === 0) setWon(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm font-medium text-slate-500">Mines: {MINES}</div>
      <div className="grid grid-cols-8 gap-1 bg-slate-200 p-1 rounded-lg">
        {board.map((row, r) => row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => reveal(r, c)}
            onContextMenu={(e) => { e.preventDefault(); if (!cell.revealed) { const n = [...board]; n[r][c].flagged = !n[r][c].flagged; setBoard(n); } }}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center text-xs font-bold transition-colors ${
              cell.revealed ? (cell.mine ? 'bg-rose-500' : 'bg-white') : 'bg-slate-300 hover:bg-slate-400'
            }`}
          >
            {cell.revealed ? (cell.mine ? '💣' : (cell.count || '')) : (cell.flagged ? '🚩' : '')}
          </button>
        )))}
      </div>
      {(gameOver || won) && (
        <div className="text-center">
          <p className={won ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>{won ? 'Gagné !' : 'Explosion !'}</p>
          <button onClick={init} className="mt-2 px-4 py-1 bg-black text-white rounded-full text-xs">Rejouer</button>
        </div>
      )}
    </div>
  );
};

// --- SUDOKU ---
export const SudokuGame = () => {
  const initial = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9]
  ];
  const [grid, setGrid] = useState<(number | null)[][]>(initial.map(r => [...r]));
  const [selected, setSelected] = useState<{ r: number, c: number } | null>(null);

  const handleInput = (val: number) => {
    if (!selected || initial[selected.r][selected.c]) return;
    const next = grid.map(r => [...r]);
    next[selected.r][selected.c] = val;
    setGrid(next);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-9 border-2 border-black">
        {grid.map((row, r) => row.map((val, c) => (
          <div
            key={`${r}-${c}`}
            onClick={() => setSelected({ r, c })}
            className={`w-8 h-8 sm:w-10 sm:h-10 border flex items-center justify-center text-sm cursor-pointer transition-colors ${
              selected?.r === r && selected?.c === c ? 'bg-indigo-100' : (initial[r][c] ? 'bg-slate-50 font-bold' : 'bg-white')
            } ${r % 3 === 2 && r !== 8 ? 'border-b-2 border-b-black' : ''} ${c % 3 === 2 && c !== 8 ? 'border-r-2 border-r-black' : ''}`}
          >
            {val}
          </div>
        )))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button key={n} onClick={() => handleInput(n)} className="w-10 h-10 bg-slate-100 rounded-lg font-bold hover:bg-slate-200">{n}</button>
        ))}
        <button onClick={() => { if (selected) { const n = [...grid]; n[selected.r][selected.c] = null; setGrid(n); } }} className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg font-bold">X</button>
      </div>
    </div>
  );
};

// --- STACK GAME ---
export const StackGame = () => {
  const [blocks, setBlocks] = useState<{ width: number; x: number }[]>([{ width: 100, x: 0 }]);
  const [currentX, setCurrentX] = useState(0);
  const [dir, setDir] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setCurrentX(x => {
        if (x > 50) setDir(-1);
        if (x < -50) setDir(1);
        return x + dir * 2;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [dir, gameOver]);

  const place = () => {
    if (gameOver) return;
    const last = blocks[blocks.length - 1];
    const diff = Math.abs(currentX - last.x);
    const newWidth = last.width - diff;

    if (newWidth <= 0) {
      setGameOver(true);
      return;
    }

    setBlocks([...blocks, { width: newWidth, x: currentX }]);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xs">
      <div className="text-sm font-medium text-slate-500">Hauteur: {blocks.length - 1}</div>
      <div className="relative w-full h-64 bg-slate-50 rounded-2xl overflow-hidden flex flex-col-reverse items-center">
        {blocks.map((b, i) => (
          <div 
            key={i} 
            className="h-6 bg-indigo-500 border-b border-indigo-600 transition-all"
            style={{ width: `${b.width}%`, transform: `translateX(${b.x}%)` }}
          />
        ))}
        {!gameOver && (
          <div 
            className="h-6 bg-indigo-300 absolute"
            style={{ width: `${blocks[blocks.length - 1].width}%`, transform: `translateX(${currentX}%)`, bottom: `${blocks.length * 24}px` }}
          />
        )}
      </div>
      <button 
        onClick={gameOver ? () => { setBlocks([{ width: 100, x: 0 }]); setGameOver(false); } : place} 
        className="w-full py-4 bg-black text-white rounded-2xl font-bold"
      >
        {gameOver ? 'Recommencer' : 'POSER'}
      </button>
    </div>
  );
};

// --- WORDLE (MOTS) ---
export const WordleGame = () => {
  const WORD = "CHICS";
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const submit = () => {
    if (current.length !== 5 || gameOver) return;
    const next = [...guesses, current.toUpperCase()];
    setGuesses(next);
    setCurrent("");
    if (current.toUpperCase() === WORD || next.length === 6) setGameOver(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid gap-2">
        {Array.from({ length: 6 }).map((_, i) => {
          const guess = guesses[i] || (i === guesses.length ? current : "");
          return (
            <div key={i} className="flex gap-2">
              {Array.from({ length: 5 }).map((_, j) => {
                const char = guess[j] || "";
                let bg = "bg-white border-slate-200";
                if (guesses[i]) {
                  if (WORD[j] === char) bg = "bg-emerald-500 text-white border-emerald-600";
                  else if (WORD.includes(char)) bg = "bg-amber-500 text-white border-amber-600";
                  else bg = "bg-slate-400 text-white border-slate-500";
                }
                return (
                  <div key={j} className={`w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg flex items-center justify-center font-bold text-xl ${bg}`}>
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {!gameOver ? (
        <div className="flex gap-2">
          <input 
            maxLength={5} 
            value={current} 
            onChange={e => setCurrent(e.target.value.toUpperCase())}
            className="w-32 px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-black uppercase font-bold"
          />
          <button onClick={submit} className="px-6 py-2 bg-black text-white rounded-xl font-bold">OK</button>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-bold mb-2">{guesses[guesses.length-1] === WORD ? 'Bravo !' : `Perdu ! Le mot était ${WORD}`}</p>
          <button onClick={() => { setGuesses([]); setGameOver(false); }} className="px-4 py-1 bg-black text-white rounded-full text-xs">Rejouer</button>
        </div>
      )}
    </div>
  );
};

// --- COLOR MATCH ---
export const ColorMatchGame = () => {
  const COLORS = [
    { name: 'ROUGE', hex: 'text-rose-500' },
    { name: 'BLEU', hex: 'text-sky-500' },
    { name: 'VERT', hex: 'text-emerald-500' },
    { name: 'JAUNE', hex: 'text-amber-500' }
  ];
  const [target, setTarget] = useState(COLORS[0]);
  const [display, setDisplay] = useState(COLORS[1]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(false);

  const next = () => {
    setTarget(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setDisplay(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    else if (timeLeft === 0) setIsActive(false);
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleAnswer = (match: boolean) => {
    if (!isActive) return;
    const isMatch = target.name === display.name;
    if (match === isMatch) setScore(s => s + 1);
    else setScore(s => Math.max(0, s - 1));
    next();
  };

  const start = () => {
    setScore(0);
    setTimeLeft(15);
    setIsActive(true);
    next();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between w-full text-sm font-medium text-slate-500">
        <span>Temps: {timeLeft}s</span>
        <span>Score: {score}</span>
      </div>
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">La couleur correspond-elle au mot ?</p>
        <div className={`text-5xl font-black ${display.hex}`}>
          {target.name}
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={() => isActive ? handleAnswer(true) : start()} className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200">OUI</button>
        <button onClick={() => isActive ? handleAnswer(false) : start()} className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200">NON</button>
      </div>
      {!isActive && timeLeft === 0 && <p className="font-bold text-indigo-600">Score Final: {score}</p>}
    </div>
  );
};

// --- PLACEHOLDER FOR OTHERS ---


export const GamePlaceholder = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center h-64 text-slate-400 italic">
    Le jeu "{name}" arrive bientôt...
  </div>
);
