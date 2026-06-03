export const colors = {
  cyan: "#36d9ff",
  green: "#8dff6e",
  yellow: "#ffd166",
  red: "#ff5268",
  violet: "#b987ff",
  orange: "#ff9f45",
  blue: "#5b8cff",
};

export const playerColors = ["#ff2d55", "#ff9f0a", "#ffcc00", "#32d74b", "#64d2ff", "#0a84ff"];
export const nameHints = ["Red", "Orange", "Yellow", "Green", "Cyan", "Blue"];

export type CategoryID = "featured" | "team" | "versus" | "attract";

export type Category = {
  id: CategoryID;
  label: string;
  title: string;
  color: string;
};

export const categories: Category[] = [
  { id: "featured", label: "Featured", title: "Ready to play", color: colors.cyan },
  { id: "team", label: "Team", title: "Play together", color: colors.green },
  { id: "versus", label: "Versus", title: "Compete", color: colors.red },
  { id: "attract", label: "Attract", title: "Ambient modes", color: colors.violet },
];

export type DifficultyID = "easy" | "medium" | "hard" | "expert";

export type Difficulty = {
  id: DifficultyID;
  label: string;
  color: string;
};

export const difficulties: Difficulty[] = [
  { id: "easy", label: "Easy", color: colors.green },
  { id: "medium", label: "Medium", color: colors.yellow },
  { id: "hard", label: "Hard", color: colors.orange },
  { id: "expert", label: "Expert", color: colors.red },
];

export type GameCard = {
  id: string;
  label: string;
  category: CategoryID;
  icon: "mole" | "loop" | "lava" | "duel";
  color: string;
  players: string;
  difficulty: string;
  description: string;
  disabled?: boolean;
};

export const games: GameCard[] = [
  {
    id: "whack-a-mole",
    label: "Whack-a-mole",
    category: "featured",
    icon: "mole",
    color: colors.yellow,
    players: "1-6",
    difficulty: "Easy-Medium",
    description: "Step on 2x2 targets before they fade. Fast, clear, very physical.",
  },
  {
    id: "loop",
    label: "Animation loop",
    category: "attract",
    icon: "loop",
    color: colors.cyan,
    players: "All",
    difficulty: "Ambient",
    description: "A full-floor color loop for testing, idle time, and calibration.",
  },
  {
    id: "lava",
    label: "Floor is Lava",
    category: "team",
    icon: "lava",
    color: colors.red,
    players: "1-6",
    difficulty: "Easy-Expert",
    description: "Move as a team and avoid red danger zones. Planned for the rebuild.",
    disabled: true,
  },
  {
    id: "duel",
    label: "Duel",
    category: "versus",
    icon: "duel",
    color: colors.violet,
    players: "2-4",
    difficulty: "Medium-Expert",
    description: "A color-clearing arena for direct competition. Planned next.",
    disabled: true,
  },
];
