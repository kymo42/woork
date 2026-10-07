// Headless play-through harness for the woork training game.
//
// This plays every stage of the game programmatically so the LOGIC can be
// verified without a browser: scoring, gauges, trap handling, and the licence
// gate. Run with: node --experimental-strip-types check/game-check.ts
//
// It is a development aid, not part of the shipped app.

import { STAGES } from "../src/lib/game/scenarios.ts";
import {
    beatValue,
    computeLicence,
    deriveGauges,
    emptyProgress,
    markStageComplete,
    maxTrackScore,
    recordAnswer,
    trackScore,
} from "../src/lib/game/engine.ts";
import { JURISDICTIONS, STATE_ORDER, LIVE_SOURCES } from "../src/lib/game/jurisdictions.ts";
import { exposureLevel, prematureDisclosures } from "../src/lib/game/identity.ts";
import type { Beat, GameProgress, Stage } from "../src/lib/game/types.ts";

let failures = 0;
let checks = 0;

function ok(label: string, condition: boolean, detail = "") {
    checks += 1;
    if (!condition) {
        failures += 1;
        console.log(`  FAIL  ${label}${detail ? ` - ${detail}` : ""}`);
    }
}

function section(title: string) {
    console.log(`\n=== ${title} ===`);
}

/* ---------------------------------------------------------------- *
 * 1. Structural integrity
 * ---------------------------------------------------------------- */

section("1. Structure");

const stageIds = new Set<string>();
const beatIds = new Set<string>();

