"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Check, ExternalLink, Info, Lightbulb, X } from "lucide-react";
import type { Beat, BeatOption, BeatResult, Gauge, StateCode } from "@/lib/game/types";
import { GAUGE_META } from "@/lib/game/engine";
import { ArtefactView } from "./Artefact";
import { DeltaChip } from "./Meter";

/**
 * The beat card. One beat = one real decision a young worker or a small
 * employer actually has to make.
 *
 * Deliberate design choice: after a wrong answer we do NOT advance and we do
 * NOT scold. We explain, and we let them take the other path. Nobody is
 * permanently penalised for not knowing something they were never taught.
 */
export function BeatCard({
    beat,
    stateCode,
    existing,
    onAnswer,
    onContinue,
    isLast,
}: {
    beat: Beat;
    stateCode: StateCode | null;
    existing?: BeatResult;
    onAnswer: (optionId: string) => void;
    onContinue: () => void;
    isLast: boolean;
}) {
    const [selected, setSelected] = useState<string[]>([]);
    const [revealed, setRevealed] = useState(false);
    const [retry, setRetry] = useState(false);

    const isBrief = beat.kind === "brief";
    const isAudit = beat.kind === "audit";

    // A brief has nothing to get wrong - its single option is just "continue".
    const chosen = isBrief ? beat.options[0] : beat.options.find((o) => o.id === selected[0]);
    const alreadyBeaten = !!existing?.correct;

    const correctIds = useMemo(
        () => new Set(beat.options.filter((o) => o.correct).map((o) => o.id)),
        [beat.options]
    );

    const stateNote = stateCode && beat.stateVariant?.[stateCode] ? beat.stateVariant[stateCode] : null;

    function submit() {
        if (selected.length === 0) return;
        setRevealed(true);
    }

    function commit() {
        if (selected.length === 0) return;
        onAnswer(selected[0]);
    }

    function auditScore() {
        const pickedRight = selected.filter((id) => correctIds.has(id)).length;
        const pickedWrong = selected.filter((id) => !correctIds.has(id)).length;
        const missed = correctIds.size - pickedRight;
        return { pickedRight, pickedWrong, missed, pass: pickedWrong === 0 && missed === 0 };
    }

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
            {/* Situation */}
            <div className="border-b border-gray-100 p-5 sm:p-6 dark:border-white/10">
                <div className="mb-3 flex items-center gap-2">
                    <KindTag kind={beat.kind} />
                    {alreadyBeaten && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-woork-teal/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-woork-teal">
                            <Check className="h-3 w-3" /> Already cleared
                        </span>
                    )}
                </div>
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-woork-navy dark:text-white/90">
                    {beat.setup}
                </p>
                {beat.briefBody && (
                    <div className="mt-4 space-y-3 border-l-2 border-woork-teal/30 pl-4">
                        {beat.briefBody.map((para, i) => (
                            <p key={i} className="text-sm leading-relaxed text-gray-600 dark:text-white/60">
                                {para}
                            </p>
                        ))}
                    </div>
                )}
                {stateNote && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-900 dark:bg-blue-500/10 dark:text-blue-200">
                        <Info className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                            <span className="font-semibold">In your state: </span>
                            {stateNote}
                        </span>
                    </div>
                )}
            </div>

            {/* Artefact */}
            {beat.artefact && (
                <div className="border-b border-gray-100 bg-gray-50/60 p-5 sm:p-6 dark:border-white/10 dark:bg-black/20">
                    <ArtefactView artefact={beat.artefact} />
                </div>
            )}

            {/* Options */}
            <div className="p-5 sm:p-6">
                {isBrief ? (
                    <button onClick={onContinue} className="btn-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto">
                        {isLast ? "Finish this stage" : "Start the decisions"}
                        <ArrowRight className="h-4 w-4" />
                    </button>
                ) : (
                    <>
                        <div className="mb-3 flex items-baseline justify-between gap-2">
                            <h4 className="text-sm font-semibold text-woork-navy dark:text-white">
                                {beat.auditPrompt ??
                                    (beat.kind === "triage"
                                        ? "What matters most here?"
                                        : beat.kind === "mirror"
                                            ? "What do you do?"
                                            : "What do you do?")}
                            </h4>
                            {isAudit && (
                                <span className="text-xs text-gray-400 dark:text-white/40">Select all that apply</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            {beat.options.map((option) => (
                                <OptionRow
                                    key={option.id}
                                    option={option}
                                    multi={isAudit}
                                    picked={selected.includes(option.id)}
                                    revealed={revealed}
                                    disabled={revealed}
                                    onPick={() => {
                                        if (revealed) return;
                                        if (isAudit) {
                                            setSelected((prev) =>
                                                prev.includes(option.id)
                                                    ? prev.filter((id) => id !== option.id)
                                                    : [...prev, option.id]
                                            );
                                        } else {
                                            setSelected([option.id]);
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        {!revealed && (
                            <button
                                onClick={isAudit ? submit : commit}
                                disabled={selected.length === 0}
                                className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                            >
                                {isAudit ? "Check my answers" : "Commit to this"}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        )}
                    </>
                )}

                {/* Feedback */}
                {revealed && (
                    <div className="mt-5 space-y-4 border-t border-gray-100 pt-5 dark:border-white/10">
                        {isAudit ? (
                            <AuditFeedback score={auditScore()} />
                        ) : (
                            chosen && <ChoiceFeedback option={chosen} />
                        )}

                        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-woork-navy dark:text-white">
                                <Lightbulb className="h-4 w-4 text-woork-teal" />
                                {beat.debrief}
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-white/70">
                                {beat.bottomLine}
                            </p>
                            <a
                                href={beat.source.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-woork-teal hover:underline"
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                {beat.source.label}
                                {beat.source.detail ? ` - ${beat.source.detail}` : ""}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            {!isAudit && chosen && !chosen.correct && !retry && (
                                <button
                                    onClick={() => {
                                        setRetry(true);
                                        setRevealed(false);
                                        setSelected([]);
                                    }}
                                    className="btn-primary inline-flex items-center justify-center gap-2"
                                >
                                    Try the other path
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    if (!isAudit && chosen) onAnswer(chosen.id);
                                    if (isAudit) {
                                        // The beat display scores the whole selection, but the durable
                                        // record holds one option. Credit the player if they found any
                                        // genuine problem, rather than punishing the order they ticked.
                                        const found = selected.find((id) => correctIds.has(id));
                                        onAnswer(found ?? selected[0]);
                                    }
                                    onContinue();
                                }}
                                className={
                                    !isAudit && chosen && !chosen.correct && !retry
                                        ? "btn-secondary inline-flex items-center justify-center gap-2"
                                        : "btn-primary inline-flex items-center justify-center gap-2"
                                }
                            >
                                {isLast ? "Finish this stage" : "Next"}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function KindTag({ kind }: { kind: Beat["kind"] }) {
    const map: Record<Beat["kind"], { label: string; className: string }> = {
        brief: { label: "Briefing", className: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/70" },
        decision: { label: "Decision", className: "bg-woork-teal/15 text-woork-teal" },
        audit: { label: "Find the problems", className: "bg-woork-coral/15 text-woork-coral" },
        triage: { label: "Priorities", className: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300" },
        mirror: { label: "The Mirror", className: "bg-woork-navy text-white dark:bg-white/15" },
    };
    const item = map[kind];
    return (
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${item.className}`}>
            {item.label}
        </span>
    );
}

function OptionRow({
    option,
    multi,
    picked,
    revealed,
    disabled,
    onPick,
}: {
    option: BeatOption;
    multi: boolean;
    picked: boolean;
    revealed: boolean;
    disabled: boolean;
    onPick: () => void;
}) {
    // Before reveal we show nothing about correctness - otherwise the game
    // tells you the answer instead of teaching it.
    const tone = !revealed
        ? picked
            ? "border-woork-teal bg-woork-teal/5"
            : "border-gray-200 hover:border-woork-teal/50 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
        : option.correct
            ? "border-woork-teal bg-woork-teal/10"
            : picked
                ? "border-woork-coral bg-woork-coral/10"
                : "border-gray-200 opacity-60 dark:border-white/10";

    return (
        <button
            type="button"
            onClick={onPick}
            disabled={disabled}
            className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition ${tone} ${
                disabled ? "cursor-default" : ""
            }`}
        >
            <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
                    multi ? "rounded-md" : "rounded-full"
                } ${
                    revealed && option.correct
                        ? "border-woork-teal bg-woork-teal text-white"
                        : revealed && picked
                            ? "border-woork-coral bg-woork-coral text-white"
                            : picked
                                ? "border-woork-teal bg-woork-teal text-white"
                                : "border-gray-300 dark:border-white/30"
                }`}
            >
                {revealed && option.correct && <Check className="h-3 w-3" strokeWidth={3} />}
                {revealed && !option.correct && picked && <X className="h-3 w-3" strokeWidth={3} />}
                {!revealed && picked && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className="flex-1">
                <span className="block text-sm font-medium text-woork-navy dark:text-white/90">{option.label}</span>
                {option.detail && (
                    <span className="mt-0.5 block text-xs text-gray-500 dark:text-white/50">{option.detail}</span>
                )}
            </span>
            {revealed && option.trap && (
                <span className="shrink-0 rounded-full bg-woork-coral/20 px-2 py-0.5 text-[10px] font-bold uppercase text-woork-coral">
                    Trap
                </span>
            )}
        </button>
    );
}

function gaugeDeltas(option: BeatOption) {
    return (Object.keys(option.effects) as Gauge[]).filter((g) => (option.effects[g] ?? 0) !== 0);
}

function ChoiceFeedback({ option }: { option: BeatOption }) {
    const deltas = gaugeDeltas(option);
    return (
        <div
            className={`rounded-2xl border p-4 ${
                option.correct
                    ? "border-woork-teal/40 bg-woork-teal/5"
                    : "border-woork-coral/40 bg-woork-coral/5"
            }`}
        >
            <div className="flex flex-wrap items-center gap-2">
                <span className={`text-sm font-bold ${option.correct ? "text-woork-teal" : "text-woork-coral"}`}>
                    {option.correct ? "That holds up" : "That one costs you"}
                </span>
                {deltas.map((g) => (
                    <span key={g} className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-white/10 dark:text-white/70">
                        {GAUGE_META[g].icon} {GAUGE_META[g].label}
                        <DeltaChip delta={option.effects[g] ?? 0} />
                    </span>
                ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-white/70">{option.outcome}</p>
        </div>
    );
}

function AuditFeedback({
    score,
}: {
    score: { pickedRight: number; pickedWrong: number; missed: number; pass: boolean };
}) {
    return (
        <div
            className={`rounded-2xl border p-4 ${
                score.pass ? "border-woork-teal/40 bg-woork-teal/5" : "border-amber-400/50 bg-amber-50 dark:bg-amber-400/10"
            }`}
        >
            <div className={`text-sm font-bold ${score.pass ? "text-woork-teal" : "text-amber-700 dark:text-amber-300"}`}>
                {score.pass
                    ? "You caught every one"
                    : `${score.pickedRight} right, ${score.pickedWrong} wrong, ${score.missed} you missed`}
            </div>
            <p className="mt-1 text-sm text-gray-700 dark:text-white/70">
                {score.pass
                    ? "Nothing on that page slipped past you. That is exactly the habit that stops a teen being underpaid for months."
                    : "Read the highlights on each option above - the ones marked in red are the problems you either missed or invented."}
            </p>
        </div>
    );
}
