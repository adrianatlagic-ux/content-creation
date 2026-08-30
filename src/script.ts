/**
 * Sprechertext und Timing.
 *
 * Solange es kein echtes Voiceover gibt, werden die Wort-Zeitstempel aus den
 * Satzgrenzen geschaetzt (gewichtet nach Wortlaenge). Sobald ElevenLabs das
 * Audio liefert, wird SENTENCES durch die echten Alignment-Daten ersetzt --
 * die Untertitel-Komponente bleibt unveraendert.
 */

export type Sentence = {
  /** Sekunde, in der der Satz beginnt. */
  start: number;
  /** Sekunde, in der der Satz endet. */
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
  { start: 0.5, end: 4.6, text: 'Ein Agent ist kein Chatbot mit einem besseren Prompt.' },

  // --- Szene 2: Der Chatbot ---
  { start: 6.2, end: 9.0, text: 'Ein Chatbot macht genau eine Runde.' },
  { start: 9.2, end: 11.6, text: 'Du fragst, das Modell antwortet, fertig.' },
  { start: 11.9, end: 13.9, text: 'Er kann nichts nachschauen.' },

  // --- Szene 3: Der Agent ---
  { start: 14.4, end: 16.6, text: 'Ein Agent bekommt Werkzeuge.' },
  { start: 16.9, end: 20.4, text: 'Er denkt, ruft ein Tool auf,' },
  { start: 20.6, end: 22.4, text: 'liest das Ergebnis,' },
  { start: 22.6, end: 25.6, text: 'und denkt dann weiter.' },

  // --- Szene 4: Die Schleife ---
  { start: 26.2, end: 29.6, text: 'Diese Schleife läuft, bis die Aufgabe erledigt ist.' },
  { start: 30.0, end: 32.0, text: 'Das ist der Unterschied.' },
  { start: 32.4, end: 34.4, text: 'Nicht das Modell. Die Schleife.' },
];

/**
 * Verteilt die Woerter eines Satzes ueber dessen Dauer, gewichtet nach Laenge --
 * laengere Woerter bekommen mehr Zeit, was naeher an echter Sprache liegt als
 * eine gleichmaessige Aufteilung.
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

/** Gesamtlaenge in Sekunden, mit etwas Nachlauf am Ende. */
export const TOTAL_SECONDS = 35;
