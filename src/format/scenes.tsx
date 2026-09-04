import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {
  Appear,
  Card,
  CardTitle,
  ChapterLabel,
  Chip,
  Mascot,
  StepBar,
  useSceneSeconds,
} from '../components';
import {ContextBox, ScanLine, TokenStrip} from '../context/components';
import {COLOR, FONT, LAYOUT} from '../theme';
import type {Szene} from './schema';
import {T} from './text';

const BOX_WIDTH = 620;

/**
 * Abstand der Streuungs-Fussnote zur letzten Antwort, in Sekunden. Steht
 * gleichlautend in scripts/pruefe-video.mjs.
 */
const STREUUNG_NACHLAUF = 1.2;

/** Rahmen, den jede Szene teilt: Kapitelzeile, Schrittleiste, Maskottchen. */
const Rahmen: React.FC<{
  szene: Szene;
  schritte: string[];
  children: React.ReactNode;
}> = ({szene, schritte, children}) => (
  <AbsoluteFill>
    <ChapterLabel text={szene.kapitel} />
    <StepBar steps={schritte} activeIndex={szene.schritt} />
    <Mascot pose={szene.pose} />
    {children}
  </AbsoluteFill>
);

/**
 * Markerstrich, der ueber einen Abschnitt hinweg waechst.
 *
 * Das einzige Bauteil, das dauerhaft in Bewegung ist, und es sitzt genau
 * dort, wo eine Szene sonst stehenbliebe: unter der Aussage, von der gerade
 * die Rede ist. Vorher liefen die drei festen Szenentypen -- irrtum, tipps,
 * schluss -- nach ihrer letzten Einblendung bis zu neun Sekunden ohne jede
 * Bewegung weiter, waehrend der Text dazu noch gesprochen wurde.
 */
const Marker: React.FC<{von: number; bis: number; ton?: 'gut' | 'accent'}> = ({
  von,
  bis,
  ton = 'gut',
}) => {
  const t = useSceneSeconds();
  const anteil = interpolate(t, [von, Math.max(bis, von + 0.8)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        marginTop: 14,
        height: 6,
        width: `${anteil * 100}%`,
        background: ton === 'gut' ? COLOR.goodSoft : COLOR.accentSoft,
        borderRadius: 3,
      }}
    />
  );
};

/** Durchgestrichene Behauptung, darunter die Richtigstellung. */
const Irrtum: React.FC<{szene: Extract<Szene, {typ: 'irrtum'}>; dauer: number}> = ({
  szene,
  dauer,
}) => {
  const t = useSceneSeconds();
  const strich = interpolate(t, [2.6, 3.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <Card top={520} delay={4} style={{padding: '46px 40px'}}>
        <CardTitle>WAS ALLE DENKEN</CardTitle>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{fontSize: 38, color: COLOR.inkSoft, lineHeight: 1.5}}>
            <T>{szene.behauptung}</T>
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: -10,
              height: 7,
              borderRadius: 4,
              background: COLOR.accent,
              width: `${strich * 106}%`,
            }}
          />
        </div>
      </Card>

      <Card top={860} delay={3.5 * 30} style={{padding: '32px 36px'}}>
        <div style={{fontSize: 34, color: COLOR.accent, lineHeight: 1.4}}>
          <T>{szene.wahrheit}</T>
        </div>
        <Marker von={3.9} bis={dauer - 0.3} ton="accent" />
      </Card>
    </>
  );
};

/** Behaelter, der sich fuellt. */
const Behaelter: React.FC<{szene: Extract<Szene, {typ: 'behaelter'}>}> = ({szene}) => (
  <>
    <div style={{position: 'absolute', left: LAYOUT.stage.left, top: 430}}>
      <ContextBox messages={szene.nachrichten} capacity={szene.kapazitaet} width={BOX_WIDTH} />
    </div>

    {szene.notiz ? (
      <Card top={900} delay={2.6 * 30} style={{padding: '28px 32px'}}>
        <div style={{fontSize: 27, color: COLOR.muted, lineHeight: 1.6}}>
          <T>{szene.notiz}</T>
        </div>
      </Card>
    ) : null}
  </>
);

/**
 * Derselbe Behaelter, bereits voll. Die ersten Nachrichten stehen von Anfang
 * an drin (at: -1), damit das Herausfallen sofort sichtbar wird statt erst
 * nach dem Fuellen.
 */
