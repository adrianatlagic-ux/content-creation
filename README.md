# content-creation

Produktionsstrecke für animierte Erklär-Reels im Hochformat. Die Videos
entstehen als Code, nicht in einem Schnittprogramm: ein Skript, ein Voiceover,
ein Render.

**Dieses Repository hat nichts mit dem ECC-Plugin zu tun.** ECC liegt separat
unter `~/.claude/plugins/marketplaces/ecc` und stammt aus
`github.com/affaan-m/ECC`. Der Zweigname `claude/ecc-plugin-installation-…`
ist nur ein Name — im Projekt selbst liegt keine ECC-Datei.

---

## Was fertig ist

| Video | Datei | Länge | Ton |
|---|---|---|---|
| Agent vs. Chatbot | `out/agent-vs-chatbot.mp4` | 42 s | Stimme + Musik |
| Context Window, einfach | `out/context-einfach.mp4` | 41,5 s | Stimme + Musik |
| Context Window, technisch | `out/context-technisch.mp4` | 49 s | nur Musik, Vertonung offen |

---

## Die Strecke

```
narration.txt          Sprechertext, gesprochenes Deutsch
      ↓                ElevenLabs, Stimme des Autors, eleven_v3
voice-raw.mp3          Rohaufnahme -- niemals überschreiben
      ↓                scripts/speed-up-voice.mjs
voice.mp3              beschleunigt, Faktor 1,22
      ↓                scripts/measure-timing.mjs
timing.json            echte Wortzeiten
      ↓                Szenengrenzen von Hand ablesen
Video.tsx              Remotion-Komposition
      ↓                npx remotion render
out/*.mp4              1080 × 1920
```

### Befehle

```bash
npm install
npx remotion studio                    # Vorschau im Browser

# Nach einem neuen Voiceover:
node scripts/speed-up-voice.mjs   public/context/voice-x-raw.mp3 public/context/voice-x.mp3 1.22
node scripts/measure-timing.mjs   public/context/voice-x.mp3 src/context/narration-x.txt src/context/timing-x.json

# Ohne Voiceover, mit der an Video 1 gemessenen Sprechrate:
node scripts/estimate-timing.mjs  src/context/narration-x.txt src/context/timing-x.json

npx remotion render ContextWindowEinfach out/context-einfach.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

Der `--browser-executable`-Pfad ist nötig, weil Remotion den alten
Headless-Modus fährt, den das reguläre Chrome nicht mehr kennt.

---

## Format und Layout

**1080 × 1920 (9:16)** — identisch für Instagram Reels, TikTok, YouTube Shorts
und Facebook Reels. Ein Render, vier Plattformen.

Instagram legt seine Bedienoberfläche **über** das Video. Nutzbar ist nur:

```
x 60 – 900        rechts liegen Herz, Kommentar, Share, Save
y 250 – 1420      oben Statusleiste, unten Caption und Kommentarfeld
```

Untertitel sitzen bei **y 1240** — so tief wie möglich, ohne verdeckt zu
werden, und hoch genug für TikToks höhere Leiste. `layout-mockup.html` zeigt
die Zonen im Bild.

---

## Was aus Fehlern gelernt wurde

Diese Punkte stehen hier, weil sie jeweils einen Fehldurchlauf gekostet haben.

**Timing wird gemessen, nicht geschätzt.** Die erste Schätzung lag bei 34,4 s
gegen tatsächlich 22,4 s Sprechzeit — jede Untertitelzeile war verrutscht.

**Der Stille-Schwellwert kann nicht fest sein.** Eine ruhige Aufnahme lag bei
−25,5 dB Mittelpegel, eine energische bei −15,9. `measure-timing.mjs`
kalibriert sich am gemessenen Pegel.

**Tempo macht die Nachbearbeitung, nicht der Prompt.** Regieanweisungen wie
`[fast]` wirken bei geklonten Stimmen kaum — die bringen ihr Tempo aus den
Trainingsaufnahmen mit. Die Rohaufnahme kam mit Tempoanweisung sogar langsamer
heraus als eine Fremdstimme ohne.

**Skripte nehmen Pfade als Argument.** Fest verdrahtete Pfade haben einmal
Video 1s Tonspur ein zweites Mal beschleunigt. `speed-up-voice.mjs` weigert
sich jetzt, in seine eigene Eingabe zu schreiben.

**Szenengrenzen und Szenen müssen gleich lang sein.** Sieben Grenzen gegen acht
Szenen erzeugen keinen Fehler — die Kapitel laufen nur still auseinander. Die
Komposition wirft jetzt.

**Umlaute nicht umschreiben.** „laeuft" und „Rueckkehr" sind mehrfach bis in
den fertigen Render gerutscht.

---

## Verzeichnisse

| Pfad | Inhalt |
|---|---|
| `src/` | Video 1: Agent vs. Chatbot |
| `src/context/` | Video 2: Context Window, beide Fassungen |
| `scripts/` | Zeitmessung, Tempo, Freistellen, Profilbild |
| `public/` | Stimmen, Musik, Maskottchen-Posen, Profilbild |
| `captions/` | Captions je Video, plus `VORLAGE.md` |
| `account/` | Username, Bio, Startplan, Profilbild-Anleitung |
| `content/` | Hook-Katalog, Themen- und Stilplan |
| `out/` | gerenderte Videos, nicht im Git |

---

## Offen

- Video 3 (Tokens) bauen, siehe `content/plan.md`
- **Technische Fassung von Video 2 vertonen** — `public/context/voice-technisch.mp3`
  ist bytegleich mit `voice-einfach.mp3`, also ein Platzhalter. `out/context-technisch.mp4`
  laeuft dadurch mit dem falschen Text und ist so nicht postbar.
- Profilbild als echtes Porträt neu generieren, siehe
  `account/profilbild-neu-generieren.md`
- Automatisiertes Posten
