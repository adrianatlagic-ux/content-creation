import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Backdrop, Captions} from './components';
import {SceneAgent, SceneChatbot, SceneIrrtum, SceneSchleife} from './scenes';
import {SCENE_BOUNDS} from './script';
import {CANVAS, FONT} from './theme';

const sec = (s: number) => Math.round(s * CANVAS.fps);

/**
 * Szenenfolge. Die Grenzen stammen aus SCENE_BOUNDS in script.ts und liegen in
 * den gemessenen Sprechpausen -- wer den Text aendert, passt sie dort an.
 * Das Maskottchen gehoert zur Szene, weil jede ihre eigene Pose zeigt.
 */
const SCENES = [
  {...SCENE_BOUNDS.irrtum, Component: SceneIrrtum},
  {...SCENE_BOUNDS.chatbot, Component: SceneChatbot},
  {...SCENE_BOUNDS.agent, Component: SceneAgent},
  {...SCENE_BOUNDS.schleife, Component: SceneSchleife},
] as const;

export const AgentVsChatbot: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONT}}>
    <Backdrop />
    <Audio src={staticFile('voice.mp3')} />

    {SCENES.map(({at, duration, Component}) => (
      <Sequence key={at} from={sec(at)} durationInFrames={sec(duration)}>
        <Component />
      </Sequence>
    ))}

    {/* Untertitel laufen ueber alle Szenen durch und liegen ueber allem. */}
    <Captions />
  </AbsoluteFill>
);