const Ueberlauf: React.FC<{szene: Extract<Szene, {typ: 'ueberlauf'}>}> = ({szene}) => {
  const verschoben = szene.nachrichten.map((m, i) => ({
    ...m,
    at: i < szene.kapazitaet ? -1 : (i - szene.kapazitaet) * 1.6 + 1.0,
  }));

  return (
    <>
      <div style={{position: 'absolute', left: LAYOUT.stage.left, top: 460}}>
        <ContextBox messages={verschoben} capacity={szene.kapazitaet} width={BOX_WIDTH} />
      </div>

      <Card top={980} delay={4.4 * 30} style={{padding: '30px 34px'}}>
        <div style={{fontSize: 27, color: COLOR.inkSoft, lineHeight: 1.6}}>
          <T>{szene.folge}</T>
        </div>
      </Card>
    </>
  );
};

/** Suchstrahl ueber den vollen Behaelter. */
const Durchlauf: React.FC<{szene: Extract<Szene, {typ: 'durchlauf'}>}> = ({szene}) => {
  const t = useSceneSeconds();
  const hoehe = szene.kapazitaet * 62 + 36;
  const voll = szene.nachrichten.slice(-szene.kapazitaet).map((m) => ({...m, at: -1}));

  return (
    <>
      <div style={{position: 'absolute', left: LAYOUT.stage.left, top: 430}}>
        <div style={{position: 'relative', width: BOX_WIDTH}}>
          <ContextBox messages={voll} capacity={szene.kapazitaet} width={BOX_WIDTH} showMeter={false} />
          {t > 0.6 ? <ScanLine width={BOX_WIDTH} height={hoehe} /> : null}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: LAYOUT.stage.left,
          top: 790,
          fontFamily: FONT,
          fontSize: 25,
          letterSpacing: 3,
          color: COLOR.good,
          opacity: t > 0.8 ? 1 : 0,
        }}
      >
        &#8635; <T>{szene.hinweis}</T>
      </div>

      <Card top={880} delay={2.4 * 30} style={{padding: '34px 36px'}}>
        <div style={{fontSize: 30, color: COLOR.ink, lineHeight: 1.45}}>
          <T>{szene.pointe}</T>
        </div>
      </Card>
    </>
  );
};

/** Ein Satz zerfaellt in eingefaerbte Stuecke. */
const Zerlegung: React.FC<{szene: Extract<Szene, {typ: 'zerlegung'}>}> = ({szene}) => (
  <Card top={470} delay={4} style={{padding: '32px 34px'}}>
    <CardTitle>
      <T>{szene.titel}</T>
    </CardTitle>
    <div style={{fontSize: 26, color: COLOR.muted, marginBottom: 20}}>
      &bdquo;<T>{szene.satz}</T>&ldquo;
    </div>
    <TokenStrip tokens={szene.teile} revealAt={szene.ab ?? 1.1} takt={szene.takt ?? 0.09} />
    <div style={{fontSize: 24, color: COLOR.faint, marginTop: 22, letterSpacing: 1}}>
      <T>{szene.fussnote}</T>
    </div>
  </Card>
);

