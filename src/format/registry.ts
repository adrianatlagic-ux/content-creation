// Erzeugt von scripts/registry.mjs -- nicht von Hand aendern.
import type {VideoDef, Zeiten} from './schema';

import claudeCodeLimitResetDef from '../../videos/claude-code-limit-reset.json';
import claudeCodeLimitResetZeiten from '../../videos/claude-code-limit-reset.zeiten.json';
import codexAlsMcpSubagentDef from '../../videos/codex-als-mcp-subagent.json';
import codexAlsMcpSubagentZeiten from '../../videos/codex-als-mcp-subagent.zeiten.json';
import contextWindowEinfachDef from '../../videos/context-window-einfach.json';
import contextWindowEinfachZeiten from '../../videos/context-window-einfach.zeiten.json';
import halluzinationDef from '../../videos/halluzination.json';
import halluzinationZeiten from '../../videos/halluzination.zeiten.json';
import katalogDef from '../../videos/katalog.json';
import katalogZeiten from '../../videos/katalog.zeiten.json';
import tokensDef from '../../videos/tokens.json';
import tokensZeiten from '../../videos/tokens.zeiten.json';

export const VIDEOS: {id: string; video: VideoDef; zeiten: Zeiten; stimme: string}[] = [
  {id: 'claude-code-limit-reset', video: claudeCodeLimitResetDef as VideoDef, zeiten: claudeCodeLimitResetZeiten as Zeiten, stimme: 'claude-code-limit-reset.mp3'},
  {id: 'codex-als-mcp-subagent', video: codexAlsMcpSubagentDef as VideoDef, zeiten: codexAlsMcpSubagentZeiten as Zeiten, stimme: 'codex-als-mcp-subagent.mp3'},
  {id: 'context-window-einfach', video: contextWindowEinfachDef as VideoDef, zeiten: contextWindowEinfachZeiten as Zeiten, stimme: 'context-window-einfach.mp3'},
  {id: 'halluzination', video: halluzinationDef as VideoDef, zeiten: halluzinationZeiten as Zeiten, stimme: 'halluzination.mp3'},
  {id: 'katalog', video: katalogDef as VideoDef, zeiten: katalogZeiten as Zeiten, stimme: 'katalog.mp3'},
  {id: 'tokens', video: tokensDef as VideoDef, zeiten: tokensZeiten as Zeiten, stimme: 'tokens.mp3'},
];
