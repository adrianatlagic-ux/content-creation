import React from 'react';
import {Composition} from 'remotion';
import {AgentVsChatbot} from './Video';
import {CANVAS, TOTAL_FRAMES} from './constants';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="AgentVsChatbot"
    component={AgentVsChatbot}
    durationInFrames={TOTAL_FRAMES}
    fps={CANVAS.fps}
    width={CANVAS.width}
    height={CANVAS.height}
  />
);
