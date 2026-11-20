"""Lenny Zero bot: the story only ever moves on GoalIQ's real tips, combos and results."""
import importlib.util
from datetime import datetime
from pathlib import Path

import pytest

_spec = importlib.util.spec_from_file_location("lenny", Path(__file__).resolve().parents[1] / "lenny.py")
lenny = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(lenny)

TZ = lenny.TZ
CONFIG = {"start_bankroll_eur": 50.0, "single_stake_fraction": 0.3, "combo_stake_fraction": 0.2,
          "combo_policies": ["ai_pick", "agree"], "combo_legs": 2, "min_stake_eur": 5.0,
          "comeback_refill_eur": 50.0, "preview_horizon_days": 4, "max_episodes_per_week": 3,
          "featured_clubs": ["Bayern Munich", "FC Bayern München"],
          "life_stages": [{"min_eur": 0, "name": "rock bottom"}, {"min_eur": 40, "name": "getting by"},
                          {"min_eur": 150, "name": "first upgrade"}]}
FIXTURES = [
    {"match_id": "a_b", "home_team": "Team A", "away_team": "Team B", "competition": "bl", "group": "Spieltag 10",
     "kickoff": datetime(2026, 11, 21, 15, 30, tzinfo=TZ)},
    {"match_id": "bay_c", "home_team": "Bayern Munich", "away_team": "Team C", "competition": "bl",
     "group": "Spieltag 10", "kickoff": datetime(2026, 11, 22, 17, 30, tzinfo=TZ)},
]
EARLY, BAYERN = "2026-11-21T14:30:00Z", "2026-11-22T16:30:00Z"
AFTER = datetime(2026, 11, 23, 10, 0, tzinfo=TZ)


def _tip(home, away, kickoff, status="ok", result=(2, 1), market="1X2", outcome="home_win", team=None, odds=1.8):
    e = {"home_team": home, "away_team": away, "commence_time": kickoff,
         "bet_tip": {"status": status, "tip": {"market": market, "outcome": outcome, "team": team or home,
                                                "best_odds": odds} if status == "ok" else None}}
    if result:
        e["result"] = {"home_score": result[0], "away_score": result[1]}
    return e


def _combo(policy="ai_pick", legs=None, logged="2026-11-21T13:30:00Z"):
    legs = legs or [
        {"market": "1X2", "outcome": "home_win", "team": "Team A", "best_odds": 1.5, "home_team": "Team A",
         "away_team": "Team B", "commence_time": EARLY},
        {"market": "Over/Under 2.5", "outcome": "Over", "team": None, "best_odds": 2.0,
         "home_team": "FC Bayern München", "away_team": "Team C", "commence_time": BAYERN},
    ]
    return {"policy": policy, "leg_count": len(legs), "first_kickoff": EARLY, "logged_at": logged, "legs": legs}


def _opened(**changes):
    state = lenny.fresh_state()
    for _ in range(2):
        state = lenny.commit(state, lenny.next_brief(state, CONFIG, ([], [], []), datetime(2026, 11, 1, tzinfo=TZ)))
    return state | changes


def _after_preview(**changes):
    state = _opened(**changes)
    preview = lenny.next_brief(state, CONFIG, (FIXTURES, [], []), datetime(2026, 11, 20, 9, 0, tzinfo=TZ))
    return lenny.commit(state, preview), preview


def test_story_opens_at_rock_bottom_then_finds_the_app():
    state = lenny.fresh_state()
    pilot = lenny.next_brief(state, CONFIG, ([], [], []), AFTER)
    assert pilot["type"] == "pilot" and pilot["life_stage"]["name"] == "rock bottom"
    discovery = lenny.next_brief(lenny.commit(state, pilot), CONFIG, ([], [], []), AFTER)
    assert discovery["type"] == "discovery" and discovery["bankroll_after_eur"] == 50.0
    assert discovery["life_change"] == "up"


def test_preview_splits_the_stake_into_single_and_combo_without_naming_tips():
    state, preview = _after_preview()
    assert preview["type"] == "preview" and preview["matchday"]["label"] == "Bundesliga Spieltag 10"
    assert preview["matchday"]["single_stake_eur"] == 15.0 and preview["matchday"]["combo_stake_eur"] == 10.0
    assert preview["big_games"][0]["home_team"] == "Bayern Munich"
    assert state["open_bet"]["id"] == preview["matchday"]["id"]


def test_nothing_happens_while_the_matchday_runs():
    state, _ = _after_preview()
    assert lenny.next_brief(state, CONFIG, (FIXTURES, [], []), datetime(2026, 11, 22, 12, tzinfo=TZ))["type"] == "none"


def test_single_and_combo_both_win_at_the_real_odds():
    state, _ = _after_preview()
    tips = [_tip("Team A", "Team B", EARLY, result=(1, 0)),
            _tip("FC Bayern München", "Team C", BAYERN, result=(3, 1))]
    brief = lenny.next_brief(state, CONFIG, (FIXTURES, tips, [_combo()]), AFTER)
    single, combo = brief["bets"]
    assert single["match"] == "FC Bayern München - Team C" and single["profit_eur"] == 12.0   # 15 x 0.8
    assert combo["odds"] == 3.0 and combo["profit_eur"] == 20.0                               # 10 x 2.0
    assert brief["profit_eur"] == 32.0 and brief["bankroll_after_eur"] == 82.0
    assert lenny.commit(state, brief)["open_bet"] is None


