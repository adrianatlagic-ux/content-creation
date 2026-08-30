/**
 * Sprechertext und Timing.
 *
 * Die Segmentgrenzen sind nicht geschaetzt, sondern am fertigen Voiceover
 * gemessen: ffmpeg silencedetect ueber public/voice.mp3 liefert die echten
 * Sprechpausen, und diese neun Segmente decken exakt die 59 Woerter des
 * Skripts ab. Innerhalb eines Segments werden die Woerter nach Laenge
 * verteilt -- bei maximal 3,9 s Segmentlaenge bleibt der Versatz unsichtbar.
 *
 * Wer den Text aendert, muss das Voiceover neu erzeugen und die Messung
 * wiederholen:
 *   ffmpeg -i public/voice.mp3 -af silencedetect=noise=-38dB:d=0.16 -f null -
 */

export type Sentence = {
  /** Sekunde, in der das Segment beginnt (gemessen). */
  start: number;
  /** Sekunde, in der das Segment endet (gemessen). */
  end: number;
  text: string;
};

export type TimedWord = {
  word: string;
  start: number;
  end: number;
};

export const SENTENCES: Sentence[] = [
  // --- Szene 1: Der Irrtum ---
  { start: 0.00, end: 2.85, text: 'Ein Agent ist kein Chatbot mit einem besseren Prompt.' },

  // --- Szene 2: Der Chatbot ---
  { start: 3.17, end: 5.19, text: 'Ein Chatbot macht genau eine Runde.' },
  { start: 5.37, end: 9.25, text: 'Du fragst, das Modell antwortet, fertig. Er kann nichts nachschauen.' },

  // --- Szene 3: Der Agent ---
  { start: 9.53, end: 11.13, text: 'Ein Agent bekommt Werkzeuge.' },
  { start: 11.42, end: 15.16, text: 'Er denkt, ruft ein Tool auf, liest das Ergebnis, und denkt dann weiter.' },

  // --- Szene 4: Die Schleife ---
  { start: 16.10, end: 18.50, text: 'Diese Schleife läuft, bis die Aufgabe erledigt ist.' },
  { start: 18.78, end: 19.72, text: 'Das ist der Unterschied.' },
  { start: 20.19, end: 21.03, text: 'Nicht das Modell.' },
  { start: 21.62, end: 22.24, text: 'Die Schleife.' },
];

/**
 * Verteilt die Woerter eines Segments ueber dessen gemessene Dauer, gewichtet
 * nach Laenge -- laengere Woerter bekommen mehr Zeit, was naeher an echter
 * Sprache liegt als eine gleichmaessige Aufteilung.
 */
export const timedWords = (sentences: Sentence[] = SENTENCES): TimedWord[] => {
  const out: TimedWord[] = [];

  for (const sentence of sentences) {
    const words = sentence.text.split(/\s+/).filter(Boolean);
    const weights = words.map((w) => w.length + 1);
    const total = weights.reduce((a, b) => a + b, 0);
    const duration = sentence.end - sentence.start;

    let cursor = sentence.start;
    words.forEach((word, i) => {
      const span = (weights[i] / total) * duration;
      out.push({ word, start: cursor, end: cursor + span });
      cursor += span;
    });
  }

  return out;
};

/** Laenge des Voiceovers plus kurzer Nachlauf, damit der Schluss stehen bleibt. */
export const TOTAL_SECONDS = 24;

/**
 * Szenengrenzen in Sekunden, an den gemessenen Pausen ausgerichtet:
 * jede Szene startet in der Stille vor dem ersten Satz, den sie bebildert.
 */
export const SCENE_BOUNDS = {
  irrtum: { at: 0.0, duration: 3.05 },
  chatbot: { at: 3.05, duration: 6.34 },
  agent: { at: 9.39, duration: 6.61 },
  schleife: { at: 16.0, duration: 8.0 },
} as const;
