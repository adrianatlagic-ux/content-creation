import React from 'react';
import {COLOR} from '../theme';

/**
 * Sparsame Auszeichnung fuer Inhaltstexte aus JSON.
 *
 *   *Sternchen*    -> fett
 *   _Unterstrich_  -> gruen hervorgehoben (COLOR.good)
 *   \n             -> Zeilenumbruch
 *
 * Absichtlich winzig. Je mehr Auszeichnung erlaubt ist, desto mehr Wege gibt
 * es fuer den Text-Agenten, etwas zu erzeugen, das im Bild bricht. Gruen kam
 * dazu, weil es im Format die Aufloesung markiert -- ohne es wurde aus einer
 * gruenen Pointe stillschweigend eine schwarze.
 */
const MARKER = [
  {zeichen: '*', stil: {fontWeight: 700} as React.CSSProperties},
  {zeichen: '_', stil: {color: COLOR.good} as React.CSSProperties},
] as const;

/** Zerlegt eine Zeile an einem Marker und setzt die ungeraden Stuecke gestylt. */
const teile = (text: string, tiefe: number): React.ReactNode => {
  if (tiefe >= MARKER.length) return text;
  const {zeichen, stil} = MARKER[tiefe];

  return text.split(zeichen).map((stueck, i) =>
    i % 2 === 1 ? (
      <span key={i} style={stil}>
        {teile(stueck, tiefe + 1)}
      </span>
    ) : (
      <React.Fragment key={i}>{teile(stueck, tiefe + 1)}</React.Fragment>
    )
  );
};

export const T: React.FC<{children: string}> = ({children}) => (
  <>
    {children.split('\n').map((zeile, z, alle) => (
      <React.Fragment key={z}>
        {teile(zeile, 0)}
        {z < alle.length - 1 ? <br /> : null}
      </React.Fragment>
    ))}
  </>
);

/**
 * Ungerade Anzahl eines Markers heisst: eine Auszeichnung wurde nicht
 * geschlossen. Der Renderer wuerde den Rest der Zeile still auszeichnen,
 * deshalb faellt das hier auf, solange es billig zu beheben ist.
 */
export const pruefeText = (text: string, wo: string): void => {
  MARKER.forEach(({zeichen}) => {
    const anzahl = text.split(zeichen).length - 1;
    if (anzahl % 2 !== 0) {
      throw new Error(`${wo}: ungerade Anzahl "${zeichen}" (${anzahl}) in "${text}"`);
    }
  });
};
