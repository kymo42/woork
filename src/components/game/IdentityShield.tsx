"use client";

import { useState } from "react";
import { Check, Eye, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import {
    IDENTITY_FIELDS,
    exposureLabel,
    exposureLevel,
    prematureDisclosures,
    type DisclosureState,
} from "@/lib/game/identity";

/**
 * The Identity Shield.
 *
 * The game's hard rule, made into an interface: nobody sees anything about the
 * player until the player chooses to hand it over. Disclosure is a deliberate
 * act with a visible cost, rather than a default that leaks by accident.
 */
export function IdentityShield({
    state,
    onChange,
    conversationStarted,
    readOnly = false,
}: {
    state: DisclosureState;
    onChange?: (next: DisclosureState) => void;
    conversationStarted: boolean;
    readOnly?: boolean;
}) {
    const [open, setOpen] = useState<string | null>(null);
    const exposure = exposureLevel(state);
    const leaks = prematureDisclosures(state, conversationStarted);

    const toggle = (key: string) => {
        if (readOnly || !onChange) return;
        onChange({ ...state, [key]: !state[key] });
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        {exposure <= 20 ? (
                            <ShieldCheck className="h-5 w-5 text-woork-teal" />
                        ) : (
                            <ShieldAlert
                                className={`h-5 w-5 ${exposure > 60 ? "text-woork-coral" : "text-amber-500"}`}
                            />
                        )}
                        <h3 className="font-semibold text-woork-navy dark:text-white">Identity Shield</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
                        {conversationStarted
                            ? "You've started talking to a verified employer, so you can hand things over as you need to."
                            : "Nobody can see you yet. An employer sees a nickname and nothing else - not your name, not your school, not where you live."}
                    </p>
                    <p className="mt-2 text-xs font-medium text-woork-teal">{exposureLabel(exposure)}</p>
                </div>
                <div className="shrink-0 text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/40">
                        Exposed
                    </div>
                    <div
                        className={`text-xl font-bold tabular-nums ${
                            exposure > 60 ? "text-woork-coral" : "text-woork-navy dark:text-white"
                        }`}
                    >
                        {exposure}%
                    </div>
                </div>
            </div>

            {leaks.length > 0 && (
                <div className="mt-4 rounded-xl border border-woork-coral/40 bg-woork-coral/10 p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-woork-coral">
                        <ShieldAlert className="h-4 w-4" />
                        Shared too early
                    </div>
                    <p className="mt-1 text-sm text-woork-coral/90">
                        You&apos;ve given out {leaks.map((l) => l.label.toLowerCase()).join(", ")} before any
                        conversation started. None of that helps you get hired - it just tells a stranger where to
                        find you.
                    </p>
                </div>
            )}

            <ul className="mt-4 space-y-2">
                {IDENTITY_FIELDS.map((field) => {
                    const shared = !!state[field.key];
                    const isOpen = open === field.key;
                    return (
                        <li key={field.key} className="rounded-xl bg-gray-50 dark:bg-white/5">
                            <button
                                type="button"
                                onClick={() => setOpen(isOpen ? null : field.key)}
                                className="flex w-full items-center gap-3 px-3 py-2 text-left"
                            >
                                {shared ? (
                                    <Eye className="h-4 w-4 shrink-0 text-woork-teal" />
                                ) : (
                                    <Lock className="h-4 w-4 shrink-0 text-gray-400 dark:text-white/40" />
                                )}
                                <span className="flex-1 text-sm font-medium text-woork-navy dark:text-white/90">
                                    {field.label}
                                </span>
                                <span
                                    className={`text-xs ${
                                        shared ? "text-woork-teal" : "text-gray-400 dark:text-white/40"
                                    }`}
                                >
                                    {shared ? "Visible" : "Hidden"}
                                </span>
                            </button>
                            {isOpen && (
                                <div className="px-3 pb-3 text-sm">
                                    <p className="text-gray-600 dark:text-white/60">
                                        <span className="font-medium text-woork-navy dark:text-white/90">
                                            What it gives away:{" "}
                                        </span>
                                        {field.reveals}
                                    </p>
                                    <p className="mt-1 text-gray-600 dark:text-white/60">
                                        <span className="font-medium text-woork-navy dark:text-white/90">
                                            When it&apos;s fair to share:{" "}
                                        </span>
                                        {field.whenSafe}
                                    </p>
                                    {!readOnly && onChange && (
                                        <button
                                            type="button"
                                            onClick={() => toggle(field.key)}
                                            className={`mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                                shared
                                                    ? "bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-white/80"
                                                    : "bg-woork-teal text-white hover:bg-woork-teal/90"
                                            }`}
                                        >
                                            {shared ? <Lock className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                                            {shared ? "Hide this again" : "Share this"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>

            <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-white/10 dark:text-white/50">
                woork never shows your name, school or address to another player, and there is no way for anyone to
                compare you to anyone else on this platform. What you turn on here stays on this device.
            </p>
        </div>
    );
}
