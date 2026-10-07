// woork GAME - type system
//
// Design rules baked into these types:
//  1. NO identity is ever stored. Progress is a local, anonymous record.
//  2. NO leaderboard / competition primitives exist. You compete against the
//     scenario, not against another person.
//  3. Every scenario must be able to cite a source, because a teen may act on it.

/* ------------------------------------------------------------------ *
 * Jurisdiction
 * ------------------------------------------------------------------ */

export type StateCode = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export interface Jurisdiction {
    code: StateCode;
    name: string;
    /** Regulator that handles child employment in this state. */
    regulator: string;
    /**
     * Minimum age a child may be employed, in years. `null` = no legislated
     * statewide minimum; the school-leaving / award rules govern instead.
     */
    minWorkingAge: number | null;
    /**
     * The nuance behind `minWorkingAge`. Australian states do not generally
     * set one clean age, so this carries the qualifier that makes the number
     * honest.
     */
    minWorkingAgeNote: string;
    /** Plain-language summary of the hours a school-aged worker may do. */
    hoursSummary: string;
    /** Anything a teen must obtain before starting (permit, certificate, etc.) */
    permitRequired: string;
    /** The gotcha that most often catches teens out in this state. */
    trap: string;
    /**
     * ISO month this jurisdiction's content was checked against sources.
     * `null` means the specifics could NOT be verified, so the game says so
     * rather than inventing a limit a teenager might act on.
     */
    lastVerified: string | null;
}

/* ------------------------------------------------------------------ *
 * Track + stage structure
 * ------------------------------------------------------------------ */

/**
 * PLAYER = you as the young worker / applicant.
 * EMPLOYER = you as the business owner doing the hiring.
 * The whole point of the game is that you must complete both.
 */
export type TrackId = "player" | "employer";

/** The five kinds of beat a stage can contain. */
export type BeatKind =
    | "brief"        // read-only framing: what this stage is really asking
    | "decision"     // single choice, immediate consequence
    | "audit"        // multi-select: find every problem in a document/ad
    | "triage"       // order/prioritise, or pick the MOST important action
    | "mirror";      // the employer judging the player's own record

export interface Stage {
    id: string;
    track: TrackId;
    /** 1-based order within the track. */
    order: number;
    title: string;
    /** Shown on the stage card - the real-world skill being built. */
    skill: string;
    /** One-line hook. */
    blurb: string;
    icon: string;
    beats: Beat[];
}

export interface Beat {
    id: string;
    kind: BeatKind;
    /** The situation, written as a scene. Second person. */
    setup: string;
    /**
     * Only for `brief` beats: the extra paragraphs of orientation to read
     * before the stage's decisions begin.
     */
    briefBody?: string[];
    /**
     * Only for `audit` beats: the exact instruction for what to hunt for.
     * e.g. "Tick every line on this payslip that is legally wrong."
     */
    auditPrompt?: string;
    /** Optional quoted artefact: the ad, the payslip, the message. */
    artefact?: Artefact;
    /**
     * A `brief` beat is read-only framing - it has no options and just orients
     * the player before the decisions start. Every other kind carries options.
     */
    options: BeatOption[];
    /** Shown after any answer, right or wrong, before the lesson deepens. */
    debrief: string;
    /** The legal / practical bottom line. */
    bottomLine: string;
    /** Where this comes from. Rendered as a citation chip. */
    source: Source;
    /** Which jurisdiction rules change this, if any. */
    stateVariant?: Partial<Record<StateCode, string>>;
}

export type Artefact =
    | { type: "job-ad"; business: string; title: string; body: string[]; pay: string; hours: string; contact: string }
    | { type: "payslip"; business: string; period: string; lines: PayslipLine[]; note?: string }
    | { type: "message"; from: string; channel: string; body: string[] }
    | { type: "roster"; business: string; rows: RosterRow[] }
    | { type: "application"; forRole: string; anonymousHandle: string; answerSummary: string[] }
    | { type: "document"; label: string; body: string[] };

export interface PayslipLine {
    label: string;
    value: string;
    problem?: string;
}

export interface RosterRow {
    name: string;
    age: number;
    day: string;
    shift: string;
    problem?: string;
}

