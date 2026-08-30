import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  Appear,
  Card,
  CardTitle,
  ChapterLabel,
  Chip,
  Mascot,
  ReturnArrow,
  StepBar,
  useAppear,
  useSceneSeconds,
} from './components';
import {COLOR, FONT, LAYOUT} from './theme';

const STEPS = ['DENKEN', 'TOOL', 'LESEN', 'WIEDERHOLEN'];

const Arrow: React.FC<{on?: boolean}> = ({on = true}) => (
  <span style={{color: on ? COLOR.faint : '#DDD8CA', fontSize: 30, margin: '0 2px'}}>&rarr;</span>
);

/** Freistehende Marke ausserhalb einer Karte, z.B. ENDE oder RUNDE 3. */
const Badge: React.FC<{
  at: number;
  top: number;
  tone: 'accent' | 'good' | 'plain';
  children: React.ReactNode;
  rotate?: number;
}> = ({at, top, tone, children, rotate = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({
    frame: frame - at * fps,
    fps,
    config: {damping: 12, stiffness: 190},
    durationInFrames: 22,
  });
  const tones = {
    accent: {bg: COLOR.accent, fg: '#fff', border: COLOR.accent},
    good: {bg: COLOR.goodSoft, fg: COLOR.good, border: COLOR.good},
    plain: {bg: '#E4DFD1', fg: COLOR.inkSoft, border: '#C9C3B4'},
  }[tone];

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: LAYOUT.stage.left,
        fontFamily: FONT,
        fontSize: 28,
        letterSpacing: 3,
        background: tones.bg,
        color: tones.fg,
        border: `2px solid ${tones.border}`,
        padding: '12px 24px',
        borderRadius: 7,
        opacity: Math.min(pop, 1),
        transform: `scale(${interpolate(pop, [0, 1], [1.5, 1])}) rotate(${rotate}deg)`,
        transformOrigin: 'left center',
      }}
    >
      {children}
    </div>
  );
};

/** Szene 1 (0-3,05s): Die Fehlannahme wird ausgesprochen und durchgestrichen. */
export const SceneIrrtum: React.FC = () => {
  const t = useSceneSeconds();
  const strike = interpolate(t, [1.5, 2.3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <ChapterLabel text="DER IRRTUM" />
      <StepBar steps={STEPS} activeIndex={-1} />
      <Mascot pose="skeptisch" />

      <Card top={520} delay={4} style={{padding: '46px 40px'}}>
        <CardTitle>WAS ALLE DENKEN</CardTitle>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{fontSize: 40, color: COLOR.inkSoft, lineHeight: 1.5}}>
            AGENT = CHATBOT
            <br />+ BESSERER PROMPT
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: -10,
              height: 7,
              borderRadius: 4,
              background: COLOR.accent,
              width: `${strike * 106}%`,
            }}
          />
        </div>
      </Card>

      <Badge at={2.35} top={880} tone="accent" rotate={-3}>
        FALSCH
      </Badge>
    </AbsoluteFill>
  );
};

/**
 * Szene 2 (4,8-13,4s): Der Chatbot laeuft genau einmal durch. Ab 3,8s kommt
 * das konkrete Beispiel, das die Erzaehlung an dieser Stelle nennt -- eine
 * echte Frage mit einer echten Ausrede als Antwort.
 */
