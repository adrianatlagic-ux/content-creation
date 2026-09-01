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
const Kasten: React.FC<{szene: Extract<Szene, {typ: 'kasten'}>}> = ({szene}) => (
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
const Voll: React.FC<{szene: Extract<Szene, {typ: 'voll'}>}> = ({szene}) => {
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
const NeuLesen: React.FC<{szene: Extract<Szene, {typ: 'neulesen'}>}> = ({szene}) => {
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
const Tokens: React.FC<{szene: Extract<Szene, {typ: 'tokens'}>}> = ({szene}) => (
  <Card top={470} delay={4} style={{padding: '32px 34px'}}>
    <CardTitle>
      <T>{szene.titel}</T>
    </CardTitle>
    <div style={{fontSize: 26, color: COLOR.muted, marginBottom: 20}}>
      &bdquo;<T>{szene.satz}</T>&ldquo;
    </div>
    <TokenStrip tokens={szene.tokens} revealAt={1.1} />
    <div style={{fontSize: 24, color: COLOR.faint, marginTop: 22, letterSpacing: 1}}>
      <T>{szene.fussnote}</T>
    </div>
  </Card>
);

/** Balken, die mit einer Kennzahl wachsen. */
const Kosten: React.FC<{szene: Extract<Szene, {typ: 'kosten'}>}> = ({szene}) => {
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
                <span style={{fontSize: 26, color: COLOR.muted, width: 130}}>{reihe.label}</span>
                <div
                  style={{
                    height: 26,
                    width: interpolate(reihe.faktor, [0, groesster], [30, 340], {
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
      case 'kasten':
        return <Kasten szene={szene} />;
      case 'voll':
        return <Voll szene={szene} />;
      case 'neulesen':
        return <NeuLesen szene={szene} />;
      case 'tokens':
        return <Tokens szene={szene} />;
      case 'kosten':
        return <Kosten szene={szene} />;
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
