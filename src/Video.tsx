import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Backdrop, Captions, Mascot} from './components';
import {SceneAgent, SceneChatbot, SceneIrrtum, SceneSchleife} from './scenes';
import {CANVAS, FONT} from './theme';

const sec = (s: number) => Math.round(s * CANVAS.fps);

/**
 * Szenenfolge. Die Grenzen entsprechen den Satzgruppen in script.ts --
 * wer das Timing aendert, muss beides zusammen anpassen.
 */
const SCENES = [
  {at: 0, duration: 6, Component: SceneIrrtum},
  {at: 6, duration: 8, Component: SceneChatbot},
  {at: 14, duration: 12, Component: SceneAgent},
  {at: 26, duration: 9, Component: SceneSchleife},
] as const;

export const AgentVsChatbot: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONT}}>
    <Backdrop />

    {SCENES.map(({at, duration, Component}) => (
      <Sequence key={at} from={sec(at)} durationInFrames={sec(duration)}>
        <Component />
      </Sequence>
    ))}

    {/* Maskottchen und Untertitel laufen ueber alle Szenen durch. */}
    <Mascot />
    <Captions />
  </AbsoluteFill>
);
