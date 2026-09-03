/**
 * Datenmodell eines Videos.
 *
 * Ein Video ist eine JSON-Datei unter videos/. Der generische Renderer in
 * format/Video.tsx baut daraus das fertige Reel. Kein Video bringt eigenen
 * Code mit -- der Grafik-Agent waehlt Szenentypen aus diesem Katalog und
 * fuellt sie, er schreibt niemals React.
 *
 * Das ist die zentrale Entscheidung der Pipeline: erzeugter Code wuerde den
 * Render unvorhersehbar brechen, und eine Kette, die jeden zweiten Tag
 * scheitert, ist schlechter als gar keine.
 */
import type {Pose} from '../components';

/**
 * Die Erzaehlabschnitte. Reihenfolge ist verbindlich, WANN ist der einzige
 * optionale. Was jeder leisten muss, steht in agenten/struktur.md.
 */
export const BEATS = ['HAKEN', 'WAS', 'WARUM', 'WIE', 'WANN', 'TUN', 'MERKEN'] as const;
export type Beat = (typeof BEATS)[number];

/** Ohne diese sechs ist ein Thema nicht vollstaendig erklaert. */
export const PFLICHT_BEATS: Beat[] = ['HAKEN', 'WAS', 'WARUM', 'WIE', 'TUN', 'MERKEN'];

/**
 * Inhaltstext mit sparsamer Auszeichnung:
 *   *Sternchen*  -> fett
 *   \n           -> Zeilenumbruch
 * Mehr gibt es bewusst nicht. Siehe format/text.tsx.
 */
export type Text = string;

export type Nachricht = {
  /** Beschriftung im Kasten. */
  label: string;
  /** Sekunde innerhalb der Szene, ab der sie erscheint. */
  at: number;
};

export type Tipp = {
  /** EINS, ZWEI, DREI -- ausgeschrieben, nicht als Ziffer. */
  n: string;
  text: Text;
};

/** Felder, die jede Szene hat. */
type Basis = {
  /**
   * Welchen Erzaehlabschnitt diese Szene traegt. Erst dadurch laesst sich
   * pruefen, ob ein Thema vollstaendig erklaert wurde -- vorher war die Mitte
   * eines Videos unspezifiziert und konnte beliebig duenn ausfallen.
   */
  beat: Beat;
  /** Zeile oben, Grossbuchstaben. */
  kapitel: string;
  pose: Pose;
  /** Index in VideoDef.schritte; -1 hebt keinen hervor. */
  schritt: number;
  /**
   * Der Sprechertext dieser Szene, in Sinnabschnitten.
   *
   * Hieraus entsteht beides: das Voiceover (alle Zeilen aller Szenen
   * hintereinander) und die Szenengrenze (aus den gemessenen Wortzeiten der
   * eigenen Zeilen). Damit kann die Grenze nicht mehr von der Szene
   * abweichen -- genau der Fehler, der frueher acht Szenen sieben Grenzen
   * gegenueberstellte und alle Kapitel stillschweigend verschob.
   *
   * Bei Tipps entspricht Zeile 0 der Ueberleitung und jede weitere Zeile
   * einem Tipp; daraus ergeben sich die Einsaetze.
   */
  text: string[];
};

/**
 * Der Szenenkatalog. Neue Typen kommen nur dazu, wenn ein bestehender das
 * Thema falsch zeigen wuerde -- nicht zur Abwechslung. Vier bis fuenf
 * wiederkehrende Typen sind ein Format, zwoelf sind ein Sammelsurium.
 */
