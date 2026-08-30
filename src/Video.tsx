import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Backdrop, Captions} from './components';
import {
  SceneAgent,
  SceneChatbot,
  SceneIrrtum,
  SceneSchleife,
  SceneSchluss,
  SceneTipps,
} from './scenes';
import {SCENE_BOUNDS, TIP_BEATS, TOTAL_SECONDS} from './script';
import {CANVAS, FONT} from './theme';

const sec = (s: number) => Math.round(s * CANVAS.fps);

/**
 * Szenenfolge. Die Grenzen stammen aus SCENE_BOUNDS und sitzen auf gemessenen
 * Wortzeiten -- kein Schnitt faellt mitten in einen Satz. Das Maskottchen
 * gehoert zur Szene, weil jede ihre eigene Pose zeigt.
 */
const SCENES = [
  {...SCENE_BOUNDS.hook, node: <SceneIrrtum />},
  {...SCENE_BOUNDS.chatbot, node: <SceneChatbot />},
  {...SCENE_BOUNDS.agent, node: <SceneAgent />},
  {...SCENE_BOUNDS.schleife, node: <SceneSchleife />},
  {...SCENE_BOUNDS.tipps, node: <SceneTipps beats={[...TIP_BEATS]} />},
  {...SCENE_BOUNDS.schluss, node: <SceneSchluss />},
];

/** Lautstaerke des Musikbetts unter der Stimme. */
const MUSIC_BED = 0.14;

export const AgentVsChatbot: React.FC = () => {
  const frame = useCurrentFrame();
  const total = sec(TOTAL_SECONDS);

  // Musik startet etwas lauter, bevor gesprochen wird, faellt dann unter die
  // Stimme zurueck und blendet am Schluss aus.
  const musicVolume = interpolate(
    frame,
    [0, sec(0.6), sec(1.2), total - sec(2.2), total],
    [0, 0.32, MUSIC_BED, MUSIC_BED, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
  <AbsoluteFill style={{fontFamily: FONT}}>
    <Backdrop />
    <Audio src={staticFile('music.mp3')} volume={musicVolume} />
    <Audio src={staticFile('voice.mp3')} />

    {SCENES.map(({at, duration, node}) => (
      <Sequence key={at} from={sec(at)} durationInFrames={sec(duration)}>
        {node}
      </Sequence>
    ))}

    {/* Untertitel laufen ueber alle Szenen durch und liegen ueber allem. */}
    <Captions />
  </AbsoluteFill>
  );
};