/** Balken, die mit einer Kennzahl wachsen. */
const Balken: React.FC<{szene: Extract<Szene, {typ: 'balken'}>}> = ({szene}) => {
  const t = useSceneSeconds();
  const groesster = Math.max(...szene.reihen.map((r) => r.faktor));

  return (
    <>
      <Card top={450} delay={4} style={{padding: '34px 36px'}}>
        <CardTitle>
          <T>{szene.titel}</T>
        </CardTitle>
        {szene.reihen.map((reihe) => {
          // Ohne ton faellt nur die groesste Reihe auf -- das stimmt fuer die
          // uebliche "hier kippt es"-Kurve und laesst sich sonst setzen.
          const warnt = reihe.ton ? reihe.ton === 'warnung' : reihe.faktor === groesster;
          return (
            <Appear key={reihe.label} at={reihe.at} rise={10}>
              <div style={{display: 'flex', alignItems: 'center', gap: 18, margin: '14px 0'}}>
                <span style={{fontSize: 24, color: COLOR.muted, width: 172}}>{reihe.label}</span>
                <div
                  style={{
                    height: 26,
                    width: interpolate(reihe.faktor, [0, groesster], [30, 280], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                    background: warnt ? COLOR.accentSoft : COLOR.goodSoft,
                    border: `2px solid ${warnt ? COLOR.accent : COLOR.good}`,
                    borderRadius: 6,
                  }}
                />
                <span style={{fontSize: 25, color: COLOR.inkSoft}}>&times;{reihe.faktor}</span>
              </div>
            </Appear>
          );
        })}
      </Card>

      <Card top={840} delay={4.0 * 30} style={{padding: '28px 32px'}}>
        <div style={{fontSize: 27, color: COLOR.inkSoft, lineHeight: 1.6}}>
          <T>{szene.folge}</T>
        </div>
      </Card>

      {szene.fussnote ? (
        <div
          style={{
            position: 'absolute',
            left: LAYOUT.stage.left,
            top: 1020,
            fontFamily: FONT,
            fontSize: 25,
            color: COLOR.muted,
            opacity: t > 5.0 ? 1 : 0,
          }}
        >
          <T>{szene.fussnote}</T>
        </div>
      ) : null}
    </>
  );
};

/**
 * Falsches Fenster. Zeigt, wo etwas steht und was ueber Durchlaeufe hinweg
 * bleibt -- die Systemzeile ist abgesetzt, weil genau das der Unterschied ist.
 */
/**
 * Zwei Chrom-Varianten fuer dasselbe Fenster: hell wie eine Chat-Ansicht,
 * dunkel wie eine Kommandozeile. Beide bleiben Illustration im Kanalstil --
 * keine der beiden bildet eine echte Oberflaeche pixelgenau ab, das Fenster
 * macht nur ueber Farbe und Zeilenform klar, um welche Art Werkzeug es geht.
 */
const FENSTER_CHROM = {
  chat: {
    fensterGrund: COLOR.card,
    rand: COLOR.cardEdge,
    kopfGrund: COLOR.chip,
    labelFarbe: COLOR.muted,
    punktFarbe: COLOR.faint,
    cursorFarbe: COLOR.ink,
  },
  terminal: {
    fensterGrund: COLOR.ink,
    rand: '#3A3A36',
    kopfGrund: '#2A2A27',
    labelFarbe: '#8A8A80',
    punktFarbe: '#54544E',
    cursorFarbe: COLOR.goodSoft,
  },
} as const;

const Fenster: React.FC<{szene: Extract<Szene, {typ: 'fenster'}>}> = ({szene}) => {
  const t = useSceneSeconds();
  const stil = szene.stil ?? 'chat';
  const chrom = FENSTER_CHROM[stil];

  // Nur die Kommandozeile braucht ein Rollen-zu-Marke-Mapping -- ein
  // Prompt-Zeichen vor Eingaben, keine Marke bei Ausgabe. Der Chat-Stil
  // zeichnet jede Rolle grundverschieden (Sprechblase, Fliesstext,
  // Hinweiszeile) und branch deshalb direkt auf zeile.rolle, siehe unten.
  const TERMINAL_TON = {
    system: {farbe: '#8A8A80', marke: '#', zeigen: true},
    nutzer: {farbe: COLOR.goodSoft, marke: '❯', zeigen: true},
    antwort: {farbe: '#C9C9C0', marke: '', zeigen: false},
  } as const;

  return (
    <>
      <div style={{position: 'absolute', left: LAYOUT.stage.left, top: 440, width: BOX_WIDTH}}>
        <div
          style={{
            background: chrom.fensterGrund,
            border: `2px solid ${chrom.rand}`,
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 18px',
              borderBottom: `2px solid ${chrom.rand}`,
              background: chrom.kopfGrund,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{width: 11, height: 11, borderRadius: 6, background: chrom.punktFarbe}}
              />
            ))}
            <span style={{fontFamily: FONT, fontSize: 21, color: chrom.labelFarbe, marginLeft: 10}}>
              {szene.produkt ? `${szene.produkt} — ${szene.fenster}` : szene.fenster}
            </span>
          </div>

          <div style={{padding: '18px 18px 22px'}}>
            {stil === 'terminal'
              ? szene.zeilen.map((zeile, i) => {
                  const ton = TERMINAL_TON[zeile.rolle];
                  return (
                    <Appear key={i} at={zeile.at} rise={8}>
                      <div style={{margin: '8px 0'}}>
                        {zeile.marke ? (
                          <div style={{marginBottom: 6}}>
                            <Chip tone="good">{zeile.marke}</Chip>
                          </div>
                        ) : null}
                        <div style={{display: 'flex', gap: 10, alignItems: 'flex-start'}}>
                          {ton.zeigen ? (
                            <span style={{fontSize: 24, color: ton.farbe, flexShrink: 0}}>{ton.marke}</span>
                          ) : (
                            <span style={{width: 14, flexShrink: 0}} />
                          )}
                          <span style={{fontSize: 24, color: ton.farbe, lineHeight: 1.45}}>
                            <T>{zeile.text}</T>
                          </span>
                        </div>
                      </div>
                    </Appear>
                  );
                })
              : // Chat: Eingaben als rechtsbuendige Sprechblase, Antworten als
                // Fliesstext mit einem Punkt statt einer KI-Marke, Systemzeilen
                // als schmaler Hinweis mittig -- so liest es sich als
                // Unterhaltung, nicht als Protokoll.
                szene.zeilen.map((zeile, i) => (
                  <Appear key={i} at={zeile.at} rise={8}>
                    {zeile.marke ? (
                      <div style={{display: 'flex', justifyContent: zeile.rolle === 'nutzer' ? 'flex-end' : 'flex-start', marginTop: 10}}>
                        <Chip tone="good">{zeile.marke}</Chip>
                      </div>
                    ) : null}
                    {zeile.rolle === 'nutzer' ? (
                      <div style={{display: 'flex', justifyContent: 'flex-end', margin: '10px 0'}}>
                        <div
                          style={{
                            maxWidth: '76%',
                            background: COLOR.accentSoft,
                            border: `2px solid ${COLOR.accent}`,
                            borderRadius: 14,
                            padding: '10px 16px',
                            fontSize: 24,
                            color: COLOR.inkSoft,
                            lineHeight: 1.4,
                          }}
                        >
                          <T>{zeile.text}</T>
                        </div>
                      </div>
                    ) : zeile.rolle === 'antwort' ? (
                      <div style={{display: 'flex', gap: 12, alignItems: 'flex-start', margin: '12px 0'}}>
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            background: COLOR.accent,
                            marginTop: 6,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{fontSize: 24, color: COLOR.inkSoft, lineHeight: 1.5}}>
                          <T>{zeile.text}</T>
                        </span>
                      </div>
                    ) : (
                      <div style={{textAlign: 'center', margin: '14px 0'}}>
                        <span
                          style={{
                            fontSize: 17,
                            letterSpacing: 1,
                            color: COLOR.muted,
                            background: COLOR.chip,
                            border: `1px solid ${COLOR.cardEdge}`,
                            borderRadius: 20,
                            padding: '4px 14px',
                          }}
                        >
                          <T>{zeile.text}</T>
                        </span>
                      </div>
                    )}
                  </Appear>
                ))}

            {stil === 'terminal' ? (
              // Der Cursor macht aus dem Standbild eine laufende Kommandozeile.
              <span
                style={{
                  display: 'inline-block',
                  width: 13,
                  height: 24,
                  marginLeft: 24,
                  background: chrom.cursorFarbe,
                  opacity: Math.floor(t * 1.8) % 2 === 0 ? 0.75 : 0,
                }}
              />
            ) : (
              // Das Eingabefeld macht aus dem Protokoll eine Chat-Oberflaeche --
              // ohne animierten Cursor, ein Kompositionsfeld steht einfach da.
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: COLOR.chip,
                  border: `2px solid ${COLOR.cardEdge}`,
                  borderRadius: 24,
                  padding: '10px 18px',
                }}
              >
                <span style={{fontSize: 20, color: COLOR.faint}}>
                  Nachricht an {szene.produkt ?? 'Claude'}…
                </span>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: COLOR.accent,
                    marginLeft: 'auto',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {szene.fussnote ? (
        <Card top={1010} delay={2.4 * 30} style={{padding: '26px 30px'}}>
          <div style={{fontSize: 26, color: COLOR.inkSoft, lineHeight: 1.55}}>
            <T>{szene.fussnote}</T>
          </div>
        </Card>
      ) : null}
    </>
  );
};