export const SceneChatbot: React.FC = () => {
  const t = useSceneSeconds();
  const chips = [
    {label: 'DU', at: 0.3},
    {label: 'MODELL', at: 0.8},
    {label: 'ANTWORT', at: 1.3},
  ];

  return (
    <AbsoluteFill>
      <ChapterLabel text="DER CHATBOT" />
      <StepBar steps={STEPS} activeIndex={-1} />
      <Mascot pose="denkend" />

      <Card top={420} delay={2}>
        <CardTitle>EINE RUNDE</CardTitle>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, minHeight: 66}}>
          {chips.map((c, i) => (
            <React.Fragment key={c.label}>
              {i > 0 ? (
                <span style={{opacity: t > c.at - 0.12 ? 1 : 0}}>
                  <Arrow />
                </span>
              ) : null}
              <Appear at={c.at} rise={0}>
                <Chip>{c.label}</Chip>
              </Appear>
            </React.Fragment>
          ))}
        </div>
        <ReturnArrow width={560} active={false} />
        <div style={{fontSize: 24, color: '#C4BEAE', letterSpacing: 2, marginTop: -14}}>
          keine Rückkehr
        </div>
      </Card>

      <Badge at={2.1} top={770} tone="accent" rotate={-3}>
        ENDE
      </Badge>

      {/* Konkretes Beispiel -- ab hier spricht die Erzaehlung von Umsatzzahlen. */}
      <Card top={880} delay={3.8 * 30} style={{padding: '30px 34px'}}>
        <div style={{fontSize: 27, color: COLOR.muted, marginBottom: 14}}>
          &bdquo;Wie waren die Umsatzzahlen im März?&ldquo;
        </div>
        <Appear at={4.9} rise={10}>
          <div style={{fontSize: 29, color: COLOR.accent, lineHeight: 1.5}}>
            &bdquo;Dazu habe ich keinen Zugriff.&ldquo;
          </div>
        </Appear>
        <Appear at={5.9} rise={8}>
          <div style={{fontSize: 25, color: '#C4BEAE', marginTop: 16}}>
            Die Datei liegt direkt daneben.
          </div>
        </Appear>
      </Card>
    </AbsoluteFill>
  );
};

/**
 * Szene 3 (13,4-17,5s): Der Agent bekommt Werkzeuge. Kurze Szene, deshalb nur
 * die drei Werkzeuge -- jedes genau dann, wenn es genannt wird.
 */
export const SceneAgent: React.FC = () => {
  const tools = [
    {label: 'read_file', hint: 'Dateien lesen', at: 0.7},
    {label: 'run_command', hint: 'Befehle ausführen', at: 1.5},
    {label: 'search_web', hint: 'im Netz suchen', at: 2.3},
  ];

  return (
    <AbsoluteFill>
      <ChapterLabel text="DER AGENT" />
      <StepBar steps={STEPS} activeIndex={0} />
      <Mascot pose="erklaerend" />

      <Card top={470} delay={2} style={{padding: '34px 36px'}}>
        <CardTitle>WERKZEUGE</CardTitle>
        {tools.map((tool) => (
          <Appear key={tool.label} at={tool.at} rise={12}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18, margin: '16px 0'}}>
              <Chip tone="good">{tool.label}</Chip>
              <span style={{fontSize: 25, color: COLOR.muted}}>{tool.hint}</span>
            </div>
          </Appear>
        ))}
      </Card>
    </AbsoluteFill>
  );
};

/**
 * Szene 4 (17,5-31,1s): Die Schleife -- der laengste Abschnitt und die
 * eigentliche Pointe. Die Einsaetze folgen den gemessenen Wortzeiten:
 * "Schleife" 2,4s | "Denken" 3,9s | "Neu entscheiden" 6,2s |
 * "Findet er nichts" 7,1s | "Nicht das Modell" 10,4s
 */
