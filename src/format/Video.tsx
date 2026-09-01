import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Backdrop, Captions} from '../components';
import {CANVAS, FONT} from '../theme';
import {Bau} from './scenes';
import type {VideoDef, Zeiten} from './schema';
import {pruefeText} from './text';

const sec = (s: number) => Math.round(s * CANVAS.fps);

/** Lautstaerke des Musikbetts unter der Stimme. */
const MUSIK_BETT = 0.14;

/**
 * Faellt frueh und laut auf, statt still ein falsches Video zu rendern.
 * Beide Faelle sind hier schon einmal passiert: eine fehlende Grenze liess
 * die Schlussszene verschwinden, ein offenes Sternchen setzte den halben
 * Satz fett.
 */
const pruefe = (video: VideoDef, zeiten: Zeiten): void => {
  if (zeiten.grenzen.length !== video.szenen.length) {
    throw new Error(
      `"${video.id}": ${zeiten.grenzen.length} Szenengrenzen, aber ${video.szenen.length} Szenen. ` +
        `Erst "node scripts/zeiten.mjs ${video.id}" laufen lassen.`
    );
  }

  video.szenen.forEach((szene, i) => {
    const wo = `"${video.id}" Szene ${i + 1} (${szene.typ})`;
    if (szene.text.length === 0) {
      throw new Error(`${wo}: kein Sprechertext`);
    }
    Object.entries(szene).forEach(([schluessel, wert]) => {
      if (typeof wert === 'string' && schluessel !== 'typ' && schluessel !== 'kapitel') {
        pruefeText(wert, `${wo}, Feld ${schluessel}`);
      }
    });
  });
};

/**
 * Generischer Renderer. Jedes Video ist eine Datei unter videos/ plus die
 * gemessenen Zeiten -- kein Video bringt eigenen Code mit.
 *
 * captions: Untertitel im Bild, standardmaessig aus. Instagram erzeugt beim
 * Hochladen eigene aus der Tonspur; zwei Spuren uebereinander waeren unlesbar.
 */
export const Reel: React.FC<{
  video: VideoDef;
  zeiten: Zeiten;
  stimme: string;
  captions?: boolean;
}> = ({video, zeiten, stimme, captions = false}) => {
  const frame = useCurrentFrame();
  pruefe(video, zeiten);

  const gesamt = sec(zeiten.duration);

  // Musik startet etwas lauter, faellt unter die Stimme und blendet aus.
  const musik = interpolate(
    frame,
    [0, sec(0.6), sec(1.2), gesamt - sec(2.2), gesamt],
    [0, 0.32, MUSIK_BETT, MUSIK_BETT, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Backdrop />
      <Audio src={staticFile('music.mp3')} volume={musik} />
      <Audio src={staticFile(stimme)} />

      {video.szenen.map((szene, i) => {
        const grenze = zeiten.grenzen[i];
        return (
          <Sequence
            key={`${szene.typ}-${i}`}
            from={sec(grenze.at)}
            durationInFrames={sec(grenze.duration)}
          >
            <Bau szene={szene} schritte={video.schritte} einsaetze={grenze.einsaetze} />
          </Sequence>
        );
      })}

      {captions ? <Captions words={zeiten.words} /> : null}
    </AbsoluteFill>
  );
};
