import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Backdrop, Captions} from './components';
import {
  SceneAgent,
  SceneChatbot,
  SceneIrrtum,
  SceneSchleife,
  SceneSchluss,
  SceneTipps,
} from './scenes';
import {SCENE_BOUNDS, TIP_BEATS} from './script';
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

export const AgentVsChatbot: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONT}}>
    <Backdrop />
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
