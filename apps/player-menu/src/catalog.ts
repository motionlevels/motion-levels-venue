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

export type CategoryID = "featured" | "individual" | "team" | "versus" | "attract";

export type Category = {
  id: CategoryID;
  label: string;
  title: string;
  color: string;
};

export const categories: Category[] = [
  { id: "featured", label: "Destacados", title: "Listos para jugar", color: colors.cyan },
  { id: "individual", label: "Individual", title: "Retos individuales", color: colors.orange },
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
  duration: string;
  mode: string;
  audio: string;
  description: string;
  rules: string[];
  levels?: GameLevel[];
  engineGame?: string;
  previewAnimation?: string;
  disabled?: boolean;
};

export type GameLevel = {
  id: string;
  label: string;
  description: string;
};

export const games: GameCard[] = [
  {
    id: "whack-a-mole",
    label: "Atrapa al topo",
    category: "featured",
    color: colors.yellow,
    players: "1-6",
    difficulty: "Fácil-Media",
    duration: "60s",
    mode: "Precisión",
    audio: "Narración + música",
    description: "Pisa los objetivos 2×2 antes de que se apaguen. Rápido, claro y muy físico.",
    rules: ["Pisa solo las zonas iluminadas.", "Los aciertos suman puntos.", "Los fallos rompen la racha."],
  },
  {
    id: "featured-lava",
    label: "El suelo es lava",
    category: "featured",
    color: colors.red,
    players: "1-6",
    difficulty: "Fácil-Experto",
    duration: "Sin límite",
    mode: "Plataformas",
    audio: "Narración + música",
    description: "Evitad las baldosas rojas, descubrid plataformas seguras nuevas y cuidad las vidas del equipo.",
    rules: ["Las zonas rojas quitan vidas.", "Cada plataforma segura nueva suma 1 punto.", "La velocidad sube con la dificultad."],
    engineGame: "lava",
    previewAnimation: "lava",
  },
  {
    id: "memory-lights",
    label: "Memoria de luces",
    category: "featured",
    color: colors.blue,
    players: "1-4",
    difficulty: "Media",
    duration: "75s",
    mode: "Memoria",
    audio: "Efectos",
    description: "Recordad la secuencia de colores y pisadla en orden antes de que termine el tiempo.",
    rules: ["Mirad la secuencia completa.", "Pisad cada baldosa en orden.", "La cadena crece en cada ronda."],
    previewAnimation: "ambient-pulse",
    disabled: true,
  },
  {
    id: "crazy-tiles",
    label: "Baldosas locas",
    category: "featured",
    color: colors.violet,
    players: "2-6",
    difficulty: "Media",
    duration: "60s",
    mode: "Caos",
    audio: "Música",
    description: "El patrón cambia sin avisar: reaccionad rápido y mantened el control del suelo.",
    rules: ["Seguid las baldosas activas.", "Evitad pisar fuera del patrón.", "Cada ronda acelera un poco."],
    previewAnimation: "ambient-spark",
    disabled: true,
  },
  {
    id: "loop",
    label: "Arcoíris",
    category: "attract",
    color: colors.cyan,
    players: "Todos",
    difficulty: "Ambiente",
    duration: "Bucle",
    mode: "Ambiente",
    audio: "Suave",
    description: "Un barrido de color continuo para atraer miradas, pruebas rápidas y tiempos muertos.",
    rules: ["Reproduce una animación continua.", "No requiere jugadores.", "Ideal para espera y demostración."],
    engineGame: "loop",
    previewAnimation: "loop",
  },
  {
    id: "parkour",
    label: "Parkour",
    category: "individual",
    color: colors.orange,
    players: "1",
    difficulty: "Niveles",
    duration: "60s",
    mode: "Saltos",
    audio: "Música + efectos",
    description: "Salta de la plataforma azul a la verde sin tocar la lava. Cada salto correcto suma un punto.",
    rules: ["Empieza sobre la plataforma azul.", "Salta a la plataforma verde cuando aparezca.", "Cualquier baldosa roja termina la partida."],
    engineGame: "parkour",
    previewAnimation: "parkour",
    levels: [
      {
        id: "starter",
        label: "Nivel 1",
        description: "Saltos cercanos y objetivo más lento para aprender el recorrido.",
      },
      {
        id: "classic",
        label: "Nivel 2",
        description: "Distancia clásica, buen ritmo para una partida normal.",
      },
      {
        id: "expert",
        label: "Nivel 3",
        description: "Objetivo más rápido y saltos largos para jugadores seguros.",
      },
    ],
  },
  {
    id: "ambient-comet",
    label: "Cometas",
    category: "attract",
    color: colors.blue,
    players: "Todos",
    difficulty: "Ambiente",
    duration: "Bucle",
    mode: "Ambiente",
    audio: "Suave",
    description: "Trazos luminosos cruzan la pista con una sensación más energética y de espectáculo.",
    rules: ["Animación continua.", "Trazos rápidos sobre el suelo.", "Se puede cambiar en cualquier momento."],
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
    duration: "Bucle",
    mode: "Ambiente",
    audio: "Suave",
    description: "Ondas suaves que respiran desde el centro, ideal para espera o entrada de jugadores.",
    rules: ["Animación continua.", "Pulso calmado de baja tensión.", "Buena para transiciones entre partidas."],
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
    duration: "Bucle",
    mode: "Ambiente",
    audio: "Suave",
    description: "Destellos cortos sobre una base oscura para una presencia discreta pero viva.",
    rules: ["Animación continua.", "Destellos cálidos y puntuales.", "Mantiene el suelo activo sin distraer."],
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
    duration: "Sin límite",
    mode: "Plataformas",
    audio: "Narración + música",
    description: "Moveos en equipo, evitad las zonas rojas y reclamad tantas plataformas seguras únicas como podáis.",
    rules: ["Las zonas rojas quitan vidas.", "Cada plataforma segura nueva suma 1 punto.", "Tras recibir daño hay 1 segundo de inmunidad."],
    previewAnimation: "lava",
  },
  {
    id: "safe-zone",
    label: "Zona segura",
    category: "team",
    color: colors.green,
    players: "2-6",
    difficulty: "Fácil-Media",
    duration: "75s",
    mode: "Cooperativo",
    audio: "Efectos",
    description: "El equipo debe entrar junto en las zonas verdes antes de que cambien de posición.",
    rules: ["Buscad la zona verde.", "Todos los jugadores deben llegar.", "La zona se mueve cada ronda."],
    previewAnimation: "ambient-pulse",
    disabled: true,
  },
  {
    id: "team-pulse",
    label: "Pulso de equipo",
    category: "team",
    color: colors.cyan,
    players: "2-6",
    difficulty: "Media",
    duration: "60s",
    mode: "Coordinación",
    audio: "Música",
    description: "Sincronizad pasos en varios puntos del suelo para mantener vivo el pulso común.",
    rules: ["Pisad al ritmo del pulso.", "Mantened varias posiciones activas.", "La precisión sostiene la energía."],
    previewAnimation: "ambient-comet",
    disabled: true,
  },
  {
    id: "reflex-race",
    label: "Carrera de reflejos",
    category: "versus",
    color: colors.orange,
    players: "2-4",
    difficulty: "Media",
    duration: "60s",
    mode: "Versus",
    audio: "Música + efectos",
    description: "Dos equipos compiten por pisar objetivos rápidos antes que sus rivales.",
    rules: ["Pisa tu color antes que el rival.", "Cada acierto suma territorio.", "Gana quien controle más baldosas."],
    previewAnimation: "ambient-comet",
    disabled: true,
  },
  {
    id: "duel",
    label: "Duelo",
    category: "versus",
    color: colors.violet,
    players: "2-4",
    difficulty: "Media-Experto",
    duration: "90s",
    mode: "Versus",
    audio: "Intensa",
    description: "Una arena de color para competir cara a cara. Próximamente.",
    rules: ["Defiende tu zona.", "Ataca cuando el suelo cambie.", "El duelo premia reflejos y lectura."],
    disabled: true,
  },
];
