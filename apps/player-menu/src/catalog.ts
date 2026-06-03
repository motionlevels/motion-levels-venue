export const colors = {
  cyan: "#36d9ff",
  green: "#8dff6e",
  yellow: "#ffd166",
  red: "#ff5268",
  violet: "#b987ff",
  orange: "#ff9f45",
  blue: "#5b8cff",
};

// Eight saturated, easy-to-distinguish player colors (evenly spread around the hue wheel).
export const playerColors = [
  "#ff3b30", // rojo
  "#ff9500", // naranja
  "#ffd60a", // amarillo
  "#34c759", // verde
  "#32d4ff", // cian
  "#0a84ff", // azul
  "#bf5af2", // morado
  "#ff2d92", // rosa
];

export const playerColorNames = ["Rojo", "Naranja", "Amarillo", "Verde", "Cian", "Azul", "Morado", "Rosa"];
export const nameHints = playerColorNames;

export type CategoryID = "featured" | "team" | "versus" | "attract";

export type Category = {
  id: CategoryID;
  label: string;
  title: string;
  color: string;
};

export const categories: Category[] = [
  { id: "featured", label: "Destacados", title: "Listos para jugar", color: colors.cyan },
  { id: "team", label: "Equipo", title: "Jugad en equipo", color: colors.green },
  { id: "versus", label: "Versus", title: "Cara a cara", color: colors.red },
  { id: "attract", label: "Ambiente", title: "Modos ambiente", color: colors.violet },
];

export type DifficultyID = "easy" | "medium" | "hard" | "expert";

export type Difficulty = {
  id: DifficultyID;
  label: string;
  color: string;
};

export const difficulties: Difficulty[] = [
  { id: "easy", label: "Fácil", color: colors.green },
  { id: "medium", label: "Media", color: colors.yellow },
  { id: "hard", label: "Difícil", color: colors.orange },
  { id: "expert", label: "Experto", color: colors.red },
];

export type GameCard = {
  id: string;
  label: string;
  category: CategoryID;
  color: string;
  players: string;
  difficulty: string;
  description: string;
  engineGame?: string;
  previewAnimation?: string;
  disabled?: boolean;
};

export const games: GameCard[] = [
  {
    id: "whack-a-mole",
    label: "Atrapa al topo",
    category: "featured",
    color: colors.yellow,
    players: "1-6",
    difficulty: "Fácil-Media",
    description: "Pisa los objetivos 2×2 antes de que se apaguen. Rápido, claro y muy físico.",
  },
  {
    id: "loop",
    label: "Arcoíris",
    category: "attract",
    color: colors.cyan,
    players: "Todos",
    difficulty: "Ambiente",
    description: "Un barrido de color continuo para atraer miradas, pruebas rápidas y tiempos muertos.",
    engineGame: "loop",
    previewAnimation: "loop",
  },
  {
    id: "ambient-comet",
    label: "Cometas",
    category: "attract",
    color: colors.blue,
    players: "Todos",
    difficulty: "Ambiente",
    description: "Trazos luminosos cruzan la pista con una sensación más energética y de espectáculo.",
    engineGame: "ambient-comet",
    previewAnimation: "ambient-comet",
  },
  {
    id: "ambient-pulse",
    label: "Pulso",
    category: "attract",
    color: colors.green,
    players: "Todos",
    difficulty: "Ambiente",
    description: "Ondas suaves que respiran desde el centro, ideal para espera o entrada de jugadores.",
    engineGame: "ambient-pulse",
    previewAnimation: "ambient-pulse",
  },
  {
    id: "ambient-spark",
    label: "Chispas",
    category: "attract",
    color: colors.orange,
    players: "Todos",
    difficulty: "Ambiente",
    description: "Destellos cortos sobre una base oscura para una presencia discreta pero viva.",
    engineGame: "ambient-spark",
    previewAnimation: "ambient-spark",
  },
  {
    id: "lava",
    label: "El suelo es lava",
    category: "team",
    color: colors.red,
    players: "1-6",
    difficulty: "Fácil-Experto",
    description: "Moveos en equipo y evitad las zonas rojas de peligro. Cada fallo cuesta una vida.",
  },
  {
    id: "duel",
    label: "Duelo",
    category: "versus",
    color: colors.violet,
    players: "2-4",
    difficulty: "Media-Experto",
    description: "Una arena de color para competir cara a cara. Próximamente.",
    disabled: true,
  },
];
