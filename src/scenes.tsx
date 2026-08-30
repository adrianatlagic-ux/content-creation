import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  Appear,
  Card,
  CardTitle,
  ChapterLabel,
  Chip,
  Mascot,
  ReturnArrow,
  StepBar,
  useAppear,
  useSceneSeconds,
} from './components';
import {COLOR, FONT, LAYOUT} from './theme';

const STEPS = ['DENKEN', 'TOOL', 'LESEN', 'WIEDERHOLEN'];

const Arrow: React.FC<{on?: boolean}> = ({on = true}) => (
  <span style={{color: on ? COLOR.faint : '#DDD8CA', fontSize: 30, margin: '0 2px'}}>&rarr;</span>
);

/** Freistehende Marke ausserhalb einer Karte, z.B. ENDE oder RUNDE 3. */
const Badge: React.FC<{
  at: number;
  top: number;
  tone: 'accent' | 'good' | 'plain';
  children: React.ReactNode;
  rotate?: number;
}> = ({at, top, tone, children, rotate = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({
    frame: frame - at * fps,
    fps,
    config: {damping: 12, stiffness: 190},
    durationInFrames: 22,
  });
  const tones = {
    accent: {bg: COLOR.accent, fg: '#fff', border: COLOR.accent},
    good: {bg: COLOR.goodSoft, fg: COLOR.good, border: COLOR.good},
    plain: {bg: '#E4DFD1', fg: COLOR.inkSoft, border: '#C9C3B4'},
  }[tone];

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: LAYOUT.stage.left,
        fontFamily: FONT,
        fontSize: 28,
        letterSpacing: 3,
        background: tones.bg,
        color: tones.fg,
        border: `2px solid ${tones.border}`,
        padding: '12px 24px',
        borderRadius: 7,
        opacity: Math.min(pop, 1),
        transform: `scale(${interpolate(pop, [0, 1], [1.5, 1])}) rotate(${rotate}deg)`,
        transformOrigin: 'left center',
      }}
    >
      {children}
    </div>
  );
};

