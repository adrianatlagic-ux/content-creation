Produce the next Lenny Zero episode from GoalIQ's real tips, combos and results.

Usage: `/lenny-folge`

Lenny Zero is a fictional, photorealistic AI influencer (English, light German
accent). `lenny/lenny.py` decides the story from GoalIQ's real logs (read from a
checkout of `adrianatlagic-ux/football-prediction`); you write and produce it.
Concept: `lenny/KONZEPT.md`. Settings and IDs: `lenny/config.json`.

## 1. Ask the bot

```bash
python3 lenny/lenny.py next > /tmp/lenny-brief.json   # clones football-prediction if it is not next to this repo
cat /tmp/lenny-brief.json
```

If `type` is `none`: stop. Report the `reason` in one line. Spend nothing.

## 2. Write the script (10 seconds, about 22-26 spoken words, English)

**Every episode is about Lenny's life, not about betting.** The viewer must *see*
his life change from episode to episode. The bets are the engine in the
background: at most **one short line**, said in passing.

Build the scene from the brief's `life_stage` (`home`, `transport`, `outfit`,
`food`, `social`). Use these exact settings so the progression stays consistent.
`life_change`:
- `up`: the episode is about the upgrade itself (moving in, first ride, new crowd).
- `down`: the episode is about losing it (moving out, selling the car, friends gone quiet).
- `same`: an everyday moment in his current life that shows its texture.

The one side line per `type`:

| type | Side line |
|---|---|
| `pilot` | None. Rock bottom, 3.12 EUR, no plan, wants a way out. |
| `discovery` | His mate keeps being right with the GoalIQ app; Lenny sold his console for a stake. |
| `preview` | He is in on `matchday.label` with a single and a 2-fold combo from GoalIQ (tips not known yet, never invent them). |
| `result` | The real outcome in a few words from `bets` (single and/or combo: won or lost, one detail such as a score or the odds). |
| `skip` | GoalIQ had no tip, so he sat it out. |
| `broke` | The money is gone; side hustle, scraped `refill_eur` together. |
| `lifestyle` | None, or a passing mention of the bankroll. |

Never invent a tip, odds, score or amount; use only the brief's facts.
Beats: **0-2 s hook** (an instantly surprising image or line from his life),
**2-8 s life scene**, **8-10 s cliffhanger**. Selfie-vlog, he talks to camera.

Hard rules:
- Never say or imply "guaranteed", "sure win", "easy money", "this is how you get rich".
- No bookmaker names, no odds links, no call to bet. GoalIQ is the app he follows.
- Real footballers only in the background (stadium, pitch, TV), never interacting with Lenny, never near betting or the app.
- Losses are shown honestly.

## 3. Voice (ElevenLabs)

- `character.elevenlabs_voice_id` from `lenny/config.json`. If it is null, stop and report that the voice must be designed and saved first.
- `creative_generate_speech` with that voice and the script; poll `creative_get_flow_run_status` until done; keep the audio URL.

## 4. Video (Higgsfield, one attempt)

- `balance` first; stop if credits < `video.max_credits`.
- `media_import_url` with the audio URL.
- `generate_video` with model `video.model` (seedance_2_0_mini), `duration` 10, `resolution` 720p,
  `aspect_ratio` 9:16, `folder_id` = `higgsfield.folder_id`, medias:
  `image_references` = `character.higgsfield_sheet_job_id`, `audio_references` = the imported audio,
  prompt = the scene (life stage settings, action, selfie-vlog framing, photorealistic).
- `estimate_video_cost` with exactly these params first; if above `video.max_credits`, stop and report.
- Generate once; wait with `jobs_wait`. Never retry automatically: report a failure, do not commit.

## 5. Deliver

- Write `lenny/episodes/<NNN>.json` (brief, script, audio URL, video job id, video URL, credits).
- Caption (English, 2-3 short lines: hook line, `#LennyZero` story line, `goaliq.de`, max 4 hashtags,
  last line `AI fiction · 18+ · not betting advice`).
- Prepend the episode to `lenny/FOLGEN.md`: `## Folge NNN – <type> – <date>`, the video link,
  the caption in a ```text block, so the user only has to download and copy.
- `python3 lenny/lenny.py commit /tmp/lenny-brief.json`
- `git add lenny && git commit -m "Lenny Folge NNN" && git push` to the current branch.
- Final message: episode number and type, video link, caption, credits left; remind to switch on
  Instagram's AI label when posting.