export const SceneSchleife: React.FC = () => {
  const t = useSceneSeconds();
  const running = t > 3.9 && t < 9.3;
  const done = t >= 9.3;
  const cycling = Math.floor((t * 2.2) % 3);

  const round = Math.min(4, 1 + Math.floor(interpolate(t, [4.0, 9.0], [0, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })));

  return (
    <AbsoluteFill>
      <ChapterLabel text="DIE SCHLEIFE" />
      <StepBar steps={STEPS} activeIndex={done ? -1 : running ? cycling : -1} />
      <Mascot pose="selbstsicher" />

      <Card top={400} delay={2.1 * 30}>
        <CardTitle>SOLANGE, BIS FERTIG</CardTitle>
        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
          {['DENKEN', 'TOOL', 'LESEN'].map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 ? <Arrow /> : null}
              <div style={{transform: `scale(${running && cycling === i ? 1.07 : 1})`}}>
                <Chip tone={running && cycling === i ? 'good' : 'plain'}>{label}</Chip>
              </div>
            </React.Fragment>
          ))}
        </div>
        <ReturnArrow width={560} active={running} />
      </Card>

      <Badge at={4.0} top={740} tone={done ? 'good' : 'plain'}>
        {done ? 'FERTIG' : `RUNDE ${round}`}
      </Badge>

      {/* "Findet er nichts, probiert er den naechsten Weg." */}
      <Card top={860} delay={6.6 * 30} style={{padding: '28px 32px'}}>
        <div style={{fontSize: 26, color: COLOR.muted, lineHeight: 1.8}}>
          <Appear at={6.7} rise={8}>
            <span>&rarr; Datei nicht gefunden</span>
          </Appear>
          <Appear at={7.5} rise={8}>
            <span style={{color: COLOR.good}}>&rarr; sucht selbst den nächsten Weg</span>
          </Appear>
        </div>
      </Card>

      <Card top={1030} delay={9.4 * 30} style={{padding: '32px 36px'}}>
        <div style={{fontSize: 34, color: COLOR.ink, lineHeight: 1.45}}>
          Nicht das Modell.
          <br />
          <span style={{color: COLOR.good}}>Die Schleife.</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/**
 * Szene 5: Die drei anwendbaren Tipps. Kein neues Wissen mehr, sondern das,
 * was der Zuschauer ab morgen anders macht -- der Grund, warum jemand ein
 * Reel speichert statt es nur zu liken.
 */
export const SceneTipps: React.FC<{beats: number[]}> = ({beats}) => {
  const tips = [
    {n: 'EINS', head: 'Datei anhängen', body: 'statt sie zu beschreiben'},
    {n: 'ZWEI', head: 'Ziel vorgeben', body: 'keine Einzelschritte'},
    {n: 'DREI', head: 'Fehler zeigen lassen', body: 'dann korrigiert er sich selbst'},
  ];

  return (
    <AbsoluteFill>
      <ChapterLabel text="SO NUTZT DU DAS" />
      <StepBar steps={STEPS} activeIndex={-1} />
      <Mascot pose="erklaerend" />

      {tips.map((tip, i) => (
        <Card key={tip.n} top={430 + i * 250} delay={beats[i] * 30} style={{padding: '28px 32px'}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
            <span style={{fontSize: 24, letterSpacing: 3, color: COLOR.good}}>{tip.n}</span>
            <span style={{fontSize: 34, color: COLOR.ink}}>{tip.head}</span>
          </div>
          <div style={{fontSize: 26, color: COLOR.muted, marginTop: 10}}>{tip.body}</div>
        </Card>
      ))}
    </AbsoluteFill>
  );
};

/** Szene 6: Abbinder. Fordert die Handlung ein, die dieses Format traegt. */
export const SceneSchluss: React.FC = () => (
  <AbsoluteFill>
    <ChapterLabel text="MITNEHMEN" />
    <StepBar steps={STEPS} activeIndex={-1} />
    <Mascot pose="selbstsicher" />

    <Card top={560} delay={4} style={{padding: '44px 40px'}}>
      <div style={{fontSize: 38, color: COLOR.ink, lineHeight: 1.5}}>
        Nicht das Modell.
        <br />
        <span style={{color: COLOR.good}}>Die Schleife.</span>
      </div>
    </Card>

    <Card top={840} delay={22} style={{padding: '30px 36px'}}>
      <div style={{fontSize: 30, color: COLOR.muted, lineHeight: 1.5}}>
        Speicher dir das für dein
        <br />nächstes Projekt.
      </div>
    </Card>
  </AbsoluteFill>
);