def test_combo_loses_when_one_leg_fails_while_the_single_wins():
    state, _ = _after_preview()
    tips = [_tip("Team A", "Team B", EARLY, result=(0, 0)),
            _tip("FC Bayern München", "Team C", BAYERN, result=(3, 1))]
    brief = lenny.next_brief(state, CONFIG, (FIXTURES, tips, [_combo()]), AFTER)
    assert [b["outcome"] for b in brief["bets"]] == ["win", "loss"]
    assert brief["profit_eur"] == 2.0 and brief["outcome"] == "win"


def test_the_shown_rule_comes_first_and_its_last_version_counts():
    old = _combo(policy="agree")
    newer = _combo(logged="2026-11-21T14:00:00Z")
    newer["legs"][1]["best_odds"] = 2.5
    picked = lenny.lennys_combo({"start": "2026-11-21T15:30:00+01:00", "end": "2026-11-22T17:30:00+01:00"},
                                [old, _combo(), newer], CONFIG)
    assert picked["policy"] == "ai_pick" and picked["legs"][1]["best_odds"] == 2.5


def test_without_a_featured_tip_the_first_published_tip_counts_even_if_it_lost():
    state, _ = _after_preview()
    tips = [_tip("Team A", "Team B", EARLY, result=(0, 3)),
            _tip("FC Bayern München", "Team C", BAYERN, status="no_agreement")]
    brief = lenny.next_brief(state, CONFIG, (FIXTURES, tips, []), AFTER)
    assert brief["bets"][0]["match"] == "Team A - Team B" and brief["bankroll_after_eur"] == 35.0


def test_unsettled_bets_wait_for_the_log_sync_then_close_as_skip():
    state, _ = _after_preview()
    tips = [_tip("Team A", "Team B", EARLY, status="ai_unsure")]
    assert lenny.next_brief(state, CONFIG, (FIXTURES, tips, []), AFTER)["type"] == "none"
    later = lenny.next_brief(state, CONFIG, (FIXTURES, tips, []), datetime(2026, 11, 26, 10, tzinfo=TZ))
    assert later["type"] == "skip" and later["bankroll_after_eur"] == 50.0


def test_life_stage_goes_up_at_once_but_down_only_with_a_buffer():
    assert lenny.life_level(160, 1, CONFIG) == 2
    assert lenny.life_level(100, 2, CONFIG) == 2       # above 60 % of 150
    assert lenny.life_level(80, 2, CONFIG) == 1


def test_broke_lenny_gets_a_comeback_episode():
    state = _opened(bankroll_eur=3.12)
    brief = lenny.next_brief(state, CONFIG, (FIXTURES, [], []), datetime(2026, 11, 20, 9, tzinfo=TZ))
    assert brief["type"] == "broke" and brief["bankroll_after_eur"] == 53.12


def test_weekly_cap_and_one_life_episode_per_week():
    now = datetime(2026, 12, 20, 9, tzinfo=TZ)
    state = _opened()
    state["episodes"] = [{"episode": i, "type": "preview", "created_at": now.isoformat()} for i in range(3)]
    assert lenny.next_brief(state, CONFIG, (FIXTURES, [], []), now)["type"] == "none"
    state = _opened()
    first = lenny.next_brief(state, CONFIG, (FIXTURES, [], []), now)
    assert first["type"] == "lifestyle"
    assert lenny.next_brief(lenny.commit(state, first), CONFIG, (FIXTURES, [], []), now)["type"] == "none"


def test_commit_refuses_out_of_order_or_empty_briefs():
    with pytest.raises(SystemExit):
        lenny.commit(lenny.fresh_state(), {"episode": 5, "type": "lifestyle"})
    with pytest.raises(SystemExit):
        lenny.commit(lenny.fresh_state(), {"episode": 1, "type": "none"})


@pytest.mark.parametrize("market,outcome,team,text", [
    ("Handicap +0.5", "handicap", "Köln", "Köln not to lose"),
    ("Handicap +1.5", "handicap", "Union", "Union not to lose by 2 or more"),
    ("Handicap -1.5", "handicap", "Arsenal", "Arsenal to win by 2 or more"),
    ("Over/Under 2.5", "Over", None, "over 2.5 goals"),
    ("BTTS", "Yes", None, "both teams to score"),
])
def test_tips_read_as_plain_english(market, outcome, team, text):
    assert lenny.describe_tip({"market": market, "outcome": outcome, "team": team}) == text


@pytest.mark.parametrize("market,outcome,team,score,expected", [
    ("1X2", "home_win", "A", (2, 1), "win"), ("1X2", "draw", None, (1, 1), "win"),
    ("Handicap +0.5", "handicap", "B", (1, 1), "win"), ("Handicap 0.0", "handicap", "A", (0, 0), "push"),
    ("Handicap -1.5", "handicap", "A", (2, 1), "loss"), ("Over/Under 2.5", "Under", None, (1, 1), "win"),
    ("BTTS", "Yes", None, (1, 0), "loss"),
])
def test_grading_matches_goaliqs_rules(market, outcome, team, score, expected):
    assert lenny.grade({"market": market, "outcome": outcome, "team": team}, "A", "B", *score) == expected
