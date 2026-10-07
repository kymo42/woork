// Loader check: proves every pure game module imports and initialises, which is
// the part `tsc --noEmit` cannot see. A module with a bad import, a typo'd
// helper or a top-level throw fails here.
//
// NOTE ON .tsx: Node's type stripping cannot transform JSX, so components cannot
// be imported here. They are verified instead by the Next dev server compiling
// and serving /play, /jobs and / -- see the verification notes in the repo.
//
// Run: npm run check:game:modules

let failures = 0;
let checks = 0;

async function load(label: string, path: string, expected: string[]) {
    checks += 1;
    try {
        const mod = await import(path);
        const missing = expected.filter((name) => !(name in mod));
        if (missing.length > 0) {
            failures += 1;
            console.log(`  FAIL  ${label}: missing exports ${missing.join(", ")}`);
            return;
        }
        console.log(`  ok    ${label} (${Object.keys(mod).length} exports)`);
    } catch (error) {
        failures += 1;
        console.log(`  FAIL  ${label}: ${(error as Error).message}`);
    }
}

console.log("=== Module loader check ===\n");

// Pure library
await load("lib/game/types", "../src/lib/game/types.ts", []);
await load("lib/game/engine", "../src/lib/game/engine.ts", [
    "STORAGE_KEY",
    "computeLicence",
    "deriveGauges",
    "deriveTrackGauges",
    "beatValue",
    "beatPoints",
    "emptyProgress",
    "loadProgress",
    "saveProgress",
    "recordAnswer",
    "markStageComplete",
    "nextIncompleteStage",
    "trackScore",
    "maxTrackScore",
    "GAUGE_META",
    "PLAYER_GAUGES",
    "EMPLOYER_GAUGES",
    "QUALIFY_THRESHOLD",
]);
await load("lib/game/scenarios", "../src/lib/game/scenarios.ts", [
    "STAGES",
    "PLAYER_STAGE_IDS",
    "EMPLOYER_STAGE_IDS",
]);
await load("lib/game/jurisdictions", "../src/lib/game/jurisdictions.ts", [
    "JURISDICTIONS",
    "STATE_ORDER",
    "LIVE_SOURCES",
    "CONTENT_VERIFIED",
]);
await load("lib/game/useGameProgress", "../src/lib/game/useGameProgress.ts", ["useGameProgress"]);

// Route and component modules are .tsx, which Node cannot type-strip. Confirm
// they exist on disk so a missing file is still caught here.
const { existsSync } = await import("node:fs");
const tsxModules = [
    "src/components/game/Meter.tsx",
    "src/components/game/Artefact.tsx",
    "src/components/game/BeatCard.tsx",
    "src/components/game/IdentityShield.tsx",
    "src/components/game/StageRunner.tsx",
    "src/components/game/MirrorStage.tsx",
    "src/components/game/LicencePanel.tsx",
    "src/components/game/MarketGate.tsx",
    "src/app/play/page.tsx",
    "src/app/jobs/page.tsx",
];
for (const file of tsxModules) {
    checks += 1;
    if (existsSync(file)) {
        console.log(`  ok    ${file} present`);
    } else {
        failures += 1;
        console.log(`  FAIL  ${file} is missing`);
    }
}

console.log(`\n${"=".repeat(48)}`);
if (failures === 0) {
    console.log(`ALL ${checks} MODULES LOADED CLEANLY`);
} else {
    console.log(`${failures} of ${checks} MODULES FAILED`);
}
process.exit(failures === 0 ? 0 : 1);