export interface Source {
    /** Human label, e.g. "Fair Work Ombudsman". */
    label: string;
    /** Real, verified URL. Never invent one. */
    url: string;
    /** Optional clause/award name. */
    detail?: string;
}

/* ------------------------------------------------------------------ *
 * Options and consequences
 * ------------------------------------------------------------------ */

/** Which gauge an option moves. Kept small so the meters stay legible. */
export type Gauge =
    | "rights"       // player track: how well you know and hold your ground
    | "standing"     // player track: how employable you look
    | "readiness"    // player track: concrete job-ready artefacts
    | "security"     // player track: money actually banked, correctly
    | "privacy"      // BOTH tracks: how much of you is exposed. Higher = safer.
    | "compliance"   // employer track: are you lawful
    | "safety"       // employer track: is your workplace physically/psychologically safe
    | "reputation";  // employer track: would good people want to work for you

export interface BeatOption {
    id: string;
    label: string;
    /** One line of what you're actually doing. */
    detail?: string;
    /** Gauge movements. Positive is always good for the player. */
    effects: Partial<Record<Gauge, number>>;
    /**
     * What this choice teaches. Shown whether you were right or wrong - being
     * wrong is a legitimate way to learn here.
     */
    outcome: string;
    /** Is this the defensible / correct choice? Drives mastery, not shame. */
    correct: boolean;
    /** Set when this is a real-world trap that costs teens money or rights. */
    trap?: boolean;
}

/* ------------------------------------------------------------------ *
 * The Mirror
 * ------------------------------------------------------------------ */

/**
 * One line of the player's own application, as an employer would read it.
 * Reconstructed from the choices the player actually made in the worker track,
 * which is what makes the mirror honest instead of scripted.
 */
export interface ApplicationLine {
    text: string;
    /** How an employer reads this line. */
    verdict: "good" | "neutral" | "risk";
}

export interface MirrorApplication {
    handle: string;
    role: string;
    lines: ApplicationLine[];
}

/* ------------------------------------------------------------------ *
 * Progress (localStorage only - anonymous)
 * ------------------------------------------------------------------ */

export interface BeatResult {
    beatId: string;
    optionId: string;
    correct: boolean;
    /** How many times the player has now attempted this beat. */
    attempts: number;
    /** Correctness was reached on attempt 2 or later - a real learning moment. */
    recovered: boolean;
}

export interface TrackProgress {
    startedAt: string | null;
    updatedAt: string | null;
    completedStages: string[];
    results: Record<string, BeatResult>;
}

export interface MirrorRecord {
    /** Did the player, playing employer, shortlist their own anonymous application? */
    shortlistedSelf: boolean;
    /** What they said they'd change. Revealed only to themselves. */
    reflection: string;
    at: string;
}

export interface GameProgress {
    version: 1;
    jurisdiction: StateCode | null;
    /**
     * A local, meaningless handle. NOT derived from name, email, DOB or school.
     * Displayed only so a player can tell their own save apart on a shared device.
     */
    handle: string;
    /**
     * Which identity fields the player has chosen to disclose, keyed by
     * IdentityField.key. This is the player's own shield: nothing here is
     * visible to anyone until they turn it on themselves.
     */
    disclosure: Record<string, boolean>;
    player: TrackProgress;
    employer: TrackProgress;
    mirror: MirrorRecord | null;
    /** ISO date the licence was issued, if it was. */
    licenceIssuedAt: string | null;
}

export interface Gauges {
    rights: number;
    standing: number;
    readiness: number;
    security: number;
    privacy: number;
    compliance: number;
    safety: number;
    reputation: number;
}

/* ------------------------------------------------------------------ *
 * Derivation
 * ------------------------------------------------------------------ */

export interface LicenceStatus {
    playerStagesDone: number;
    playerStagesTotal: number;
    employerStagesDone: number;
    employerStagesTotal: number;
    playerScore: number;
    employerScore: number;
    /** Correct answers reached on the first try. */
    firstTryCorrect: number;
    /** Correct answers reached after failing at least once. */
    recovered: number;
    trapsAvoided: number;
    trapsFallenFor: number;
    mirrorDone: boolean;
    /** 0-100 readiness to enter the real job market. */
    informedPercent: number;
    /** Is entering the real market appropriate yet? */
    qualified: boolean;
    /** What specifically still stands between them and the job market. */
    gaps: string[];
}
