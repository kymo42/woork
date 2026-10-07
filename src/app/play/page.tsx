"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    Briefcase,
    Building2,
    EyeOff,
    Lock,
    RotateCcw,
    Shield,
    Sparkles,
    UserRound,
} from "lucide-react";
import { STAGES } from "@/lib/game/scenarios";
import { JURISDICTIONS, STATE_ORDER } from "@/lib/game/jurisdictions";
import { computeLicence, deriveGauges, nextIncompleteStage, trackScore } from "@/lib/game/engine";
import { useGameProgress } from "@/lib/game/useGameProgress";
import type { Gauges, Stage, StateCode, TrackId } from "@/lib/game/types";import { MeterPanel } from "@/components/game/Meter";
import { StageRunner } from "@/components/game/StageRunner";
import { LicencePanel } from "@/components/game/LicencePanel";

export default function PlayPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-woork-cream dark:bg-woork-navy">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-woork-teal/30 border-t-woork-teal" />
                </div>
            }
        >
            <PlayShell />
        </Suspense>
    );
}

function PlayShell() {
    const { progress, ready, mutate, reset, setJurisdiction } = useGameProgress();
    const searchParams = useSearchParams();
    const router = useRouter();

    const activeTrack = searchParams.get("track") as TrackId | null;
    const activeStageId = searchParams.get("stage");

    // Per-track gauges derived from the answers given so far. Recomputed rather
    // than stored, so "reset" genuinely resets and there is no second source of truth.
    const gauges = useMemo(() => deriveGauges(STAGES, progress), [progress]);

    if (!ready || !progress) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-woork-cream dark:bg-woork-navy">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-woork-teal/30 border-t-woork-teal" />
            </div>
        );
    }

    const licence = computeLicence(STAGES, progress, gauges);

    // ---- Stage runner -------------------------------------------------
    const activeStage: Stage | null =
        activeTrack && activeStageId
            ? STAGES.find((s) => s.id === activeStageId && s.track === activeTrack) ?? null
            : null;

    if (activeStage) {
        return (
            <StageRunner
                stage={activeStage}
                stateCode={progress.jurisdiction}
                progress={progress}
                onExit={() => router.push("/play")}
                onProgress={mutate}
            />
        );
    }

    // ---- Track view ---------------------------------------------------
    if (activeTrack) {
        return (
            <TrackView
                track={activeTrack}
                progress={progress}
                stateCode={progress.jurisdiction}
                gauges={gauges}
                onExit={() => router.push("/play")}
                onEnterStage={(stageId) => router.push(`/play?track=${activeTrack}&stage=${stageId}`)}
            />
        );
    }

    // ---- Onboarding gate ----------------------------------------------
    if (!progress.jurisdiction) {
        return <Onboarding onPick={setJurisdiction} />;
    }

    const nextPlayer = nextIncompleteStage(STAGES, "player", progress);
    const nextEmployer = nextIncompleteStage(STAGES, "employer", progress);

    return (
        <div className="min-h-screen bg-woork-cream dark:bg-woork-navy">
            <GameHeader handle={progress.handle} onReset={reset} />

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Opening framing */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-woork-teal/10 px-3 py-1.5 text-xs font-semibold text-woork-teal">
                        <Sparkles className="h-3.5 w-3.5" />
                        {progress.jurisdiction} · {JURISDICTIONS[progress.jurisdiction].regulator}
                    </div>
                    <h1 className="mt-4 text-3xl font-bold text-woork-navy dark:text-white sm:text-4xl">
                        Both sides of the counter
                    </h1>
                    <p className="mt-3 max-w-2xl text-gray-600 dark:text-white/60">
                        You are going to do this twice: once as the person asking for the job, and once as the
                        person deciding who gets it. You finish when you can pass your own application - honestly.
                    </p>
                </div>

                {/* The two tracks */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <TrackCard
                        track="player"
                        title="You, asking for the job"
                        subtitle="Learn what you're owed, and how to ask for it without folding."
                        icon={<UserRound className="h-5 w-5" />}
                        nextStage={nextPlayer}
                        stages={STAGES.filter((s) => s.track === "player")}
                        progress={progress}
                        score={licence.playerScore}
                        maxScore={licence.playerStagesTotal * 3 * 10}
                        accent="teal"
                        onEnter={(id) => router.push(`/play?track=player&stage=${id}`)}
                        onOpenTrack={() => router.push("/play?track=player")}
                    />
                    <TrackCard
                        track="employer"
                        title="You, doing the hiring"
                        subtitle="Find out what an employer actually needs - and what they're not allowed to do."
                        icon={<Building2 className="h-5 w-5" />}
                        nextStage={nextEmployer}
                        stages={STAGES.filter((s) => s.track === "employer")}
                        progress={progress}
                        score={licence.employerScore}
                        maxScore={licence.employerStagesTotal * 3 * 10}
                        accent="navy"
                        onEnter={(id) => router.push(`/play?track=employer&stage=${id}`)}
                        onOpenTrack={() => router.push("/play?track=employer")}
                    />
                </div>

                {/* Gauges + licence */}
                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                        <h3 className="mb-4 flex items-center gap-2 font-semibold text-woork-navy dark:text-white">
                            <Shield className="h-4 w-4 text-woork-teal" />
                            Where you stand
                        </h3>
                        <MeterPanel gauges={gauges.player} side="player" />
                        <div className="my-5 border-t border-gray-100 dark:border-white/10" />
                        <h3 className="mb-4 flex items-center gap-2 font-semibold text-woork-navy dark:text-white">
                            <Building2 className="h-4 w-4 text-woork-navy dark:text-white/70" />
                            How you'd run it
                        </h3>
                        <MeterPanel gauges={gauges.employer} side="employer" />
                    </div>

                    <div className="lg:col-span-2">
                        <LicencePanel
                            licence={licence}
                            progress={progress}
                            onMirror={() => router.push("/play?track=employer&stage=mirror")}
                            onResume={
                                nextPlayer
                                    ? () => router.push(`/play?track=player&stage=${nextPlayer.id}`)
                                    : nextEmployer
                                        ? () => router.push(`/play?track=employer&stage=${nextEmployer.id}`)
                                        : undefined
                            }
                        />
                    </div>
                </div>

                {/* The refusal */}
                <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <h3 className="flex items-center gap-2 font-semibold text-woork-navy dark:text-white">
                        <EyeOff className="h-4 w-4 text-woork-teal" />
                        What this game will never do
                    </h3>
                    <ul className="mt-4 grid gap-3 text-sm text-gray-600 dark:text-white/60 sm:grid-cols-2">
                        {[
                            "Show another player your name, school, suburb or photo.",
                            "Rank you against anyone else, or show who is 'winning'.",
                            "Publish your score, your mistakes or your answers anywhere.",
                            "Ask for your email to let you play.",
                            "Send anything you type here to a server.",
                        ].map((line) => (
                            <li key={line} className="flex gap-2">
                                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-woork-teal" />
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}

/* ------------------------------------------------------------------ */

function GameHeader({ handle, onReset }: { handle: string; onReset: () => void }) {
    const [confirming, setConfirming] = useState(false);
    return (
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-teal">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-woork-navy dark:text-white">woork</span>
                    <span className="hidden rounded-full bg-woork-navy px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white sm:inline dark:bg-white/15">
                        Training
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <span className="hidden items-center gap-1.5 text-xs text-gray-500 sm:flex dark:text-white/50">
                        <EyeOff className="h-3.5 w-3.5" />
                        You are <span className="font-semibold text-woork-navy dark:text-white/80">{handle}</span> here
                    </span>
                    {confirming ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    onReset();
                                    setConfirming(false);
                                }}
                                className="rounded-lg bg-woork-coral px-3 py-1.5 text-xs font-semibold text-white"
                            >
                                Yes, erase it all
                            </button>
                            <button
                                onClick={() => setConfirming(false)}
                                className="text-xs text-gray-500 dark:text-white/50"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirming(true)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:text-woork-coral dark:text-white/50"
                            title="Progress is stored only on this device"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Erase my progress</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

/* ------------------------------------------------------------------ */

function Onboarding({ onPick }: { onPick: (code: StateCode) => void }) {
    const [choice, setChoice] = useState<StateCode | null>(null);
    const [pledged, setPledged] = useState(false);

    return (
        <div className="min-h-screen bg-woork-cream dark:bg-woork-navy">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
                <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-woork-navy dark:text-white/50">
                    <ArrowLeft className="h-4 w-4" /> Back to woork
                </Link>

                <div className="inline-flex items-center gap-2 rounded-full bg-woork-navy px-3 py-1.5 text-xs font-semibold text-white dark:bg-white/10">
                    <Shield className="h-3.5 w-3.5 text-woork-teal" />
                    Before you start
                </div>

                <h1 className="mt-5 text-3xl font-bold text-woork-navy dark:text-white sm:text-4xl">
                    You will be invisible here until you choose otherwise.
                </h1>

                <div className="mt-6 space-y-4 text-gray-600 dark:text-white/60">
                    <p>
                        Everyone playing this is under 18, so this works differently to most games. There is no
                        scoreboard, because a scoreboard would mean other people could see you. There is no name, no
                        photo and no school on your profile.
                    </p>
                    <p>
                        When you play as an employer, the applications you read are anonymous - including your own.
                        You will not know which one is you until the game tells you. That is the point: you will judge
                        your own application the way a stranger would.
                    </p>
                    <p>
                        Your progress is saved on this device only. Clearing your browser data clears it. Nobody at
                        woork, and no other player, can see it.
                    </p>
                </div>

                <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <h2 className="font-semibold text-woork-navy dark:text-white">Where do you live?</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
                        Employment rules for under-18s differ between states and territories. This only changes which
                        rules the game teaches you - it is not stored with anything that identifies you.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {STATE_ORDER.map((code) => (
                            <button
                                key={code}
                                onClick={() => setChoice(code)}
                                className={`rounded-xl border-2 px-3 py-3 text-left transition ${
                                    choice === code
                                        ? "border-woork-teal bg-woork-teal/5"
                                        : "border-gray-200 hover:border-woork-teal/40 dark:border-white/10"
                                }`}
                            >
                                <div className="font-bold text-woork-navy dark:text-white">{code}</div>
                                <div className="text-[11px] leading-tight text-gray-500 dark:text-white/50">
                                    {JURISDICTIONS[code].name}
                                </div>
                            </button>
                        ))}
                    </div>
                    {choice && (
                        <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm dark:bg-white/5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="font-medium text-woork-navy dark:text-white">
                                    {JURISDICTIONS[choice].name}
                                </div>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                        JURISDICTIONS[choice].lastVerified
                                            ? "bg-woork-teal/15 text-woork-teal"
                                            : "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300"
                                    }`}
                                >
                                    {JURISDICTIONS[choice].lastVerified
                                        ? `Rules checked ${JURISDICTIONS[choice].lastVerified}`
                                        : "Check with the regulator"}
                                </span>
                            </div>
                            <p className="mt-2 text-gray-600 dark:text-white/60">
                                <span className="font-medium">Regulator: </span>
                                {JURISDICTIONS[choice].regulator}
                            </p>
                            <p className="mt-2 text-gray-600 dark:text-white/60">
                                <span className="font-medium">Minimum age: </span>
                                {JURISDICTIONS[choice].minWorkingAge === null
                                    ? "No single statewide minimum"
                                    : `${JURISDICTIONS[choice].minWorkingAge} years`}
                                {" — "}
                                {JURISDICTIONS[choice].minWorkingAgeNote}
                            </p>
                            <p className="mt-2 text-gray-600 dark:text-white/60">
                                <span className="font-medium">Hours: </span>
                                {JURISDICTIONS[choice].hoursSummary}
                            </p>
                            <p className="mt-2 text-gray-600 dark:text-white/60">
                                <span className="font-medium">Most common trap: </span>
                                {JURISDICTIONS[choice].trap}
                            </p>
                            {!JURISDICTIONS[choice].lastVerified && (
                                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
                                    We could not verify this state's specific hour limits to the standard we'd want
                                    before telling you a number. Rather than guess, the game teaches you the rules
                                    that apply everywhere and points you at {JURISDICTIONS[choice].regulator} for the
                                    rest.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <input
                        type="checkbox"
                        checked={pledged}
                        onChange={(e) => setPledged(e.target.checked)}
                        className="mt-1 h-4 w-4 accent-[#00D4AA]"
                    />
                    <span className="text-sm text-gray-600 dark:text-white/60">
                        I understand this game stores my progress only on this device, that I can erase it at any
                        time, and that nothing I type here is sent anywhere.
                    </span>
                </label>

                <button
                    disabled={!choice || !pledged}
                    onClick={() => choice && onPick(choice)}
                    className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                    Start training
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */

function TrackCard({
    track,
    title,
    subtitle,
    icon,
    nextStage,
    stages,
    progress,
    score,
    maxScore,
    accent,
    onEnter,
    onOpenTrack,
}: {
    track: TrackId;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    nextStage: Stage | null;
    stages: Stage[];
    progress: ReturnType<typeof useGameProgress>["progress"];
    score: number;
    maxScore: number;
    accent: "teal" | "navy";
    onEnter: (stageId: string) => void;
    onOpenTrack: () => void;
}) {
    const trackProgress = progress![track];
    const done = stages.filter((s) => trackProgress.completedStages.includes(s.id)).length;
    const pct = Math.round((done / stages.length) * 100);
    const complete = done === stages.length;

    return (
        <div className="flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-3">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        accent === "teal" ? "gradient-teal" : "gradient-navy"
                    } text-white`}
                >
                    {icon}
                </div>
                {complete ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-woork-teal/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-woork-teal">
                        <BadgeCheck className="h-3.5 w-3.5" /> Complete
                    </span>
                ) : (
                    <span className="text-xs font-semibold text-gray-400 dark:text-white/40">
                        {done}/{stages.length} stages
                    </span>
                )}
            </div>

            <h2 className="mt-4 text-xl font-bold text-woork-navy dark:text-white">{title}</h2>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-white/60">{subtitle}</p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${
                        accent === "teal" ? "bg-woork-teal" : "bg-woork-navy dark:bg-white/60"
                    }`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <ul className="mt-4 flex-1 space-y-1.5">
                {stages.map((stage) => {
                    const doneStage = trackProgress.completedStages.includes(stage.id);
                    return (
                        <li key={stage.id}>
                            <button
                                onClick={() => onEnter(stage.id)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-gray-50 dark:hover:bg-white/5"
                            >
                                <span aria-hidden className="text-base">{stage.icon}</span>
                                <span className="flex-1 text-sm text-woork-navy dark:text-white/80">{stage.title}</span>
                                {doneStage ? (
                                    <BadgeCheck className="h-4 w-4 shrink-0 text-woork-teal" />
                                ) : (
                                    <span className="text-[10px] font-semibold uppercase text-gray-300 dark:text-white/25">
                                        {stage.order}
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
                <button
                    onClick={() => nextStage && onEnter(nextStage.id)}
                    disabled={!nextStage}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-40 ${
                        accent === "teal" ? "bg-woork-teal hover:bg-woork-teal/90" : "bg-woork-navy hover:bg-woork-navy/90"
                    }`}
                >
                    {complete ? "Revisit" : trackProgress.startedAt ? "Continue" : "Begin"}
                    <ArrowRight className="h-4 w-4" />
                </button>
                <button
                    onClick={onOpenTrack}
                    className="rounded-xl px-3 py-2.5 text-sm text-gray-500 hover:text-woork-navy dark:text-white/50"
                >
                    Overview
                </button>
            </div>
            <div className="mt-2 text-center text-[11px] text-gray-400 dark:text-white/40">
                {score} / {maxScore} points as {track === "player" ? "the worker" : "the employer"}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */

function TrackView({
    track,
    progress,
    stateCode,
    gauges,
    onExit,
    onEnterStage,
}: {
    track: TrackId;
    progress: NonNullable<ReturnType<typeof useGameProgress>["progress"]>;
    stateCode: StateCode | null;
    gauges: { player: Gauges; employer: Gauges };
    onExit: () => void;
    onEnterStage: (stageId: string) => void;
}) {
    const stages = STAGES.filter((s) => s.track === track);
    const done = stages.filter((s) => progress[track].completedStages.includes(s.id));
    const totalBeats = stages.reduce((n, s) => n + s.beats.length, 0);

    return (
        <div className="min-h-screen bg-woork-cream dark:bg-woork-navy">
            <GameHeader handle={progress.handle} onReset={() => undefined} />
            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <button onClick={onExit} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-woork-navy dark:text-white/50">
                    <ArrowLeft className="h-4 w-4" /> All training
                </button>

                <div className="mb-6 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${track === "player" ? "gradient-teal" : "gradient-navy"}`}>
                        {track === "player" ? <UserRound className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-woork-navy dark:text-white">
                            {track === "player" ? "You, asking for the job" : "You, doing the hiring"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-white/50">
                            {done.length} of {stages.length} stages · {totalBeats} decisions ·{" "}
                            {trackScore(stages, progress[track])} points
                        </p>
                    </div>
                </div>

                <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                    <MeterPanel gauges={gauges[track]} side={track} />
                </div>

                <ol className="space-y-3">
                    {stages.map((stage) => {
                        const isDone = progress[track].completedStages.includes(stage.id);
                        const beatsDone = stage.beats.filter((b) => progress[track].results[b.id]).length;
                        return (
                            <li key={stage.id}>
                                <button
                                    onClick={() => onEnterStage(stage.id)}
                                    className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-woork-teal/40 dark:border-white/10 dark:bg-white/5"
                                >
                                    <span aria-hidden className="text-2xl">{stage.icon}</span>
                                    <span className="flex-1">
                                        <span className="flex items-center gap-2">
                                            <span className="font-semibold text-woork-navy dark:text-white">{stage.title}</span>
                                            {isDone && <BadgeCheck className="h-4 w-4 text-woork-teal" />}
                                        </span>
                                        <span className="mt-0.5 block text-sm text-gray-500 dark:text-white/50">
                                            {stage.blurb}
                                        </span>
                                        <span className="mt-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-white/40">
                                            Builds: {stage.skill}
                                        </span>
                                    </span>
                                    <span className="shrink-0 text-right">
                                        <span className="block text-xs text-gray-400 dark:text-white/40">
                                            {beatsDone}/{stage.beats.length}
                                        </span>
                                        <ArrowRight className="mt-1 ml-auto h-4 w-4 text-gray-300 dark:text-white/25" />
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </main>
        </div>
    );
}

/* ------------------------------------------------------------------ */