/**
 * Cursor-Punkt, der zu einem Ziel wandert und kurz davor "klickt".
 *
 * Nimmt eine Liste von Zielpunkten mit eigener Ankunftszeit. Zwischen zwei
 * Zielen bewegt er sich in den letzten 0,5 s davor; am Ziel selbst ein
 * kurzer Groessenpuls statt eines eigenen Klick-Symbols -- das reicht als
 * Signal und bleibt im selben zurueckhaltenden Stil wie der Rest des Kanals.
 */
const Cursor: React.FC<{ziele: {x: number; y: number; at: number}[]}> = ({ziele}) => {
  const t = useSceneSeconds();
  if (!ziele.length) return null;

  const sortiert = [...ziele].sort((a, b) => a.at - b.at);
  let zielIndex = sortiert.findIndex((p) => t < p.at);
  if (zielIndex === -1) zielIndex = sortiert.length - 1;
  const ziel = sortiert[zielIndex];
  const start = zielIndex > 0 ? sortiert[zielIndex - 1] : {x: ziel.x, y: ziel.y - 60};

  const ANLAUF = 0.5;
  const fortschritt = interpolate(t, [ziel.at - ANLAUF, ziel.at], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(fortschritt, [0, 1], [start.x, ziel.x]);
  const y = interpolate(fortschritt, [0, 1], [start.y, ziel.y]);
  const puls = interpolate(t, [ziel.at - 0.08, ziel.at, ziel.at + 0.18], [1, 0.65, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x - 11,
        top: y - 11,
        width: 22,
        height: 22,
        borderRadius: 11,
        background: COLOR.ink,
        opacity: 0.85,
        boxShadow: `0 0 0 5px ${COLOR.bg}`,
        transform: `scale(${puls})`,
      }}
    />
  );
};

