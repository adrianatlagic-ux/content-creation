# Routine mit Connectors anlegen

Schritt für Schritt. Die Angaben stammen aus der Dokumentation unter
`code.claude.com/docs/en/routines`, nicht aus dem Gedächtnis.

**Die gute Nachricht vorweg:** Im Web-Formular sind **alle deine Connectors
standardmäßig dabei**. Das Problem, an dem ich hier gescheitert bin, gibt es
dort nicht — die API-Sperre betrifft nur den programmatischen Weg.

---

## Schritt 1 — Formular öffnen

Gehe auf **https://claude.ai/code/routines** und klicke **New routine**.

## Schritt 2 — Name und Prompt

**Name:** `Tägliches KI-Reel`

**Prompt:** den Text aus dem Abschnitt „Prompt zum Kopieren" ganz unten.

Über dem Prompt-Feld sitzt ein **Modell-Auswahlfeld**. Das gewählte Modell
läuft bei jedem Durchgang.

## Schritt 3 — Repository

**`adrianatlagic-ux/content-creation`** hinzufügen.

Nichts weiter einzustellen: Der Standard-Branch des Repositories ist bereits
`claude/ecc-plugin-installation-9qmt6g`, also genau der mit der Pipeline. Die
Routine klont automatisch den richtigen Stand.

## Schritt 4 — Environment

**Default** genügt.

Die Netzwerkstufe „Trusted" reicht aus, weil Connector-Verkehr über
Anthropics Server läuft und nicht über die Allowlist der Sitzung. Du musst
dort also nichts freischalten.

## Schritt 5 — Trigger

Unter **Select a trigger** → **Schedule** → **daily**, Uhrzeit **06:00**.

Zeiten werden in **deiner lokalen Zone** eingegeben und automatisch
umgerechnet — du trägst einfach 06:00 ein, keine UTC-Rechnerei.

Läufe starten manchmal ein paar Minuten später (gewollter Versatz, damit nicht
alle Routinen gleichzeitig feuern). Der Versatz ist für deine Routine immer
derselbe.

## Schritt 6 — Connectors ⚠️ der wichtige Schritt

Ganz unten im Formular unter **Connectors**.

**Standardmäßig sind ALLE deine verbundenen Connectors dabei.** Genau das
willst du nicht: Laut Dokumentation kann Claude während eines Laufs *jedes*
Werkzeug eines eingebundenen Connectors benutzen, **auch schreibende, ohne
nachzufragen.**

**Behalte nur diese zwei:**

- ✅ **ElevenLabs** — für die Vertonung
- ✅ **Google Drive** — für die Ablage

**Entferne alle anderen**, insbesondere:

- ❌ **Stripe** — Zahlungsverkehr, hat hier nichts zu suchen
- ❌ **Supabase** — Datenbanken
- ❌ **Lovable** — App-Bereitstellung
- ❌ Figma, Google Calendar, Microsoft 365

Das ist kein Formalismus. Eine Routine läuft unbeaufsichtigt und ohne
Rückfragen; ein Zahlungs-Connector gehört nicht in einen Lauf, der Videos baut.

## Schritt 7 — Anlegen

**Create** klicken. Mit **Run now** auf der Detailseite kannst du sofort einen
Probelauf starten, ohne bis 06:00 zu warten. **Das empfehle ich** — dann siehst
du heute noch, ob die Kette durchläuft.

## Schritt 8 — meine alte Routine löschen

Ich habe hier bereits eine angelegt: **„Tägliches KI-Reel vorbereiten"**. Die
kann keine Connectors tragen und würde sonst parallel laufen.

Lösch sie auf derselben Seite über das Papierkorb-Symbol — oder sag mir
Bescheid, dann mache ich es, sobald deine neue läuft.

---

## Prompt zum Kopieren

```
Erzeuge ein neues Instagram-Reel für den KI-Erklärkanal. Ein Lauf, ein Video.

VORBEREITUNG
1. `npm install` ausführen (node_modules liegt nicht im Git).
2. `agenten/00-orchestrator.md` lesen. Dort steht der komplette Ablauf mit
   allen Befehlen und Abbruchbedingungen. Halte dich exakt daran.
3. Die übrigen Dateien in `agenten/` sind die Rollenbeschreibungen der
   einzelnen Schritte. Lies jede, bevor du den zugehörigen Schritt ausführst.

WICHTIG
- `node scripts/pruefe-video.mjs <id>` muss 0 zurückgeben, BEVOR du vertonst.
  Die Vertonung ist der erste Schritt, der Geld kostet.
- Bei der Vertonung immer zuerst `estimate_only` (kostenlos), dann mit
  `generations_count: 1` erzeugen. Nicht die Voreinstellung 4 verwenden.
- Stimme: ausschließlich ifvYno2dLD5AxjPYOGa4, Modell eleven_v3.
- Ist ElevenLabs nicht erreichbar: NICHT abbrechen und nichts neu schreiben.
  Lege ab, was fertig ist, lass das Thema auf `inarbeit`, notiere in der
  Ablage was fehlt. Der nächste Lauf macht ab Schritt 5 weiter.
- Committe und pushe am Ende alles. Der Container wird recycelt; was nicht im
  Git liegt, ist verloren.
- Poste nichts. Am Ende liegt das Video mit Caption in Google Drive unter
  `KI-Reels/JJJJ-MM-TT-<id>/`. Die Freigabe bleibt beim Menschen.

MELDUNG AM ENDE
Kurz: welches Thema, wie lang das Video geworden ist, welches Hook-Muster, wo
es liegt, und was gegebenenfalls noch fehlt.
```

---

## Zwei Hinweise am Rande

**Es gibt eine Tagesgrenze für Routine-Läufe.** Wie viele dir noch bleiben,
steht auf derselben Seite unter claude.ai/code/routines.

**Grüner Status heißt nicht „hat geklappt".** Laut Dokumentation bedeutet er
nur, dass die Sitzung ohne Infrastrukturfehler beendet wurde. Ob das Video
wirklich entstanden ist, siehst du erst, wenn du den Lauf öffnest — oder
schlicht daran, ob in Drive etwas liegt.
