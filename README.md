# content-creation

Animierte KI-Erklär-Reels mit Remotion: **selbst lernen und verständlich posten**.
Historischer Branchname ohne inhaltlichen ECC-Bezug.

- [Redaktion](content/redaktion.md), [Forschung](research/lerncontent.md)
- [Ablauf](agenten/orchestrator.md), [Themen](content/plan.md)
- [Bestandsaudit](content/bestandsaudit.md)
- [Beispiel-Lernblatt RAG](content/lernzettel/rag-dokument-lernen.md)

Aufruf: /neues-video [ID oder Lernfrage].
Ergebnis: Recherche, Lernblatt, Skript, Caption, Review, danach Ton/Render.
Fehlt ein Connector, wird ein klar bezeichnetes Skript-Paket geliefert.

```bash
npm ci
npm test
node scripts/pruefe-redaktion.mjs <id> --hash
node scripts/pruefe-video.mjs <id>
node scripts/narration.mjs <id>
# Ton erstellen, dann:
node scripts/speed-up-voice.mjs public/<id>-raw.mp3 public/<id>.mp3 --text videos/<id>.narration.txt
node scripts/measure-timing.mjs public/<id>.mp3 videos/<id>.narration.txt videos/<id>.messung.json
node scripts/zeiten.mjs <id>
node scripts/registry.mjs
node scripts/render.mjs <id>
node scripts/cover.mjs <id>
npm run typen
```

--hash bestätigt keine Qualität. Review tatsächlich durchführen.
--technik-only ist nur Wartung, keine Inhaltsfreigabe.
Alte Videos bleiben erhalten, ohne Dossier aber nicht neu geprüft.
Neue Videos: profile: "lernen-v2".

videos/: Szenen/Texte/Timing. redaktion/: Brief/Claims/Review.
content/lernzettel/: Lernen. captions/: Post-Text. public/: Assets.
src/: Renderer. scripts/: Prüfungen/Produktion. tests/: Regressionen.
out/: lokale Render, nicht im Git. Veröffentlichung bleibt beim Menschen.
