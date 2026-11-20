"""Lenny Zero bot: decides the next episode from GoalIQ's real tips and results.

    python3 lenny/lenny.py next               # print the brief for the next episode
    python3 lenny/lenny.py commit BRIEF.json  # record an episode once it was produced
    python3 lenny/lenny.py status             # bankroll, life stage, open bets

Lenny follows GoalIQ with fixed rules. On every matchday he places
- a single: GoalIQ's first published tip of the matchday (a game with one of his
  featured clubs first), 30 % of his bankroll, and
- a 2-fold combo: GoalIQ's first logged 2-leg combo ticket of the matchday
  (the rule the site shows first), 20 % of his bankroll.
Before the matchday he only announces that he is in (the tips are published in
the app shortly before kickoff). Afterwards the real results decide. The money
is fictional; tips, odds and results are GoalIQ's real logs. No rule ever looks
at a result, so nothing is cherry-picked.

Every episode is about Lenny's life: the bankroll sets his life stage (home,
transport, outfit, food, friends), the bets only run alongside.

The GoalIQ data is read from a checkout of the football-prediction repository
(`goaliq_repo` in config.json, or --goaliq / $GOALIQ_REPO). `next` never changes
anything; only `commit` writes state.json, so a failed production does not move
the story on.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import unicodedata
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
TZ = ZoneInfo("Europe/Berlin")
CONFIG = HERE / "config.json"
STATE = HERE / "state.json"
COMPETITION_FILES = {"bl": "bundesliga", "cl": "champions-league", "nl": "nations-league"}
COMPETITION_NAMES = {"bl": "Bundesliga", "cl": "Champions League", "nl": "Nations League"}
PUBLISHED = {"ok"}              # tip statuses where GoalIQ published a bet
STALE_DAYS = 3                  # a matchday still unsettled this long after its last kickoff is closed
DOWN_BUFFER = 0.6               # lose a life stage only below 60 % of its threshold


# ---------------------------------------------------------------- GoalIQ data

def norm(name: str) -> str:
    """A team name reduced to letters, accents folded (same rule as GoalIQ's src/log_store.norm)."""
    n = name.lower().replace("ø", "o").replace("ł", "l").replace("đ", "d").replace("ß", "ss")
    n = unicodedata.normalize("NFKD", n)
    n = re.sub(r"\band\b", " ", n).replace("&", " ")
    n = re.sub(r"[^a-z]", "", n)
    return {"usa": "unitedstates"}.get(n, n)


def _margin(team, home, away, hs, as_):
    if norm(team) == norm(home):
        return hs - as_
    if norm(team) == norm(away):
        return as_ - hs
    return None


def grade(bet: dict, home: str, away: str, hs: int, as_: int) -> str | None:
    """'win' | 'loss' | 'push' | None, same rules as GoalIQ's scripts/grade_bets.grade."""
    market, outcome, team = bet["market"], bet["outcome"], bet.get("team")
    total = hs + as_
    if market == "1X2":
        if outcome == "draw":
            return "win" if hs == as_ else "loss"
        m = _margin(team, home, away, hs, as_)
        return None if m is None else ("win" if m > 0 else "loss")
    if market.startswith("Over/Under"):
        line = float(market.split()[-1])
        return ("win" if total > line else "loss") if outcome == "Over" else ("win" if total < line else "loss")
    if market == "BTTS":
        return "win" if (hs > 0 and as_ > 0) == (outcome.lower() == "yes") else "loss"
    if market.startswith("Handicap"):
        m = _margin(team, home, away, hs, as_)
        if m is None:
            return None
        adj = m + float(market.split()[-1])
        return "push" if adj == 0 else ("win" if adj > 0 else "loss")
    return None


def goaliq_root(config: dict, override: str | None = None) -> Path:
    """The football-prediction checkout; cloned shallowly next to this folder if it is missing."""
    path = Path(override or os.environ.get("GOALIQ_REPO") or (HERE / config.get("goaliq_repo", "../../football-prediction")))
    path = path.resolve()
    if (path / "data" / "logs").is_dir():
        return path
    fallback = HERE / ".goaliq"
    if not (fallback / "data" / "logs").is_dir():
        subprocess.run(["git", "clone", "--depth", "1", config["goaliq_repo_url"], str(fallback)], check=True)
    return fallback


def _read_jsonl(path: Path) -> list[dict]:
    try:
        return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    except OSError:
        return []


def load_goaliq(root: Path, competitions) -> tuple[list, list, list]:
    fixtures, tips, combos = [], [], []
    for key in competitions:
        for f in _load_json(root / "data" / "fixtures" / f"{key}.json", []) or []:
            kickoff = datetime.fromisoformat(f"{f['date']}T{f.get('time') or '15:30'}").replace(tzinfo=TZ)
            fixtures.append({**f, "competition": key, "kickoff": kickoff})
        tips += _read_jsonl(root / "data" / "logs" / "tips" / f"{COMPETITION_FILES[key]}.jsonl")
        combos += _read_jsonl(root / "data" / "logs" / "combos" / f"{COMPETITION_FILES[key]}.jsonl")
    return fixtures, tips, combos


def _load_json(path: Path, default=None):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return default


def _utc(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


# ---------------------------------------------------------------- tips in words

def describe_tip(tip: dict) -> str:
    market, outcome, team = tip["market"], tip["outcome"], tip.get("team")
    if market == "1X2":
        return "a draw" if outcome == "draw" else f"{team} to win"
    if market.startswith("Over/Under"):
        return f"{'over' if outcome == 'Over' else 'under'} {market.split()[-1]} goals"
    if market == "BTTS":
        return "both teams to score" if outcome.lower() == "yes" else "not both teams to score"
    if market == "Handicap +0.5":
        return f"{team} not to lose"
    if market == "Handicap 0.0":
        return f"{team} to win (stake back on a draw)"
    if market.startswith("Handicap"):
        point = float(market.split()[-1])
        if point < 0:
            return f"{team} to win by {int(-point + 0.5)} or more"
        return f"{team} not to lose by {int(point + 0.5)} or more"
    return f"{market} {outcome} {team or ''}".strip()


# ---------------------------------------------------------------- bets

def matchdays(fixtures: list[dict]) -> list[dict]:
    """Fixtures grouped into matchdays (competition + round), each with its kickoff window."""
    groups = {}
    for f in fixtures:
        groups.setdefault((f["competition"], f.get("group") or f["kickoff"].date().isoformat()), []).append(f)
    out = []
    for (comp, group), games in groups.items():
        games.sort(key=lambda g: g["kickoff"])
        out.append({"id": f"{comp}:{group}:{games[0]['kickoff'].date().isoformat()}", "competition": comp,
                    "group": group, "start": games[0]["kickoff"], "end": games[-1]["kickoff"], "games": games})
    return sorted(out, key=lambda m: m["start"])


def _window(bet: dict) -> tuple[datetime, datetime]:
    return (datetime.fromisoformat(bet["start"]) - timedelta(hours=3),
            datetime.fromisoformat(bet["end"]) + timedelta(hours=3))


def lennys_single(bet: dict, tips: list[dict], featured: set) -> dict | None:
    """GoalIQ's first published tip of the matchday, a featured club's game first."""
    start, end = _window(bet)
    published = [e for e in tips if start <= _utc(e["commence_time"]) <= end
                 and (e.get("bet_tip") or {}).get("status") in PUBLISHED and (e.get("bet_tip") or {}).get("tip")]
    if not published:
        return None
    rank = lambda e: (-min(1, (norm(e["home_team"]) in featured) + (norm(e["away_team"]) in featured)),
                      _utc(e["commence_time"]))
    return sorted(published, key=rank)[0]


def lennys_combo(bet: dict, combos: list[dict], config: dict) -> dict | None:
    """GoalIQ's first 2-fold ticket of the matchday: earliest first kickoff, its last version
    (the one still placeable at kickoff), policies in the configured order."""
    start, end = _window(bet)
    legs = config.get("combo_legs", 2)
    for policy in config.get("combo_policies", ["ai_pick"]):
        tickets = [t for t in combos if t.get("policy") == policy and t.get("leg_count") == legs
                   and t.get("first_kickoff") and start <= _utc(t["first_kickoff"]) <= end]
        if tickets:
            first = min(_utc(t["first_kickoff"]) for t in tickets)
            versions = [t for t in tickets if _utc(t["first_kickoff"]) == first]
            return max(versions, key=lambda t: t.get("logged_at", ""))
    return None


def _result_for(home: str, away: str, kickoff: str, tips: list[dict]) -> dict | None:
    when = _utc(kickoff)
    for e in tips:
        if norm(e["home_team"]) == norm(home) and norm(e["away_team"]) == norm(away) \
                and abs(_utc(e["commence_time"]) - when) < timedelta(hours=12) and e.get("result"):
            return e["result"]
    return None


def settle_single(entry: dict, stake: float) -> dict | None:
    if not entry.get("result"):
        return None
    tip, r = entry["bet_tip"]["tip"], entry["result"]
    outcome = grade(tip, entry["home_team"], entry["away_team"], r["home_score"], r["away_score"])
    if outcome is None:
        return None
    odds = float(tip["best_odds"])
    profit = {"win": stake * (odds - 1), "loss": -stake, "push": 0.0}[outcome]
    return {"kind": "single", "match": f"{entry['home_team']} - {entry['away_team']}",
            "tip_text": describe_tip(tip), "score": f"{r['home_score']}-{r['away_score']}", "odds": odds,
            "stake_eur": stake, "outcome": outcome, "profit_eur": round(profit, 2)}


def settle_combo(ticket: dict, tips: list[dict], stake: float) -> dict | None:
    legs, outcomes = [], []
    for leg in ticket["legs"]:
        r = _result_for(leg["home_team"], leg["away_team"], leg["commence_time"], tips)
        o = None if r is None else grade(leg, leg["home_team"], leg["away_team"], r["home_score"], r["away_score"])
        outcomes.append(o)
        legs.append({"match": f"{leg['home_team']} - {leg['away_team']}", "tip_text": describe_tip(leg),
                     "odds": leg.get("best_odds"), "score": None if r is None else f"{r['home_score']}-{r['away_score']}",
                     "outcome": o})
    if "loss" in outcomes:
        outcome = "loss"
    elif all(o in ("win", "push") for o in outcomes):
        outcome = "win"
    else:
        return None
    odds = 1.0
    for leg, o in zip(ticket["legs"], outcomes):
        odds *= 1.0 if o == "push" else float(leg["best_odds"])
    odds = round(odds, 2)
    profit = stake * (odds - 1) if outcome == "win" else -stake
    return {"kind": "combo", "legs": legs, "odds": odds, "stake_eur": stake, "outcome": outcome,
            "profit_eur": round(profit, 2)}


# ---------------------------------------------------------------- story

def mood(results: list[dict]) -> str:
    last = [r["outcome"] for r in results[-3:]]
    if not last:
        return "hungry"
    if last[-1] == "loss" and last.count("loss") >= 2:
        return "rock_bottom"
    if last[-1] == "loss":
        return "shaken"
    if last.count("win") == 3:
        return "on_fire"
    return "rising" if last[-1] == "win" else "steady"


def _stages(config: dict) -> list[dict]:
    return sorted(config.get("life_stages", []), key=lambda s: s["min_eur"])


def life_level(bankroll: float, level: int | None, config: dict) -> int | None:
    """Up as soon as he can afford the next stage, down only once clearly below the current one."""
    stages = _stages(config)
    if not stages:
        return None
    affordable = max(i for i, s in enumerate(stages) if bankroll >= s["min_eur"])
    if level is None or affordable >= level:
        return affordable
    while level > 0 and bankroll < stages[level]["min_eur"] * DOWN_BUFFER:
        level -= 1
    return level


def life_stage(level: int | None, config: dict) -> dict:
    return {"name": "unknown"} if level is None else {**_stages(config)[level], "level": level}


def fresh_state() -> dict:
    return {"episode": 0, "bankroll_eur": 3.12, "life_level": None, "open_bet": None, "results": [],
            "episodes": []}


def next_brief(state: dict, config: dict, data: tuple, now: datetime) -> dict:
    """The next episode. Every episode is about Lenny's life; the bets only run alongside."""
    brief = _decide(state, config, data, now)
    if brief["type"] == "none":
        return brief
    before = state.get("life_level")
    if before is None:
        before = life_level(brief["bankroll_before_eur"], None, config)
    after = life_level(brief["bankroll_after_eur"], before, config)
    change = "same" if before == after or None in (before, after) else ("up" if after > before else "down")
    return {**brief, "life_stage_before": life_stage(before, config), "life_stage": life_stage(after, config),
            "life_change": change}


def _decide(state: dict, config: dict, data: tuple, now: datetime) -> dict:
    fixtures, tips, combos = data
    bankroll = round(state["bankroll_eur"], 2)
    base = {"episode": state["episode"] + 1, "created_at": now.isoformat(), "bankroll_before_eur": bankroll,
            "mood": mood(state["results"]), "character": config.get("character", {})}
    featured = {norm(c) for c in config.get("featured_clubs", [])}
    min_stake = config.get("min_stake_eur", 5.0)

    if state["episode"] == 0:
        return {**base, "type": "pilot", "bankroll_after_eur": bankroll,
                "note": "rock bottom: bare flat, 3.12 EUR in the account, no plan. No app, no betting yet."}
    if state["episode"] == 1:
        return {**base, "type": "discovery", "bankroll_after_eur": config.get("start_bankroll_eur", 50.0),
                "note": "his mate is right again and again with the GoalIQ app; Lenny sells his console for a "
                        "starting stake and will follow GoalIQ from the next matchday"}

    cap = config.get("max_episodes_per_week")
    recent = [e for e in state["episodes"] if datetime.fromisoformat(e["created_at"]) > now - timedelta(days=7)]
    if cap and len(recent) >= cap:
        return {**base, "type": "none", "reason": f"{len(recent)} episodes in the last 7 days (cap {cap})"}

    bet = state.get("open_bet")
    if bet:
        end = datetime.fromisoformat(bet["end"])
        if now < end + timedelta(hours=2):
            return {**base, "type": "none", "reason": f"{bet['label']} still running (last kickoff {bet['end']})"}
        stale = now - end > timedelta(days=STALE_DAYS)
        single = lennys_single(bet, tips, featured)
        combo = lennys_combo(bet, combos, config)
        settled = []
        if single:
            s = settle_single(single, bet["single_stake_eur"])
            if s is None and not stale:
                return {**base, "type": "none", "reason": "single not settled in the logs yet"}
            settled += [s] if s else []
        if combo and bet.get("combo_stake_eur", 0) > 0:
            c = settle_combo(combo, tips, bet["combo_stake_eur"])
            if c is None and not stale:
                return {**base, "type": "none", "reason": "combo not settled in the logs yet"}
            settled += [c] if c else []
        if not settled:
            if not stale:
                return {**base, "type": "none", "reason": "no settled GoalIQ tip for this matchday yet"}
            return {**base, "type": "skip", "matchday": bet, "bets": [], "profit_eur": 0.0,
                    "bankroll_after_eur": bankroll, "note": "GoalIQ published no tip: Lenny kept his money"}
        profit = round(sum(b["profit_eur"] for b in settled), 2)
        outcome = "win" if profit > 0 else ("loss" if profit < 0 else "push")
        return {**base, "type": "result", "matchday": bet, "bets": settled, "profit_eur": profit,
                "outcome": outcome, "bankroll_after_eur": round(bankroll + profit, 2),
                "mood_after": mood(state["results"] + [{"outcome": outcome}])}

    if bankroll < min_stake:
        refill = config.get("comeback_refill_eur", 50.0)
        return {**base, "type": "broke", "bankroll_after_eur": round(bankroll + refill, 2), "refill_eur": refill,
                "note": "bankroll below the minimum stake: side hustle / comeback episode"}

    covered = {e["matchday"]["id"] for e in state["episodes"] if e.get("matchday")}
    horizon = now + timedelta(days=config.get("preview_horizon_days", 4))
    md = next((m for m in matchdays(fixtures) if now + timedelta(hours=2) <= m["start"] <= horizon
               and m["id"] not in covered), None)
    if md:
        single_stake = min(bankroll, round(max(min_stake, bankroll * config.get("single_stake_fraction", 0.3)), 2))
        combo_stake = min(bankroll - single_stake,
                          round(max(min_stake, bankroll * config.get("combo_stake_fraction", 0.2)), 2))
        if combo_stake < min_stake:
            combo_stake = 0.0
        stars = [g for g in md["games"] if norm(g["home_team"]) in featured or norm(g["away_team"]) in featured]
        label = f"{COMPETITION_NAMES.get(md['competition'], md['competition'])} {md['group']}"
        return {**base, "type": "preview", "bankroll_after_eur": bankroll,
                "matchday": {"id": md["id"], "label": label, "start": md["start"].isoformat(),
                             "end": md["end"].isoformat(), "single_stake_eur": single_stake,
                             "combo_stake_eur": combo_stake},
                "big_games": [{"home_team": g["home_team"], "away_team": g["away_team"],
                               "kickoff": g["kickoff"].isoformat()} for g in (stars or md["games"])[:4]],
                "note": "Lenny is in with a single and a 2-fold combo on GoalIQ's tips. The tips appear in the "
                        "app shortly before kickoff: do not name or invent them."}

    if any(e["type"] == "lifestyle" for e in recent):
        return {**base, "type": "none", "reason": "no matchday ahead and already one life episode this week"}
    return {**base, "type": "lifestyle", "bankroll_after_eur": bankroll,
            "note": "no matchday ahead (e.g. international break): a life episode that fits the mood"}


def commit(state: dict, brief: dict) -> dict:
    if brief["type"] == "none":
        raise SystemExit("nothing to record: the brief says there is no episode to make")
    if brief["episode"] != state["episode"] + 1:
        raise SystemExit(f"brief is for episode {brief['episode']}, state expects {state['episode'] + 1}")
    state = json.loads(json.dumps(state))
    kind = brief["type"]
    if kind == "preview":
        state["open_bet"] = brief["matchday"]
    elif kind in ("result", "skip"):
        state["open_bet"] = None
        if kind == "result":
            state["results"].append({"matchday": brief["matchday"]["id"], "outcome": brief["outcome"],
                                     "profit_eur": brief["profit_eur"]})
    state["bankroll_eur"] = brief["bankroll_after_eur"]
    state["episode"] = brief["episode"]
    state["life_level"] = brief.get("life_stage", {}).get("level", state.get("life_level"))
    state["episodes"].append({k: brief[k] for k in ("episode", "type", "created_at", "bankroll_after_eur",
                                                    "matchday") if k in brief})
    return state


# ---------------------------------------------------------------- cli

def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--goaliq", help="path to the football-prediction checkout")
    sub = p.add_subparsers(dest="cmd", required=True)
    n = sub.add_parser("next")
    n.add_argument("--now", help="ISO time to plan from (default: now)")
    c = sub.add_parser("commit")
    c.add_argument("brief")
    sub.add_parser("status")
    args = p.parse_args(argv)

    config = _load_json(CONFIG, {})
    state = _load_json(STATE) or fresh_state()
    if args.cmd == "status":
        print(json.dumps({"episode": state["episode"], "bankroll_eur": state["bankroll_eur"],
                          "life_stage": life_stage(state.get("life_level"), config).get("name"),
                          "open_bet": state["open_bet"]}, indent=2, ensure_ascii=False))
    elif args.cmd == "next":
        now = datetime.fromisoformat(args.now) if args.now else datetime.now(timezone.utc)
        now = now if now.tzinfo else now.replace(tzinfo=TZ)
        data = load_goaliq(goaliq_root(config, args.goaliq), config.get("competitions", ["bl", "cl"]))
        print(json.dumps(next_brief(state, config, data, now), indent=2, ensure_ascii=False))
    elif args.cmd == "commit":
        brief = json.loads(Path(args.brief).read_text(encoding="utf-8"))
        STATE.write_text(json.dumps(commit(state, brief), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"episode {brief['episode']} recorded, bankroll {brief['bankroll_after_eur']} EUR")


if __name__ == "__main__":
    main()
