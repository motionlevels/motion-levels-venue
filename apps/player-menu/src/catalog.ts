import parkourEasyLevel1Preview from "./assets/previews/parkour-easy-level-1.webp";
import parkourEasyLevel2Preview from "./assets/previews/parkour-easy-level-2.webp";
import parkourEasyLevel3Preview from "./assets/previews/parkour-easy-level-3.webp";
import parkourEasyLevel4Preview from "./assets/previews/parkour-easy-level-4.webp";
import parkourEasyLevel5Preview from "./assets/previews/parkour-easy-level-5.webp";
import parkourMediumLevel1Preview from "./assets/previews/parkour-medium-level-1.webp";
import parkourMediumLevel2Preview from "./assets/previews/parkour-medium-level-2.webp";
import parkourMediumLevel3Preview from "./assets/previews/parkour-medium-level-3.webp";
import parkourMediumLevel4Preview from "./assets/previews/parkour-medium-level-4.webp";
import parkourMediumLevel5Preview from "./assets/previews/parkour-medium-level-5.webp";
import parkourHardLevel1Preview from "./assets/previews/parkour-hard-level-1.webp";
import parkourHardLevel2Preview from "./assets/previews/parkour-hard-level-2.webp";
import parkourHardLevel3Preview from "./assets/previews/parkour-hard-level-3.webp";
import parkourHardLevel4Preview from "./assets/previews/parkour-hard-level-4.webp";
import parkourHardLevel5Preview from "./assets/previews/parkour-hard-level-5.webp";

const previewAssets = import.meta.glob("./assets/previews/*.webp", { eager: true, import: "default" }) as Record<string, string>;

export function previewAsset(fileName: string): string | undefined {
  return previewAssets[`./assets/previews/${fileName}`];
}

export const colors = {
  cyan: "#36d9ff",
  green: "#8dff6e",
  yellow: "#ffd166",
  red: "#ff5268",
  violet: "#b987ff",
  orange: "#ff9f45",
  blue: "#005af8",
};

// Eight fully saturated, easy-to-distinguish player colors.
export const playerColors = [
  "#ff0000", // rojo
  "#00ffff", // cian
  "#00ff00", // verde
  "#ff00ff", // rosa
  "#0000ff", // azul
  "#ffff00", // amarillo
  "#ff8000", // naranja
  "#8000ff", // morado
];

export const playerColorNames = ["Rojo", "Cian", "Verde", "Rosa", "Azul", "Amarillo", "Naranja", "Morado"];
export const nameHints = playerColorNames;

export type CategoryID = "featured" | "team" | "versus" | "individual" | "arcade" | "attract";

export type Category = {
  id: CategoryID;
  label: string;
  title: string;
  color: string;
  icon: string;
};

export const categories: Category[] = [
  { id: "featured", label: "Destacados", title: "Listos para jugar", color: colors.blue, icon: "⭐" },
  { id: "team", label: "Cooperativos", title: "Jugad en equipo", color: colors.blue, icon: "👥" },
  { id: "versus", label: "Competitivos", title: "Cara a cara", color: colors.blue, icon: "⚔️" },
  { id: "individual", label: "Individual", title: "Retos individuales", color: colors.blue, icon: "👤" },
  { id: "arcade", label: "Arcade", title: "Arcade", color: colors.blue, icon: "🎮" },
  { id: "attract", label: "Ambiente", title: "Modos ambiente", color: colors.blue, icon: "🏞️" },
];

export type DifficultyID = "easy" | "medium" | "hard" | "expert";

export type Difficulty = {
  id: DifficultyID;
  label: string;
  color: string;
};

export const difficulties: Difficulty[] = [
  { id: "easy", label: "Fácil", color: colors.blue },
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
  estimatedDurationSeconds?: number;
  mode: string;
  audio: string;
  description: string;
  rules: string[];
  levels?: GameLevel[];
  partyMiniGames?: PartyMiniGame[];
  allowDifficultyWithLevels?: boolean;
  difficulties?: DifficultyID[];
  engineGame?: string;
  maxPlayers?: number;
  minPlayers?: number;
  thumbnailSrc?: string;
  thumbnailSrcs?: string[];
  previewSrc?: string;
  previewSrcs?: string[];
  previewAnimation?: string;
  previewRevisionHash?: string;
  featured?: boolean;
  supportsLevels?: boolean;
  sourceKind?: string;
  revisionHash?: string;
  disabled?: boolean;
};

