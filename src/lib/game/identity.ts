// woork GAME - the Identity Shield's rules
//
// Hard rule this encodes: a player under 18 never has personal identifying
// information visible to anyone until the player themselves chooses to disclose
// it, and then only to a specific, verified employer they have decided to talk to.
//
// Kept separate from the component so both the engine and the UI can use it
// without an import cycle.

export type IdentityField = {
    key: string;
    label: string;
    /** What it actually reveals about you if shared. */
    reveals: string;
    /** When it is reasonable to hand this over. */
    whenSafe: string;
    /** Sharing this before a real conversation is a mistake. */
    tooEarly: boolean;
    /** How much of your exposure this accounts for, 0-100 total. */
    weight: number;
};

export const IDENTITY_FIELDS: IdentityField[] = [
    {
        key: "handle",
        label: "A nickname you choose",
        reveals: "Nothing about you. Not even your real name.",
        whenSafe: "Immediately. This is all an employer needs to start with.",
        tooEarly: false,
        weight: 0,
    },
    {
        key: "availability",
        label: "When you can work",
        reveals: "That you go to school, and roughly your timetable.",
        whenSafe: "When you apply. This is the main thing they need, and the safest useful thing to give.",
        tooEarly: false,
        weight: 6,
    },
    {
        key: "suburb",
        label: "Your suburb (not your address)",
        reveals: "Roughly where you are, so they can tell you if the trip is realistic.",
        whenSafe: "When you apply for a job that is actually near you.",
        tooEarly: false,
        weight: 10,
    },
    {
        key: "experience",
        label: "What you've done before",
        reveals: "Your school teams, volunteer work, family business - and often your school.",
        whenSafe: "When you apply. Keep it to the work, not the people.",
        tooEarly: false,
        weight: 6,
    },
    {
        key: "legalName",
        label: "Your full legal name",
        reveals: "Who you actually are.",
        whenSafe: "After they have offered you the job and need paperwork drawn up.",
        tooEarly: true,
        weight: 16,
    },
    {
        key: "dob",
        label: "Your date of birth",
        reveals: "Your exact age, and your birthday.",
        whenSafe: "Once you are being hired, because age rules and your pay rate depend on it.",
        tooEarly: true,
        weight: 12,
    },
    {
        key: "phone",
        label: "Your mobile number",
        reveals: "A direct line to you, at any hour.",
        whenSafe: "After a conversation has started on the platform, or once you have an interview.",
        tooEarly: true,
        weight: 14,
    },
    {
        key: "school",
        label: "Which school you go to",
        reveals: "Where you can be found during the day.",
        whenSafe: "Only if a formal school-based program or traineeship genuinely requires it.",
        tooEarly: true,
        weight: 16,
    },
    {
        key: "address",
        label: "Your home address",
        reveals: "Where you live.",
        whenSafe: "Almost never before you are employed. They need your suburb to roster you, not your street.",
        tooEarly: true,
        weight: 16,
    },
    {
        key: "socials",
        label: "Your social media handles",
        reveals: "Years of your life, your friends, your family, your location.",
        whenSafe: "You are not obliged to hand these over at all. Ever.",
        tooEarly: true,
        weight: 14,
    },
];

export type DisclosureState = Record<string, boolean>;

/**
 * Every field starts hidden except the nickname.
 *
 * That is the point: nothing about the player is visible until the player turns
 * it on, one deliberate choice at a time. A shield that starts half-open teaches
 * the wrong instinct.
 */
export function defaultDisclosure(): DisclosureState {
    const state: DisclosureState = {};
    IDENTITY_FIELDS.forEach((field) => {
        state[field.key] = field.key === "handle";
    });
    return state;
}

/** How much of the player is exposed, 0 (sealed) to 100 (everything out there). */
export function exposureLevel(state: DisclosureState): number {
    const total = IDENTITY_FIELDS.reduce((sum, f) => (state[f.key] ? sum + f.weight : sum), 0);
    return Math.min(100, total);
}

/** Fields shared before a real conversation has started. */
export function prematureDisclosures(
    state: DisclosureState,
    conversationStarted: boolean
): IdentityField[] {
    if (conversationStarted) return [];
    return IDENTITY_FIELDS.filter((f) => f.tooEarly && state[f.key]);
}

/** Human-readable summary for the meters and the licence panel. */
export function exposureLabel(exposure: number): string {
    if (exposure <= 15) return "Sealed - employers see a nickname and nothing else";
    if (exposure <= 35) return "Minimal - enough to be considered, nothing that locates you";
    if (exposure <= 65) return "Open - you have handed over things that identify you";
    return "Exposed - far more of you is out there than a job requires";
}
