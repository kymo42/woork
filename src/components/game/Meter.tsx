"use client";

import type { Gauges } from "@/lib/game/types";
import { GAUGE_META, clampGauge } from "@/lib/game/engine";

/**
 * One gauge, drawn so the player can read it at a glance.
 * Colour tracks the value, not the gauge - red is "you are exposed here".
 */
export function Meter({
    gauge,
    value,
    delta,
    compact = false,
}: {
    gauge: keyof Gauges;
    value: number;
    delta?: number;
    compact?: boolean;
}) {
    const meta = GAUGE_META[gauge];
    const v = clampGauge(value);

    const barColour =
        v >= 75
            ? "bg-woork-teal"
            : v >= 55
                ? "bg-emerald-400"
                : v >= 35
                    ? "bg-amber-400"
                    : "bg-woork-coral";

    if (compact) {
        return (
            <div className="flex items-center gap-2" title={`${meta.label}: ${v}/100`}>
                <span className="text-sm" aria-hidden>{meta.icon}</span>
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-white/15">
                    <div className={`h-full rounded-full ${barColour} transition-all duration-500`} style={{ width: `${v}%` }} />
                </div>
                {typeof delta === "number" && delta !== 0 && <DeltaChip delta={delta} />}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    <span aria-hidden>{meta.icon}</span>
                    <span className="text-sm font-medium text-woork-navy dark:text-white">{meta.label}</span>
                </div>
                <div className="flex items-center gap-2">
                    {typeof delta === "number" && delta !== 0 && <DeltaChip delta={delta} />}
                    <span className="text-xs font-semibold tabular-nums text-gray-500 dark:text-white/60">{v}</span>
                </div>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/15">
                <div className={`h-full rounded-full ${barColour} transition-all duration-700`} style={{ width: `${v}%` }} />
            </div>
        </div>
    );
}

export function DeltaChip({ delta }: { delta: number }) {
    const positive = delta > 0;
    return (
        <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                positive
                    ? "bg-woork-teal/15 text-woork-teal"
                    : "bg-woork-coral/15 text-woork-coral"
            }`}
        >
            {positive ? "+" : ""}
            {delta}
        </span>
    );
}

/**
 * The whole gauge panel for one side. Privacy is shown on both sides because
 * it follows the player across the table.
 */
export function MeterPanel({
    gauges,
    side,
    deltas,
}: {
    gauges: Gauges;
    side: "player" | "employer";
    deltas?: Partial<Record<keyof Gauges, number>>;
}) {
    const order: (keyof Gauges)[] =
        side === "player"
            ? ["rights", "standing", "readiness", "security", "privacy"]
            : ["compliance", "safety", "reputation", "privacy"];

    return (
        <div className="space-y-3">
            {order.map((g) => (
                <Meter key={g} gauge={g} value={gauges[g]} delta={deltas?.[g]} />
            ))}
        </div>
    );
}