export type PartyMiniGame = {
  gameId: string;
  label?: string;
  difficultyMode?: "inherit" | "override";
  difficulty?: DifficultyID;
  level?: string;
};

export type GameLevel = {
  id: string;
  label: string;
  description: string;
  difficulties?: DifficultyID[];
  previewSrc?: string;
  previewByDifficulty?: Partial<Record<DifficultyID, string>>;
  previewAnimation?: string;
};

const temporada1Previews = [
  ...Array.from({ length: 24 }, (_, index) => previewAsset(`temporada1-level-${index + 1}.webp`)),
];

const temporada1Descriptions = [
  "Láser N1: cruza entre líneas rojas móviles y recoge puntos azules.",
  "Telones N1: espera la apertura y pasa cuando el camino quede libre.",
  "Ruletas N1: esquiva radios giratorios y busca las monedas.",
  "Rayuela N1: sigue la ruta segura y salta de baldosa en baldosa.",
  "Topos N1: atrapa objetivos que aparecen en ventanas cortas.",
  "Bomba N1: recoge puntos mientras esquivas zonas de explosión.",
  "Láser N2: los cortes llegan antes y dejan menos margen.",
  "Telones N2: pasos más estrechos con ventanas más rápidas.",
  "Ruletas N2: más giro, más presión y monedas repartidas.",
  "Rayuela N2: memoriza el recorrido y muévete con precisión.",
  "Topos N2: objetivos más dispersos para coordinar al equipo.",
  "Láser N3: patrón largo de láseres con ritmo constante.",
  "Telones N3: sincroniza entradas y salidas entre barreras.",
  "Ruletas N3: evita varias ruedas mientras limpias el tablero.",
  "Rayuela N3: ruta segura avanzada con pocos apoyos.",
  "Topos N3: objetivos rápidos para equipos atentos.",
  "Bomba N2: explosiones más densas y menos descanso.",
  "Bomba N3: presión alta con zonas peligrosas encadenadas.",
  "Láser N4: desafío final de láseres con cambios bruscos.",
  "Telones N4: barreras rápidas y lectura de equipo.",
  "Ruletas N4: ruletas avanzadas con trayectorias exigentes.",
  "Rayuela N4: ruta de precisión para cerrar la serie.",
  "Topos N4: últimos objetivos, máxima velocidad.",
  "Final Boss: limpia todos los retos antes de que se agote el tiempo.",
];

export const temporada1Levels: GameLevel[] = temporada1Descriptions.map((description, index) => ({
  id: `level-${index + 1}`,
  label: `Nivel ${index + 1}`,
  description,
  previewSrc: temporada1Previews[index],
}));

export const plataformasLevels: GameLevel[] = [
  {
    id: "level-1",
    label: "Temporada 1 / Nivel 1",
    description: "Láser N1 migrado al formato editable en la nube.",
    previewSrc: previewAsset("temporada1-level-1.webp"),
  },
];

