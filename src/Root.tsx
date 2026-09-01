import React from 'react';
import {Composition} from 'remotion';
import {AgentVsChatbot} from './Video';
import {ContextWindow, TIMING} from './context/Video';
import {Reel} from './format/Video';
import {VIDEOS} from './format/registry';
import {CANVAS, TOTAL_FRAMES} from './constants';

const frames = (seconds: number) => Math.round(seconds * CANVAS.fps);

const shared = {
  fps: CANVAS.fps,
  width: CANVAS.width,
  height: CANVAS.height,
} as const;

/**
 * Die Reel-* Kompositionen entstehen aus videos/ und werden von
 * scripts/registry.mjs eingetragen. Die drei handgebauten darunter sind die
 * Videos aus der Zeit vor dem Datenformat und bleiben, bis sie umgezogen sind.
 */
export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map(({id, video, zeiten, stimme}) => (
      <Composition
        key={id}
        id={`Reel-${id}`}
        component={Reel}
        defaultProps={{video, zeiten, stimme, captions: false}}
        durationInFrames={frames(zeiten.duration)}
        {...shared}
      />
    ))}

    <Composition
      id="AgentVsChatbot"
      component={AgentVsChatbot}
      defaultProps={{captions: false}}
      durationInFrames={TOTAL_FRAMES}
      {...shared}
    />
    <Composition
      id="ContextWindowEinfach"
      component={ContextWindow}
      defaultProps={{variant: 'einfach' as const, captions: false}}
      durationInFrames={frames(TIMING.einfach.duration)}
      {...shared}
    />
    <Composition
      id="ContextWindowTechnisch"
      component={ContextWindow}
      defaultProps={{variant: 'technisch' as const, captions: false}}
      durationInFrames={frames(TIMING.technisch.duration)}
      {...shared}
    />
  </>
);
