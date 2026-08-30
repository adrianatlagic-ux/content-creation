import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CANVAS, CAPTION, COLOR, FONT, LAYOUT} from './theme';
import {timedWords} from './script';

/** Cremefarbener Grund mit Punktraster und warmem Lichtverlauf von oben. */
export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COLOR.bg}}>
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${COLOR.dot} 1.5px, transparent 1.5px)`,
        backgroundSize: '26px 26px',
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 55% at 50% 0%, ${COLOR.bgWarm} 0%, transparent 60%)`,
      }}
    />
  </AbsoluteFill>
);

/** Kapitel-Label oben links. Wechselt pro Szene und schiebt sich kurz ein. */
export const ChapterLabel: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 14});

  return (
    <div
      style={{
        position: 'absolute',
        top: LAYOUT.chapterTop,
        left: 62,
        fontFamily: FONT,
        fontSize: 27,
        letterSpacing: 5,
        color: COLOR.muted,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [-18, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

/** Schrittleiste. activeIndex = -1 blendet alle Schritte inaktiv. */
export const StepBar: React.FC<{steps: string[]; activeIndex: number}> = ({steps, activeIndex}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 16});

  return (
    <div
      style={{
        position: 'absolute',
        top: LAYOUT.stepBarTop,
        left: 62,
        display: 'flex',
        gap: 12,
        opacity: enter,
      }}
    >
      {steps.map((step, i) => {
        const on = i === activeIndex;
        return (
          <div
            key={step}
            style={{
              fontFamily: FONT,
              fontSize: 21,
              letterSpacing: 2,
              padding: '10px 20px',
              borderRadius: 5,
              border: `2px solid ${on ? '#A9A292' : '#C9C3B4'}`,
              background: on ? '#DDD7C6' : '#FFFFFF55',
              color: on ? COLOR.inkSoft : COLOR.muted,
            }}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
};

/** Karte im Stil des Referenzvideos. delay in Frames, relativ zur Szene. */
export const Card: React.FC<{
  top: number;
  left?: number;
  width?: number;
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({top, left = LAYOUT.stage.left, width = LAYOUT.stage.width, delay = 0, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 18});

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        padding: '30px 34px',
        background: COLOR.card,
        border: `2px solid ${COLOR.cardEdge}`,
        borderRadius: 12,
        boxShadow: '0 5px 18px #0000000f',
        fontFamily: FONT,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [22, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Kleine Ueberschrift innerhalb einer Karte. */
export const CardTitle: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontSize: 25, letterSpacing: 3, color: '#9A9488', marginBottom: 20}}>{children}</div>
);

/** Beschrifteter Kasten, wie DU / MODELL / ANTWORT im Ablaufdiagramm. */
export const Chip: React.FC<{children: React.ReactNode; tone?: 'plain' | 'good' | 'accent'}> = ({
  children,
  tone = 'plain',
}) => {
  const tones = {
    plain: {bg: COLOR.chip, border: COLOR.chipEdge, color: COLOR.inkSoft},
    good: {bg: COLOR.goodSoft, border: COLOR.good, color: COLOR.good},
    accent: {bg: COLOR.accentSoft, border: COLOR.accent, color: COLOR.accent},
  }[tone];

  return (
    <span
      style={{
        border: `2px solid ${tones.border}`,
        background: tones.bg,
        color: tones.color,
        borderRadius: 7,
        padding: '12px 22px',
        fontSize: 26,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
};

/**
 * Untertitel im Karaoke-Stil: ein rollendes Fenster der zuletzt gesprochenen
 * Woerter, das aktuelle dunkel, die vorherigen grau. Position und Breite
 * stammen aus CAPTION und bleiben innerhalb der Safe Zone.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const words = React.useMemo(() => timedWords(), []);

  let current = -1;
  for (let i = 0; i < words.length; i++) {
    if (words[i].start <= t) current = i;
    else break;
  }
  if (current === -1) return null;

  const window = words.slice(Math.max(0, current - CAPTION.trail), current + 1);
  const sinceWordStart = t - words[current].start;
  const pop = interpolate(sinceWordStart, [0, 0.12], [0.965, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: CAPTION.top,
        left: CANVAS.width / 2,
        transform: `translateX(-50%) scale(${pop})`,
        maxWidth: CAPTION.maxWidth,
        background: COLOR.card,
        border: `2px solid #D6D0C0`,
        borderRadius: 10,
        boxShadow: '0 6px 20px #00000018',
        padding: '18px 28px',
        fontFamily: FONT,
        fontSize: CAPTION.fontSize,
        fontWeight: 'bold',
        display: 'flex',
        gap: 14,
        whiteSpace: 'nowrap',
      }}
    >
      {window.map((w, i) => (
        <span
          key={`${w.start}-${i}`}
          style={{color: i === window.length - 1 ? COLOR.ink : '#9A9488'}}
        >
          {w.word}
        </span>
      ))}
    </div>
  );
};

/**
 * Maskottchen: gezeichnete Figur nach dem Vorbild des Nutzers, bewusst kein
 * lizenzierter Charakter. Steht in allen Szenen links und bleibt statisch --
 * nur ein sehr leichtes Atmen, damit das Bild nicht tot wirkt.
 */
export const Mascot: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.004;

  return (
    <Img
      src={staticFile('mascot.png')}
      style={{
        position: 'absolute',
        left: LAYOUT.mascot.left,
        top: LAYOUT.mascot.top,
        width: LAYOUT.mascot.width,
        height: LAYOUT.mascot.height,
        transform: `scale(${breathe})`,
        transformOrigin: 'bottom center',
      }}
    />
  );
};