export type Szene =
  /** Durchgestrichene Behauptung, darunter die Richtigstellung. Jeder Hook. */
  | (Basis & {typ: 'irrtum'; behauptung: Text; wahrheit: Text})
  /** Behaelter, der sich fuellt. Grenzen, Kapazitaet. */
  | (Basis & {typ: 'behaelter'; nachrichten: Nachricht[]; kapazitaet: number; notiz?: Text})
  /** Derselbe Behaelter laeuft ueber, Aeltestes faellt oben raus. */
  | (Basis & {typ: 'ueberlauf'; nachrichten: Nachricht[]; kapazitaet: number; folge: Text})
  /** Suchstrahl ueber den vollen Behaelter: alles wird neu gelesen. */
  | (Basis & {typ: 'durchlauf'; nachrichten: Nachricht[]; kapazitaet: number; hinweis: Text; pointe: Text})
  /** Ein Satz zerfaellt in eingefaerbte Stuecke. */
  | (Basis & {
      typ: 'zerlegung';
      titel: Text;
      satz: Text;
      teile: string[];
      /** Sekunde, ab der das erste Teil erscheint. Vorgabe 1,1. */
      ab?: number;
      /**
       * Abstand zwischen zwei Teilen, in Sekunden. Vorgabe 0,09 -- so schnell,
       * dass alle Teile binnen einer halben Sekunde stehen. Bei einer langen
       * Szene ist danach nichts mehr los; dann gehoert der Takt hochgesetzt,
       * damit sich die Zerlegung ueber die Szene zieht statt vorne zu klumpen.
       */
      takt?: number;
      fussnote: Text;
    })
  /** Balken, die mit einer Kennzahl wachsen. */
  | (Basis & {
      typ: 'balken';
      titel: Text;
      /** ton steuert die Farbe. Abgeleitet ging bei zwei Reihen daneben:
       *  die Schwelle lag dann so tief, dass beide rot wurden. */
      reihen: {label: string; faktor: number; at: number; ton?: 'gut' | 'warnung'}[];
      folge: Text;
      fussnote?: Text;
    })
  /**
   * Falsches Fenster mit Zeilen, die nacheinander auflaufen. Zeigt, wo etwas
   * steht und was bleibt: System-Prompt, Werkzeugzugriff, MCP.
   */
  | (Basis & {
      typ: 'fenster';
      fenster: string;
      zeilen: {text: Text; rolle: 'system' | 'nutzer' | 'antwort'; at: number}[];
      fussnote?: Text;
    })
  /**
   * Zwei Seiten gegeneinander. Fuer Entscheidungen mit echtem Abwaegen:
   * RAG gegen Fine-Tuning, teures gegen schnelles Modell.
   */
  | (Basis & {
      typ: 'waage';
      links: {titel: string; punkte: Text[]};
      rechts: {titel: string; punkte: Text[]};
      /** Welche Seite am Ende hervorgehoben wird. */
      empfehlung?: 'links' | 'rechts';
      urteil: Text;
    })
  /**
   * Eine Eingabe, mehrere verschiedene Ausgaben. Fuer alles, was nicht
   * deterministisch ist: Temperature, Halluzination.
   */
  | (Basis & {
      typ: 'streuung';
      frage: Text;
      antworten: {text: Text; at: number; ton?: 'gut' | 'warnung' | 'neutral'}[];
      fussnote?: Text;
    })
  /**
   * Punkte im Raum, Naehe bedeutet Aehnlichkeit. Fuer Embeddings und
   * Vektorsuche. x und y laufen von 0 bis 1 und werden in die Buehne gelegt.
   */
  | (Basis & {
      typ: 'karte';
      punkte: {label: string; x: number; y: number; gruppe?: number; at: number}[];
      /** Diese beiden Punkte werden verbunden -- der Kern der Aussage. */
      verbindung?: [number, number];
      hinweis: Text;
    })
  /** Nummerierte Handlungen. Immer die vorletzte Szene. */
  | (Basis & {typ: 'tipps'; tipps: Tipp[]})
  /** Pointe und Merk-Aufforderung. Immer die letzte Szene. */
  | (Basis & {typ: 'schluss'; pointe: Text; merksatz: Text});

export type SzenenTyp = Szene['typ'];

export type VideoDef = {
  /** Dateiname ohne Endung, zugleich Remotion-Komposition. */
  id: string;
  titel: string;
  /** Beschriftungen der Schrittleiste, drei bis fuenf. */
  schritte: string[];
  /**
   * Probe: zeigt Bautypen zur Ansicht und wird nicht gepostet. Nimmt das
   * Video von der Laengenregel aus, sonst gilt alles wie sonst.
   */
  probe?: boolean;
  szenen: Szene[];
};

/**
 * Szenengrenzen, von scripts/zeiten.mjs aus den gemessenen Wortzeiten
 * berechnet -- nicht von Hand gepflegt. einsaetze ist nur bei Tipps besetzt
 * und haelt die Einsatzsekunden relativ zum Szenenstart.
 */
export type Grenze = {at: number; duration: number; einsaetze?: number[]};

/** Was scripts/zeiten.mjs neben den Wortzeiten ablegt. */
export type Zeiten = {
  duration: number;
  grenzen: Grenze[];
  words: {word: string; start: number; end: number}[];
};

/** Alle Sprechertexte eines Videos hintereinander, eine Zeile je Abschnitt. */
export const narration = (video: VideoDef): string[] =>
  video.szenen.flatMap((szene) => szene.text);
