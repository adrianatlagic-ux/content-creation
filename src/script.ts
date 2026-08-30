/**
 * Sprechertext und Timing.
 *
 * Nichts hiervon ist geschaetzt. src/timing.json wird von
 * scripts/measure-timing.mjs aus dem fertigen Voiceover erzeugt und enthaelt
 * fuer jedes Wort echte Zeitstempel. Aendert sich der Text, laeuft die Kette:
 *
 *   1. src/narration.txt anpassen
 *   2. Voiceover neu erzeugen -> public/voice.mp3
 *   3. node scripts/measure-timing.mjs
 *   4. SCENE_BOUNDS unten an den neuen Wortzeiten ausrichten
 */
import timing from './timing.json';

export type TimedWord = {
  word: string;
  start: number;
  end: number;
};

export const timedWords = (): TimedWord[] => timing.words;

/** Gemessene Laenge des Voiceovers plus kurzer Nachlauf am Schluss. */
export const TOTAL_SECONDS = 44;

/**
 * Szenengrenzen, abgelesen an den gemessenen Wortzeiten -- jede Szene beginnt
 * genau dort, wo der zugehoerige Satz einsetzt:
 *
 *   4,8 s  "Ein Chatbot macht ..."
 *  13,4 s  "Ein Agent bekommt Werkzeuge."
 *  17,5 s  "Und jetzt der Teil, den fast alle uebersehen ..."
 *  31,1 s  "Drei Dinge, die du ab heute anders machst."
 *  41,9 s  "Speicher dir das ..."
 */
export const SCENE_BOUNDS = {
  hook: {at: 0.0, duration: 4.8},
  chatbot: {at: 4.8, duration: 8.6},
  agent: {at: 13.4, duration: 4.1},
  schleife: {at: 17.5, duration: 13.6},
  tipps: {at: 31.1, duration: 10.8},
  schluss: {at: 41.9, duration: 2.1},
} as const;

/**
 * Einsatzzeiten der drei Tipp-Karten, relativ zum Start der Tipps-Szene.
 * Gemessen: "Eins:" 33,9 s | "Zwei:" 36,7 s | "Drei:" 39,3 s
 */
export const TIP_BEATS = [2.8, 5.6, 8.2] as const;
