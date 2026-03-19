// woork - TypeScript Type Definitions

export type UserType = "teen" | "parent" | "employer" | "admin";

export interface Location {
    suburb: string;
    state: string;
    postcode: string;
    latitude?: number;
    longitude?: number;
}

export interface TeenProfile {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    age: number;
    bio: string;
    profilePhoto: string;
    location: Location;
    skills: Skill[];
    experience: Experience[];
    education: Education[];
    availability: Availability;
    parentId: string;
    achievements: Achievement[];
}

export interface ParentProfile {
    firstName: string;
    lastName: string;
    phone: string;
    teenIds: string[];
    notificationPrefs: NotificationPrefs;
}

export interface EmployerProfile {
    companyName: string;
    abn: string;
    industry: string;
    website: string;
    logo: string;
    description: string;
    location: Location;
    isVerified: boolean;
    subscriptionTier: "free" | "basic" | "pro";
}

export interface Skill {
    id: string;
    name: string;
    category: "soft" | "technical" | "industry" | "safety";
    level: "beginner" | "intermediate" | "advanced";
    endorsements: number;
    verified: boolean;
}

export interface Experience {
    id: string;
    title: string;
    company: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
}

export interface Education {
    id: string;
    school: string;
    year: number;
    level: string;
}

export interface Availability {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
    schoolHolidays: "available" | "limited" | "unavailable";
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: Date;
}

export interface NotificationPrefs {
    email: boolean;
    push: boolean;
    applications: boolean;
    messages: boolean;
}

export interface Job {
    id: string;
    employerId: string;
    title: string;
    description: string;
    type: "casual" | "part-time" | "internship" | "apprenticeship";
    industry: string;
    minAge: number;
    maxAge: number;
    requiredSkills: string[];
    preferredSkills: string[];
    location: Location;
    schedule: JobSchedule;
    pay: JobPay;
    status: "draft" | "active" | "paused" | "closed";
    postedAt: Date;
    expiresAt: Date;
    views: number;
    applications: number;
    isVerified: boolean;
    moderationStatus: "pending" | "approved" | "rejected";
}

export interface JobSchedule {
    hoursPerWeek: string;
    shifts: Shift[];
    flexible: boolean;
}

export interface Shift {
    day: string;
    startTime: string;
    endTime: string;
}

export interface JobPay {
    type: "hourly" | "weekly" | "monthly";
    amount: number;
    award: string;
}

export interface Application {
    id: string;
    jobId: string;
    teenId: string;
    employerId: string;
    parentId: string;
    coverMessage: string;
    resumeUrl: string;
    status: ApplicationStatus;
    parentApproval?: ParentApproval;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
}

export type ApplicationStatus =
    | "draft"
    | "pending_parent"
    | "submitted"
    | "viewed"
    | "shortlisted"
    | "interview"
    | "offered"
    | "accepted"
    | "rejected"
    | "withdrawn";

export interface ParentApproval {
    status: "pending" | "approved" | "rejected";
    approvedAt?: Date;
    notes: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderType: "teen" | "employer";
    content: string;
    isFlagged: boolean;
    flaggedReason?: string;
    moderatedBy: "ai" | "human";
    visibleTo: string[];
    createdAt: Date;
}

export interface Conversation {
    id: string;
    participants: string[];
    jobId?: string;
    lastMessage?: string;
    lastMessageAt?: Date;
    unreadCount: Record<string, number>;
}
