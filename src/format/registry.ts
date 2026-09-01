// Erzeugt von scripts/registry.mjs -- nicht von Hand aendern.
import type {VideoDef, Zeiten} from './schema';

import contextWindowEinfachDef from '../../videos/context-window-einfach.json';
import contextWindowEinfachZeiten from '../../videos/context-window-einfach.zeiten.json';
import katalogDef from '../../videos/katalog.json';
import katalogZeiten from '../../videos/katalog.zeiten.json';
import tokensDef from '../../videos/tokens.json';
import tokensZeiten from '../../videos/tokens.zeiten.json';

export const VIDEOS: {id: string; video: VideoDef; zeiten: Zeiten; stimme: string}[] = [
  {id: 'context-window-einfach', video: contextWindowEinfachDef as VideoDef, zeiten: contextWindowEinfachZeiten as Zeiten, stimme: 'context-window-einfach.mp3'},
  {id: 'katalog', video: katalogDef as VideoDef, zeiten: katalogZeiten as Zeiten, stimme: 'katalog.mp3'},
  {id: 'tokens', video: tokensDef as VideoDef, zeiten: tokensZeiten as Zeiten, stimme: 'tokens.mp3'},
];
