import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  LayoutGrid, 
  Settings, 
  User, 
  Search,
  ArrowLeft,
  Gamepad2
} from 'lucide-react';
import { GAMES, GameMetadata } from './constants';
import { 
  MemoryGame, 
  TicTacToe, 
  ReflexTest, 
  ClickerTest, 
  SimonSays,
  SnakeGame,
  Game2048,
  MinesweeperGame,
  SudokuGame,
  StackGame,
  WordleGame,
  ColorMatchGame,
  GamePlaceholder 
} from './components/Games';

export default function App() {
  const [selectedGame, setSelectedGame] = useState<GameMetadata | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = GAMES.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGame = () => {
    if (!selectedGame) return null;
    switch (selectedGame.id) {
      case 'memory': return <MemoryGame />;
      case 'tictactoe': return <TicTacToe />;
      case 'reflex': return <ReflexTest />;
      case 'clicker': return <ClickerTest />;
      case 'simon': return <SimonSays />;
      case 'snake': return <SnakeGame />;
      case '2048': return <Game2048 />;
      case 'minesweeper': return <MinesweeperGame />;
      case 'sudoku': return <SudokuGame />;
      case 'stack': return <StackGame />;
      case 'wordle': return <WordleGame />;
      case 'color-match': return <ColorMatchGame />;
      default: return <GamePlaceholder name={selectedGame.name} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            <Gamepad2 size={24} />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">Arcade Chic</h1>
        </div>
        
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 w-96">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un jeu..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Settings size={20} /></button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><User size={20} /></button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-12">
                <h2 className="text-4xl font-serif font-bold mb-2">Bonjour, Joueur</h2>
                <p className="text-slate-500">Choisissez votre défi du jour parmi notre collection exclusive.</p>
              </div>

              <div className="game-grid">
                {filteredGames.map((game, idx) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedGame(game)}
                    className="chic-card p-6 cursor-pointer group"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${game.color}`}>
                      <game.icon size={28} />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{game.category}</span>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-black transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{game.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <button 
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors mb-8 font-medium"
              >
                <ArrowLeft size={20} /> Retour à la collection
              </button>

              <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-2xl overflow-hidden">
                <div className="p-8 md:p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${selectedGame.color}`}>
                        <selectedGame.icon size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{selectedGame.category}</span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold">{selectedGame.name}</h2>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-slate-50 px-4 py-2 rounded-xl text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Record</p>
                      <p className="font-mono font-bold">--</p>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Niveau</p>
                      <p className="font-mono font-bold">Pro</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 md:p-16 flex items-center justify-center min-h-[400px]">
                  {renderGame()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 px-6 border-t border-slate-100 text-center text-slate-400 text-xs tracking-widest uppercase font-medium">
        &copy; 2026 Arcade Chic &bull; Design Minimaliste &bull; Expérience Premium
      </footer>
    </div>
  );
}
