import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Card, CardTitle, ChapterLabel, Chip, StepBar} from './components';
import {COLOR, FONT, LAYOUT} from './theme';

const STEPS = ['DENKEN', 'TOOL', 'LESEN', 'WIEDERHOLEN'];

const Arrow: React.FC = () => (
  <span style={{color: COLOR.faint, fontSize: 30, margin: '0 4px'}}>&rarr;</span>
);

/** Szene 1 (0-6s): Die Fehlannahme wird ausgesprochen und durchgestrichen. */
export const SceneIrrtum: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Der Strich faehrt ab Sekunde 3 durch die Aussage.
  const strike = interpolate(frame, [fps * 3.0, fps * 4.2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <ChapterLabel text="DER IRRTUM" />
      <StepBar steps={STEPS} activeIndex={-1} />

      <Card top={560} delay={10} style={{padding: '44px 40px'}}>
        <CardTitle>WAS ALLE DENKEN</CardTitle>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{fontSize: 38, color: COLOR.inkSoft, lineHeight: 1.5}}>
            AGENT = CHATBOT
            <br />+ BESSERER PROMPT
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: -8,
              height: 6,
              borderRadius: 3,
              background: COLOR.accent,
              width: `${strike * 104}%`,
            }}
          />
        </div>
      </Card>

      <Card top={860} delay={fps * 4.3} style={{padding: '30px 34px'}}>
        <div style={{fontSize: 32, color: COLOR.accent, letterSpacing: 2}}>FALSCH.</div>
      </Card>
    </AbsoluteFill>
  );
};

/** Szene 2 (6-14s): Der Chatbot läuft genau einmal durch und ist fertig. */
export const SceneChatbot: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const stamp = spring({
    frame: frame - fps * 3.2,
    fps,
    config: {damping: 12, stiffness: 190},
    durationInFrames: 26,
  });

  return (
    <AbsoluteFill>
      <ChapterLabel text="DER CHATBOT" />
      <StepBar steps={STEPS} activeIndex={-1} />

      <Card top={540} delay={6}>
        <CardTitle>EINE RUNDE</CardTitle>
        <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8}}>
          <Chip>DU</Chip>
          <Arrow />
          <Chip>MODELL</Chip>
          <Arrow />
          <Chip>ANTWORT</Chip>
        </div>
      </Card>

      {/* Stempel: nach einer Runde ist Schluss. */}
      <div
        style={{
          position: 'absolute',
          top: 760,
          left: LAYOUT.stage.left,
          fontFamily: FONT,
          fontSize: 26,
          letterSpacing: 4,
          color: '#fff',
          background: COLOR.accent,
          padding: '12px 22px',
          borderRadius: 7,
          opacity: Math.min(stamp, 1),
          transform: `scale(${interpolate(stamp, [0, 1], [1.6, 1])}) rotate(-3deg)`,
          transformOrigin: 'left center',
        }}
      >
        ENDE
      </div>

      <Card top={880} delay={fps * 5.2} style={{padding: '28px 34px'}}>
        <div style={{fontSize: 27, color: COLOR.muted, lineHeight: 1.9}}>
          &times; kann nichts nachschauen
          <br />&times; kann nichts ausprobieren
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/** Szene 3 (14-26s): Der Agent bekommt Werkzeuge und benutzt sie. */
export const SceneAgent: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  // Schrittleiste wandert im Takt der Erzaehlung mit.
  const activeIndex = t < 2.5 ? 0 : t < 6.0 ? 1 : t < 8.5 ? 2 : 3;

  // Terminal tippt sich ab Sekunde 3,4 Zeichen fuer Zeichen.
  const command = '$ read_file("report.csv")';
  const typed = command.slice(
    0,
    Math.floor(
      interpolate(t, [3.4, 5.4], [0, command.length], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  return (
    <AbsoluteFill>
      <ChapterLabel text="DER AGENT" />
      <StepBar steps={STEPS} activeIndex={activeIndex} />

      <Card top={470} delay={6}>
        <CardTitle>WERKZEUGE</CardTitle>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
          <Chip tone="good">read_file</Chip>
          <Chip tone="good">run_command</Chip>
          <Chip tone="good">search_web</Chip>
        </div>
      </Card>

      <Card top={700} delay={fps * 3.2} style={{padding: '28px 32px', minHeight: 150}}>
        <div style={{fontSize: 28, color: COLOR.inkSoft}}>
          {typed}
          {t > 3.4 && t < 5.6 ? <span style={{color: COLOR.faint}}>|</span> : null}
        </div>
        {t > 6.0 ? (
          <div style={{fontSize: 24, color: COLOR.muted, marginTop: 16, lineHeight: 1.7}}>
            &rarr; 1.248 Zeilen gelesen
          </div>
        ) : null}
      </Card>

      <Card top={950} delay={fps * 7.4} style={{padding: '26px 32px'}}>
        <div style={{fontSize: 27, color: COLOR.good, letterSpacing: 2}}>
          ... UND DENKT WEITER
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/** Szene 4 (26-35s): Die Schleife als eigentliche Pointe. */
export const SceneSchleife: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  // Rundenzaehler laeuft bis 4 hoch, danach verlaesst der Agent die Schleife.
  const round = Math.min(4, Math.floor(interpolate(t, [0.6, 3.4], [1, 5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })));
  const activeIndex = Math.floor((t * 2.2) % 4);
  const done = t > 3.8;

  return (
    <AbsoluteFill>
      <ChapterLabel text="DIE SCHLEIFE" />
      <StepBar steps={STEPS} activeIndex={done ? -1 : activeIndex} />

      <Card top={520} delay={6}>
        <CardTitle>SOLANGE, BIS FERTIG</CardTitle>
        <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8}}>
          <Chip>DENKEN</Chip>
          <Arrow />
          <Chip>TOOL</Chip>
          <Arrow />
          <Chip>LESEN</Chip>
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 26,
            color: COLOR.faint,
            letterSpacing: 2,
          }}
        >
          &#8630; zurück zum Anfang
        </div>
      </Card>

      <div
        style={{
          position: 'absolute',
          top: 790,
          left: LAYOUT.stage.left,
          fontFamily: FONT,
          fontSize: 30,
          letterSpacing: 3,
          color: done ? COLOR.good : COLOR.inkSoft,
          background: done ? COLOR.goodSoft : '#E4DFD1',
          border: `2px solid ${done ? COLOR.good : '#C9C3B4'}`,
          padding: '14px 26px',
          borderRadius: 8,
        }}
      >
        {done ? 'FERTIG' : `RUNDE ${round}`}
      </div>

      <Card top={920} delay={fps * 4.6} style={{padding: '34px 36px'}}>
        <div style={{fontSize: 34, color: COLOR.ink, lineHeight: 1.5}}>
          Nicht das Modell.
          <br />
          <span style={{color: COLOR.good}}>Die Schleife.</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