const temporada2Descriptions = [
  "Islas seguras, escáneres rojos cruzados y monedas para repartir el equipo.",
  "Un río de lava con huecos móviles: cruza, espera y recoge las monedas.",
  "Brazos rojos giratorios alrededor de una base verde central.",
  "Puertas que abren por columnas: lee el ritmo y entra en el momento justo.",
  "Final cooperativo con refugios, diagonales rojas y una lluvia de monedas.",
  "Puente norte: barreras rojas con compuertas verdes que alternan desde arriba.",
  "Patios cruzados: refugios repartidos y escáneres que obligan a cambiar de zona.",
  "Diagonal suave: barridos lentos y objetivos entre pasos seguros.",
  "Anillo central: núcleo seguro con brazos rojos alrededor de la pista.",
  "Salas dobles: puertas alternas entre salas verdes y puntos en pasillos.",
  "Puente sur: compuertas desplazadas para cruzar con ritmo de equipo.",
  "Patios rápidos: escáneres más cerrados alrededor de islas seguras.",
  "Diagonal partida: dos barridos cruzados con ventanas cortas.",
  "Anillo estrecho: centro seguro, radios rojos y poco margen.",
  "Salas en cadena: objetivos por turnos entre salas conectadas.",
  "Puente de calma: compuertas amplias para probar coordinación sin prisa.",
  "Patios espejados: escáneres opuestos y descansos en los laterales.",
  "Diagonal doble: dos familias de diagonales para cambiar de carril.",
  "Anillo exterior: usa borde y centro para escapar de cruces rojos.",
  "Salas rápidas: puertas vivas y objetivos en descansos cortos.",
  "Puente partido: compuertas que no siempre alinean, espera el hueco bueno.",
  "Patios de riesgo: islas pequeñas, escáneres anchos y puntos expuestos.",
  "Diagonal larga: rutas de extremo a extremo con barridos amplios.",
  "Anillo vivo: refugios alrededor del centro mientras gira la amenaza.",
  "Salas finales: puertas encadenadas y objetivos de doble toque.",
  "Puente caótico: compuertas con ritmos distintos para dividir roles.",
  "Patios finales: lectura lateral con puntos morados en zonas expuestas.",
  "Diagonal final: barridos densos y descansos justos entre oleadas.",
  "Anillo final: cruces rojos intensos alrededor del núcleo seguro.",
  "Gran cierre: salas, puertas y doble toque para cerrar la selección.",
];

export const temporada2Levels: GameLevel[] = temporada2Descriptions.map((description, index) => ({
  id: `level-${index + 1}`,
  label: `Nivel ${index + 1}`,
  description,
  difficulties: ["easy"],
  previewSrc: previewAsset(`temporada2-level-${index + 1}.webp`),
  previewAnimation: `temporada2-level-${index + 1}`,
}));

const parkourEasyPreviews = [parkourEasyLevel1Preview, parkourEasyLevel2Preview, parkourEasyLevel3Preview, parkourEasyLevel4Preview, parkourEasyLevel5Preview];
const parkourMediumPreviews = [parkourMediumLevel1Preview, parkourMediumLevel2Preview, parkourMediumLevel3Preview, parkourMediumLevel4Preview, parkourMediumLevel5Preview];
const parkourHardPreviews = [parkourHardLevel1Preview, parkourHardLevel2Preview, parkourHardLevel3Preview, parkourHardLevel4Preview, parkourHardLevel5Preview];

const parkourDescriptions = [
  "Cruza el primer trazado, pisa todas las plataformas azules y evita la lava.",
  "Un recorrido más directo para practicar lectura rápida del suelo.",
  "Saltos cortos con cambios de dirección y menos margen de error.",
  "Secuencia de obstáculos con zonas verdes de apoyo y ritmo constante.",
  "Reto final de Parkour: limpia el trazado lo más rápido posible.",
];

export const parkourLevels: GameLevel[] = parkourDescriptions.map((description, index) => ({
  id: `level-${index + 1}`,
  label: `Nivel ${index + 1}`,
  description,
  difficulties: ["easy", "medium", "hard"],
  previewSrc: parkourEasyPreviews[index],
  previewByDifficulty: {
    easy: parkourEasyPreviews[index],
    medium: parkourMediumPreviews[index],
    hard: parkourHardPreviews[index],
  },
}));

export const patronesLevels: GameLevel[] = [
  {
    id: "level-1",
    label: "Nivel 1",
    description: "Copia una cruz simple en el canvas central.",
  },
  {
    id: "level-2",
    label: "Nivel 2",
    description: "Reconstruye una diagonal doble sin pisar el fondo negro.",
  },
  {
    id: "level-3",
    label: "Nivel 3",
    description: "Completa el marco de luz del patrón.",
  },
  {
    id: "level-4",
    label: "Nivel 4",
    description: "Sigue una escalera luminosa por el centro.",
  },
  {
    id: "level-5",
    label: "Nivel 5",
    description: "Cierra un símbolo compacto con varias ramas.",
  },
];

