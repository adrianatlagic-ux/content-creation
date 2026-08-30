/**
 * Design-Tokens fuer das Reel-Format.
 *
 * Alle Positionswerte beziehen sich auf die 1080x1920-Leinwand und halten sich
 * an die Safe Zone aus layout-mockup.html: Instagram legt seine Bedienoberflaeche
 * ueber das Video (oben 250px, unten 500px, rechts 180px).
 */

export const CANVAS = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/** Nutzbare Flaeche, in der alles Wichtige liegen muss. */
export const SAFE = {
  left: 60,
  top: 250,
  right: 900,
  bottom: 1420,
} as const;

export const COLOR = {
  bg: '#EFEBE2',
  bgWarm: '#FBF6E6',
  dot: '#00000012',

  ink: '#1E1E1C',
  inkSoft: '#33322E',
  muted: '#8A857A',
  faint: '#B4AE9E',

  card: '#FDFCF8',
  cardEdge: '#DCD6C6',
  chip: '#F6F3EA',
  chipEdge: '#DCD6C6',

  accent: '#C0392B',
  accentSoft: '#E9C4BF',
  good: '#2E7D5B',
  goodSoft: '#CDE3D8',
} as const;

export const FONT = '"DejaVu Sans Mono", "Liberation Mono", monospace';

/** Untertitel-Band: so tief wie moeglich, ohne von Instagram verdeckt zu werden. */
export const CAPTION = {
  top: 1240,
  maxWidth: 820,
  fontSize: 40,
  /** Anzahl bereits gesprochener Woerter, die neben dem aktuellen stehen bleiben. */
  trail: 3,
} as const;

export const LAYOUT = {
  chapterTop: 268,
  stepBarTop: 322,
  /** Ueber die Hoehe skaliert und an der Grundlinie verankert, siehe Mascot. */
  mascot: { left: 26, bottom: 1330, height: 700 },
  /** Diagrammflaeche. Darf rechts bis 1010 laufen, wichtiger Text bleibt links von 900. */
  stage: { left: 340, top: 430, width: 670 },
} as const;
