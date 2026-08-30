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
import {COLOR, FONT, LAYOUT} from '../theme';
import {ContextBox, ScanLine, TokenStrip, type Message} from './components';

/** Schrittleiste beider Fassungen: der Weg einer Nachricht durch das Fenster. */
export const STEPS = ['REIN', 'VOLL', 'RAUS', 'NEU LESEN'];

/** Nachrichten, die den Kasten fuellen -- bewusst Alltagsaufgaben. */
const MESSAGES: Message[] = [
  {label: 'Sprich immer Deutsch', at: 0.4},
  {label: 'Hier ist mein Bericht', at: 1.4},
  {label: 'Fasse Kapitel 2 zusammen', at: 2.4},
  {label: 'Und jetzt Kapitel 3', at: 3.6},
  {label: 'Mach eine Tabelle draus', at: 4.8},
  {label: 'Kürzer bitte', at: 6.0},
];

const BOX_WIDTH = 620;
const CAPACITY = 4;

/** Szene 1: Die Fehlannahme, durchgestrichen -- gleiches Muster wie Video 1. */
export const SceneIrrtum: React.FC<{claim: React.ReactNode; truth: React.ReactNode}> = ({
  claim,
  truth,
}) => {
  const t = useSceneSeconds();
  const strike = interpolate(t, [2.6, 3.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <ChapterLabel text="DER IRRTUM" />
      <StepBar steps={STEPS} activeIndex={-1} />
      <Mascot pose="skeptisch" />

      <Card top={520} delay={4} style={{padding: '46px 40px'}}>
        <CardTitle>WAS ALLE DENKEN</CardTitle>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{fontSize: 38, color: COLOR.inkSoft, lineHeight: 1.5, whiteSpace: 'pre-line'}}>
            {claim}
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: -10,
              height: 7,
              borderRadius: 4,
              background: COLOR.accent,
              width: `${strike * 106}%`,
            }}
          />
        </div>
      </Card>

      <Card top={860} delay={3.5 * 30} style={{padding: '32px 36px'}}>
        <div style={{fontSize: 34, color: COLOR.accent, lineHeight: 1.4}}>{truth}</div>
      </Card>
    </AbsoluteFill>
  );
};

/** Szene 2: Der Kasten fuellt sich. */
export const SceneKasten: React.FC<{chapter: string; note?: React.ReactNode}> = ({
  chapter,
  note,
}) => (
  <AbsoluteFill>
    <ChapterLabel text={chapter} />
    <StepBar steps={STEPS} activeIndex={0} />
    <Mascot pose="erklaerend" />

    <div style={{position: 'absolute', left: LAYOUT.stage.left, top: 430}}>
      <ContextBox messages={MESSAGES} capacity={CAPACITY} width={BOX_WIDTH} />
    </div>

    {note ? (
      <Card top={900} delay={2.6 * 30} style={{padding: '28px 32px'}}>
        {note}
      </Card>
    ) : null}
  </AbsoluteFill>
);

/**
 * Szene 3: Der Kasten laeuft ueber. Die Nachrichten starten hier so, dass der
 * Kasten bereits gefuellt ist und das Herausfallen sofort sichtbar wird.
 */
export const SceneVoll: React.FC<{consequence: React.ReactNode}> = ({consequence}) => {
  const shifted: Message[] = MESSAGES.map((m, i) => ({...m, at: i < CAPACITY ? -1 : (i - CAPACITY) * 1.6 + 1.0}));

  return (
    <AbsoluteFill>
      <ChapterLabel text="ES LÄUFT ÜBER" />
      <StepBar steps={STEPS} activeIndex={2} />
      <Mascot pose="skeptisch" />

      <div style={{position: 'absolute', left: LAYOUT.stage.left, top: 460}}>
        <ContextBox messages={shifted} capacity={CAPACITY} width={BOX_WIDTH} />
      </div>

      <Card top={980} delay={4.4 * 30} style={{padding: '30px 34px'}}>
        {consequence}
      </Card>
    </AbsoluteFill>
  );
};

/** Szene 4: Bei jedem Durchlauf wird alles neu gelesen. */
export const SceneNeuLesen: React.FC<{chapter: string; punch: React.ReactNode}> = ({
  chapter,
  punch,
}) => {
  const t = useSceneSeconds();
  const boxHeight = CAPACITY * 62 + 36;
  const full: Message[] = MESSAGES.slice(2).map((m, i) => ({...m, at: -1 + i * 0}));

  return (
    <AbsoluteFill>
      <ChapterLabel text={chapter} />
      <StepBar steps={STEPS} activeIndex={3} />
      <Mascot pose="denkend" />

      <div style={{position: 'absolute', left: LAYOUT.stage.left, top: 430}}>
        <div style={{position: 'relative', width: BOX_WIDTH}}>
          <ContextBox messages={full} capacity={CAPACITY} width={BOX_WIDTH} showMeter={false} />
          {t > 0.6 ? <ScanLine width={BOX_WIDTH} height={boxHeight} /> : null}
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
        &#8635; LIEST ALLES NEU, JEDES MAL
      </div>

      <Card top={880} delay={2.4 * 30} style={{padding: '34px 36px'}}>
        {punch}
      </Card>
    </AbsoluteFill>
  );
};

