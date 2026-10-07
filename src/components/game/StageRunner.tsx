"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, BadgeCheck, Flag, Shield } from "lucide-react";
import type { GameProgress, Gauges, Stage, StateCode } from "@/lib/game/types";
import { deriveTrackGauges, markStageComplete, recordAnswer } from "@/lib/game/engine";
import { STAGES } from "@/lib/game/scenarios";
import { BeatCard } from "./BeatCard";
import { Meter } from "./Meter";
import { MirrorStage } from "./MirrorStage";
import { IdentityShield } from "./IdentityShield";

/**
 * Runs one stage: a handful of beats, in order, with the gauges on screen so
 * the player can see the cost of each choice land immediately.
 */
export function StageRunner({
    stage,
    stateCode,
    progress,
    onExit,
    onProgress,
}: {
    stage: Stage;
    stateCode: StateCode | null;
    progress: GameProgress;
    onExit: () => void;
    onProgress: (fn: (current: GameProgress) => GameProgress) => void;
}) {
    const [index, setIndex] = useState(() => {
        // Resume at the first beat that hasn't been cleared.
        const firstOpen = stage.beats.findIndex((b) => !progress[stage.track].results[b.id]?.correct);
        return firstOpen === -1 ? 0 : firstOpen;
    });
    const [showShield, setShowShield] = useState(false);
    const [shieldSeen, setShieldSeen] = useState(false);

    const beat = stage.beats[index];
    const isLast = index === stage.beats.length - 1;
    const trackProgress = progress[stage.track];

    // Live gauges for this stage, derived from the answers so far.
    const gauges = useMemo(() => deriveTrackGauges(STAGES, progress, stage.track), [progress, stage.track]);

    // Deltas from the answer just given on this beat, for the flash on the meter.
    const deltas = useMemo(() => {
        const result = trackProgress.results[beat?.id ?? ""];
        if (!result) return undefined;
        const option = beat?.options.find((o) => o.id === result.optionId);
        return option?.effects as Partial<Record<keyof Gauges, number>> | undefined;
    }, [beat, trackProgress.results]);

    if (!beat) return null;

    const isMirrorStage = stage.id === "mirror";

    const handleAnswer = (optionId: string) => {
        onProgress((current) => recordAnswer(current, stage.track, beat, optionId).progress);
    };

    const advance = () => {
        if (isLast) {
            onProgress((current) => markStageComplete(current, stage.track, stage.id));
            onExit();
        } else {
            setIndex((i) => Math.min(i + 1, stage.beats.length - 1));
        }
    };

    const stageBeatsCleared = stage.beats.filter((b) => trackProgress.results[b.id]?.correct).length;

    return (
        <div className="min-h-screen bg-woork-cream dark:bg-woork-navy">
            <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-woork-navy/90">
                <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <button
                            onClick={onExit}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-woork-navy dark:text-white/50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">{stage.title}</span>
                        </button>
                        <div className="flex items-center gap-1.5">
                            {stage.beats.map((b, i) => {
                                const cleared = trackProgress.results[b.id]?.correct;
                                const answered = !!trackProgress.results[b.id];
                                return (
                                    <span
                                        key={b.id}
                                        className={`h-1.5 rounded-full transition-all ${
                                            i === index ? "w-6" : "w-3"
                                        } ${
                                            cleared
                                                ? "bg-woork-teal"
                                                : answered
                                                    ? "bg-amber-400"
                                                    : "bg-gray-200 dark:bg-white/15"
                                        }`}
                                    />
                                );
                            })}
                        </div>
                        <span className="hidden text-xs font-semibold text-gray-400 sm:block dark:text-white/40">
                            {stageBeatsCleared}/{stage.beats.length}
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
                <div className="mb-5 flex items-center gap-3">
                    <span aria-hidden className="text-2xl">{stage.icon}</span>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wide text-woork-teal">
                            Stage {stage.order} · {stage.track === "player" ? "As the worker" : "As the employer"}
                        </div>
                        <h1 className="text-xl font-bold text-woork-navy dark:text-white">{stage.title}</h1>
                    </div>
                </div>

                {/* Live meters */}
                <div className="mb-5 grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-4 dark:border-white/10 dark:bg-white/5">
                    {(stage.track === "player"
                        ? (["rights", "standing", "readiness", "security"] as const)
                        : (["compliance", "safety", "reputation", "privacy"] as const)
                    ).map((g) => (
                        <Meter key={g} gauge={g} value={gauges[g]} delta={deltas?.[g]} compact />
                    ))}
                </div>

                {isMirrorStage ? (
                    <MirrorStage
                        stage={stage}
                        progress={progress}
                        playerGauges={deriveTrackGauges(STAGES, progress, "player")}
                        onExit={onExit}
                        onProgress={onProgress}
                    />
                ) : (
                    <>
                        {/* The Identity Shield lives where privacy is taught, so the
                            mechanic is something the player operates rather than
                            something the game merely talks about. */}
                        {stage.id === "identity" && (
                            <div className="mb-5">
                                <button
                                    onClick={() => {
                                        setShowShield((v) => !v);
                                        setShieldSeen(true);
                                    }}
                                    className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-woork-teal/40 dark:border-white/10 dark:bg-white/5"
                                >
                                    <Shield className="h-5 w-5 shrink-0 text-woork-teal" />
                                    <span className="flex-1">
                                        <span className="block text-sm font-semibold text-woork-navy dark:text-white">
                                            Your Identity Shield
                                        </span>
                                        <span className="block text-xs text-gray-500 dark:text-white/50">
                                            {shieldSeen
                                                ? "Open it again any time to change what you're sharing."
                                                : "Decide what an employer can see about you. You control every item."}
                                        </span>
                                    </span>
                                    <span className="shrink-0 text-xs font-semibold text-woork-teal">
                                        {gauges.privacy}% private
                                    </span>
                                </button>
                                {showShield && (
                                    <div className="mt-3">
                                        <IdentityShield
                                            state={progress.disclosure}
                                            conversationStarted={false}
                                            onChange={(next) =>
                                                onProgress((current) => ({ ...current, disclosure: next }))
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <BeatCard
                            key={beat.id}
                            beat={beat}
                            stateCode={stateCode}
                            existing={trackProgress.results[beat.id]}
                            onAnswer={handleAnswer}
                            onContinue={advance}
                            isLast={isLast}
                        />

                        <p className="mt-4 flex items-start gap-2 text-xs text-gray-400 dark:text-white/40">
                            <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            Getting one wrong does not cost you the game. It shows you the trap, then lets you take
                            the other road. You only have to beat each trap once.
                        </p>
                    </>
                )}

                {/* Stage footer: what this stage actually built */}
                {isLast && trackProgress.results[beat.id]?.correct && (
                    <div className="mt-6 rounded-2xl border border-woork-teal/40 bg-woork-teal/5 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-woork-teal">
                            <BadgeCheck className="h-4 w-4" />
                            Stage complete - you built: {stage.skill}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
