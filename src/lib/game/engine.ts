// woork GAME - engine
//
// Deliberately has NO concept of: other players, ranking, comparison, streaks
// shown to others, or identity. A player's only opponent is the scenario.
// Progress is a plain object in localStorage. Nothing is sent anywhere.

import type {
    Beat,
    BeatOption,
    BeatResult,
    GameProgress,
    Gauges,
    LicenceStatus,
    Stage,
    StateCode,
    TrackId,
    TrackProgress,
} from "./types";
import { defaultDisclosure, exposureLevel } from "./identity";

export const STORAGE_KEY = "woork.game.progress.v1";

/* ------------------------------------------------------------------ *
 * Gauges
 * ------------------------------------------------------------------ */

export const PLAYER_GAUGES: (keyof Gauges)[] = [
    "rights",
    "standing",
    "readiness",
    "security",
    "privacy",
];

export const EMPLOYER_GAUGES: (keyof Gauges)[] = [
    "compliance",
    "safety",
    "reputation",
    "privacy",
];

export const GAUGE_META: Record<
    keyof Gauges,
    { label: string; icon: string; good: string; bad: string }
> = {
    rights: {
        label: "Rights",
        icon: "⚖️",
        good: "You know what you're owed and you say it out loud.",
        bad: "You're guessing, or letting things slide that you shouldn't.",
    },
    standing: {
        label: "Standing",
        icon: "🤝",
        good: "You look like someone worth taking a chance on.",
        bad: "Employers are seeing a risk, not a person.",
    },
    readiness: {
        label: "Readiness",
        icon: "🎒",
        good: "The actual paperwork and kit is done.",
        bad: "You'd be caught short on day one.",
    },
    security: {
        label: "Security",
        icon: "💵",
        good: "Money that should be yours is actually in your account.",
        bad: "You're working for less than you're owed.",
    },
    privacy: {
        label: "Privacy",
        icon: "🛡️",
        good: "Your identity is still yours. You decide who sees what, when.",
        bad: "Too much of you is out in the open, too early.",
    },
    compliance: {
        label: "Compliance",
        icon: "📋",
        good: "You are doing the lawful thing, and you can prove it.",
        bad: "You've got exposure - and it lands on you, not the teen.",
    },
    safety: {
        label: "Safety",
        icon: "🦺",
        good: "Your young workers would be physically safe here.",
        bad: "Someone is going to get hurt on your shift.",
    },
    reputation: {
        label: "Reputation",
        icon: "⭐",
        good: "Good young workers want to stay and tell their friends.",
        bad: "You'll churn staff and word gets around.",
    },
};

export const INITIAL_GAUGES: Gauges = {
    // Player starts with no particular advantage and full privacy.
    rights: 50,
    standing: 50,
    readiness: 40,
    security: 50,
    privacy: 100,
    // Employer starts honest-but-untested, and holds the candidate's privacy in trust.
    compliance: 50,
    safety: 50,
    reputation: 50,
};

/** Meter width for rendering, clamped. */
export function clampGauge(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
}

/** Apply a beat option's effects to the gauge set. */
export function applyEffects(gauges: Gauges, option: BeatOption): Gauges {
    const next: Gauges = { ...gauges };
    (Object.keys(option.effects) as (keyof Gauges)[]).forEach((key) => {
        const delta = option.effects[key];
        if (typeof delta === "number") {
            next[key] = clampGauge(next[key] + delta);
        }
    });
    return next;
}

/**
 * Starting gauges for a track. Privacy is shared, so it is carried across
 * when the player switches sides - being careless as a teen should follow
 * you when you sit in the employer's chair.
 */
export function initialGaugesFor(track: TrackId, carried?: Gauges): Gauges {
    const base = { ...INITIAL_GAUGES };
    if (carried) base.privacy = carried.privacy;
    if (track === "employer") {
        base.rights = 50;
        base.standing = 50;
        base.readiness = 40;
        base.security = 50;
    }
    return base;
}

/* ------------------------------------------------------------------ *
 * Score
 * ------------------------------------------------------------------ */

/** Max points a single beat can ever contribute. */
export const POINTS_PER_BEAT = 10;

