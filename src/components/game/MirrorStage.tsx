"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowRight,
    BadgeCheck,
    Building2,
    Eye,
    EyeOff,
    FileText,
    UserRound,
} from "lucide-react";
import type { ApplicationLine, GameProgress, Gauges, MirrorApplication, Stage, TrackId } from "@/lib/game/types";
import { STAGES } from "@/lib/game/scenarios";
import { Meter } from "./Meter";

/**
 * THE MIRROR.
 *
 * This is the reason the game exists. The player has spent the whole worker
 * track becoming a candidate. Now they sit on the other side of the desk and
 * read four anonymous applications - one of which is theirs.
 *
 * They never learn which one is theirs before they judge it. They shortlist on
 * merit, then the game shows them what they just did to themselves.
 */
export function MirrorStage({
    stage,
    progress,
    playerGauges,
    onExit,
    onProgress,
}: {
    stage: Stage;
    progress: GameProgress;
    playerGauges: Gauges;
    onExit: () => void;
    onProgress: (fn: (current: GameProgress) => GameProgress) => void;
}) {
    const [shortlist, setShortlisted] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(progress.mirror !== null);
    const [reflection, setReflection] = useState(progress.mirror?.reflection ?? "");

    const mine = useMemo(() => buildMyApplication(progress), [progress]);
    const others = useMemo(() => peerApplications(mine), [mine]);

    const buckets = useMemo(
        () => [
            { id: "B", label: "Applicant B", lines: others[0].lines },
            { id: "C", label: "Applicant C", lines: others[1].lines },
            { id: "D", label: "Applicant D", lines: others[2].lines },
            { id: "A", label: "Applicant A", lines: mine.lines },
        ],
        [mine, others]
    );

    // Deliberately shuffles which letter your own application gets, so nothing
    // about the ordering tips you off.
    const ordered = useMemo(() => {
        const seed = progress.handle.length + Object.keys(progress.player.results).length;
        const rotated = [...buckets.slice(seed % 4), ...buckets.slice(0, seed % 4)];
        return rotated;
    }, [buckets, progress.handle.length, progress.player.results]);

    const myLetter = ordered.find((b) => b.id === "A")?.label ?? "Applicant A";
    const shortlistedMine = shortlist.includes("A");

    const toggle = (id: string) => {
        if (submitted) return;
        setShortlisted((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const commit = () => {
        setSubmitted(true);
        onProgress((current) => ({
            ...current,
            mirror: {
                shortlistedSelf: shortlistedMine,
                reflection,
                at: new Date().toISOString(),
            },
        }));
    };

    const selfLine = mine.lines.find((l) => l.verdict === "risk");
    const goodLines = mine.lines.filter((l) => l.verdict === "good");

    return (
        <div className="space-y-5">
            {/* Framing */}
            <div className="rounded-3xl border border-woork-navy/20 bg-woork-navy p-5 text-white sm:p-6">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-woork-teal">
                    <Building2 className="h-3.5 w-3.5" />
                    {stage.title}
                </div>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-white/90">{stage.beats[0].setup}</p>
                <p className="mt-3 text-sm text-white/60">
                    You cannot see names, faces or schools. You cannot ask for them yet either - that is the point.
                    Shortlist the two you would actually call in.
                </p>
            </div>

            {!submitted && (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        {ordered.map((bucket) => {
                            const picked = shortlist.includes(bucket.id);
                            return (
                                <button
                                    key={bucket.id}
                                    onClick={() => toggle(bucket.id)}
                                    className={`rounded-3xl border-2 bg-white p-5 text-left shadow-sm transition dark:bg-white/5 ${
                                        picked
                                            ? "border-woork-teal"
                                            : "border-gray-200 hover:border-woork-teal/40 dark:border-white/10"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-white/40">
                                            <EyeOff className="h-3.5 w-3.5" />
                                            {bucket.label}
                                        </span>
                                        <span
                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                picked
                                                    ? "border-woork-teal bg-woork-teal text-white"
                                                    : "border-gray-300 dark:border-white/30"
                                            }`}
                                        >
                                            {picked && <BadgeCheck className="h-3 w-3" />}
                                        </span>
                                    </div>
                                    <ul className="mt-4 space-y-2">
                                        {bucket.lines.map((line, i) => (
                                            <li key={i} className="flex gap-2 text-sm">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300 dark:bg-white/25" />
                                                <span className="text-gray-700 dark:text-white/70">{line.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={commit}
                        disabled={shortlist.length === 0}
                        className="btn-primary inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        I'd hire these {shortlist.length > 0 ? `(${shortlist.length})` : ""}
                        <ArrowRight className="h-4 w-4" />
                    </button>
                    <p className="text-center text-xs text-gray-400 dark:text-white/40">
                        Choose honestly. Nothing here is shown to anyone else, and no answer is the "game over" answer.
                    </p>
                </>
            )}

            {/* THE REVEAL */}
            {submitted && (
                <div className="space-y-5">
                    <div className="rounded-3xl border border-woork-teal/40 bg-woork-teal/5 p-5 sm:p-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-woork-teal">
                            <Eye className="h-4 w-4" />
                            One of those was you. You were {myLetter}.
                        </div>
                        <p className="mt-3 text-[15px] leading-relaxed text-woork-navy dark:text-white/90">
                            {shortlistedMine
                                ? "You shortlisted yourself. On the evidence in front of you, you would have given you the interview. That is the strongest signal this game can give you."
                                : "You passed on yourself. Not because you were told to - because reading it cold, next to three other people, it did not stand out. That is worth sitting with, and it is fixable."}
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-white p-4 dark:bg-white/5">
                                <div className="text-[11px] font-bold uppercase tracking-wide text-woork-teal">
                                    What worked in your application
                                </div>
                                {goodLines.length > 0 ? (
                                    <ul className="mt-2 space-y-2">
                                        {goodLines.map((l, i) => (
                                            <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-white/70">
                                                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-woork-teal" />
                                                {l.text}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-2 text-sm text-gray-500 dark:text-white/50">
                                        Nothing here stood out yet. The worker track is where you build this.
                                    </p>
                                )}
                            </div>

                            <div className="rounded-2xl bg-white p-4 dark:bg-white/5">
                                <div className="text-[11px] font-bold uppercase tracking-wide text-woork-coral">
                                    What a stranger noticed
                                </div>
                                {selfLine ? (
                                    <ul className="mt-2 space-y-2">
                                        <li className="flex gap-2 text-sm text-gray-700 dark:text-white/70">
                                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-woork-coral" />
                                            {selfLine.text}
                                        </li>
                                    </ul>
                                ) : (
                                    <p className="mt-2 text-sm text-gray-500 dark:text-white/50">
                                        Nothing jumped out as a problem. That is rare and it is earned.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl bg-white p-4 dark:bg-white/5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-woork-navy dark:text-white">
                                <Meter gauge="privacy" value={playerGauges.privacy} compact />
                                <span>On privacy</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 dark:text-white/60">
                                As the employer you could not see anyone's name, address, school or socials - and you
                                did not need them to decide. Remember that the next time a job ad asks you to text your
                                address before you have even spoken to a person.
                            </p>
                        </div>
                    </div>

                    {/* The take-away only the player ever sees */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-woork-navy dark:text-white">
                            <FileText className="h-4 w-4 text-woork-teal" />
                            One thing you'd change before you apply for real
                        </label>
                        <p className="mt-1 text-xs text-gray-500 dark:text-white/50">
                            This stays on this device. It is never shown to another player.
                        </p>
                        <textarea
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            rows={3}
                            placeholder="e.g. I'll say what days I can work, and I'll mention the two Saturdays I already help at the markets."
                            className="input-field mt-3 resize-none text-sm dark:bg-white/5"
                        />
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                            <button
                                onClick={() =>
                                    onProgress((current) => ({
                                        ...current,
                                        mirror: {
                                            shortlistedSelf: shortlistedMine,
                                            reflection,
                                            at: new Date().toISOString(),
                                        },
                                    }))
                                }
                                className="btn-primary inline-flex items-center justify-center gap-2"
                            >
                                Save this
                                <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={onExit}
                                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-500 hover:text-woork-navy dark:text-white/50"
                            >
                                Back to training
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-woork-navy dark:text-white">
                            <UserRound className="h-4 w-4 text-woork-teal" />
                            The other three
                        </h4>
                        <p className="mt-1.5 text-sm text-gray-600 dark:text-white/60">
                            Two of them were strong and one was not, and none of that was about personality. The
                            difference was whether they had made it easy for an employer to say yes: they named the
                            days they were free, they had something real to point at, and they did not ask for special
                            treatment before they had the job.
                        </p>
                        <p className="mt-3 text-sm text-gray-600 dark:text-white/60">
                            That is the whole skill. It is learnable, and you have just watched it from both sides.
                        </p>
                        <Link
                            href="/jobs"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-woork-teal hover:underline"
                        >
                            Go to the real job market
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Building the player's own application out of what they actually did
 * ------------------------------------------------------------------ */

/** The worker-track beats whose answers become visible to an employer. */
const EVIDENCE_BEATS = [
    { beatId: "p-identity-3", label: "Availability given" },
    { beatId: "p-search-3", label: "How you applied" },
    { beatId: "p-apply-1", label: "Choice of referee" },
    { beatId: "p-apply-2", label: "The unlawful question" },
    { beatId: "p-deliver-1", label: "Trial shift" },
    { beatId: "p-deliver-2", label: "First payslip" },
];

/**
 * Turn the player's own worker-track answers into the document an employer
 * would actually have read. This is what makes the mirror honest rather than
 * a scripted cut-scene.
 */
function buildMyApplication(progress: GameProgress): MirrorApplication {
    const lines: ApplicationLine[] = [];

    const playerStages = STAGES.filter((s: Stage) => s.track === "player");

    EVIDENCE_BEATS.forEach(({ beatId, label }) => {
        const result = progress.player.results[beatId];
        if (!result) return;
        let option: { label: string; correct: boolean; trap?: boolean } | undefined;
        playerStages.forEach((stage: Stage) =>
            stage.beats.forEach((beat) => {
                if (beat.id !== beatId) return;
                option = beat.options.find((o) => o.id === result.optionId);
            })
        );
        if (!option) return;
        lines.push({
            text: `${label}: ${option.label}`,
            verdict: option.trap && !option.correct ? "risk" : option.correct ? "good" : "neutral",
        });
    });

    return {
        handle: progress.handle,
        role: "Junior team member",
        lines,
    };
}

/** Three fixed peers, written to be a fair but demanding comparison set. */
function peerApplications(mine: MirrorApplication): MirrorApplication[] {
    void mine;
    return [
        {
            handle: "Applicant",
            role: "Junior team member",
            lines: [
                { text: "Availability given: Every Saturday, and after 4pm on weekdays", verdict: "good" },
                { text: "Experience: Two seasons of weekend soccer canteen duty", verdict: "good" },
                { text: "Referee: Canteen coordinator, contact provided", verdict: "good" },
                { text: "Wants: To learn barista work", verdict: "good" },
            ],
        },
        {
            handle: "Applicant",
            role: "Junior team member",
            lines: [
                { text: "Availability given: Whenever you need me", verdict: "risk" },
                { text: "Experience: None listed", verdict: "neutral" },
                { text: "Referee: A friend's mum", verdict: "neutral" },
                { text: "Wants: A chance", verdict: "neutral" },
            ],
        },
        {
            handle: "Applicant",
            role: "Junior team member",
            lines: [
                { text: "Availability given: 3 shifts a week, but I have netball finals in March", verdict: "good" },
                { text: "Experience: Helped run a school market stall", verdict: "good" },
                { text: "Referee: Maths teacher", verdict: "good" },
                { text: "Wants: Casual work near home", verdict: "good" },
            ],
        },
    ];
}

export type { TrackId };
