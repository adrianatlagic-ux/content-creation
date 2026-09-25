# Bestandsaudit und Migration

Geprüfter Ausgangsstand: cca04353d1e72bf106512f473c9f8b07efa8b0d5.
Skriptprüfung, kein vollständiger Faktencheck aller Produktfunktionen und
keine Sicht-/Hörprüfung der vorhandenen MP4-Dateien. Alle bisherigen
Video-/Audio-Dateien bleiben erhalten. fertig bleibt Produktionshistorie.
redaktionsstatus: nachpruefen verhindert die Verwechslung mit neuer Inhaltsabnahme.

## Priorität

| Bestand | Konkreter Anlass für Überarbeitung |
|---|---|
| system-prompt | Serienvorspann ersetzt den realen Ablauf; System-Prompt, Profil, Projektwissen und CLAUDE.md werden ohne Ebenentrennung verbunden. Eine enge Frage wählen und Schnittstellen belegen. |
| claude-cowork-browser | Cowork-Recherche wird als allgemeine Aussage über KI-Browser formuliert; Verhalten nur produktspezifisch behaupten. |
| claude-code-diff-panel | „Ersetzt meist den ganzen Inhalt“ nicht durch den Feature-Nachweis gedeckt; Öffnen/Schließen ersetzt keine Erklärung des Prüfens. |
| halluzination | Anderes Ergebnis im zweiten Chat wird als Beweis fürs Raten behandelt; Alltagswissen pauschal verharmlost. Überarbeitung zur Überprüfung konkreter Behauptungen. |
| tokens | Tokenzerlegung, Preisverhältnisse und Sprachkosten werden ohne konkretes Modell/Tokenizer verallgemeinert; API-Abrechnung von Abo-Nutzung trennen. |
| context-window-einfach | FIFO-Überlauf und Zusammenfassen als vollständigen Verlust nicht universell behaupten; Modellkontext und App-Komprimierung unterscheiden. |
| claude-memory | Beständigkeit, Umfang und sensible Daten produktspezifisch neu belegen; „einmal reicht“ nicht garantieren. |
| claude-artifacts-link | Erzeugung und Veröffentlichung/Linkfreigabe trennen; keine pauschale Persistenzzusage für alles, was KI baut. |
| claude-code-design-skill | WIE bleibt Funktionsbeschreibung; sinnvoller als ein konkreter Vorher-/Nachher-Vorgang mit Voraussetzungen. |
| claude-code-limit-reset | Befehl, Rollout, Grenzen und Erfolg neu prüfen; kein „kommt bald“ ohne Nachweis. |
| claude-code-schedule | Feature-/Cloud-Aussagen und Voraussetzungen prüfen; aktuelle Routine-Anleitung darf keine abweichende Einrichtung versprechen. |
| claude-code-remote-control-phone | Freigabeverhalten und Verbindungszustände pro Produktstand belegen; konkrete Frage statt pauschalem Warnnarrativ. |
| claude-code-auto-mode-regeln | Regelprioritäten/Defaultverhalten benötigen aktuellen Primärbeleg; Voraussetzungen statt allgemeinem KI-Tipp. |
| claude-code-skill-doctor | Metadaten, geladener Inhalt und tatsächliche Nutzung unterscheiden; keine universellen Kostenbehauptungen. |
| codex-als-mcp-subagent | Konkreten Server, Berechtigungen und Konfiguration nennen; kein allgemeines Verhalten aus einer Integration ableiten. |
| agent-vs-chatbot | Historischer Sonderpfad src/ statt videos/: Werkzeugaufruf/Berechtigung/Ergebnis beim Neuaufbau sauber trennen. |

## Vorgehen je Altvideo

1. Eine enge neue Zuschauerfrage formulieren, Quellen neu lesen.
2. Neue ID für die überarbeitete Fassung verwenden. Original behalten.
3. profile lernen-v2, Dossier, Lernblatt und Caption erstellen.
4. Inhalt tatsächlich abnehmen, dann neue Tonspur/Timing/Render erzeugen.
5. Alte fertige MP4 nicht durch bloßes Ändern des JSON als korrigiert ausgeben.

Das neue Beispiel rag-dokument-lernen demonstriert die gesamte redaktionelle
Strecke. Es ist ein geprüftes Skript-Paket, ohne MP3/MP4, Status inarbeit.

## Betrieb

Der neue Branch muss gemergt oder in der Routine ausgewählt werden, damit die
Routine ihn verwendet. Bestehende externe Routinen wurden nicht umgestellt.
pruefe-video verlangt standardmäßig Inhaltsreview; --technik-only ist nur
Wartung. render.mjs erzwingt die vollständige Prüfung. Das schützt die
Standardpipeline; ein direkter Remotion-Aufruf bleibt technisch möglich und
ist keine redaktionelle Freigabe.