/**
 * What one beat is worth at full marks.
 *
 * Audit beats ask the player to find every problem in a document, so they carry
 * several correct answers and are worth proportionally more than a single
 * decision.
 *
 * Briefing beats are read-only and carry no marks. So do Mirror beats: the
 * Mirror is scored by whether the player shortlisted themselves, which is
 * recorded separately in `progress.mirror` and weighted by `computeLicence`.
 * Counting those beats here would create marks that no player could ever earn.
 */
export function beatValue(beat: Beat): number {
    if (beat.kind === "brief" || beat.kind === "mirror") return 0;
    if (beat.kind === "audit") {
        const targets = beat.options.filter((o) => o.correct).length;
        return POINTS_PER_BEAT * Math.max(1, targets);
    }
    return POINTS_PER_BEAT;
}

/**
 * Scoring that rewards the DESTINATION, not the route.
 *  - right first time ............ full marks
 *  - right after getting it wrong . 60% of full marks (you learned something)
 *  - still unresolved ............ 20% (engaged, but not yet able to act)
 */
export function beatPoints(result: BeatResult | undefined, beat: Beat): number {
    if (!result) return 0;
    const value = beatValue(beat);
    if (result.correct) return result.attempts <= 1 ? value : Math.round(value * 0.6);
    return Math.round(value * 0.2);
}

export function trackScore(stages: Stage[], progress: TrackProgress): number {
    let score = 0;
    stages.forEach((stage) =>
        stage.beats.forEach((beat) => {
            score += beatPoints(progress.results[beat.id], beat);
        })
    );
    return score;
}

export function maxTrackScore(stages: Stage[]): number {
    return stages.reduce(
        (total, stage) => total + stage.beats.reduce((n, beat) => n + beatValue(beat), 0),
        0
    );
}

/* ------------------------------------------------------------------ *
 * Progress persistence
 * ------------------------------------------------------------------ */

export function emptyTrackProgress(): TrackProgress {
    return { startedAt: null, updatedAt: null, completedStages: [], results: {} };
}

export function emptyProgress(handle?: string): GameProgress {
    return {
        version: 1,
        jurisdiction: null,
        handle: handle ?? describeHandle(),
        disclosure: defaultDisclosure(),
        player: emptyTrackProgress(),
        employer: emptyTrackProgress(),
        mirror: null,
        licenceIssuedAt: null,
    };
}

/**
 * A random local label. Intentionally not derived from anything about the
 * player. It exists only so two siblings sharing a laptop can tell their own
 * save apart, and it stays on the device.
 */
export function describeHandle(): string {
    const adjectives = ["Quiet", "Steady", "Curious", "Early", "Level", "Bright", "Patient", "Sharp"];
    const nouns = ["Sparrow", "Kettle", "Lantern", "Compass", "Anchor", "Pilot", "Echo", "Pebble"];
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    const n = Math.floor(Math.random() * 900 + 100);
    return `${pick(adjectives)} ${pick(nouns)} ${n}`;
}

export function loadProgress(): GameProgress {
    if (typeof window === "undefined") return emptyProgress();
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyProgress();
        const parsed = JSON.parse(raw) as GameProgress;
        if (!parsed || parsed.version !== 1) return emptyProgress();
        // Defensive: never trust a shape that might predate a schema change.
        return {
            ...emptyProgress(),
            ...parsed,
            disclosure: { ...defaultDisclosure(), ...(parsed.disclosure ?? {}) },
            player: { ...emptyTrackProgress(), ...(parsed.player ?? {}) },
            employer: { ...emptyTrackProgress(), ...(parsed.employer ?? {}) },
        };
    } catch {
        return emptyProgress();
    }
}

export function saveProgress(progress: GameProgress): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
        /* storage full or blocked - the game still plays, it just won't resume */
    }
}

export function clearProgress(): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        /* nothing to do */
    }
}

/* ------------------------------------------------------------------ *
 * Recording an answer
 * ------------------------------------------------------------------ */

export interface RecordResult {
    progress: GameProgress;
    result: BeatResult;
    firstAnswer: boolean;
}