/** Szene 1 (0-3,05s): Die Fehlannahme wird ausgesprochen und durchgestrichen. */
export const SceneIrrtum: React.FC = () => {
  const t = useSceneSeconds();
  const strike = interpolate(t, [1.5, 2.3], [0, 1], {
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
          <div style={{fontSize: 40, color: COLOR.inkSoft, lineHeight: 1.5}}>
            AGENT = CHATBOT
            <br />+ BESSERER PROMPT
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

      <Badge at={2.35} top={880} tone="accent" rotate={-3}>
        FALSCH
      </Badge>
    </AbsoluteFill>
  );
};

/** Szene 2 (3,05-9,39s): Der Chatbot laeuft genau einmal durch und ist fertig. */
export const SceneChatbot: React.FC = () => {
  const t = useSceneSeconds();
  const chips = [
    {label: 'DU', at: 0.35},
    {label: 'MODELL', at: 0.95},
    {label: 'ANTWORT', at: 1.55},
  ];

  return (
    <AbsoluteFill>
      <ChapterLabel text="DER CHATBOT" />
      <StepBar steps={STEPS} activeIndex={-1} />
      <Mascot pose="denkend" />

      <Card top={450} delay={2}>
        <CardTitle>EINE RUNDE</CardTitle>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, minHeight: 66}}>
          {chips.map((c, i) => (
            <React.Fragment key={c.label}>
              {i > 0 ? (
                <span style={{opacity: t > c.at - 0.12 ? 1 : 0}}>
                  <Arrow />
                </span>
              ) : null}
              <Appear at={c.at} rise={0}>
                <Chip>{c.label}</Chip>
              </Appear>
            </React.Fragment>
          ))}
        </div>
        <ReturnArrow width={560} active={false} />
        <div style={{fontSize: 24, color: '#C4BEAE', letterSpacing: 2, marginTop: -14}}>
          keine Rückkehr
        </div>
      </Card>

      <Badge at={2.3} top={800} tone="accent" rotate={-3}>
        ENDE
      </Badge>

      <Card top={920} delay={3.4 * 30} style={{padding: '30px 34px'}}>
        <div style={{fontSize: 29, color: COLOR.muted, lineHeight: 1.9}}>
          <Appear at={3.5} rise={8}>
            <span>&times;&nbsp;&nbsp;kann nichts nachschauen</span>
          </Appear>
          <Appear at={4.2} rise={8}>
            <span>&times;&nbsp;&nbsp;kann nichts ausprobieren</span>
          </Appear>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/** Szene 3 (9,39-16,0s): Der Agent bekommt Werkzeuge und benutzt sie. */
export const SceneAgent: React.FC = () => {
  const t = useSceneSeconds();
  const activeIndex = t < 1.6 ? 0 : t < 3.8 ? 1 : t < 5.0 ? 2 : 3;

  const command = '$ read_file("report.csv")';
  const typed = command.slice(
    0,
    Math.floor(
      interpolate(t, [1.9, 3.3], [0, command.length], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  const tools = [
    {label: 'read_file', at: 0.3},
    {label: 'run_command', at: 0.6},
    {label: 'search_web', at: 0.9},
  ];

  return (
    <AbsoluteFill>
      <ChapterLabel text="DER AGENT" />
      <StepBar steps={STEPS} activeIndex={activeIndex} />
      <Mascot pose="erklaerend" />

      <Card top={420} delay={2}>
        <CardTitle>WERKZEUGE</CardTitle>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
          {tools.map((tool) => {
            // Das gewaehlte Werkzeug hebt sich ab 1,6s heraus.
            const picked = tool.label === 'read_file' && t > 1.6;
            return (
              <Appear key={tool.label} at={tool.at} rise={10}>
                <div
                  style={{
                    transform: `scale(${picked ? 1.06 : 1})`,
                    opacity: t > 1.6 && !picked ? 0.4 : 1,
                    transition: 'none',
                  }}
                >
                  <Chip tone="good">{tool.label}</Chip>
                </div>
              </Appear>
            );
          })}
        </div>
      </Card>

      <Card top={660} delay={1.7 * 30} style={{padding: '30px 34px', minHeight: 210}}>
        <div style={{fontSize: 30, color: COLOR.inkSoft, minHeight: 40}}>
          {typed}
          {t > 1.9 && t < 3.6 ? <span style={{color: COLOR.faint}}>|</span> : null}
        </div>
        {t > 3.9 ? (
          <Appear at={3.9} rise={10}>
            <div style={{fontSize: 26, color: COLOR.muted, marginTop: 18, lineHeight: 1.8}}>
              &rarr; 1.248 Zeilen gelesen
            </div>
          </Appear>
        ) : null}
        {t > 4.5 ? (
          <Appear at={4.5} rise={10}>
            <div style={{fontSize: 26, color: COLOR.muted, lineHeight: 1.8}}>
              &rarr; Umsatz fällt seit März
            </div>
          </Appear>
        ) : null}
      </Card>

      <Card top={960} delay={5.1 * 30} style={{padding: '28px 34px'}}>
        <div style={{fontSize: 29, color: COLOR.good, letterSpacing: 2}}>
          ... UND DENKT WEITER
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/** Szene 4 (16,0-24,0s): Die Schleife als eigentliche Pointe. */
export const SceneSchleife: React.FC = () => {
  const t = useSceneSeconds();
  const done = t > 4.2;

  // Rundenzaehler laeuft bis 4, danach verlaesst der Agent die Schleife.
  const round = Math.min(4, 1 + Math.floor(interpolate(t, [0.5, 4.0], [0, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })));
  const cycling = Math.floor((t * 2.4) % 3);

  return (
    <AbsoluteFill>
      <ChapterLabel text="DIE SCHLEIFE" />
      <StepBar steps={STEPS} activeIndex={done ? -1 : cycling} />
      <Mascot pose="selbstsicher" />

      <Card top={430} delay={2}>
        <CardTitle>SOLANGE, BIS FERTIG</CardTitle>
        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
          {['DENKEN', 'TOOL', 'LESEN'].map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 ? <Arrow /> : null}
              <div style={{transform: `scale(${!done && cycling === i ? 1.07 : 1})`}}>
                <Chip tone={!done && cycling === i ? 'good' : 'plain'}>{label}</Chip>
              </div>
            </React.Fragment>
          ))}
        </div>
        <ReturnArrow width={560} active={!done} />
      </Card>

      <Badge at={0.5} top={790} tone={done ? 'good' : 'plain'}>
        {done ? 'FERTIG' : `RUNDE ${round}`}
      </Badge>

      <Card top={910} delay={4.6 * 30} style={{padding: '38px 36px'}}>
        <div style={{fontSize: 38, color: COLOR.ink, lineHeight: 1.5}}>
          Nicht das Modell.
          <br />
          <span style={{color: COLOR.good}}>Die Schleife.</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