export const games: GameCard[] = [
  {
    id: "whack-a-mole",
    label: "Atrapa al topo",
    category: "versus",
    color: colors.yellow,
    players: "1-6",
    difficulty: "Fácil-Media",
    duration: "60s",
    estimatedDurationSeconds: 60,
    minPlayers: 1,
    maxPlayers: 6,
    difficulties: ["easy", "medium"],
    mode: "Precisión",
    audio: "Narración + música",
    description: "Pisa los objetivos 2×2 antes de que se apaguen. Rápido, claro y muy físico.",
    rules: ["Pisa solo las zonas iluminadas.", "Los aciertos suman puntos.", "Los fallos rompen la racha."],
  },
  {
    id: "simon-dice",
    label: "Simón dice",
    category: "arcade",
    color: colors.blue,
    players: "1-6",
    difficulty: "Memoria",
    duration: "Rondas",
    minPlayers: 1,
    maxPlayers: 6,
    difficulties: ["medium"],
    mode: "Secuencia",
    audio: "Música + efectos",
    description: "Memorizad la secuencia de luces y repetidla en grupo antes de que el ritmo suba.",
    rules: ["Mirad la secuencia iluminada.", "Pisad los colores en el mismo orden.", "Cada ronda añade un paso más."],
    previewAnimation: "simon-dice",
    disabled: true,
  },
  {
    id: "featured-lava",
    label: "El suelo es lava",
    category: "featured",
    color: colors.red,
    players: "1-6",
    difficulty: "1-4 estrellas",
    duration: "Sin límite",
    estimatedDurationSeconds: 180,
    minPlayers: 1,
    maxPlayers: 6,
    difficulties: ["easy", "medium", "hard", "expert"],
    mode: "Plataformas",
    audio: "Narración + música",
    description: "Evitad las baldosas rojas, descubrid plataformas seguras nuevas y cuidad las vidas del equipo.",
    rules: ["1 estrella: plataformas grandes y lentas.", "Cada plataforma segura nueva suma 1 punto.", "4 estrellas: menos margen y más velocidad."],
    engineGame: "authored-lava",
    previewAnimation: "lava",
  },
  {
    id: "memory-lights",
    label: "Reto de memoria",
    category: "team",
    featured: true,
    color: colors.blue,
    players: "1-4",
    difficulty: "Memoria",
    duration: "90s",
    estimatedDurationSeconds: 90,
    minPlayers: 1,
    maxPlayers: 4,
    difficulties: ["medium"],
    mode: "Camino oculto",
    audio: "Música + efectos",
    description: "Memorizad el camino iluminado, salid de la zona inicial y recorredlo sin verlo. Si pisáis fuera, volved al inicio.",
    rules: ["El camino se muestra al inicio.", "Al salir se desvanece.", "Pisa la ruta en orden.", "Un fallo obliga a volver al inicio."],
    engineGame: "memory",
    previewAnimation: "memory",
  },
  {
    id: "salvapantallas",
    label: "Salvapantallas",
    category: "attract",
    color: colors.cyan,
    players: "Todos",
    difficulty: "Ambiente",
    duration: "60s",
    estimatedDurationSeconds: 60,
    minPlayers: 1,
    maxPlayers: 1,
    mode: "Ambiente",
    audio: "Suave",
    description: "Modo reposo que rota entre animaciones destacadas; si no hay destacadas usa las visibles.",
    rules: ["Rota automaticamente cada 60 segundos.", "Usa destacadas primero.", "Actualiza la lista al cambiar de animacion."],
    engineGame: "salvapantallas",
    thumbnailSrc: "/motion-levels-icon.webp",
  },
  {
    id: "saltos",
    label: "Saltos",
    category: "individual",
    color: colors.orange,
    players: "1",
    difficulty: "Niveles",
    duration: "60s",
    estimatedDurationSeconds: 60,
    minPlayers: 1,
    maxPlayers: 1,
    supportsLevels: true,
    mode: "Saltos",
    audio: "Música + efectos",
    description: "Salta de la plataforma azul a la verde sin tocar la lava. Cada salto correcto suma un punto.",
    rules: ["Empieza sobre la plataforma azul.", "Salta a la plataforma verde cuando aparezca.", "Cualquier baldosa roja termina la partida."],
    engineGame: "saltos",
    previewAnimation: "saltos",
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
    id: "parkour",
    label: "Parkour",
    category: "individual",
    color: colors.orange,
    players: "1",
    difficulty: "Fácil-Difícil",
    duration: "Mejor tiempo",
    estimatedDurationSeconds: 120,
    minPlayers: 1,
    maxPlayers: 1,
    difficulties: ["easy", "medium", "hard"],
    supportsLevels: true,
    mode: "Niveles",
    audio: "Música + efectos",
    description: "Un reto individual por niveles: pisa todas las plataformas azules, esquiva la lava y busca tu mejor tiempo.",
    rules: ["Solo juega un jugador.", "Cada plataforma azul pisada se confirma en verde.", "Completar un nivel desbloquea el siguiente."],
    engineGame: "parkour",
    previewSrc: parkourEasyLevel1Preview,
    allowDifficultyWithLevels: true,
    levels: parkourLevels,
  },
  {
    id: "ambient-comet",
    label: "Cometas",
    category: "attract",
    color: colors.blue,
    players: "Todos",
    difficulty: "Ambiente",
    duration: "Bucle",
    minPlayers: 1,
    maxPlayers: 6,
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
    minPlayers: 1,
    maxPlayers: 6,
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
    minPlayers: 1,
    maxPlayers: 6,
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
    difficulty: "1-4 estrellas",
    duration: "Sin límite",
    estimatedDurationSeconds: 180,
    minPlayers: 1,
    maxPlayers: 6,
    difficulties: ["easy", "medium", "hard", "expert"],
    mode: "Plataformas",
    audio: "Narración + música",
    description: "Moveos en equipo, evitad las zonas rojas y reclamad tantas plataformas seguras únicas como podáis.",
    rules: ["1 estrella: plataformas grandes y lentas.", "Cada plataforma segura nueva suma 1 punto.", "Tras recibir daño hay 1 segundo de inmunidad."],
    engineGame: "authored-lava",
    previewAnimation: "lava",
  },
  {
    id: "parkour2",
    label: "Parkour 2.0",
    category: "individual",
    color: colors.green,
    players: "1",
    difficulty: "Fácil-Experto",
    duration: "Niveles de plataforma",
    estimatedDurationSeconds: 120,
    minPlayers: 1,
    maxPlayers: 1,
    difficulties: ["easy", "medium", "hard", "expert"],
    supportsLevels: true,
    mode: "Editor",
    audio: "Música + efectos",
    description: "Reto editable inspirado en Parkour, con lava animada y plataformas verdes que pueden desvanecerse por nivel.",
    rules: ["El motor descarga los niveles visibles desde la plataforma.", "Las animaciones de plataforma se activan desde el editor.", "Pensado para probar y ajustar rutas de parkour rápido."],
    engineGame: "parkour2",
    previewSrc: previewAsset("temporada1-level-1.webp"),
    previewAnimation: "ambient-pulse",
    allowDifficultyWithLevels: true,
    levels: plataformasLevels,
  },
  {
    id: "temporada1-niveles",
    label: "Temporada 1",
    category: "team",
    color: colors.green,
    players: "1-6",
    difficulty: "Fácil-Experto",
    duration: "24 niveles",
    estimatedDurationSeconds: 300,
    minPlayers: 1,
    maxPlayers: 6,
    difficulties: ["easy", "medium", "hard", "expert"],
    supportsLevels: true,
    mode: "",
    audio: "",
    description: "Ruta cooperativa de 24 niveles con puntos, peligros y retos clásicos de la pista.",
    rules: ["El motor descarga los niveles visibles desde la plataforma.", "Las baldosas azules suman puntos.", "Las rojas hacen daño y las moradas piden doble toque."],
    engineGame: "temporada1-niveles",
    previewSrc: previewAsset("temporada1-level-1.webp"),
    previewAnimation: "temporada1-level-1",
    allowDifficultyWithLevels: true,
    levels: temporada1Levels,
  },
  {
    id: "duel",
    label: "Duelo",
    category: "versus",
    color: colors.red,
    players: "2-4",
    difficulty: "Medio-Hard",
    duration: "Sin límite",
    minPlayers: 2,
    maxPlayers: 4,
    difficulties: ["medium", "hard"],
    mode: "Versus",
    audio: "Música + efectos",
    description: "Cada jugador empieza en su zona 4×4. Medio reparte el 60% del suelo; hard reparte el 90%. Gana quien reclame antes todas sus baldosas.",
    rules: ["Pisa tu zona inicial para preparar la ronda.", "Medio llena el 60% del suelo.", "Hard llena el 90% del suelo.", "El primer color completado gana el duelo."],
    engineGame: "authored-duel",
    previewAnimation: "duel",
  },
];