export function recordAnswer(
    progress: GameProgress,
    track: TrackId,
    beat: Beat,
    optionId: string
): RecordResult {
    const option = beat.options.find((o) => o.id === optionId);
    if (!option) return { progress, result: { beatId: beat.id, optionId, correct: false, attempts: 1, recovered: false }, firstAnswer: false };

    const current = progress[track];
    const previous = current.results[beat.id];
    const attempts = (previous?.attempts ?? 0) + 1;

    const result: BeatResult = {
        beatId: beat.id,
        optionId,
        correct: option.correct,
        attempts,
        // "Recovered" = you got there, but not first go. Worth surfacing kindly.
        recovered: option.correct && attempts > 1,
    };

    const nextTrack: TrackProgress = {
        startedAt: current.startedAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedStages: current.completedStages,
        results: { ...current.results, [beat.id]: result },
    };

    const next: GameProgress = { ...progress, [track]: nextTrack } as GameProgress;
    return { progress: next, result, firstAnswer: !previous };
}

export function markStageComplete(progress: GameProgress, track: TrackId, stageId: string): GameProgress {
    const current = progress[track];
    if (current.completedStages.includes(stageId)) return progress;
    return {
        ...progress,
        [track]: {
            ...current,
            startedAt: current.startedAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedStages: [...current.completedStages, stageId],
        },
    } as GameProgress;
}

export function nextIncompleteStage(
    stages: Stage[],
    track: TrackId,
    progress: GameProgress
): Stage | null {
    const trackProgress = progress[track];
    const ordered = stages.filter((s) => s.track === track).sort((a, b) => a.order - b.order);
    return ordered.find((s) => !trackProgress.completedStages.includes(s.id)) ?? null;
}

/* ------------------------------------------------------------------ *
 * Gauge derivation
 * ------------------------------------------------------------------ */

/**
 * Replay every answer the player has given to arrive at their current gauges.
 *
 * Gauges are DERIVED, never stored. That means erasing progress really erases
 * everything, and the meters can never disagree with the choices made.
 *
 * Privacy is special: it is one continuous life across both roles. Being
 * careless with your identity as a teen should still be true when you sit in
 * the employer's chair, so the player side is computed first and carried over.
 */
export function deriveGauges(
    stages: Stage[],
    progress: GameProgress | null
): { player: Gauges; employer: Gauges } {
    const player = { ...INITIAL_GAUGES };
    const employer = { ...INITIAL_GAUGES };

    if (!progress) return { player, employer };

    const apply = (target: Gauges, track: TrackId) => {
        stages
            .filter((s) => s.track === track)
            .forEach((stage) =>
                stage.beats.forEach((beat) => {
                    const result = progress[track].results[beat.id];
                    if (!result) return;
                    const option = beat.options.find((o) => o.id === result.optionId);
                    if (!option) return;
                    (Object.keys(option.effects) as (keyof Gauges)[]).forEach((key) => {
                        const delta = option.effects[key];
                        if (typeof delta === "number" && key !== "privacy") {
                            target[key] = clampGauge(target[key] + delta);
                        }
                    });
                })
            );
    };

    apply(player, "player");
    apply(employer, "employer");

    // Privacy is not a score the player accumulates - it is the literal state of
    // their Identity Shield. Scenarios teach about privacy through the decisions
    // they present; the shield is what actually measures how exposed they are.
    const exposure = exposureLevel(progress.disclosure ?? {});
    player.privacy = clampGauge(100 - exposure);
    employer.privacy = player.privacy;

    return { player, employer };
}

/** Just one side, for the stage runner's live meters. */
export function deriveTrackGauges(
    stages: Stage[],
    progress: GameProgress,
    track: TrackId
): Gauges {
    return deriveGauges(stages, progress)[track];
}

/* ------------------------------------------------------------------ *
 * Licence derivation - the "you're now qualified" gate
 * ------------------------------------------------------------------ */

/** Readiness needed to enter the real job market. */
export const QUALIFY_THRESHOLD = 70;