/** Szene 5: Die drei Tipps, jeweils zum gemessenen Einsatz. */
export const SceneTipps: React.FC<{beats: number[]; tips: {n: string; text: React.ReactNode}[]}> = ({
  beats,
  tips,
}) => (
  <AbsoluteFill>
    <ChapterLabel text="SO MACHST DU ES BESSER" />
    <StepBar steps={STEPS} activeIndex={-1} />
    <Mascot pose="erklaerend" />

    {tips.map((tip, i) => (
      <Card key={tip.n} top={420 + i * 250} delay={beats[i] * 30} style={{padding: '28px 32px'}}>
        <div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
          <Chip tone="good">{tip.n}</Chip>
          <div style={{fontSize: 27, color: COLOR.inkSoft, lineHeight: 1.5, paddingTop: 6, maxWidth: 470}}>
            {tip.text}
          </div>
        </div>
      </Card>
    ))}
  </AbsoluteFill>
);

/** Szene 6: Pointe und Merk-Aufforderung. */
export const SceneSchluss: React.FC<{punch: React.ReactNode}> = ({punch}) => (
  <AbsoluteFill>
    <ChapterLabel text="MITNEHMEN" />
    <StepBar steps={STEPS} activeIndex={-1} />
    <Mascot pose="selbstsicher" />

    <Card top={540} delay={2} style={{padding: '38px 36px'}}>
      <div style={{fontSize: 36, color: COLOR.ink, lineHeight: 1.45}}>{punch}</div>
    </Card>

    <Card top={800} delay={0.8 * 30} style={{padding: '26px 32px'}}>
      <div style={{fontSize: 26, color: COLOR.muted, lineHeight: 1.5}}>
        Speicher dir das für dein nächstes langes Gespräch.
      </div>
    </Card>
  </AbsoluteFill>
);

/** Nur technisch: Tokens als Einheit einfuehren. */
export const SceneTokens: React.FC = () => (
  <AbsoluteFill>
    <ChapterLabel text="TOKENS" />
    <StepBar steps={STEPS} activeIndex={0} />
    <Mascot pose="erklaerend" />

    <Card top={470} delay={4} style={{padding: '32px 34px'}}>
      <CardTitle>SO SIEHT DAS MODELL DEINEN TEXT</CardTitle>
      <div style={{fontSize: 26, color: COLOR.muted, marginBottom: 20}}>
        &bdquo;Fasse den Quartalsbericht zusammen&ldquo;
      </div>
      <TokenStrip
        tokens={['Fas', 'se', ' den', ' Quart', 'als', 'ber', 'icht', ' zusammen']}
        revealAt={1.1}
      />
      <div style={{fontSize: 24, color: COLOR.faint, marginTop: 22, letterSpacing: 1}}>
        8 Tokens &nbsp;&middot;&nbsp; im Deutschen grob 3&ndash;4 Zeichen pro Token
      </div>
    </Card>
  </AbsoluteFill>
);

/** Nur technisch: die quadratische Kostenkurve. */
export const SceneKosten: React.FC = () => {
  const t = useSceneSeconds();
  const rows = [
    {ctx: '4k', cost: 1, at: 0.8},
    {ctx: '8k', cost: 4, at: 1.9},
    {ctx: '16k', cost: 16, at: 3.0},
  ];

  return (
    <AbsoluteFill>
      <ChapterLabel text="DER HAKEN" />
      <StepBar steps={STEPS} activeIndex={-1} />
      <Mascot pose="skeptisch" />

      <Card top={450} delay={4} style={{padding: '34px 36px'}}>
        <CardTitle>ATTENTION SKALIERT QUADRATISCH</CardTitle>
        {rows.map((row) => (
          <Appear key={row.ctx} at={row.at} rise={10}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18, margin: '14px 0'}}>
              <span style={{fontSize: 26, color: COLOR.muted, width: 90}}>{row.ctx}</span>
              <div
                style={{
                  height: 26,
                  width: interpolate(Math.min(row.cost, 16), [1, 16], [30, 380]),
                  background: row.cost > 4 ? COLOR.accentSoft : COLOR.goodSoft,
                  border: `2px solid ${row.cost > 4 ? COLOR.accent : COLOR.good}`,
                  borderRadius: 6,
                }}
              />
              <span style={{fontSize: 25, color: COLOR.inkSoft}}>&times;{row.cost}</span>
            </div>
          </Appear>
        ))}
      </Card>

      <Card top={840} delay={4.0 * 30} style={{padding: '28px 32px'}}>
        <div style={{fontSize: 27, color: COLOR.inkSoft, lineHeight: 1.6}}>
          Doppelter Kontext,
          <br />
          <span style={{color: COLOR.accent}}>vierfacher Rechenaufwand.</span>
        </div>
      </Card>

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
        teurer &middot; langsamer &middot; ungenauer
      </div>
    </AbsoluteFill>
  );
};
