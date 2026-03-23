// Trust/Realness System for woork
// This is NOT about rating teen performance, but about proving they're real humans

export interface TrustBadges {
    parentVerified: boolean;      // Parent has created account and linked
    jobVerified: boolean;         // An employer has confirmed they've worked
    staffReferral: boolean;       // A teen who's been verified by an employer referred them
    teenVouches: number;         // Number of teen vouches (mutual trust)
    memberDays: number;           // Days since registration (longer = more established)
    assessmentsCompleted: number; // Skills assessments completed
}

export const TRUST_LEVELS = {
    NEW: {
        label: "New Member",
        color: "gray",
        requirements: [],
        description: "Just joined - building trust"
    },
    PARENT_LINKED: {
        label: "Parent Verified",
        color: "blue",
        requirements: ["parentVerified"],
        description: "Parent has verified account"
    },
    ACTIVE: {
        label: "Active Member",
        color: "green",
        requirements: ["parentVerified", "memberDays:14"],
        description: "Verified parent & active for 2+ weeks"
    },
    ESTABLISHED: {
        label: "Established Member",
        color: "purple",
        requirements: ["parentVerified", "jobVerified"],
        description: "Parent verified & employer confirmed"
    },
    TRUSTED: {
        label: "Trusted Member",
        color: "gold",
        requirements: ["parentVerified", "jobVerified", "staffReferral"],
        description: "Highest trust - referred by employed teen"
    }
};

export function calculateTrustLevel(badges: TrustBadges): keyof typeof TRUST_LEVELS {
    const reqs = TRUST_LEVELS.TRUSTED.requirements;
    if (reqs.every(r => checkRequirement(r, badges))) return "TRUSTED";

    const estReqs = TRUST_LEVELS.ESTABLISHED.requirements;
    if (estReqs.every(r => checkRequirement(r, badges))) return "ESTABLISHED";

    const actReqs = TRUST_LEVELS.ACTIVE.requirements;
    if (actReqs.every(r => checkRequirement(r, badges))) return "ACTIVE";

    if (badges.parentVerified) return "PARENT_LINKED";

    return "NEW";
}

function checkRequirement(req: string, badges: TrustBadges): boolean {
    if (req.includes(":")) {
        const [key, value] = req.split(":");
        return (badges as any)[key] >= parseInt(value);
    }
    return (badges as any)[req] === true;
}

export function getTrustDescription(level: keyof typeof TRUST_LEVELS): string {
    return TRUST_LEVELS[level].description;
}

export function getTrustColor(level: keyof typeof TRUST_LEVELS): {
    bg: string;
    text: string;
    border: string;
} {
    const colors = {
        NEW: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
        PARENT_LINKED: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
        ACTIVE: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
        ESTABLISHED: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
        TRUSTED: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-400" }
    };
    return colors[level];
}

// Badge icons/messages
export const TRUST_INDICATORS = [
    {
        key: "parentVerified",
        icon: "👨‍👩‍👧",
        label: "Parent Verified",
        description: "A parent/guardian has verified this account"
    },
    {
        key: "jobVerified",
        icon: "💼",
        label: "Job Verified",
        description: "An employer has confirmed this teen has worked for them"
    },
    {
        key: "staffReferral",
        icon: "🤝",
        label: "Staff Referral",
        description: "Referred by a teen who has been verified by an employer"
    },
    {
        key: "assessmentsCompleted",
        icon: "🎯",
        label: "Skills Assessed",
        description: "Has completed employer skill assessments"
    }
];
