import { 
  Gamepad2, 
  Brain, 
  Zap, 
  Grid3X3, 
  Hash, 
  Target, 
  Layers, 
  Palette, 
  MousePointer2, 
  Type, 
  CircleDot, 
  Bomb 
} from 'lucide-react';

export interface GameMetadata {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'Puzzle' | 'Action' | 'Logic' | 'Skill';
  color: string;
}

export const GAMES: GameMetadata[] = [
  {
    id: 'memory',
    name: 'Mémoire',
    description: 'Trouvez les paires de cartes identiques.',
    icon: Brain,
    category: 'Puzzle',
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    id: 'tictactoe',
    name: 'Morpion',
    description: 'Alignez trois symboles pour gagner.',
    icon: Grid3X3,
    category: 'Logic',
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Le classique serpent, version épurée.',
    icon: Gamepad2,
    category: 'Action',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    id: '2048',
    name: '2048',
    description: 'Fusionnez les tuiles pour atteindre 2048.',
    icon: Hash,
    category: 'Puzzle',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    id: 'minesweeper',
    name: 'Démineur',
    description: 'Évitez les mines cachées sous les tuiles.',
    icon: Bomb,
    category: 'Logic',
    color: 'bg-rose-50 text-rose-600'
  },
  {
    id: 'reflex',
    name: 'Réflexe',
    description: 'Testez votre vitesse de réaction.',
    icon: Zap,
    category: 'Skill',
    color: 'bg-sky-50 text-sky-600'
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    description: 'Le défi mathématique incontournable.',
    icon: Target,
    category: 'Logic',
    color: 'bg-violet-50 text-violet-600'
  },
  {
    id: 'stack',
    name: 'Stack',
    description: 'Empilez les blocs le plus haut possible.',
    icon: Layers,
    category: 'Skill',
    color: 'bg-fuchsia-50 text-fuchsia-600'
  },
  {
    id: 'simon',
    name: 'Simon',
    description: 'Reproduisez la séquence lumineuse.',
    icon: CircleDot,
    category: 'Skill',
    color: 'bg-lime-50 text-lime-600'
  },
  {
    id: 'wordle',
    name: 'Mots',
    description: 'Devinez le mot secret en 6 essais.',
    icon: Type,
    category: 'Puzzle',
    color: 'bg-teal-50 text-teal-600'
  },
  {
    id: 'color-match',
    name: 'Couleurs',
    description: 'Associez les couleurs rapidement.',
    icon: Palette,
    category: 'Skill',
    color: 'bg-pink-50 text-pink-600'
  },
  {
    id: 'clicker',
    name: 'Clicker',
    description: 'Combien de clics en 10 secondes ?',
    icon: MousePointer2,
    category: 'Skill',
    color: 'bg-slate-50 text-slate-600'
  }
];
