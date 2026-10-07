"use client";

import Link from "next/link";
import {
    AlertTriangle,
    ArrowRight,
    BadgeCheck,
    Building2,
    CheckCircle2,
    Lock,
    ShieldCheck,
    Sparkles,
    UserRound,
} from "lucide-react";
import type { GameProgress, LicenceStatus } from "@/lib/game/types";
import { QUALIFY_THRESHOLD } from "@/lib/game/engine";

/**
 * The gate into the real job market.
 *
 * This is the "you are now qualified" moment the whole game builds to. It is
 * deliberately not a celebration screen - it is a statement of what the player
 * can now actually do, with the gaps still listed until they close them.
 */
export function LicencePanel({
    licence,
    progress,
    onMirror,
    onResume,
}: {
    licence: LicenceStatus;
    progress: GameProgress;
    onMirror: () => void;
    onResume?: () => void;
}) {
    const pct = licence.informedPercent;
    const remaining = Math.max(0, QUALIFY_THRESHOLD - pct);

    return (
        <div className="h-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-bold text-woork-navy dark:text-white">
                        {licence.qualified ? (
                            <ShieldCheck className="h-5 w-5 text-woork-teal" />
                        ) : (
                            <Lock className="h-5 w-5 text-gray-400 dark:text-white/40" />
                        )}
                        Job Market Readiness
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
                        {licence.qualified
                            ? "You've proven you understand both sides. The real job market is open to you."
                            : "Finish both sides and beat every trap. This is not a score to grind - it is the evidence that you know what you're walking into."}
                    </p>
                </div>
                <div className="shrink-0 text-right">
                    <div className={`text-3xl font-bold tabular-nums ${licence.qualified ? "text-woork-teal" : "text-woork-navy dark:text-white"}`}>
                        {pct}%
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/40">
                        informed
                    </div>
                </div>
            </div>

            {/* Progress to the gate */}
            <div className="mt-5">
                <div className="relative h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                            licence.qualified ? "bg-woork-teal" : "bg-woork-teal/60"
                        }`}
                        style={{ width: `${pct}%` }}
                    />
                    <div
                        className="absolute top-0 h-full w-0.5 bg-woork-navy dark:bg-white"
                        style={{ left: `${QUALIFY_THRESHOLD}%` }}
                        title={`Gate at ${QUALIFY_THRESHOLD}%`}
                    />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-gray-400 dark:text-white/40">
                    <span>Starting out</span>
                    <span>
                        {licence.qualified ? "Gate passed" : `${remaining}% to the gate`}
                    </span>
                </div>
            </div>

            {/* Evidence */}
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat
                    icon={<UserRound className="h-3.5 w-3.5" />}
                    label="As the worker"
                    value={`${licence.playerStagesDone}/${licence.playerStagesTotal}`}
                    done={licence.playerStagesDone === licence.playerStagesTotal}
                />
                <Stat
                    icon={<Building2 className="h-3.5 w-3.5" />}
                    label="As the employer"
                    value={`${licence.employerStagesDone}/${licence.employerStagesTotal}`}
                    done={licence.employerStagesDone === licence.employerStagesTotal}
                />
                <Stat
                    icon={<Sparkles className="h-3.5 w-3.5" />}
                    label="Traps beaten"
                    value={`${licence.trapsAvoided}`}
                    done={licence.trapsFallenFor === 0 && licence.trapsAvoided > 0}
                />
                <Stat
                    icon={<BadgeCheck className="h-3.5 w-3.5" />}
                    label="Learned the hard way"
                    value={`${licence.recovered}`}
                    done
                    hint="Wrong first, then worked it out"
                />
            </dl>

            {/* Mirror status */}
            <button
                onClick={onMirror}
                className={`mt-5 flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                    licence.mirrorDone
                        ? "border-woork-teal/40 bg-woork-teal/5"
                        : "border-woork-navy/20 bg-woork-navy text-white hover:bg-woork-navy/90"
                }`}
            >
                {licence.mirrorDone ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-woork-teal" />
                ) : (
                    <UserRound className="h-5 w-5 shrink-0 text-woork-teal" />
                )}
                <span className="flex-1">
                    <span className={`block text-sm font-semibold ${licence.mirrorDone ? "text-woork-navy dark:text-white" : ""}`}>
                        {licence.mirrorDone ? "You faced your own application" : "The Mirror - judge your own application"}
                    </span>
                    <span className={`mt-0.5 block text-xs ${licence.mirrorDone ? "text-gray-600 dark:text-white/60" : "text-white/60"}`}>
                        {licence.mirrorDone
                            ? progress.mirror?.shortlistedSelf
                                ? "You would have hired yourself."
                                : "You passed on yourself - worth another look."
                            : "Four anonymous applications. One is yours. You won't know which until you decide."}
                    </span>
                </span>
                <ArrowRight className={`h-4 w-4 shrink-0 ${licence.mirrorDone ? "text-gray-300 dark:text-white/25" : "text-white/60"}`} />
            </button>

            {/* What still stands in the way */}
            {!licence.qualified && licence.gaps.length > 0 && (
                <div className="mt-5 rounded-2xl bg-amber-50 p-4 dark:bg-amber-400/10">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="h-4 w-4" />
                        What's still between you and the market
                    </div>
                    <ul className="mt-2 space-y-1">
                        {licence.gaps.map((gap) => (
                            <li key={gap} className="flex gap-2 text-sm text-amber-900 dark:text-amber-200/90">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-600" />
                                {gap}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* The gate itself */}
            {licence.qualified ? (
                <div className="mt-5 overflow-hidden rounded-2xl border-2 border-woork-teal bg-gradient-to-br from-woork-teal/10 to-white p-5 dark:to-white/5">
                    <div className="flex items-center gap-2 text-sm font-bold text-woork-teal">
                        <ShieldCheck className="h-5 w-5" />
                        You're qualified to job-hunt
                    </div>
                    <p className="mt-2 text-sm text-woork-navy dark:text-white/80">
                        You have read the law from both chairs, you know what you are owed, you know what an employer
                        is not allowed to ask you, and you have judged yourself the way a stranger would. That is more
                        than most adults bring to their first shift.
                    </p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Link href="/jobs" className="btn-primary inline-flex items-center justify-center gap-2">
                            Open the job market
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link href="/profile" className="btn-secondary inline-flex items-center justify-center gap-2">
                            Build my profile
                        </Link>
                    </div>
                    <p className="mt-3 text-[11px] text-gray-500 dark:text-white/50">
                        Issued to <span className="font-semibold">{progress.handle}</span> on this device only. No one
                        else can see it, and nothing was sent anywhere.
                    </p>
                </div>
            ) : (
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    {onResume && (
                        <button onClick={onResume} className="btn-primary inline-flex items-center justify-center gap-2">
                            Pick up where I left off
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                    <Link
                        href="/jobs"
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 dark:text-white/40"
                        title="Finish your training first"
                    >
                        <Lock className="h-4 w-4" />
                        Job market locked
                    </Link>
                </div>
            )}
        </div>
    );
}

function Stat({
    icon,
    label,
    value,
    done,
    hint,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    done: boolean;
    hint?: string;
}) {
    return (
        <div className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5" title={hint}>
            <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide ${done ? "text-woork-teal" : "text-gray-400 dark:text-white/40"}`}>
                {icon}
                {label}
            </div>
            <div className="mt-1 text-lg font-bold tabular-nums text-woork-navy dark:text-white">{value}</div>
        </div>
    );
}
