# Caption — Dein Handy hat eigene Freigabe-Regeln

Video: `out/claude-code-remote-control-phone.mp4` · Hook-Muster: Einladung + Widerspruch (siehe `content/hooks.md`)
Suchbegriffe im Fließtext: Claude Code, Remote Control, Freigabe, Handy

Aufbau und Regeln: `captions/VORLAGE.md`

Alles in einer Caption, kein separater Kommentar — der Klickpfad ist kurz
genug, um ihn direkt zum Kopieren dazustehen zu lassen.

---

## Caption

Claude Code hält jede Freigabe offen, bis ein verbundenes Gerät antwortet — Terminal, Browser oder Handy zählen gleich viel.

Nutzt du Remote Control vom Handy aus, kann genau das nach hinten losgehen: du tippst auf „erlauben", aber der Rechner bleibt manchmal trotzdem hängen — ein bekannter, noch offener Fehler, kein Einzelfall.

Damit du das wenigstens mitbekommst:

1️⃣ `/config` öffnen
2️⃣ Zu Benachrichtigungen wechseln
3️⃣ „Push bei Aktionen nötig" anschalten

Ersetzt keine Kontrolle: Wirkt eine Aufgabe hängengeblieben, kurz selbst am Rechner nachsehen statt aufs Handy zu vertrauen.

Ist dir das schon passiert — am Handy freigegeben und trotzdem gewartet?

#ClaudeCode #Claude #RemoteControl #KITools #KITipps

---

## Vor dem Posten prüfen

- Alles in einer Caption, kein separater Kommentar — der Klickpfad ist kurz.
- Quelle: offizielle Doku `code.claude.com/docs/en/remote-control`, per
  WebFetch am 9./10. September 2026 geprüft — die Doku beschreibt
  Freigabe-Weiterleitung an jedes verbundene Gerät (Terminal, Browser,
  Handy) und Nachrichten-Warteschlangen bei Verbindungsabbruch, nennt aber
  `--dangerously-skip-permissions` an keiner Stelle namentlich.
- Bewusst **nicht** behauptet, dass das Ignorieren von
  `--dangerously-skip-permissions` eine dokumentierte Absicht ist — das
  stammt aus Nutzerberichten (github.com/anthropics/claude-code Issues
  #29214, #52084), nicht aus der offiziellen Doku. Im Video deshalb als
  beobachtetes Verhalten formuliert, nicht als bestätigtes Feature.
- Ehrlicher Zusatz bewusst drin: der Freigabe-Hänger (Issue #52084) ist ein
  offener, unbestätigter Fehler, kein Anthropic-Statement dazu gefunden.
- Instagram rendert Backticks nicht als Code, nur als normalen Text — das
  ist eingepreist, keine Formatierung geht verloren.
- 719 Zeichen, Instagrams Grenze liegt bei 2200 — reichlich Luft, und
  außerhalb der schwachen Zone 51–125. Erste Zeile 124 Zeichen, passt
  knapp vor das „mehr".
