import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Backdrop, Captions} from '../components';
import {CANVAS, FONT} from '../theme';
import {
  SceneIrrtum,
  SceneKasten,
  SceneKosten,
  SceneNeuLesen,
  SceneSchluss,
  SceneTipps,
  SceneTokens,
  SceneVoll,
} from './scenes';
import einfach from './timing-einfach.json';
import technisch from './timing-technisch.json';

const sec = (s: number) => Math.round(s * CANVAS.fps);

export type Variant = 'einfach' | 'technisch';

export const TIMING = {einfach, technisch};

/**
 * Szenengrenzen, abgelesen an den Wortzeiten der jeweiligen Fassung.
 * Solange kein Voiceover vorliegt, stammen die Zeiten aus
 * scripts/estimate-timing.mjs mit der an Video 1 GEMESSENEN Rate von
 * 3,02 Woertern pro Sekunde -- also keine freie Schaetzung, aber auch noch
 * keine Messung. Nach der Vertonung neu ablesen.
 */
const SCENES = {
  einfach: [
    {at: 0.0, duration: 5.6},
    {at: 5.6, duration: 4.8},
    {at: 10.4, duration: 9.0},
    {at: 19.4, duration: 7.6},
    {at: 27.0, duration: 13.8},
    {at: 40.8, duration: 3.9},
  ],
  technisch: [
    {at: 0.0, duration: 5.2},
    {at: 5.2, duration: 4.6},
    {at: 9.8, duration: 2.2},
    {at: 12.0, duration: 1.9},
    {at: 13.9, duration: 4.6},
    {at: 18.5, duration: 8.7},
    {at: 27.2, duration: 18.4},
    {at: 45.6, duration: 3.6},
  ],
} as const;

/** Tipp-Einsaetze relativ zum Start der Tipps-Szene. */
const TIP_BEATS = {
  einfach: [2.7, 6.7, 10.0],
  technisch: [2.5, 8.0, 12.6],
} as const;

const TIPS = {
  einfach: [
    {n: 'EINS', text: <>Neues Thema, neuer Chat.<br />Nicht alles in einen langen.</>},
    {n: 'ZWEI', text: <>Wichtige Regeln ans <b>Ende</b>,<br />nicht an den Anfang.</>},
    {n: 'DREI', text: <>Wird es lang: zusammenfassen<br />lassen und damit neu starten.</>},
  ],
  technisch: [
    {
      n: 'EINS',
      text: (
        <>
          Was sich nie ändert, gehört nach vorne.
          <br />
          Prompt Caching greift nur auf
          <br />
          unveränderte Präfixe.
        </>
      ),
    },
    {
      n: 'ZWEI',
      text: (
        <>
          Nicht das ganze Dokument reinkippen.
          <br />
          Chunken, einbetten, gezielt abrufen.
        </>
      ),
    },
    {
      n: 'DREI',
      text: (
        <>
          Lange Läufe komprimieren.
          <br />
          Zusammenfassung statt Rohverlauf.
        </>
      ),
    },
  ],
} as const;

export const ContextWindow: React.FC<{variant: Variant}> = ({variant}) => {
  const bounds = SCENES[variant];
  const nodes =
    variant === 'einfach'
      ? [
          <SceneIrrtum key="Irrtum"
            claim={<>DIE KI HAT EIN{'\n'}SCHLECHTES GEDÄCHTNIS</>}
            truth={<>Sie hat gar keins.</>}
          />,
          <SceneKasten key="Kasten"
            chapter="DER KASTEN"
            note={
              <div style={{fontSize: 27, color: COLOR_MUTED, lineHeight: 1.6}}>
                Alles landet im selben Kasten.
                <br />
                Und der hat eine feste Größe.
              </div>
            }
          />,
          <SceneVoll key="Voll"
            consequence={
              <div style={{fontSize: 28, color: COLOR_INK, lineHeight: 1.5}}>
                Deine Anweisung von vor
                <br />
                zwanzig Minuten? <b>Rausgefallen.</b>
              </div>
            }
          />,
          <SceneNeuLesen key="NeuLesen"
            chapter="KEIN GEDÄCHTNIS"
            punch={
              <div style={{fontSize: 34, lineHeight: 1.45}}>
                Sie erinnert sich nicht.
                <br />
                <b>Sie liest nach.</b>
              </div>
            }
          />,
          <SceneTipps key="Tipps" beats={[...TIP_BEATS.einfach]} tips={[...TIPS.einfach]} />,
          <SceneSchluss key="Schluss"
            punch={
              <>
                Kein Gedächtnis.
                <br />
                <span style={{color: '#2E7D5B'}}>Ein Kasten mit Deckel.</span>
              </>
            }
          />,
        ]
      : [
          <SceneIrrtum key="Irrtum"
            claim={<>DAS CONTEXT WINDOW{'\n'}IST EIN GEDÄCHTNIS</>}
            truth={<>Es ist ein Puffer.</>}
          />,
          <SceneTokens key="Tokens" />,
          <SceneKasten key="Kasten" chapter="DAS FENSTER" />,
          <SceneVoll key="Voll"
            consequence={
              <div style={{fontSize: 28, color: COLOR_INK, lineHeight: 1.5}}>
                Ist es voll, fällt vorne raus.
                <br />
                Ohne Warnung.
              </div>
            }
          />,
          <SceneNeuLesen key="NeuLesen"
            chapter="ZUSTANDSLOS"
            punch={
              <div style={{fontSize: 32, lineHeight: 1.45}}>
                Jeder Durchlauf liest
                <br />
                <b>das komplette Fenster</b> neu ein.
              </div>
            }
          />,
          <SceneKosten key="Kosten" />,
          <SceneTipps key="Tipps" beats={[...TIP_BEATS.technisch]} tips={[...TIPS.technisch]} />,
          <SceneSchluss key="Schluss"
            punch={
              <>
                Kein Gedächtnis.
                <br />
                <span style={{color: '#2E7D5B'}}>Ein Puffer mit Kosten.</span>
              </>
            }
          />,
        ];

  if (bounds.length !== nodes.length) {
    throw new Error(
      `Fassung "${variant}": ${bounds.length} Szenengrenzen, aber ${nodes.length} Szenen. ` +
        'Beide Listen muessen gleich lang sein, sonst laufen Kapitel und Ton auseinander.'
    );
  }

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Backdrop />
      <Audio src={staticFile('music.mp3')} volume={0.16} />

      {bounds.map((b, i) => (
        <Sequence key={b.at} from={sec(b.at)} durationInFrames={sec(b.duration)}>
          {nodes[i]}
        </Sequence>
      ))}

      <Captions words={TIMING[variant].words} />
    </AbsoluteFill>
  );
};

const COLOR_MUTED = '#8A857A';
const COLOR_INK = '#1E1E1C';
