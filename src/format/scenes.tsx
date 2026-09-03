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

/** Durchgestrichene Behauptung, darunter die Richtigstellung. */
const Irrtum: React.FC<{szene: Extract<Szene, {typ: 'irrtum'}>}> = ({szene}) => {
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
    <TokenStrip tokens={szene.teile} revealAt={1.1} />
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
const Fenster: React.FC<{szene: Extract<Szene, {typ: 'fenster'}>}> = ({szene}) => {
  const t = useSceneSeconds();
  const TON = {
    system: {farbe: COLOR.good, grund: COLOR.goodSoft, marke: 'SYSTEM'},
    nutzer: {farbe: COLOR.inkSoft, grund: COLOR.chip, marke: 'DU'},
    antwort: {farbe: COLOR.muted, grund: 'transparent', marke: 'KI'},
  } as const;

  return (
    <>
      <div style={{position: 'absolute', left: LAYOUT.stage.left, top: 440, width: BOX_WIDTH}}>
        <div
          style={{
            background: COLOR.card,
            border: `2px solid ${COLOR.cardEdge}`,
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
              borderBottom: `2px solid ${COLOR.cardEdge}`,
              background: COLOR.chip,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{width: 11, height: 11, borderRadius: 6, background: COLOR.faint}}
              />
            ))}
            <span style={{fontFamily: FONT, fontSize: 21, color: COLOR.muted, marginLeft: 10}}>
              {szene.fenster}
            </span>
          </div>

          <div style={{padding: '18px 18px 22px'}}>
            {szene.zeilen.map((zeile, i) => {
              const ton = TON[zeile.rolle];
              return (
                <Appear key={i} at={zeile.at} rise={8}>
                  <div style={{display: 'flex', gap: 12, alignItems: 'flex-start', margin: '10px 0'}}>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 17,
                        letterSpacing: 1,
                        color: ton.farbe,
                        background: ton.grund,
                        border: `2px solid ${zeile.rolle === 'antwort' ? COLOR.cardEdge : ton.farbe}`,
                        borderRadius: 6,
                        padding: '3px 8px',
                        flexShrink: 0,
                        minWidth: 62,
                        textAlign: 'center',
                      }}
                    >
                      {ton.marke}
                    </span>
                    <span style={{fontSize: 24, color: ton.farbe, lineHeight: 1.45}}>
                      <T>{zeile.text}</T>
                    </span>
                  </div>
                </Appear>
              );
            })}

            {/* Der Cursor macht aus dem Standbild ein laufendes Fenster. */}
            <span
              style={{
                display: 'inline-block',
                width: 13,
                height: 24,
                marginLeft: 74,
                background: COLOR.ink,
                opacity: Math.floor(t * 1.8) % 2 === 0 ? 0.75 : 0,
              }}
            />
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

      {szene.fussnote ? (
        <Card top={980} delay={3.4 * 30} style={{padding: '26px 30px'}}>
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
}> = ({szene, einsaetze}) => (
  <>
    {szene.tipps.map((tipp, i) => (
      <Card key={tipp.n} top={420 + i * 250} delay={(einsaetze[i] ?? 0) * 30} style={{padding: '28px 32px'}}>
        <div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
          <Chip tone="good">{tipp.n}</Chip>
          <div
            style={{fontSize: 27, color: COLOR.inkSoft, lineHeight: 1.5, paddingTop: 6, maxWidth: 470}}
          >
            <T>{tipp.text}</T>
          </div>
        </div>
      </Card>
    ))}
  </>
);

/** Pointe und Merk-Aufforderung. */
const Schluss: React.FC<{szene: Extract<Szene, {typ: 'schluss'}>}> = ({szene}) => (
  <>
    <Card top={540} delay={2} style={{padding: '38px 36px'}}>
      <div style={{fontSize: 36, color: COLOR.ink, lineHeight: 1.45}}>
        <T>{szene.pointe}</T>
      </div>
    </Card>

    <Card top={800} delay={0.8 * 30} style={{padding: '26px 32px'}}>
      <div style={{fontSize: 26, color: COLOR.muted, lineHeight: 1.5}}>
        <T>{szene.merksatz}</T>
      </div>
    </Card>
  </>
);

/**
 * Waehlt den Bautyp. Der Katalog ist absichtlich geschlossen: gibt es einen
 * Typ nicht, faellt das beim Rendern sofort auf statt ein leeres Bild zu
 * erzeugen.
 */
export const Bau: React.FC<{szene: Szene; schritte: string[]; einsaetze?: number[]}> = ({
  szene,
  schritte,
  einsaetze = [],
}) => {
  const inhalt = (() => {
    switch (szene.typ) {
      case 'irrtum':
        return <Irrtum szene={szene} />;
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
      case 'waage':
        return <Waage szene={szene} />;
      case 'streuung':
        return <Streuung szene={szene} />;
      case 'karte':
        return <Karte szene={szene} />;
      case 'tipps':
        return <Tipps szene={szene} einsaetze={einsaetze} />;
      case 'schluss':
        return <Schluss szene={szene} />;
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
