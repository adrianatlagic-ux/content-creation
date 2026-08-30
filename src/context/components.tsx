import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR, FONT} from '../theme';

export type Message = {
  /** Beschriftung im Kasten. */
  label: string;
  /** Szenenrelative Sekunde, ab der die Nachricht eintrifft. */
  at: number;
};

/**
 * Das Context Window als Kasten mit fester Kapazitaet -- die Kernaussage
 * beider Fassungen. Nachrichten stapeln sich von unten hinein; ist der Kasten
 * voll, wird die aelteste oben herausgedraengt und faellt sichtbar heraus.
 *
 * Genau dieses Herausfallen ist der Moment, den das Video erklaeren soll,
 * deshalb bekommt es eine eigene Animation statt nur zu verschwinden.
 */
export const ContextBox: React.FC<{
  messages: Message[];
  capacity: number;
  width?: number;
  showMeter?: boolean;
}> = ({messages, capacity, width = 620, showMeter = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const entered = messages.filter((m) => m.at <= t);
  const visible = entered.slice(-capacity);
  const droppedCount = Math.max(0, entered.length - capacity);

  // Die zuletzt herausgefallene Nachricht bleibt kurz ueber dem Kasten sichtbar.
  const dropped = droppedCount > 0 ? entered[droppedCount - 1] : null;
  const dropTrigger = droppedCount > 0 ? entered[capacity + droppedCount - 1].at : 0;
  const sinceDrop = t - dropTrigger;
  const dropOut = interpolate(sinceDrop, [0, 0.75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const full = entered.length >= capacity;
  const slotHeight = 62;

  return (
    <div style={{position: 'relative', width, fontFamily: FONT}}>
      {/* herausgefallene Nachricht */}
      <div style={{position: 'absolute', top: -66, left: 26, height: 52, width: width - 52}}>
        {dropped && dropOut < 1 ? (
          <div
            style={{
              border: `2px dashed ${COLOR.accent}`,
              background: '#FBEEEC',
              color: COLOR.accent,
              borderRadius: 8,
              padding: '9px 16px',
              fontSize: 21,
              whiteSpace: 'nowrap',
              opacity: 1 - dropOut,
              transform: `translateY(${interpolate(dropOut, [0, 1], [6, -52])}px)`,
            }}
          >
            {dropped.label} &nbsp;&rarr; raus
          </div>
        ) : null}
      </div>

      {/* der Kasten selbst */}
      <div
        style={{
          border: `3px solid ${full ? COLOR.accent : COLOR.cardEdge}`,
          background: COLOR.card,
          borderRadius: 12,
          padding: 18,
          height: capacity * slotHeight + 36,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 10,
          boxShadow: '0 5px 18px #0000000f',
        }}
      >
        {visible.map((m, i) => {
          const age = t - m.at;
          const enter = spring({
            frame: (age - 0) * fps,
            fps,
            config: {damping: 200},
            durationInFrames: 12,
          });
          // Aeltere Eintraege ruecken nach oben und verblassen leicht.
          const depth = visible.length - 1 - i;
          return (
            <div
              key={`${m.label}-${m.at}`}
              style={{
                border: `2px solid ${COLOR.chipEdge}`,
                background: depth === 0 ? '#EDF3EF' : COLOR.chip,
                borderRadius: 8,
                padding: '12px 20px',
                fontSize: 24,
                color: COLOR.inkSoft,
                opacity: interpolate(depth, [0, capacity - 1], [1, 0.55]) * Math.min(enter, 1),
                transform: `translateY(${interpolate(enter, [0, 1], [16, 0])}px)`,
              }}
            >
              {m.label}
            </div>
          );
        })}
      </div>

      {showMeter ? (
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 24,
            letterSpacing: 2,
            color: full ? COLOR.accent : COLOR.muted,
          }}
        >
          <span>
            {Math.min(entered.length, capacity)} / {capacity}
          </span>
          <div style={{flex: 1, height: 8, background: '#E4DFD1', borderRadius: 4}}>
            <div
              style={{
                width: `${Math.min(1, entered.length / capacity) * 100}%`,
                height: '100%',
                borderRadius: 4,
                background: full ? COLOR.accent : COLOR.good,
              }}
            />
          </div>
          {full ? <span>VOLL</span> : null}
        </div>
      ) : null}
    </div>
  );
};

/**
 * Ueber den Kasten wandernde Linie -- zeigt, dass bei jedem Durchlauf der
 * gesamte Inhalt neu gelesen wird, statt dass sich das Modell etwas merkt.
 */
export const ScanLine: React.FC<{width: number; height: number; period?: number}> = ({
  width,
  height,
  period = 1.4,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const phase = ((frame / fps) % period) / period;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width,
        height,
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: 12,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: phase * height,
          height: 3,
          background: COLOR.good,
          boxShadow: `0 0 18px 4px ${COLOR.goodSoft}`,
          opacity: 0.85,
        }}
      />
    </div>
  );
};

/**
 * Zerlegt einen Satz sichtbar in Token-Chips -- nur in der technischen
 * Fassung, wo Tokens als Einheit eingefuehrt werden.
 */
export const TokenStrip: React.FC<{tokens: string[]; revealAt: number}> = ({tokens, revealAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, fontFamily: FONT}}>
      {tokens.map((token, i) => {
        const at = revealAt + i * 0.09;
        const enter = spring({
          frame: (t - at) * fps,
          fps,
          config: {damping: 200},
          durationInFrames: 10,
        });
        return (
          <span
            key={`${token}-${i}`}
            style={{
              border: `2px solid ${i % 2 ? COLOR.chipEdge : '#CBD9D0'}`,
              background: i % 2 ? COLOR.chip : COLOR.goodSoft,
              borderRadius: 6,
              padding: '7px 11px',
              fontSize: 23,
              color: COLOR.inkSoft,
              opacity: Math.min(enter, 1),
              transform: `scale(${interpolate(enter, [0, 1], [0.8, 1])})`,
            }}
          >
            {token}
          </span>
        );
      })}
    </div>
  );
};
