"use client";

import { AlertTriangle, Phone, Timer, Wallet } from "lucide-react";
import type { Artefact } from "@/lib/game/types";

/**
 * Artefacts are the documents a real first job throws at you: the ad, the
 * payslip, the text from the boss, the roster. Reading them properly IS the
 * skill, so they get rendered as objects rather than described in prose.
 */
export function ArtefactView({ artefact }: { artefact: Artefact }) {
    switch (artefact.type) {
        case "job-ad":
            return (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
                    <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-white/40">
                            Job advertisement
                        </div>
                        <div className="mt-0.5 font-semibold text-woork-navy dark:text-white">{artefact.title}</div>
                        <div className="text-sm text-gray-500 dark:text-white/60">{artefact.business}</div>
                    </div>
                    <div className="space-y-2 px-4 py-3 text-sm text-gray-700 dark:text-white/70">
                        {artefact.body.map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 px-4 py-3 text-xs dark:border-white/10">
                        <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-white/60">
                            <Wallet className="h-3.5 w-3.5" /> {artefact.pay}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-white/60">
                            <Timer className="h-3.5 w-3.5" /> {artefact.hours}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-white/60">
                            <Phone className="h-3.5 w-3.5" /> {artefact.contact}
                        </span>
                    </div>
                </div>
            );

        case "payslip":
            return (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-baseline justify-between border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-white/40">
                                Payslip
                            </div>
                            <div className="font-semibold text-woork-navy dark:text-white">{artefact.business}</div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-white/60">{artefact.period}</div>
                    </div>
                    <dl className="divide-y divide-gray-100 dark:divide-white/10">
                        {artefact.lines.map((line, i) => (
                            <div key={i} className="flex items-baseline justify-between gap-4 px-4 py-2 text-sm">
                                <dt className="text-gray-600 dark:text-white/60">{line.label}</dt>
                                <dd className="font-medium tabular-nums text-woork-navy dark:text-white/90">{line.value}</dd>
                            </div>
                        ))}
                    </dl>
                    {artefact.note && (
                        <p className="border-t border-gray-100 px-4 py-2 text-xs italic text-gray-500 dark:border-white/10 dark:text-white/50">
                            {artefact.note}
                        </p>
                    )}
                </div>
            );

        case "message":
            return (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-white/40">
                        {artefact.channel}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-woork-navy dark:text-white">{artefact.from}</div>
                    <div className="mt-3 space-y-2">
                        {artefact.body.map((line, i) => (
                            <p
                                key={i}
                                className="w-fit max-w-full rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 text-sm text-gray-800 dark:bg-white/10 dark:text-white/80"
                            >
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
            );

        case "roster":
            return (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
                    <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-white/40">
                            Roster
                        </div>
                        <div className="font-semibold text-woork-navy dark:text-white">{artefact.business}</div>
                    </div>
                    <ul className="divide-y divide-gray-100 dark:divide-white/10">
                        {artefact.rows.map((row, i) => (
                            <li key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                                <span className="w-16 shrink-0 text-xs text-gray-400 dark:text-white/40">{row.day}</span>
                                <span className="flex-1">
                                    <span className="font-medium text-woork-navy dark:text-white/90">{row.name}</span>
                                    <span className="ml-1.5 text-xs text-gray-500 dark:text-white/50">({row.age})</span>
                                </span>
                                <span className="tabular-nums text-gray-700 dark:text-white/70">{row.shift}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            );

        case "application":
            return (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-white/40">
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600 dark:bg-white/10 dark:text-white/70">
                            {artefact.anonymousHandle}
                        </span>
                        <span>Application</span>
                    </div>
                    <div className="mt-2 text-sm font-semibold text-woork-navy dark:text-white">
                        Applying for: {artefact.forRole}
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm text-gray-600 dark:text-white/60">
                        {artefact.answerSummary.map((line, i) => (
                            <li key={i} className="flex gap-2">
                                <span className="text-woork-teal">·</span>
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            );

        case "document":
            return (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-white/40">
                        {artefact.label}
                    </div>
                    <div className="mt-2 space-y-2 text-sm text-gray-700 dark:text-white/70">
                        {artefact.body.map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                </div>
            );

        default:
            return null;
    }
}

/** Small flag used inside debriefs to call out a real-world trap. */
export function TrapFlag({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 rounded-xl border border-woork-coral/40 bg-woork-coral/10 px-3 py-2 text-sm text-woork-coral">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{children}</span>
        </div>
    );
}
