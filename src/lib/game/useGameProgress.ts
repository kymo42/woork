"use client";

import { useCallback, useEffect, useState } from "react";
import {
    clearProgress,
    emptyProgress,
    loadProgress,
    saveProgress,
} from "@/lib/game/engine";
import type { GameProgress, StateCode } from "@/lib/game/types";

/**
 * Progress lives on this device and nowhere else.
 *
 * No name, no email, no date of birth, no school is stored. There is no sync,
 * no server call and no identifier anyone could use to work out who is playing
 * or to line two players up against each other.
 */
export function useGameProgress() {
    const [progress, setProgress] = useState<GameProgress | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setProgress(loadProgress());
        setReady(true);
    }, []);

    const update = useCallback((next: GameProgress) => {
        setProgress(next);
        saveProgress(next);
    }, []);

    const mutate = useCallback(
        (fn: (current: GameProgress) => GameProgress) => {
            setProgress((current) => {
                const base = current ?? emptyProgress();
                const next = fn(base);
                saveProgress(next);
                return next;
            });
        },
        []
    );

    const reset = useCallback(() => {
        clearProgress();
        const fresh = emptyProgress();
        setProgress(fresh);
        saveProgress(fresh);
    }, []);

    const setJurisdiction = useCallback(
        (code: StateCode) => mutate((current) => ({ ...current, jurisdiction: code })),
        [mutate]
    );

    return { progress, ready, update, mutate, reset, setJurisdiction };
}
