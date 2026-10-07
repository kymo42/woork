"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Lock, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { computeLicence, deriveGauges, loadProgress } from "@/lib/game/engine";
import { STAGES } from "@/lib/game/scenarios";
import type { GameProgress, LicenceStatus } from "@/lib/game/types";

/**
 * The gate on the real job market.
 *
 * woork's premise is that training has to come before a teenager hands their
 * details to an adult stranger. So the market stays closed until the player has
 * finished both sides and beaten every trap.
 *
 * It is a soft gate in the sense that matters: nothing is destroyed, progress
 * is on the device, and the reason for the lock is explained rather than dangled.
 */
export function MarketGate({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<"loading" | "locked" | "open">("loading");
    const [licence, setLicence] = useState<LicenceStatus | null>(null);
    const [progress, setProgress] = useState<GameProgress | null>(null);

    useEffect(() => {
        const loaded = loadProgress();
        const assessed = computeLicence(STAGES, loaded, deriveGauges(STAGES, loaded));
        setProgress(loaded);
        setLicence(assessed);
        setState(assessed.qualified ? "open" : "locked");
    }, []);

    if (state === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-woork-navy">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-woork-teal/30 border-t-woork-teal" />
            </div>
        );
    }

    if (state === "open") return <>{children}</>;

    const pct = licence?.informedPercent ?? 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-woork-navy">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
                <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-teal">
                        <Lock className="h-7 w-7 text-white" />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-woork-navy dark:text-white sm:text-3xl">
                        The job market opens when you're ready for it
                    </h1>

                    <p className="mt-3 text-gray-600 dark:text-white/60">
                        Right now you'd be handing your details to adults you've never met. Before that happens, woork
                        wants you to know exactly what you're owed, what an employer is not allowed to do, and what
                        they're actually looking for.
                    </p>

                    <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-left dark:bg-white/5">
                        <div className="flex items-baseline justify-between">
                            <span className="text-sm font-semibold text-woork-navy dark:text-white">
                                Your readiness
                            </span>
                            <span className="text-2xl font-bold tabular-nums text-woork-teal">{pct}%</span>
                        </div>
                        <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                            <div className="h-full rounded-full bg-woork-teal transition-all duration-700" style={{ width: `${pct}%` }} />
                            <div className="absolute top-0 h-full w-0.5 bg-woork-navy dark:bg-white" style={{ left: "70%" }} />
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-white/50">
                            {licence && licence.gaps.length > 0
                                ? `Still to do: ${licence.gaps.join("; ")}.`
                                : "You're almost there."}
                        </p>

                        {licence && (
                            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 text-xs dark:border-white/10">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                                    <UserRound className="h-3.5 w-3.5 text-woork-teal" />
                                    As the worker: {licence.playerStagesDone}/{licence.playerStagesTotal} stages
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                                    <Sparkles className="h-3.5 w-3.5 text-woork-teal" />
                                    As the employer: {licence.employerStagesDone}/{licence.employerStagesTotal} stages
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                                    <ShieldCheck className="h-3.5 w-3.5 text-woork-teal" />
                                    Traps beaten: {licence.trapsAvoided}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                                    <BookOpen className="h-3.5 w-3.5 text-woork-teal" />
                                    {licence.mirrorDone ? "Faced your own application" : "Mirror not yet faced"}
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="mt-5 text-sm text-gray-500 dark:text-white/50">
                        You can browse nothing here yet - but nothing is stopping you. It takes about twenty minutes,
                        you can stop and come back, and no one sees your progress but you.
                    </p>

                    <Link href="/play" className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2">
                        {pct > 0 ? "Continue training" : "Start training"}
                        <ArrowRight className="h-4 w-4" />
                    </Link>

                    <p className="mt-3 text-[11px] text-gray-400 dark:text-white/40">
                        {progress?.handle ? `Progress saved on this device as ${progress.handle}.` : "Progress saves on this device only."}
                    </p>
                </div>
            </div>
        </div>
    );
}