/**
 * Echte Bedienelemente statt Text: Liste, Reiter, Schalter, die sich
 * animiert umschalten, mit einem Cursor, der hinklickt. Antwort auf die
 * Beobachtung, dass ein `fenster` mit Text wie "Tab: Auto Mode" nur den
 * Klick beschreibt, statt ihn zu zeigen -- hier aendert sich das Bauteil
 * selbst.
 */
const BEDIENFELD_ABSTAND = 148;

const Bedienfeld: React.FC<{szene: Extract<Szene, {typ: 'bedienfeld'}>}> = ({szene}) => {
  const t = useSceneSeconds();
  const ziele: {x: number; y: number; at: number}[] = [];

  const bloecke = szene.elemente.map((el, i) => {
    const top = i * BEDIENFELD_ABSTAND;
    const marke = el.marke ? (
      <div style={{marginBottom: 8}}>
        <Chip tone="good">{el.marke}</Chip>
      </div>
    ) : null;

    if (el.art === 'liste') {
      const REIHE = 54;
      ziele.push({x: 40, y: top + el.gewaehlt * REIHE + REIHE / 2 + (el.marke ? 46 : 0), at: el.at});
      return (
        <div key={i} style={{marginBottom: 24}}>
          {marke}
          <div style={{background: COLOR.card, border: `2px solid ${COLOR.cardEdge}`, borderRadius: 12, overflow: 'hidden'}}>
            {el.eintraege.map((eintrag, n) => {
              const hervor = interpolate(t, [el.at - 0.05, el.at + 0.15], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const aktiv = n === el.gewaehlt && hervor > 0.5;
              return (
                <div
                  key={n}
                  style={{
                    padding: '13px 20px',
                    fontSize: 24,
                    background: aktiv ? COLOR.goodSoft : 'transparent',
                    borderLeft: `4px solid ${aktiv ? COLOR.good : 'transparent'}`,
                    color: aktiv ? COLOR.good : COLOR.inkSoft,
                  }}
                >
                  {eintrag}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (el.art === 'reiter') {
      const breite = BOX_WIDTH / el.optionen.length;
      ziele.push({x: el.ziel * breite + breite / 2, y: top + (el.marke ? 76 : 30), at: el.at});
      return (
        <div key={i} style={{marginBottom: 24}}>
          {marke}
          <div style={{display: 'flex', border: `2px solid ${COLOR.cardEdge}`, borderRadius: 10, overflow: 'hidden'}}>
            {el.optionen.map((option, n) => {
              const aktivIndex = t >= el.at ? el.ziel : el.start;
              const aktiv = n === aktivIndex;
              return (
                <div
                  key={n}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '14px 8px',
                    fontSize: 22,
                    background: aktiv ? COLOR.goodSoft : COLOR.chip,
                    color: aktiv ? COLOR.good : COLOR.muted,
                    borderRight: n < el.optionen.length - 1 ? `2px solid ${COLOR.cardEdge}` : 'none',
                  }}
                >
                  {option}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (el.art === 'schalter') {
      const an = t >= el.at ? el.an : !el.an;
      ziele.push({x: BOX_WIDTH - 47, y: top + (el.marke ? 63 : 17), at: el.at});
      return (
        <div
          key={i}
          style={{
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {marke}
            <span style={{fontSize: 24, color: COLOR.inkSoft}}>{el.label}</span>
          </div>
          <div
            style={{
              position: 'relative',
              width: 64,
              height: 34,
              borderRadius: 17,
              background: an ? COLOR.goodSoft : COLOR.chip,
              border: `2px solid ${an ? COLOR.good : COLOR.cardEdge}`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 2,
                left: interpolate(t, [el.at, el.at + 0.25], an ? [2, 32] : [32, 2], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                width: 26,
                height: 26,
                borderRadius: 13,
                background: an ? COLOR.good : COLOR.faint,
              }}
            />
          </div>
        </div>
      );
    }

    // eingabe -- ein Feld, das sich ab `at` fuellt, mit Haekchen als Bestaetigung.
    const gefuellt = interpolate(t, [el.at, el.at + 0.3], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    ziele.push({x: 30, y: top + (el.marke ? 68 : 22), at: el.at});
    return (
      <div key={i} style={{marginBottom: 24}}>
        {marke}
        <div style={{fontSize: 18, color: COLOR.muted, marginBottom: 6}}>{el.label}</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: COLOR.card,
            border: `2px solid ${gefuellt > 0.5 ? COLOR.good : COLOR.cardEdge}`,
            borderRadius: 10,
            padding: '12px 16px',
          }}
        >
          <span style={{fontSize: 22, color: COLOR.inkSoft, flex: 1, opacity: gefuellt}}>{el.wert}</span>
          <span style={{fontSize: 22, color: COLOR.good, opacity: gefuellt}}>✓</span>
        </div>
      </div>
    );
  });

  return (
    <>
      <div style={{position: 'absolute', left: LAYOUT.stage.left, top: 440, width: BOX_WIDTH}}>
        {szene.produkt ? (
          <div style={{fontFamily: FONT, fontSize: 20, color: COLOR.muted, marginBottom: 14}}>
            {szene.produkt}
          </div>
        ) : null}
        {bloecke}
        <Cursor ziele={ziele} />
      </div>

      {szene.fussnote ? (
        <Card top={1010} delay={2.4 * 30} style={{padding: '26px 30px'}}>
          <div style={{fontSize: 26, color: COLOR.inkSoft, lineHeight: 1.55}}>
            <T>{szene.fussnote}</T>
          </div>
        </Card>
      ) : null}
    </>
  );
};

/**
 * Zwei Seiten gegeneinander, darunter das Urteil.
 *
 * Die Spalten passen zwischen Maskottchen (bis 340) und Safe Zone (ab 900).
 * Erste Fassung lief bis 1000 -- die empfohlene Seite haette teilweise unter
 * Instagrams Knopfleiste gelegen, also ausgerechnet die wichtigere.
 */
const SPALTE_BREITE = 268;
const SPALTE_LUECKE = 24;

const Waage: React.FC<{szene: Extract<Szene, {typ: 'waage'}>}> = ({szene}) => {
  const spalte = (
    seite: {titel: string; punkte: string[]},
    welche: 'links' | 'rechts',
    versatz: number
  ) => {
    const hervor = szene.empfehlung === welche;
    return (
      <div
        style={{
          position: 'absolute',
          left: LAYOUT.stage.left + versatz,
          top: 450,
          width: SPALTE_BREITE,
          background: hervor ? COLOR.goodSoft : COLOR.card,
          border: `2px solid ${hervor ? COLOR.good : COLOR.cardEdge}`,
          borderRadius: 14,
          padding: '20px 20px 24px',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 22,
            letterSpacing: 2,
            color: hervor ? COLOR.good : COLOR.muted,
            marginBottom: 16,
          }}
        >
          {seite.titel}
        </div>
        {seite.punkte.map((punkt, i) => (
          <Appear key={i} at={0.7 + i * 0.55 + (welche === 'rechts' ? 0.28 : 0)} rise={8}>
            <div style={{display: 'flex', gap: 10, margin: '11px 0'}}>
              <span style={{color: hervor ? COLOR.good : COLOR.faint, fontSize: 22}}>&#9679;</span>
              <span style={{fontSize: 22, color: COLOR.inkSoft, lineHeight: 1.4}}>
                <T>{punkt}</T>
              </span>
            </div>
          </Appear>
        ))}
      </div>
    );
  };

  return (
    <>
      {spalte(szene.links, 'links', 0)}
      {spalte(szene.rechts, 'rechts', SPALTE_BREITE + SPALTE_LUECKE)}
      <Card top={1000} delay={3.2 * 30} style={{padding: '28px 32px'}}>
        <div style={{fontSize: 28, color: COLOR.ink, lineHeight: 1.5}}>
          <T>{szene.urteil}</T>
        </div>
      </Card>
    </>
  );
};

/** Eine Frage, mehrere Antworten -- der Faecher ist die Aussage. */
const Streuung: React.FC<{szene: Extract<Szene, {typ: 'streuung'}>}> = ({szene}) => {
  const RAND = {gut: COLOR.good, warnung: COLOR.accent, neutral: COLOR.cardEdge} as const;
  const GRUND = {gut: COLOR.goodSoft, warnung: COLOR.accentSoft, neutral: COLOR.card} as const;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: LAYOUT.stage.left,
          top: 440,
          width: BOX_WIDTH,
          background: COLOR.chip,
          border: `2px dashed ${COLOR.faint}`,
          borderRadius: 12,
          padding: '18px 22px',
          fontSize: 25,
          color: COLOR.inkSoft,
        }}
      >
        <T>{szene.frage}</T>
      </div>

      {/* Die Klammer macht sichtbar, dass alles aus derselben Eingabe kommt. */}
      <div
        style={{
          position: 'absolute',
          left: LAYOUT.stage.left + 40,
          top: 528,
          width: 2,
          height: 34,
          background: COLOR.faint,
        }}
      />

      {szene.antworten.map((antwort, i) => {
        const ton = antwort.ton ?? 'neutral';
        return (
          <Appear key={i} at={antwort.at} rise={12}>
            <div
              style={{
                position: 'absolute',
                left: LAYOUT.stage.left + 40,
                top: 570 + i * 118,
                width: BOX_WIDTH - 40,
                background: GRUND[ton],
                border: `2px solid ${RAND[ton]}`,
                borderRadius: 12,
                padding: '18px 22px',
                fontSize: 24,
                color: COLOR.inkSoft,
                lineHeight: 1.45,
              }}
            >
              <T>{antwort.text}</T>
            </div>
          </Appear>
        );
      })}

      {/*
        Die Fussnote ist die Pointe ("welche stimmt?") und muss deshalb nach
        der letzten Antwort kommen. Fest bei 3,4 s stand sie mitten zwischen
        den Antworten, sobald die auseinandergezogen wurden.
      */}
      {szene.fussnote ? (
        <Card
          top={980}
          delay={(Math.max(...szene.antworten.map((a) => a.at)) + STREUUNG_NACHLAUF) * 30}
          style={{padding: '26px 30px'}}
        >
          <div style={{fontSize: 27, color: COLOR.inkSoft, lineHeight: 1.5}}>
            <T>{szene.fussnote}</T>
          </div>
        </Card>
      ) : null}
    </>
  );
};

/** Punkte im Raum: Naehe ist Bedeutung. */
const Karte: React.FC<{szene: Extract<Szene, {typ: 'karte'}>}> = ({szene}) => {
  const B = BOX_WIDTH;
  const H = 400;
  const GRUPPE = [COLOR.good, COLOR.accent, COLOR.muted];
  const platz = (p: {x: number; y: number}) => ({x: 30 + p.x * (B - 60), y: 30 + p.y * (H - 60)});

  const von = szene.verbindung ? platz(szene.punkte[szene.verbindung[0]]) : null;
  const bis = szene.verbindung ? platz(szene.punkte[szene.verbindung[1]]) : null;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: LAYOUT.stage.left,
          top: 440,
          width: B,
          height: H,
          background: COLOR.card,
          border: `2px solid ${COLOR.cardEdge}`,
          borderRadius: 14,
        }}
      >
        {von && bis ? (
          <svg width={B} height={H} style={{position: 'absolute', inset: 0}}>
            <line
              x1={von.x}
              y1={von.y}
              x2={bis.x}
              y2={bis.y}
              stroke={COLOR.good}
              strokeWidth={3}
              strokeDasharray="7 6"
            />
          </svg>
        ) : null}

        {szene.punkte.map((punkt, i) => {
          const {x, y} = platz(punkt);
          const farbe = GRUPPE[punkt.gruppe ?? 0] ?? COLOR.muted;
          return (
            <Appear key={i} at={punkt.at} rise={0}>
              <div style={{position: 'absolute', left: x, top: y}}>
                <div
                  style={{
                    position: 'absolute',
                    left: -8,
                    top: -8,
                    width: 16,
                    height: 16,
                    borderRadius: 10,
                    background: farbe,
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: -13,
                    fontFamily: FONT,
                    fontSize: 21,
                    color: COLOR.inkSoft,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {punkt.label}
                </span>
              </div>
            </Appear>
          );
        })}
      </div>

      <Card top={890} delay={2.8 * 30} style={{padding: '28px 32px'}}>
        <div style={{fontSize: 27, color: COLOR.inkSoft, lineHeight: 1.5}}>
          <T>{szene.hinweis}</T>
        </div>
      </Card>
    </>
  );
};

/**
 * Nummerierte Handlungen. Die Einsaetze kommen aus den gemessenen Wortzeiten
 * (scripts/zeiten.mjs), nicht aus der Videodatei -- sonst laeuft ein Tipp
 * gegen den gesprochenen Text.
 */
const Tipps: React.FC<{
  szene: Extract<Szene, {typ: 'tipps'}>;
  einsaetze: number[];
  dauer: number;
}> = ({szene, einsaetze, dauer}) => (
  <>
    {szene.tipps.map((tipp, i) => {
      // Der Abschnitt eines Tipps reicht bis zum naechsten, der letzte bis
      // zum Szenenende. Der Marker laeuft ueber genau diesen Abschnitt und
      // zeigt damit mit, wovon gerade die Rede ist.
      const ab = einsaetze[i] ?? 0;
      const bis = einsaetze[i + 1] ?? dauer;

      return (
        <Card key={tipp.n} top={420 + i * 250} delay={ab * 30} style={{padding: '28px 32px'}}>
          <div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
            <Chip tone="good">{tipp.n}</Chip>
            <div style={{paddingTop: 6, maxWidth: 470}}>
              <div style={{fontSize: 27, color: COLOR.inkSoft, lineHeight: 1.5}}>
                <T>{tipp.text}</T>
              </div>
              <Marker von={ab + 0.35} bis={bis - 0.25} />
            </div>
          </div>
        </Card>
      );
    })}
  </>
);

/**
 * Pointe, Merk-Aufforderung, und der feste Schlusssatz.
 *
 * "Genaue Schritte in der Caption. Folgt für mehr KI-Tipps." WIRD
 * GESPROCHEN -- steht deshalb als zweiter Eintrag in schluss.text (text[0]
 * ist Pointe/Merksatz, text[1] dieser Satz) und zaehlt zur echten
 * Sprechzeit. Kein eigenes Schema-Feld, damit narration.mjs und zeiten.mjs
 * ihn ohne Sonderfall mitnehmen -- beide lesen ohnehin schon szene.text.
 * Gleicher Wortlaut in jedem Video, siehe struktur.md und die Pruefung in
 * pruefe-video.mjs.
 */
export const AUFRUF_SATZ = 'Genaue Schritte in der Caption. Folgt für mehr KI-Tipps.';

const Schluss: React.FC<{szene: Extract<Szene, {typ: 'schluss'}>; dauer: number}> = ({
  szene,
  dauer,
}) => (
  <>
    <Card top={500} delay={2} style={{padding: '38px 36px'}}>
      <div style={{fontSize: 36, color: COLOR.ink, lineHeight: 1.45}}>
        <T>{szene.pointe}</T>
      </div>
    </Card>

    <Card top={760} delay={0.8 * 30} style={{padding: '26px 32px'}}>
      <div style={{fontSize: 26, color: COLOR.muted, lineHeight: 1.5}}>
        <T>{szene.merksatz}</T>
      </div>
      <Marker von={1.3} bis={dauer - 0.3} />
    </Card>

    <Card
      top={1020}
      delay={Math.max(0, dauer - 2.6) * 30}
      style={{padding: '20px 28px', background: COLOR.chip}}
    >
      <div style={{fontSize: 22, color: COLOR.muted, lineHeight: 1.45}}>
        <T>{szene.text[1] ?? AUFRUF_SATZ}</T>
      </div>
    </Card>
  </>
);

/**
 * Waehlt den Bautyp. Der Katalog ist absichtlich geschlossen: gibt es einen
 * Typ nicht, faellt das beim Rendern sofort auf statt ein leeres Bild zu
 * erzeugen.
 */
export const Bau: React.FC<{
  szene: Szene;
  schritte: string[];
  einsaetze?: number[];
  dauer?: number;
}> = ({
  szene,
  schritte,
  einsaetze = [],
  dauer = 0,
}) => {
  const inhalt = (() => {
    switch (szene.typ) {
      case 'irrtum':
        return <Irrtum szene={szene} dauer={dauer} />;
      case 'behaelter':
        return <Behaelter szene={szene} />;
      case 'ueberlauf':
        return <Ueberlauf szene={szene} />;
      case 'durchlauf':
        return <Durchlauf szene={szene} />;
      case 'zerlegung':
        return <Zerlegung szene={szene} />;
      case 'balken':
        return <Balken szene={szene} />;
      case 'fenster':
        return <Fenster szene={szene} />;
      case 'bedienfeld':
        return <Bedienfeld szene={szene} />;
      case 'waage':
        return <Waage szene={szene} />;
      case 'streuung':
        return <Streuung szene={szene} />;
      case 'karte':
        return <Karte szene={szene} />;
      case 'tipps':
        return <Tipps szene={szene} einsaetze={einsaetze} dauer={dauer} />;
      case 'schluss':
        return <Schluss szene={szene} dauer={dauer} />;
      default: {
        const unbekannt: never = szene;
        throw new Error(`Unbekannter Szenentyp: ${JSON.stringify(unbekannt)}`);
      }
    }
  })();

  return (
    <Rahmen szene={szene} schritte={schritte}>
      {inhalt}
    </Rahmen>
  );
};
