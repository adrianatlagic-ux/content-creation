import React from 'react';
import {Composition} from 'remotion';
import {AgentVsChatbot} from './Video';
import {ContextWindow, TIMING} from './context/Video';
import {CANVAS, TOTAL_FRAMES} from './constants';

const frames = (seconds: number) => Math.round(seconds * CANVAS.fps);

const shared = {
  fps: CANVAS.fps,
  width: CANVAS.width,
  height: CANVAS.height,
} as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AgentVsChatbot"
      component={AgentVsChatbot}
      durationInFrames={TOTAL_FRAMES}
      {...shared}
    />
    <Composition
      id="ContextWindowEinfach"
      component={ContextWindow}
      defaultProps={{variant: 'einfach' as const}}
      durationInFrames={frames(TIMING.einfach.duration)}
      {...shared}
    />
    <Composition
      id="ContextWindowTechnisch"
      component={ContextWindow}
      defaultProps={{variant: 'technisch' as const}}
      durationInFrames={frames(TIMING.technisch.duration)}
      {...shared}
    />
  </>
);