export function computeLicence(
    stages: Stage[],
    progress: GameProgress,
    gauges: { player: Gauges; employer: Gauges }
): LicenceStatus {
    const playerStages = stages.filter((s) => s.track === "player");
    const employerStages = stages.filter((s) => s.track === "employer");

    const playerDone = playerStages.filter((s) => progress.player.completedStages.includes(s.id)).length;
    const employerDone = employerStages.filter((s) => progress.employer.completedStages.includes(s.id)).length;

    const playerScore = trackScore(playerStages, progress.player);
    const employerScore = trackScore(employerStages, progress.employer);
    const playerMax = Math.max(1, maxTrackScore(playerStages));
    const employerMax = Math.max(1, maxTrackScore(employerStages));

    const allResults = [
        ...Object.values(progress.player.results),
        ...Object.values(progress.employer.results),
    ];

    const firstTryCorrect = allResults.filter((r) => r.correct && r.attempts <= 1).length;
    const recovered = allResults.filter((r) => r.recovered).length;

    // A trap is only "cleared" once the player has answered that beat correctly.
    // Being caught by a trap is normal; leaving it standing is what blocks you.
    let trapsAvoided = 0;
    let trapsFallenFor = 0;
    stages.forEach((stage) =>
        stage.beats.forEach((beat) => {
            const trapOptions = beat.options.filter((o) => o.trap);
            if (trapOptions.length === 0) return;
            const result = (stage.track === "player" ? progress.player : progress.employer).results[beat.id];
            const choseTrap = result ? trapOptions.some((t) => t.id === result.optionId) : false;
            if (!result) return;
            if (choseTrap && !result.correct) {
                trapsFallenFor += 1;
            } else {
                trapsAvoided += 1;
            }
        })
    );

    const mirrorDone = progress.mirror !== null;
    // Facing the Mirror is most of the credit. Shortlisting your own application
    // on the evidence is the rest of it - that is the actual test of whether you
    // understand what an employer reads.
    const mirrorCredit = mirrorDone ? (progress.mirror!.shortlistedSelf ? 1 : 0.7) : 0;

    // Weighted readiness. Knowledge (scores) 55%, judgement (gauges) 30%,
    // having actually finished both sides and faced yourself 15%.
    const knowledge =
        (playerScore / playerMax) * 0.5 + (employerScore / employerMax) * 0.5;
    const judgement =
        (gauges.player.rights + gauges.player.standing + gauges.player.readiness + gauges.player.security) /
        (4 * 100) *
        0.5 +
        (gauges.employer.compliance + gauges.employer.safety + gauges.employer.reputation) / (3 * 100) * 0.5;
    const completeness =
        (playerDone / Math.max(1, playerStages.length)) * 0.3 +
        (employerDone / Math.max(1, employerStages.length)) * 0.3 +
        mirrorCredit * 0.4;

    const informedPercent = Math.round(
        Math.max(0, Math.min(1, knowledge * 0.55 + judgement * 0.3 + completeness * 0.15)) * 100
    );

    const gaps: string[] = [];
    if (playerDone < playerStages.length) {
        gaps.push(
            `${playerStages.length - playerDone} stage${playerStages.length - playerDone === 1 ? "" : "s"} left as the worker`
        );
    }
    if (employerDone < employerStages.length) {
        gaps.push(
            `${employerStages.length - employerDone} stage${employerStages.length - employerDone === 1 ? "" : "s"} left as the employer`
        );
    }
    if (!mirrorDone) gaps.push("You haven't faced the Mirror yet - judging your own application");
    if (trapsFallenFor > 0) {
        gaps.push(
            `${trapsFallenFor} known trap${trapsFallenFor === 1 ? "" : "s"} still standing - go back and beat ${trapsFallenFor === 1 ? "it" : "them"}`
        );
    }
    if (informedPercent < QUALIFY_THRESHOLD) {
        gaps.push(`Readiness at ${informedPercent}% - needs ${QUALIFY_THRESHOLD}%`);
    }

    return {
        playerStagesDone: playerDone,
        playerStagesTotal: playerStages.length,
        employerStagesDone: employerDone,
        employerStagesTotal: employerStages.length,
        playerScore,
        employerScore,
        firstTryCorrect,
        recovered,
        trapsAvoided,
        trapsFallenFor,
        mirrorDone,
        informedPercent,
        qualified: gaps.length === 0,
        gaps,
    };
}
