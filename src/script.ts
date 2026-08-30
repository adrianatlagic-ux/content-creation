/**
 * Sprechertext und Timing.
 *
 * Nichts hiervon ist geschaetzt. src/timing.json wird von
 * scripts/measure-timing.mjs aus dem fertigen Voiceover erzeugt und enthaelt
 * fuer jedes Wort echte Zeitstempel. Aendert sich der Text, laeuft die Kette:
 *
 *   1. src/narration.txt anpassen
 *   2. Voiceover neu erzeugen -> public/voice.mp3
 *   3. node scripts/speed-up-voice.mjs 1.22   (Tempo, siehe unten)
 *   4. node scripts/measure-timing.mjs
 *   5. SCENE_BOUNDS und TIP_BEATS unten an den neuen Wortzeiten ausrichten
 *
 * Zum Tempo: die Regieanweisungen im Text ([fast], [rapid]) haben bei der
 * geklonten Stimme kaum gewirkt -- die Rohaufnahme kam mit 50,1 s sogar
 * langsamer heraus als eine Fremdstimme ohne solche Anweisungen. Das Tempo
 * macht deshalb der Nachbearbeitungsschritt: 41,1 s bei Faktor 1,22, also
 * 3,0 Woerter pro Sekunde. Zum Vergleich liegt das Referenz-Reel bei 3,5.
 */
import timing from './timing.json';

export type TimedWord = {
  word: string;
  start: number;
  end: number;
};

export const timedWords = (): TimedWord[] => timing.words;

/** Gemessene Laenge des Voiceovers plus kurzer Nachlauf am Schluss. */
export const TOTAL_SECONDS = 42;

/**
 * Szenengrenzen, abgelesen an den gemessenen Wortzeiten -- jede Szene beginnt
 * genau dort, wo der zugehoerige Satz einsetzt:
 *
 *   4,21 s  "Chatbot: eine Runde ..."
 *  12,79 s  "... kriegt Werkzeuge."
 *  15,73 s  "Und jetzt kommt der Teil ..."
 *  28,14 s  "Drei Sachen, die du ab heute anders machst."
 *  38,89 s  "Speicher dir das ..."
 */
export const SCENE_BOUNDS = {
  hook: {at: 0.0, duration: 4.21},
  chatbot: {at: 4.21, duration: 8.58},
  agent: {at: 12.79, duration: 2.94},
  schleife: {at: 15.73, duration: 12.41},
  tipps: {at: 28.14, duration: 10.75},
  schluss: {at: 38.89, duration: 3.11},
} as const;

/**
 * Einsatzzeiten der drei Tipp-Karten, relativ zum Start der Tipps-Szene.
 * Gemessen: "Eins:" 30,50 s | "Zwei:" 32,91 s | "Drei:" 35,68 s
 */
export const TIP_BEATS = [2.36, 4.77, 7.54] as const;