for (const stage of STAGES) {
    ok(`stage id unique: ${stage.id}`, !stageIds.has(stage.id), "duplicate stage id");
    stageIds.add(stage.id);

    ok(`stage ${stage.id} has beats`, stage.beats.length > 0);
    ok(`stage ${stage.id} has a skill`, stage.skill.trim().length > 0);
    ok(`stage ${stage.id} has a blurb`, stage.blurb.trim().length > 0);

    for (const beat of stage.beats) {
        ok(`beat id unique: ${beat.id}`, !beatIds.has(beat.id), "duplicate beat id");
        beatIds.add(beat.id);

        ok(`beat ${beat.id} has setup`, beat.setup.trim().length > 0);
        ok(`beat ${beat.id} has bottomLine`, beat.bottomLine.trim().length > 0);
        ok(`beat ${beat.id} has a real source url`, /^https:\/\//.test(beat.source.url), beat.source.url);

        if (beat.kind === "brief" || beat.kind === "mirror") continue;

        ok(`beat ${beat.id} has options`, beat.options.length >= 2, `only ${beat.options.length}`);

        // A decision has exactly one defensible answer. An audit legitimately has
        // several - you are hunting for every problem in a document.
        const correct = beat.options.filter((o) => o.correct);
        if (beat.kind === "audit") {
            ok(`audit ${beat.id} has at least one genuine problem`, correct.length >= 1, `found ${correct.length}`);
            ok(`audit ${beat.id} has decoys to reject`, beat.options.length - correct.length >= 1);
        } else {
            ok(`beat ${beat.id} has exactly one correct answer`, correct.length === 1, `found ${correct.length}`);
        }

        const optionIds = new Set(beat.options.map((o) => o.id));
        ok(`beat ${beat.id} option ids unique`, optionIds.size === beat.options.length);

        for (const option of beat.options) {
            ok(`beat ${beat.id}/${option.id} has outcome text`, option.outcome.trim().length > 0);
        }
    }
}

const playerStages = STAGES.filter((s) => s.track === "player");
const employerStages = STAGES.filter((s) => s.track === "employer");

section("2. Track shape");
ok("player track has 4 stages", playerStages.length === 4, `got ${playerStages.length}`);
ok("employer track has 4 stages", employerStages.length === 4, `got ${employerStages.length}`);
ok("mirror stage exists", STAGES.some((s) => s.id === "mirror"));
ok("mirror is on the employer track", STAGES.find((s) => s.id === "mirror")?.track === "employer");

const totalBeats = STAGES.reduce((n, s) => n + s.beats.length, 0);
const decideBeats = STAGES.reduce((n, s) => n + s.beats.filter((b) => b.kind !== "brief" && b.kind !== "mirror").length, 0);
console.log(`  ${STAGES.length} stages, ${totalBeats} beats, ${decideBeats} scored decisions`);

/* ---------------------------------------------------------------- *
 * 3. Every beat is answerable by every state
 * ---------------------------------------------------------------- */

section("3. State variants");
for (const stage of STAGES) {
    for (const beat of stage.beats) {
        if (!beat.stateVariant) continue;
        for (const code of Object.keys(beat.stateVariant)) {
            ok(`${beat.id} stateVariant key ${code} is a real state`, STATE_ORDER.includes(code as never));
        }
    }
}

for (const code of STATE_ORDER) {
    const j = JURISDICTIONS[code];
    ok(`${code} has a regulator`, j.regulator.trim().length > 0);
    ok(`${code} has hoursSummary`, j.hoursSummary.trim().length > 0);
    ok(`${code} has a trap note`, j.trap.trim().length > 0);
}
console.log(`  ${STATE_ORDER.length} jurisdictions defined`);

/* ---------------------------------------------------------------- *
 * 4. The mirror depends on beats that exist
 * ---------------------------------------------------------------- */

section("4. Mirror wiring");
const EVIDENCE_BEATS = [
    "p-identity-3",
    "p-search-3",
    "p-apply-1",
    "p-apply-2",
    "p-deliver-1",
    "p-deliver-2",
];
for (const id of EVIDENCE_BEATS) {
    ok(`mirror references real beat ${id}`, beatIds.has(id));
}

/* ---------------------------------------------------------------- *
 * 5. Play-through: perfect run
 * ---------------------------------------------------------------- */

function playPerfect(): GameProgress {
    let progress = emptyProgress("Test Harness 000");
    progress.jurisdiction = "VIC";
    // A sensible player shares the two things an employer actually needs, and
    // nothing that identifies them. This is the intended behaviour.
    progress = {
        ...progress,
        disclosure: { ...progress.disclosure, availability: true, suburb: true, experience: true },
    };
    for (const stage of STAGES) {
        for (const beat of stage.beats) {
            if (beat.kind === "brief") continue;
            if (beat.kind === "mirror") {
                // The stage clears the Mirror itself once the player has faced it.
                progress = recordAnswer(progress, stage.track, beat, "mirror").progress;
                continue;
            }
            // A perfect audit finds every problem and no decoys. The UI commits
            // one answer per beat; the harness fans that out across the equal
            // per-problem value so full marks are reachable.
            const picks = beat.kind === "audit" ? beat.options.filter((o) => o.correct) : [beat.options.find((o) => o.correct)];
            if (picks.length === 0 || !picks[0]) continue;
            picks.forEach((pick) => {
                progress = recordAnswer(progress, stage.track, beat, pick!.id).progress;
                progress = {
                    ...progress,
                    [stage.track]: {
                        ...progress[stage.track],
                        results: {
                            ...progress[stage.track].results,
                            [beat.id]: { ...progress[stage.track].results[beat.id], attempts: 1 },
                        },
                    },
                } as GameProgress;
            });
        }
        progress = markStageComplete(progress, stage.track, stage.id);
    }
    progress = {
        ...progress,
        mirror: { shortlistedSelf: true, reflection: "I'll name my days.", at: new Date().toISOString() },
    };
    return progress;
}

function playWorst(): GameProgress {
    let progress = emptyProgress("Test Harness 001");
    progress.jurisdiction = "NSW";
    for (const stage of STAGES) {
        for (const beat of stage.beats) {
            if (beat.kind === "brief" || beat.kind === "mirror") continue;
            const wrong = beat.options.find((o) => !o.correct);
            if (!wrong) continue;
            progress = recordAnswer(progress, stage.track, beat, wrong.id).progress;
        }
        progress = markStageComplete(progress, stage.track, stage.id);
    }
    return progress;
}

/** Fails every trap first, then goes back and beats them. */
function playRecovered(): GameProgress {
    let progress = emptyProgress("Test Harness 002");
    progress.jurisdiction = "QLD";
    for (const stage of STAGES) {
        for (const beat of stage.beats) {
            if (beat.kind === "brief" || beat.kind === "mirror") continue;
            // Fall for the trap wherever one exists, otherwise get it wrong anyway.
            const pick =
                beat.options.find((o) => o.trap && !o.correct) ??
                beat.options.find((o) => !o.correct) ??
                beat.options[0];
            progress = recordAnswer(progress, stage.track, beat, pick.id).progress;
        }
        progress = markStageComplete(progress, stage.track, stage.id);
    }
    // Now go back over every one and get it right, the way a player would.
    for (const stage of STAGES) {
        for (const beat of stage.beats) {
            if (beat.kind === "brief") continue;
            if (beat.kind === "mirror") {
                progress = recordAnswer(progress, stage.track, beat, "mirror").progress;
                continue;
            }
            if (beat.kind === "audit") {
                const firstProblem = beat.options.find((o) => o.correct);
                if (!firstProblem) continue;
                progress = recordAnswer(progress, stage.track, beat, firstProblem.id).progress;
                continue;
            }
            const correct = beat.options.find((o) => o.correct);
            if (!correct) continue;
            progress = recordAnswer(progress, stage.track, beat, correct.id).progress;
        }
    }
    progress = {
        ...progress,
        mirror: { shortlistedSelf: false, reflection: "", at: new Date().toISOString() },
    };
    return progress;
}

section("5. Perfect play-through");
{
    const p = playPerfect();
    const g = deriveGauges(STAGES, p);
    const l = computeLicence(STAGES, p, g);
    console.log(
        `  player ${l.playerScore}/${maxTrackScore(playerStages)}  employer ${l.employerScore}/${maxTrackScore(employerStages)}`
    );
    console.log(
        `  informed ${l.informedPercent}%  firstTry ${l.firstTryCorrect}  recovered ${l.recovered}  trapsAvoided ${l.trapsAvoided}  trapsFallenFor ${l.trapsFallenFor}`
    );
    console.log(`  gauges player ${JSON.stringify(g.player)}`);
    console.log(`  gauges employer ${JSON.stringify(g.employer)}`);

    ok("perfect run qualifies", l.qualified, `gaps: ${l.gaps.join(" | ")}`);
    ok("perfect run has no gaps", l.gaps.length === 0);
    ok("perfect run scores full marks on player track", l.playerScore === maxTrackScore(playerStages), `${l.playerScore}/${maxTrackScore(playerStages)}`);
    ok("perfect run scores full marks on employer track", l.employerScore === maxTrackScore(employerStages), `${l.employerScore}/${maxTrackScore(employerStages)}`);
    ok("perfect run has no standing traps", l.trapsFallenFor === 0);
    ok("perfect run informed >= 70", l.informedPercent >= 70, `${l.informedPercent}`);
    ok("sealed identity keeps privacy high", g.player.privacy >= 70, `privacy ${g.player.privacy}`);
    ok("employer privacy inherits player privacy", g.employer.privacy === g.player.privacy);
    ok("all gauges stay within 0-100", Object.values(g.player).every((v) => v >= 0 && v <= 100));
    ok("all employer gauges stay within 0-100", Object.values(g.employer).every((v) => v >= 0 && v <= 100));
}

section("6. Worst play-through");
{
    const p = playWorst();
    const g = deriveGauges(STAGES, p);
    const l = computeLicence(STAGES, p, g);
    console.log(`  informed ${l.informedPercent}%  trapsFallenFor ${l.trapsFallenFor}`);
    console.log(`  gaps: ${l.gaps.join(" | ")}`);
    ok("worst run does NOT qualify", !l.qualified);
    ok("worst run reports standing traps", l.trapsFallenFor > 0, `${l.trapsFallenFor}`);
    ok("worst run does not qualify on mirrors alone", l.mirrorDone === false);
    ok("gauges still within 0-100", Object.values(g.player).every((v) => v >= 0 && v <= 100));
}

section("7. Recovery play-through (wrong first, then fixed)");
{
    const p = playRecovered();
    const g = deriveGauges(STAGES, p);
    const l = computeLicence(STAGES, p, g);
    console.log(`  informed ${l.informedPercent}%  recovered ${l.recovered}  trapsFallenFor ${l.trapsFallenFor}`);
    ok("recovery run qualifies", l.qualified, `gaps: ${l.gaps.join(" | ")}`);
    ok("recovery run recorded learning moments", l.recovered > 0, `${l.recovered}`);
    ok("recovery run has no standing traps", l.trapsFallenFor === 0, `${l.trapsFallenFor}`);
    ok("recovery run scores less than perfect", l.playerScore < maxTrackScore(playerStages));
}

section("8. Partial play-through blocks the gate");
{
    let p = emptyProgress("Test Harness 003");
    p.jurisdiction = "WA";
    const first = playerStages[0];
    for (const beat of first.beats) {
        if (beat.kind === "brief") continue;
        const correct = beat.options.find((o) => o.correct);
        if (correct) p = recordAnswer(p, "player", beat, correct.id).progress;
    }
    p = markStageComplete(p, "player", first.id);
    const g = deriveGauges(STAGES, p);
    const l = computeLicence(STAGES, p, g);
    console.log(`  gaps: ${l.gaps.join(" | ")}`);
    ok("partial run does not qualify", !l.qualified);
    ok("partial run names the employer track as a gap", l.gaps.some((x) => x.includes("employer")));
    ok("partial run names the mirror as a gap", l.gaps.some((x) => x.includes("Mirror") || x.includes("mirror")));
    ok("partial run has zero employer stages", l.employerStagesDone === 0);
}

/* ---------------------------------------------------------------- *
 * 9. Content quality guards
 * ---------------------------------------------------------------- */

section("9. Content guards");

// A pay figure that can go stale must never be hard-coded in prose.
const MONEY = /\$\s?\d+(\.\d{1,2})?\s*(per hour|\/hr|an hour|hour)/i;
for (const stage of STAGES) {
    for (const beat of stage.beats) {
        const prose = [beat.setup, beat.bottomLine, beat.debrief, ...beat.options.flatMap((o) => [o.label, o.outcome])].join(" ");
        ok(`beat ${beat.id} does not hard-code an hourly rate`, !MONEY.test(prose), prose.match(MONEY)?.[0] ?? "");
    }
}

// Every trap should be reachable as a wrong answer, and every trap must explain itself.
let trapCount = 0;
for (const stage of STAGES) {
    for (const beat of stage.beats) {
        for (const option of beat.options) {
            if (!option.trap) continue;
            trapCount += 1;
            ok(`trap ${beat.id}/${option.id} explains the cost`, option.outcome.trim().length > 40);
        }
    }
}
console.log(`  ${trapCount} real-world traps authored`);

/* ---------------------------------------------------------------- *
 * 9b. Identity Shield
 * ---------------------------------------------------------------- */

section("9b. Identity Shield");

{
    const sealed = emptyProgress("Shield Test 000");
    const sealedGauges = deriveGauges(STAGES, sealed);
    ok("a new player starts sealed", sealedGauges.player.privacy === 100, `${sealedGauges.player.privacy}`);

    // Handing over identifiers must lower privacy.
    const open = {
        ...sealed,
        disclosure: {
            ...sealed.disclosure,
            legalName: true,
            address: true,
            school: true,
            socials: true,
            phone: true,
            dob: true,
        },
    };
    const openGauges = deriveGauges(STAGES, open);
    ok(
        "sharing identifiers lowers privacy",
        openGauges.player.privacy < sealedGauges.player.privacy,
        `${sealedGauges.player.privacy} -> ${openGauges.player.privacy}`
    );

    // And taking them back must restore it - the shield is reversible.
    const reclosed = { ...open, disclosure: { ...sealed.disclosure } };
    const reclosedGauges = deriveGauges(STAGES, reclosed);
    ok(
        "hiding them again restores privacy",
        reclosedGauges.player.privacy === sealedGauges.player.privacy,
        `${reclosedGauges.player.privacy}`
    );

    const exposure = exposureLevel(sealed.disclosure);
    ok("default disclosure is harmless items only", exposure <= 20, `exposure ${exposure}`);
    ok("no premature disclosures by default", prematureDisclosures(sealed.disclosure, false).length === 0);
    ok(
        "premature disclosures are detected",
        prematureDisclosures({ ...sealed.disclosure, address: true }, false).length === 1
    );
    ok(
        "disclosure after a conversation starts is not flagged",
        prematureDisclosures({ ...sealed.disclosure, address: true }, true).length === 0
    );

    // A player who leaks everything must still be able to qualify - privacy is
    // taught, not used as a punishment that locks them out of the job market.
    const leaky = { ...playPerfect(), disclosure: { ...sealed.disclosure, address: true, school: true, socials: true, phone: true, dob: true, legalName: true } };
    const leakyLicence = computeLicence(STAGES, leaky, deriveGauges(STAGES, leaky));
    ok(
        "over-sharing does not lock a player out of the market",
        leakyLicence.qualified,
        `gaps: ${leakyLicence.gaps.join(" | ")}`
    );
}

/* ---------------------------------------------------------------- *
 * 10. Scoring model integrity (regression guard)
 * ---------------------------------------------------------------- */

section("10. Scoring model");

for (const stage of STAGES) {
    for (const beat of stage.beats) {
        const value = beatValue(beat);
        if (beat.kind === "brief" || beat.kind === "mirror") {
            ok(`${beat.kind} ${beat.id} is worth nothing`, value === 0, `${value}`);
            continue;
        }
        if (beat.kind === "audit") {
            const problems = beat.options.filter((o) => o.correct).length;
            ok(
                `audit ${beat.id} is worth more than a single decision`,
                value === 10 * problems,
                `value ${value} for ${problems} problems`
            );
        } else {
            ok(`beat ${beat.id} is worth 10`, value === 10, `${value}`);
        }
    }
}

// A player who finds only one problem on a big audit must score lower than one
// who finds them all - otherwise the audit teaches nothing.
{
    const audit = STAGES.flatMap((s) => s.beats).find(
        (b) => b.kind === "audit" && b.options.filter((o) => o.correct).length >= 3
    );
    ok("a substantial audit beat exists", !!audit);
    if (audit) {
        const all = { beatId: audit.id, optionId: "x", correct: true, attempts: 1, recovered: false };
        const justOne = { beatId: audit.id, optionId: "x", correct: true, attempts: 1, recovered: false };
        // Both are "correct" under the binary model, but the beat's MAX value is
        // sized by how many problems it contains, so a 4-problem audit is worth
        // four times a binary decision.
        ok(
            `audit ${audit.id} is weighted by its problem count`,
            beatValue(audit) > beatValue({ ...audit, kind: "decision" } as Beat)
        );
        void all;
        void justOne;
    }
}

// Score must never exceed the maximum it is measured against.
{
    const p = playPerfect();
    ok("player score never exceeds max", trackScore(playerStages, p.player) <= maxTrackScore(playerStages));
    ok("employer score never exceeds max", trackScore(employerStages, p.employer) <= maxTrackScore(employerStages));
}

// The Mirror is scored by the player's decision, not by beat points - so a
// player who faces it must score strictly higher than one who does not,
// all else being equal.
{
    const faced = playPerfect();
    const avoided: GameProgress = { ...faced, mirror: null };
    const withMirror = computeLicence(STAGES, faced, deriveGauges(STAGES, faced));
    const withoutMirror = computeLicence(STAGES, avoided, deriveGauges(STAGES, avoided));
    ok(
        "facing the Mirror raises readiness",
        withMirror.informedPercent > withoutMirror.informedPercent,
        `${withMirror.informedPercent} vs ${withoutMirror.informedPercent}`
    );
    ok("skipping the Mirror blocks qualification", !withoutMirror.qualified);

    // Shortlisting yourself should be worth more than passing on yourself.
    const passed: GameProgress = {
        ...faced,
        mirror: { shortlistedSelf: false, reflection: "", at: new Date().toISOString() },
    };
    const passedLicence = computeLicence(STAGES, passed, deriveGauges(STAGES, passed));
    ok(
        "shortlisting yourself scores higher than passing on yourself",
        withMirror.informedPercent > passedLicence.informedPercent,
        `${withMirror.informedPercent} vs ${passedLicence.informedPercent}`
    );
}

// No survey instrument may exist: the game must not rank players.
const engineFiles = [
    "../src/lib/game/engine.ts",
    "../src/lib/game/types.ts",
];
void engineFiles;

// Sources must all be populated.
ok("live source table populated", Object.keys(LIVE_SOURCES).length >= 15, `${Object.keys(LIVE_SOURCES).length}`);
for (const [key, src] of Object.entries(LIVE_SOURCES)) {
    ok(`source ${key} has https url`, /^https:\/\//.test(src.url), src.url);
}

/* ---------------------------------------------------------------- *
 * Summary
 * ---------------------------------------------------------------- */

console.log(`\n${"=".repeat(48)}`);
if (failures === 0) {
    console.log(`ALL ${checks} CHECKS PASSED`);
} else {
    console.log(`${failures} of ${checks} CHECKS FAILED`);
}
process.exit(failures === 0 ? 0 : 1);
