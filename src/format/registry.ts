// Erzeugt von scripts/registry.mjs -- nicht von Hand aendern.
import type {VideoDef, Zeiten} from './schema';

import claudeCodeAutoModeRegelnDef from '../../videos/claude-code-auto-mode-regeln.json';
import claudeCodeAutoModeRegelnZeiten from '../../videos/claude-code-auto-mode-regeln.zeiten.json';
import claudeCodeLimitResetDef from '../../videos/claude-code-limit-reset.json';
import claudeCodeLimitResetZeiten from '../../videos/claude-code-limit-reset.zeiten.json';
import claudeCodeRemoteControlPhoneDef from '../../videos/claude-code-remote-control-phone.json';
import claudeCodeRemoteControlPhoneZeiten from '../../videos/claude-code-remote-control-phone.zeiten.json';
import claudeCodeScheduleDef from '../../videos/claude-code-schedule.json';
import claudeCodeScheduleZeiten from '../../videos/claude-code-schedule.zeiten.json';
import claudeCodeSkillDoctorDef from '../../videos/claude-code-skill-doctor.json';
import claudeCodeSkillDoctorZeiten from '../../videos/claude-code-skill-doctor.zeiten.json';
import claudeMemoryDef from '../../videos/claude-memory.json';
import claudeMemoryZeiten from '../../videos/claude-memory.zeiten.json';
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
  {id: 'claude-code-auto-mode-regeln', video: claudeCodeAutoModeRegelnDef as VideoDef, zeiten: claudeCodeAutoModeRegelnZeiten as Zeiten, stimme: 'claude-code-auto-mode-regeln.mp3'},
  {id: 'claude-code-limit-reset', video: claudeCodeLimitResetDef as VideoDef, zeiten: claudeCodeLimitResetZeiten as Zeiten, stimme: 'claude-code-limit-reset.mp3'},
  {id: 'claude-code-remote-control-phone', video: claudeCodeRemoteControlPhoneDef as VideoDef, zeiten: claudeCodeRemoteControlPhoneZeiten as Zeiten, stimme: 'claude-code-remote-control-phone.mp3'},
  {id: 'claude-code-schedule', video: claudeCodeScheduleDef as VideoDef, zeiten: claudeCodeScheduleZeiten as Zeiten, stimme: 'claude-code-schedule.mp3'},
  {id: 'claude-code-skill-doctor', video: claudeCodeSkillDoctorDef as VideoDef, zeiten: claudeCodeSkillDoctorZeiten as Zeiten, stimme: 'claude-code-skill-doctor.mp3'},
  {id: 'claude-memory', video: claudeMemoryDef as VideoDef, zeiten: claudeMemoryZeiten as Zeiten, stimme: 'claude-memory.mp3'},
  {id: 'codex-als-mcp-subagent', video: codexAlsMcpSubagentDef as VideoDef, zeiten: codexAlsMcpSubagentZeiten as Zeiten, stimme: 'codex-als-mcp-subagent.mp3'},
  {id: 'context-window-einfach', video: contextWindowEinfachDef as VideoDef, zeiten: contextWindowEinfachZeiten as Zeiten, stimme: 'context-window-einfach.mp3'},
  {id: 'halluzination', video: halluzinationDef as VideoDef, zeiten: halluzinationZeiten as Zeiten, stimme: 'halluzination.mp3'},
  {id: 'katalog', video: katalogDef as VideoDef, zeiten: katalogZeiten as Zeiten, stimme: 'katalog.mp3'},
  {id: 'tokens', video: tokensDef as VideoDef, zeiten: tokensZeiten as Zeiten, stimme: 'tokens.mp3'},
];
