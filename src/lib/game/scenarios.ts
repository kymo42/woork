// woork GAME - scenario content
//
// Every beat here is a decision a real Australian teenager or a real small
// employer has to make, and every one carries a source a player can check.
//
// PAY FIGURES: deliberately NOT hard-coded. Minimum wages and junior rates are
// re-set by the annual wage review, so the game teaches the RULE and the method
// and points at the live Fair Work Pay Calculator. A game that teaches a stale
// dollar figure is worse than no game.

import type { Stage } from "./types";
import { LIVE_SOURCES as S } from "./jurisdictions";

/* ================================================================== *
 * WORKER TRACK - "You, asking for the job"
 * ================================================================== */

const identity: Stage = {
    id: "identity",
    track: "player",
    order: 1,
    title: "Getting Real",
    skill: "the legal groundwork before anyone will put you on a roster",
    blurb: "What you need before you can be paid lawfully - and what nobody has the right to ask you for.",
    icon: "🪪",
    beats: [
        {
            id: "p-identity-1",
            kind: "brief",
            setup:
                "You're 15 and you want a job at the shops near you. Before you send a single application, two things have to be true: the government has to know you exist as a worker, and the person hiring you has to be able to pay you without breaking the law.\n\nThis stage is about getting those two things right, because getting them wrong is the most common way teenagers lose money before they've even started.",
            briefBody: [
                "Nothing in this stage is about being impressive. It's admin, and admin is where most first jobs go wrong.",
                "You will be asked to decide what to hand over and when. That matters more for you than for an adult, because you're under 18.",
            ],
            options: [],
            debrief: "Admin first",
            bottomLine:
                "Two documents make you employable: a tax file number, and proof you can be paid into an account. Everything else an employer asks for should be earning its place.",
            source: S.youngWorkers,
        },
        {
            id: "p-identity-2",
            kind: "decision",
            setup:
                "A café near you has a sign up: 'Junior staff wanted, start this week.' You walk in. The owner is friendly, says she'd love to give you a go, and asks you to fill in a form tonight so you can start Saturday.\n\nThe form is a Tax File Number declaration. You don't have a tax file number yet.",
            options: [
                {
                    id: "a",
                    label: "Apply for a TFN now, and tell her you'll have it before your first shift",
                    detail: "It's free, and it can be done online. It usually arrives in a couple of weeks.",
                    effects: { readiness: 12, rights: 8 },
                    outcome:
                        "Correct. You can start work before your TFN arrives - you just complete the declaration once you have it. What you must not do is ignore the form.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Start Saturday anyway and sort the tax thing out later",
                    detail: "You're keen. It's only a few shifts.",
                    effects: { readiness: -10, security: -15 },
                    outcome:
                        "This is the one that quietly costs teenagers money. If your employer has no TFN for you, they are required to withhold tax at the highest rate. You can end up working a full Saturday and seeing a fraction of it - and you have to chase the rest back at tax time.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "Ask if you could be paid cash in hand instead, to keep it simple",
                    detail: "No forms, no tax, just money.",
                    effects: { security: -20, rights: -15, readiness: -10 },
                    outcome:
                        "Cash in hand usually means no payslip, no super, no record of your hours and no workers compensation if you're hurt. It also means that if you're underpaid, you have almost nothing to prove it with. It is not a favour to you.",
                    correct: false,
                    trap: true,
                },
            ],
            debrief: "Get the TFN before you start",
            bottomLine:
                "Applying for a tax file number is free and takes minutes online. You can start work while it's being processed - but if your employer never gets one, they must withhold tax at the top rate. That's your money sitting in someone else's account until you claim it back.",
            source: S.tfn,
        },
        {
            id: "p-identity-3",
            kind: "audit",
            auditPrompt:
                "The owner sends you a message listing everything she needs before Saturday. Tick every item she is NOT entitled to ask you for at this stage.",
            setup:
                "You've got a good feeling about this place. Then the message arrives, and it's a longer list than you expected.\n\nSome of these are normal and reasonable. Some of them are not hers to ask for yet - or at all.",
            artefact: {
                type: "message",
                from: "Café owner",
                channel: "Message",
                body: [
                    "Great to meet you! Before Saturday I'll need:",
                    "1. Your tax file number declaration",
                    "2. Your bank account details so I can pay you",
                    "3. A copy of your passport or birth certificate",
                    "4. Your home address",
                    "5. Your Instagram so I can see you're a normal kid",
                    "6. Which school you go to",
                    "7. $80 for your uniform and the food safety course",
                ],
            },
            options: [
                {
                    id: "address",
                    label: "Your home address",
                    effects: { privacy: -12, rights: 6 },
                    outcome:
                        "Correct to flag. She needs your suburb to work out your roster and travel, not your street address. Before you've started, there is no reason to hand over where you live.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "socials",
                    label: "Your Instagram",
                    effects: { privacy: -18, rights: 8 },
                    outcome:
                        "Correct to flag, and this is the big one. You never have to hand over social media to get a job. It reveals your friends, your family, your movements and years of your life - and it tells an employer nothing about whether you can do the work.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "school",
                    label: "Which school you go to",
                    effects: { privacy: -12, rights: 4 },
                    outcome:
                        "Correct to flag at this stage. She needs to know when you're available, not where you can be found during the day. Only a formal school-based program genuinely needs the school's name.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "money",
                    label: "$80 for the uniform and the food safety course",
                    effects: { security: -15, rights: 10 },
                    outcome:
                        "Correct to flag, and it is unlawful. An employer cannot make you pay for your own uniform or training if it is required for the job. If the business needs you to hold a certificate, the business pays. Asking a 15-year-old for $80 before the first shift is a well-known pattern.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "tfn",
                    label: "Your tax file number declaration",
                    effects: {},
                    outcome:
                        "This one is normal. She must collect it, and you must complete it. Not a problem.",
                    correct: false,
                },
                {
                    id: "bank",
                    label: "Your bank account details",
                    effects: {},
                    outcome:
                        "Normal and necessary. She cannot pay you without them, and paying into an account is exactly what you want - it creates a record.",
                    correct: false,
                },
                {
                    id: "id",
                    label: "A copy of your passport or birth certificate",
                    effects: {},
                    outcome:
                        "Reasonable. Under the Fair Work Act an employer needs to keep records proving your age, because your age sets your pay rate. Just don't hand over the physical original documents.",
                    correct: false,
                },
            ],
            debrief: "Three of those are hers to ask. Four are not.",
            bottomLine:
                "An employer may ask for your tax file number declaration, your bank details and proof of age. They may not charge you for uniforms or mandatory training, and they have no need for your home address, your school or your social media before you are employed. If a job asks for money from you, that is the moment to walk away and tell an adult.",
            source: S.unpaidTrials,
        },
    ],
};

const search: Stage = {
    id: "search",
    track: "player",
    order: 2,
    title: "Reading the Advert",
    skill: "spotting a bad job before you waste a single hour on it",
    blurb: "Most traps are visible in the advertisement. This stage teaches you to see them.",
    icon: "🔍",
    beats: [
        {
            id: "p-search-1",
            kind: "brief",
            setup:
                "Job ads for young people are written to sound exciting. That's fine - but some of them are also written to get around the law, and the tells are almost always in the wording.\n\nYou're about to read four advertisements for the same kind of work. Three of them are ordinary. One of them is a trap that would cost you money and rights.",
            briefBody: [
                "Read every ad looking for what it does NOT say as much as what it does. Missing pay rate, missing hours, and 'must have an ABN' are all signals.",
                "You are allowed to ask for the pay rate before you agree to anything. An employer who won't tell you is telling you something.",
            ],
            options: [],
            debrief: "Ads give the game away",
            bottomLine:
                "The Fair Work system requires that you be paid at least the minimum for your age and the work you do. Any ad that tries to route around that - through an ABN, an unpaid trial, or cash - is a warning, not an opportunity.",
            source: S.shamContracting,
        },
        {
            id: "p-search-2",
            kind: "audit",
            auditPrompt: "Tick every advertisement that is trying to get around the law.",
            setup:
                "Four ads, one suburb, one week. You want casual work after school and on weekends.\n\nOne of these will pay you properly and treat you lawfully. The others will not.",
            artefact: {
                type: "document",
                label: "Local job ads",
                body: [
                    "AD 1 — 'Junior café all-rounder. Casual, award rates, weekday afternoons and Saturdays. Bring your TFN. Uniform provided.'",
                    "AD 2 — 'Kitchen hand wanted. Must have own ABN. Cash in hand, flat rate, start tomorrow.'",
                    "AD 3 — 'Retail assistant. We'll give you a 3-hour unpaid trial shift to see if you fit, then we'll talk about pay.'",
                    "AD 4 — 'Event staff. Casual, paid at the award rate for your age, 4-hour minimum shifts, super paid.'",
                ],
            },
            options: [
                {
                    id: "ad2",
                    label: "AD 2 - must have own ABN, cash in hand",
                    effects: { rights: 12, security: 8 },
                    outcome:
                        "Correct. This is sham contracting. If someone tells you where to be, when to be there and how to do the job, you are an employee - and it is unlawful for them to push you onto an ABN to avoid paying your entitlements. It is also well under any lawful minimum rate.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "ad3",
                    label: "AD 3 - unpaid trial shift before talking about pay",
                    effects: { rights: 12, security: 8 },
                    outcome:
                        "Correct. A trial is only lawfully unpaid if it is a brief demonstration of your skill with no real productive value to the business. A full 3-hour shift doing the actual job is work, and work must be paid. Unpaid trials are one of the biggest sources of stolen wages from young people.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "ad1",
                    label: "AD 1 - café all-rounder at award rates",
                    effects: {},
                    outcome:
                        "This one is clean. It states the pay basis, the shifts and the requirements, and it doesn't ask you for money or an ABN.",
                    correct: false,
                },
                {
                    id: "ad4",
                    label: "AD 4 - event staff with a 4-hour minimum",
                    effects: {},
                    outcome:
                        "Also clean, and unusually good. A stated minimum shift length protects you, because casuals generally have a minimum engagement and you cannot be called in for twenty minutes.",
                    correct: false,
                },
            ],
            debrief: "Two of those four were traps",
            bottomLine:
                "You should never be asked for an ABN to do ordinary shift work, and you should never work a full shift for free. Both patterns are common against teenagers precisely because teenagers don't know they're unlawful.",
            source: S.shamContracting,
        },
        {
            id: "p-search-3",
            kind: "decision",
            setup:
                "You've found a job you actually want: junior retail assistant, ten minutes from home, Saturdays and two afternoons. The ad is lawful. You're about to apply.\n\nYour friend says the best way in is to just walk in with your resume and ask for the manager, and to put your mobile number and home address right at the top so they can 'see you're serious'.",
            options: [
                {
                    id: "a",
                    label: "Apply through the platform, with your availability, your experience, and a referee - no address",
                    effects: { standing: 12, privacy: 6, readiness: 6 },
                    outcome:
                        "Right. An employer is trying to answer one question: can this person reliably turn up when I need them? Availability, a referee and something real you've done answers it. Your street address answers nothing and hands over where you live.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Put your full name, address, school and mobile at the top, plus your socials",
                    effects: { privacy: -20, standing: 2 },
                    outcome:
                        "You've given away your location, your daily whereabouts and access to years of your personal life, and you have not told them anything that helps you get the job. Seriousness is shown by what you can do, not by how much of yourself you surrender.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "Walk in and ask for the manager with a printed resume and no advance contact",
                    effects: { standing: 4, readiness: 4 },
                    outcome:
                        "Not wrong, and plenty of people get jobs this way. It's just the lowest-percentage move: the manager is usually mid-shift, you get thirty seconds, and you'll likely be told to apply online anyway.",
                    correct: false,
                },
            ],
            debrief: "Availability is the currency",
            bottomLine:
                "For entry-level work, the single most valuable thing you can tell an employer is exactly when you are free. Give them that, give them one person who will vouch for you, and keep your address off the application until you have the job.",
            source: S.discrimination,
        },
    ],
};

const apply: Stage = {
    id: "apply",
    track: "player",
    order: 3,
    title: "The Interview",
    skill: "holding your ground politely when an interview goes somewhere it shouldn't",
    blurb: "There are questions an employer is not allowed to ask you. This stage makes sure you recognise them.",
    icon: "🗣️",
    beats: [
        {
            id: "p-apply-1",
            kind: "decision",
            setup:
                "They've asked you in for a chat on Saturday morning. The manager is friendly and the shop is busy.\n\nShe asks you three things: what days you're free, whether you've ever handled a register, and whether you have someone who could speak for you if she rang them.",
            options: [
                {
                    id: "a",
                    label: "Answer all three plainly, and give your soccer coach as a referee",
                    effects: { standing: 12, readiness: 8 },
                    outcome:
                        "Good. This is the whole interview at this level. They want to know your hours, whether you can learn the till, and whether someone will confirm you're reliable. You answered all three.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Give your best friend's mum as a referee",
                    effects: { standing: -10, readiness: -6 },
                    outcome:
                        "Risky. If she's asked how she knows you and it comes out that she's a family friend, your credibility takes the hit. A coach, a teacher, a team manager or someone you've volunteered for carries far more weight because they've actually seen you work.",
                    correct: false,
                },
                {
                    id: "c",
                    label: "Say you're free whenever, so you look keen",
                    effects: { standing: -8, readiness: -4 },
                    outcome:
                        "'Whenever' sounds flexible but reads as unreliable, because it tells her you haven't thought about your own timetable. It also sets you up to be rostered during school exams. Being specific is what makes you easy to hire.",
                    correct: false,
                    trap: true,
                },
            ],
            debrief: "Specific beats keen",
            bottomLine:
                "Name your actual free days. Choose a referee who has seen you turn up and do something - a coach, a teacher, a coordinator. 'Whenever' is the answer that gets applications put down.",
            source: S.discrimination,
        },
        {
            id: "p-apply-2",
            kind: "decision",
            setup:
                "Near the end, the manager leans in and says: 'Just between us - are you planning on getting pregnant any time soon? And what's going on with your mental health? I've had kids your age go off the rails and I can't afford that.'\n\nYou're 16. You really want this job.",
            options: [
                {
                    id: "a",
                    label: "Say politely that you'd rather keep those private, and offer to talk about the job instead",
                    effects: { rights: 16, standing: 6 },
                    outcome:
                        "Correct, and it takes nerve. Those questions are not lawful. An employer may not ask about pregnancy, relationship status, disability or health as part of deciding who gets the job. You are allowed to decline, and you can redirect to the actual work.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Answer everything honestly, because you don't want to seem like you're hiding something",
                    effects: { privacy: -20, rights: -12, standing: -4 },
                    outcome:
                        "Understandable, and it happens constantly. But you've now handed over private health and personal information that had no bearing on whether you can stack shelves - and it's information that can be used against you later. You were never obliged to answer.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "Say 'that's illegal' and walk out",
                    effects: { rights: 10, standing: -8 },
                    outcome:
                        "You're legally right, and you've protected yourself. But you've also ended an interview that might have been run by someone who simply doesn't know the rules. The stronger move is to decline the questions, not the job - at least until you know whether the workplace is actually bad.",
                    correct: false,
                },
            ],
            debrief: "You can decline a question",
            bottomLine:
                "Employers may not ask about pregnancy, relationship status, disability, religion, race, age or medical history when deciding who to hire. If they do, you can decline and steer back to the work. If it keeps happening, or the decision seems to turn on it, that is a complaint you can make - for free, and without a lawyer.",
            source: S.discrimination,
        },
        {
            id: "p-apply-3",
            kind: "decision",
            setup:
                "Two days later you get the call: you've got the job. Casual, Saturdays and Thursday afternoons, starting in a fortnight.\n\nBy the end of your first week, you should have received a document you may never have heard of - and it's one of the most useful things you'll be handed.",
            options: [
                {
                    id: "a",
                    label: "The Fair Work Information Statement - it sets out your minimum rights and where to get help",
                    effects: { readiness: 10, rights: 10 },
                    outcome:
                        "Correct. Your employer must give you the Fair Work Information Statement when you start, and casuals must also receive the Casual Employment Information Statement. Read it. It is the plain-English version of everything this game has taught you.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "A superannuation choice form, which you have to fill in",
                    effects: { readiness: 4 },
                    outcome:
                        "Partly right - you may be given a super choice form and you should complete it - but it is not the key document here, and as an under-18 working under 30 hours a week your employer generally does not owe you super yet.",
                    correct: false,
                },
                {
                    id: "c",
                    label: "Your employment contract, which you must sign before your first shift",
                    effects: { readiness: 2 },
                    outcome:
                        "Not it. A contract is common but not compulsory for casual work, and signing one doesn't replace the information statement your employer is legally required to give you.",
                    correct: false,
                },
            ],
            debrief: "You get a rights document on day one",
            bottomLine:
                "On starting, your employer must give you the Fair Work Information Statement, and casuals also get the Casual Employment Information Statement. Keep it. It tells you your minimum rate, your breaks, and who to ring if something is wrong - and ringing them is free.",
            source: S.fairWorkStatement,
        },
    ],
};

const deliver: Stage = {
    id: "deliver",
    track: "player",
    order: 4,
    title: "Your First Weeks",
    skill: "knowing what you're owed, and saying something when it's wrong",
    blurb: "Trials, payslips, safety and hours. This is where money is actually lost and won.",
    icon: "⏱️",
    beats: [
        {
            id: "p-deliver-1",
            kind: "decision",
            setup:
                "Before your first real shift, the manager asks you to come in for a two-hour trial on Thursday 'just to see how you go - I won't put it through the books, it's easier'.\n\nThursday afternoon the shop is flat out. You serve customers, restock the fridge and clean the milk line. You have definitely produced value for this business.",
            options: [
                {
                    id: "a",
                    label: "Ask to be paid for it, and explain that a productive trial shift is work",
                    effects: { rights: 18, security: 12 },
                    outcome:
                        "Correct. A trial is only lawfully unpaid if it's a short demonstration of skill with no real benefit to the business. Two hours of serving customers during a rush is not a demonstration - it's a shift. Asking is awkward for about four seconds.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Do it unpaid - it's only two hours and you don't want to make it weird",
                    effects: { security: -18, rights: -14 },
                    outcome:
                        "This is the single most common way young workers are underpaid, and the amount is small enough that it feels petty to mention. It isn't. Two unpaid hours a week for a year is a fortnight of your life given away.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "Refuse to come in at all until you're officially on the roster",
                    effects: { rights: 8, standing: -12 },
                    outcome:
                        "You've avoided the free labour, but you've also come across as difficult before you've started. There's a middle path: come in, do the trial, and ask to be paid for it. That's the move that keeps both your money and the job.",
                    correct: false,
                },
            ],
            debrief: "A productive trial is a paid shift",
            bottomLine:
                "Unpaid trials are lawful only when they are a brief, genuine demonstration of skill that gives the business no real benefit. If you're serving customers or doing the actual job, you're working, and working is paid. Asking is your right - and it's a completely normal thing to ask.",
            source: S.unpaidTrials,
        },
        {
            id: "p-deliver-2",
            kind: "audit",
            auditPrompt: "Tick every line that is legally wrong or missing from this payslip.",
            setup:
                "Your first payslip arrives by email. You worked 14 hours across two weeks.\n\nSomething about the number at the bottom looks low, but you're not sure how to argue with a payslip. Luckily, a payslip has to contain specific things - and once you know the list, checking one takes about a minute.",
            artefact: {
                type: "payslip",
                business: "Harbourside Café",
                period: "Fortnight ending 14 March",
                lines: [
                    { label: "Hours worked", value: "14" },
                    { label: "Rate", value: "Not shown" },
                    { label: "Gross pay", value: "$182.00" },
                    { label: "Tax withheld", value: "Not shown" },
                    { label: "Superannuation", value: "Not shown" },
                    { label: "Net pay", value: "$182.00" },
                ],
                note: "No employer ABN, no pay period start date, no employee name.",
            },
            options: [
                {
                    id: "rate",
                    label: "The hourly rate isn't shown",
                    effects: { rights: 10, security: 6 },
                    outcome:
                        "Correct. A payslip must state your rate of pay, and if you're paid an hourly rate it must show the ordinary hourly rate. Without it you cannot check whether you were paid the minimum for your age.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "tax",
                    label: "The tax withheld isn't shown",
                    effects: { rights: 8, security: 6 },
                    outcome:
                        "Correct. The amount withheld for tax must appear. This is also how you check it against the tax the ATO says was withheld - if they don't match, that's a problem you want to find early.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "period",
                    label: "The start of the pay period isn't shown",
                    effects: { rights: 8 },
                    outcome:
                        "Correct. A payslip must show both the start and end of the pay period. Otherwise you can't match the hours claimed to the hours you actually worked.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "abn",
                    label: "The employer's ABN isn't shown",
                    effects: { rights: 6 },
                    outcome:
                        "Correct. The employer's name and ABN must appear on a payslip. An employer who won't put their ABN on paper is an employer you should be careful with.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "hours",
                    label: "The hours worked",
                    effects: {},
                    outcome:
                        "This is actually present and correctly shown. Hours worked is one of the things a payslip must contain, and it's here.",
                    correct: false,
                },
                {
                    id: "super_note",
                    label: "Superannuation isn't shown",
                    effects: {},
                    outcome:
                        "Genuinely not required here. If you are under 18 you are only owed super for a week in which you work MORE than 30 hours - and those hours are the actual hours that week, not an average across the fortnight. You worked 7 hours a week, so there is nothing to show. Know the rule though, because employers get this wrong in both directions.",
                    correct: false,
                },
            ],
            debrief: "Four things were missing",
            bottomLine:
                "Every payslip must show your name, the employer's name and ABN, the pay period, your rate of pay, your hours, gross pay, tax withheld, net pay and any deductions. Missing rate, missing tax and missing ABN are the three classic signs of an employer who is either disorganised or deliberately vague. Either way, ask in writing.",
            source: S.paySlips,
        },
        {
            id: "p-deliver-3",
            kind: "decision",
            setup:
                "It's your fourth week. The manager asks you to clean the inside of the industrial freezer with a hose and a chemical drum that has no label on it. There are no gloves, and no one has shown you how to use it.\n\nShe adds: 'Just get it done before close, and don't spray near the power point - last kid got a shock doing it and he was fine.'",
            options: [
                {
                    id: "a",
                    label: "Say you won't do it until you've been shown how and have the right gear - and mean it",
                    effects: { rights: 16, security: 8 },
                    outcome:
                        "Correct. You have a legal right to refuse work that is unsafe, and an unlabelled chemical near water and power, with no PPE and no training, is unsafe. You can be asked to do reasonable tasks - you cannot be asked to risk a shock or a chemical burn.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Do it carefully, but take a photo of the unlabelled drum first",
                    effects: { rights: 8, security: 4 },
                    outcome:
                        "Better than nothing, and the photo is genuinely smart evidence. But you've still taken the risk. Photographing a hazard is not a substitute for refusing it - and if you're injured, evidence doesn't undo an injury.",
                    correct: false,
                },
                {
                    id: "c",
                    label: "Do it - everyone has to do gross jobs sometimes",
                    effects: { rights: -16, security: -10 },
                    outcome:
                        "Unlabelled chemicals without PPE, next to a power point, with a manager who has already seen another teenager get shocked, is not a gross job. It's a hazard. In Australia you cannot be made to do it, and if you're hurt the business faces the penalty - but you're the one hurt.",
                    correct: false,
                    trap: true,
                },
            ],
            debrief: "You are allowed to say no to unsafe work",
            bottomLine:
                "Under work health and safety law you have the right to refuse work that puts you at serious risk, and your employer owes you training, supervision, protective equipment and safe chemicals. A manager who tells you it's fine because the last person was 'fine' is describing a hazard, not a precedent.",
            source: S.whs,
        },
    ],
};

/* ================================================================== *
 * EMPLOYER TRACK - "You, doing the hiring"
 * ================================================================== */

const lawful: Stage = {
    id: "lawful",
    track: "employer",
    order: 1,
    title: "Writing the Ad",
    skill: "recruiting lawfully, so the right young person actually applies",
    blurb: "Now you're the one holding the pen. Most employers break the law in the ad, without meaning to.",
    icon: "📝",
    beats: [
        {
            id: "e-lawful-1",
            kind: "brief",
            setup:
                "You run a café. Two juniors have left for uni and you need weekend and after-school cover. You have a budget, a roster gap, and about two weeks.\n\nYou're about to write the advertisement. This is where you decide, in writing, whether you're going to be a good employer or a problem one - and the law cares about the wording.",
            briefBody: [
                "Here's what you should know first. Young workers are covered by the same Fair Work system as everyone else, but with extra rules about age, school hours and the types of work they may do.",
                "Your obligations start before anyone is hired. A job advertisement that asks for the wrong things is itself a breach.",
                "You will now make the decisions that a real small-business owner makes. Watch what it costs you when you get them wrong.",
            ],
            options: [],
            debrief: "You are the employer now",
            bottomLine:
                "You cannot advertise a job that asks for unlawful things, and you cannot pay a young worker less than the minimum for their age and the award that covers the work. Get the ad and the rate right and the rest of the job gets much easier.",
            source: S.discrimination,
        },
        {
            id: "e-lawful-2",
            kind: "audit",
            auditPrompt: "Tick every line in your draft advertisement that you must remove or change.",
            setup:
                "You've drafted an ad. It's the kind of ad that gets written in five minutes at the end of a shift, and it sounds like most of the ones you've seen.\n\nBefore you publish it, go through it properly.",
            artefact: {
                type: "job-ad",
                business: "Harbourside Café",
                title: "Junior café staff - must be reliable",
                body: [
                    "We need a junior all-rounder for weekends.",
                    "Must be 16 or 17 - we want someone young and energetic.",
                    "Female preferred, as you'll be working alongside our male kitchen staff.",
                    "Must have a car and a driver's licence.",
                    "You'll do a 4-hour unpaid trial before we decide.",
                    "You must pay $60 for your food handling certificate and $40 for your uniform.",
                    "Must be an Australian citizen and speak clear English.",
                    "Bring your own ABN if you want to be paid as a contractor.",
                ],
                pay: "$16/hr, cash",
                hours: "Casual, weekends",
                contact: "Ring Dave after 9pm",
            },
            options: [
                {
                    id: "age",
                    label: "\"Must be 16 or 17 - we want someone young and energetic\"",
                    effects: { compliance: 10, reputation: 4 },
                    outcome:
                        "Correct. You can set a lawful minimum age where the work or the law requires it, but you cannot ask for a particular age because you prefer it. \"We want someone young\" is age discrimination, and it also exposes you - a 15-year-old who can lawfully do this job has been unlawfully excluded.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "gender",
                    label: "\"Female preferred, as you'll be working alongside our male kitchen staff\"",
                    effects: { compliance: 12, reputation: 6 },
                    outcome:
                        "Correct, and this is the clearest breach on the page. Gender is a protected attribute. Staffing comfort is not a lawful reason to exclude candidates. This single line could cost you far more than the hire is worth.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "car",
                    label: "\"Must have a car and a driver's licence\"",
                    effects: { compliance: 8, reputation: 4 },
                    outcome:
                        "Correct to question. Unless driving is genuinely part of the role, this excludes most 15 and 16-year-olds and many others, for no work-related reason. If the job is behind a counter, a licence is irrelevant.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "trial",
                    label: "\"You'll do a 4-hour unpaid trial before we decide\"",
                    effects: { compliance: 12 },
                    outcome:
                        "Correct. A productive four-hour shift is not a lawful unpaid trial, it's unpaid work - and advertising it in advance makes it deliberate. This is exactly the pattern the regulator pursues.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "fees",
                    label: "Charging the worker $60 for a certificate and $40 for a uniform",
                    effects: { compliance: 12 },
                    outcome:
                        "Correct. You cannot pass the cost of a uniform or mandatory training onto the worker. If the business needs the certificate, the business pays for it. Deducting it from a young person's first pay is a fast route to a complaint.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "english",
                    label: "\"Must be an Australian citizen and speak clear English\"",
                    effects: { compliance: 10 },
                    outcome:
                        "Correct. Citizenship and accent-based requirements are discriminatory and have nothing to do with making coffee. You may require the right to work in Australia - that is a different and lawful question, asked at the right time.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "abn",
                    label: "\"Bring your own ABN if you want to be paid as a contractor\"",
                    effects: { compliance: 14 },
                    outcome:
                        "Correct, and this is the most serious line on the page. You would be directing when, where and how they work, which makes them an employee. Pushing them onto an ABN to avoid their entitlements is sham contracting, and it is unlawful.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "junior",
                    label: "\"We need a junior all-rounder for weekends\"",
                    effects: {},
                    outcome:
                        "This one is fine. 'Junior' is a recognised pay classification, and stating the shifts is exactly what you should be doing.",
                    correct: false,
                },
            ],
            debrief: "Seven of the eight lines were problems",
            bottomLine:
                "An ad may state the shifts, the duties, the lawful minimum age where it genuinely applies, and the pay basis. It may not select by age preference, gender, citizenship, accent, or access to a car, and it may not demand an ABN, an unpaid trial, or payment from the worker. Almost every one of those mistakes is made by well-meaning small businesses - and it is the business that pays for it.",
            source: S.discrimination,
        },
        {
            id: "e-lawful-3",
            kind: "decision",
            setup:
                "You've fixed the ad. Now you have to put a rate on it, and this is where you're genuinely unsure.\n\nYou're hiring a 15-year-old, a 16-year-old and a 17-year-old for the same café work. You want to offer one flat rate to all three, paid in cash at the end of each shift, because it's simple and they're all doing the same job.",
            options: [
                {
                    id: "a",
                    label: "Check the award and the junior rates, pay each person the minimum for their age, and put them on the books",
                    effects: { compliance: 16, reputation: 8, safety: 4 },
                    outcome:
                        "Correct. Junior pay rates are a percentage of the adult rate for the classification and they rise with age, so a 15, 16 and 17-year-old are on three different minimums even doing identical work. Put them on the books, issue payslips and keep records.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Pay all three one flat rate in cash - it's more than some places pay and they're happy",
                    effects: { compliance: -16, reputation: -8, safety: -6 },
                    outcome:
                        "This fails in several directions at once. You're likely underpaying the older ones, you're leaving them with no payslip and no record of hours, you're likely failing your super and record-keeping obligations, and if one is injured you have a serious problem. 'They're happy' is not a defence.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "Pay one flat rate but put them all on the books with proper payslips",
                    effects: { compliance: -8, reputation: 2 },
                    outcome:
                        "Better, and the paperwork is right - but a flat rate still ignores the junior percentage scale, so at least one of them is being underpaid. Payslips make an underpayment provable, which is not the outcome you want.",
                    correct: false,
                },
            ],
            debrief: "Same work does not mean the same rate",
            bottomLine:
                "Junior rates are a percentage of the adult rate for the relevant classification and increase with the worker's age, so three people doing identical work can lawfully be on three different minimums. Pay the rate for each person's age, issue payslips, and keep records. If you're unsure, the Fair Work Pay Calculator will tell you exactly what to pay.",
            source: S.payCalculator,
        },
    ],
};

const interviewing: Stage = {
    id: "interviewing",
    track: "employer",
    order: 2,
    title: "Choosing a Person",
    skill: "judging candidates on the work, not on who they remind you of",
    blurb: "You have four applicants and half an hour. What you ask decides whether you hire lawfully.",
    icon: "🤝",
    beats: [
        {
            id: "e-interview-1",
            kind: "decision",
            setup:
                "Four people applied. You've got the afternoon to see them.\n\nBefore you start, you need to decide what you're actually going to ask, because the questions you choose determine whether you hire the best person or the person most like you - and whether you stay inside the law.",
            options: [
                {
                    id: "a",
                    label: "Availability, reliability, and a referee who has seen them work",
                    effects: { compliance: 12, reputation: 10 },
                    outcome:
                        "Correct. For entry-level work these three questions predict performance better than anything else, and they're lawful. A referee who has actually watched them turn up tells you more than any personality question.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Whether they have a boyfriend or girlfriend, and whether their parents are together",
                    effects: { compliance: -18, reputation: -10 },
                    outcome:
                        "These questions are unlawful and, worse, useless. Relationship status has no bearing on whether someone can run a till, and asking it tells a good candidate that this is a workplace that will pry.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "A personality test and a question about their long-term career goals",
                    effects: { compliance: 4, reputation: -4 },
                    outcome:
                        "Not unlawful, just unhelpful. Asking a 15-year-old about their ten-year career plan gets you a rehearsed answer, and personality tests are weak predictors for casual junior work. You're spending your half hour on the wrong thing.",
                    correct: false,
                },
            ],
            debrief: "Ask about the work",
            bottomLine:
                "For junior casual roles, ask about availability, reliability and prior experience, and take up a referee. Those are lawful, predictive, and quick. Anything about relationships, family, health, disability, religion, race or pregnancy is off the table entirely.",
            source: S.discrimination,
        },
        {
            id: "e-interview-2",
            kind: "triage",
            setup:
                "You've seen all four. You have to pick two for a second chat.\n\nOne is a friend's daughter who is lovely but says she's 'pretty busy with netball'. One has no experience but gave you exact days and a coach who'll vouch for her. One was confident and told you she wants to be a barista one day. One didn't show up.",
            options: [
                {
                    id: "a",
                    label: "The one with exact availability and the coach referee, and the one who told you what she wants",
                    effects: { compliance: 10, reputation: 12, safety: 4 },
                    outcome:
                        "Correct. Availability is the single biggest predictor of whether a junior actually turns up, and a candidate who tells you where she wants to go is likely to invest in the job. Neither of those is about personality - it's about evidence.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "The friend's daughter, because a personal connection means you can trust her",
                    effects: { compliance: -8, reputation: -8 },
                    outcome:
                        "'Pretty busy with netball' is the exact signal that she will be unavailable exactly when you need her. Hiring on personal connection isn't unlawful, but it produces unreliable juniors, high turnover, and awkwardness when you have to let her go.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "The confident one plus the friend's daughter - confidence is what a café needs",
                    effects: { compliance: -4, reputation: -4 },
                    outcome:
                        "Confidence is worth something, but it isn't availability. You've now got one strong hire and one you'll be chasing. The candidate with the coach referee was the safer second spot.",
                    correct: false,
                },
            ],
            debrief: "Availability over vibes",
            bottomLine:
                "For young casual workers, concrete availability and a credible referee beat confidence and connections. Hiring on personal relationship is legal but tends to produce the worst outcome for both of you.",
            source: S.discrimination,
        },
        {
            id: "e-interview-3",
            kind: "decision",
            setup:
                "The 15-year-old you're about to hire mentions that she has epilepsy, and that she takes medication. She's well controlled and says it hasn't affected anything for three years.\n\nYou're about to make her an offer.",
            options: [
                {
                    id: "a",
                    label: "Make the offer, then have a private conversation about anything she needs in the workplace and a safety plan",
                    effects: { compliance: 14, reputation: 12, safety: 12 },
                    outcome:
                        "Correct. You cannot refuse to hire someone because of a disability or medical condition, but you absolutely should talk about what she needs to be safe at work. Those two things are not in conflict - one is discrimination law and the other is your safety duty.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Withdraw the offer - you can't have someone with a medical condition on shift",
                    effects: { compliance: -20, reputation: -14, safety: -6 },
                    outcome:
                        "This is disability discrimination, and it is unlawful. A well-controlled condition with no impact on the work is not a lawful reason to refuse a job. You have just exposed the business to a complaint for no benefit at all.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "Hire her but say nothing and hope it never comes up",
                    effects: { compliance: 2, reputation: -4, safety: -14 },
                    outcome:
                        "You've done the right thing on discrimination and the wrong thing on safety. If something happens on a shift, you needed a plan and someone who knew what to do. Silence protects nobody.",
                    correct: false,
                    trap: true,
                },
            ],
            debrief: "Both duties, at the same time",
            bottomLine:
                "You cannot decline to hire because of a disability or a health condition. You must manage the workplace so that the person is safe - which means asking what they need, not guessing, and not avoiding the conversation to keep things comfortable.",
            source: S.protections,
        },
    ],
};

const running: Stage = {
    id: "running",
    track: "employer",
    order: 3,
    title: "Running It Properly",
    skill: "rostering, paying and protecting young workers correctly",
    blurb: "The law is easy to get right once and easy to get wrong every single week.",
    icon: "📋",
    beats: [
        {
            id: "e-running-1",
            kind: "audit",
            auditPrompt: "Tick every shift on this roster that breaks a rule.",
            setup:
                "You've picked your two juniors: Mia, 15, on school days, and Jayden, 17, who finished school last year.\n\nYou've written next week's roster. It's the roster that suits your trading hours. Whether it suits the law is a different question.",
            artefact: {
                type: "roster",
                business: "Harbourside Café",
                rows: [
                    { name: "Mia", age: 15, day: "Monday", shift: "9:00am - 1:00pm" },
                    { name: "Mia", age: 15, day: "Wednesday", shift: "4:00pm - 9:30pm" },
                    { name: "Mia", age: 15, day: "Saturday", shift: "7:00am - 2:00pm" },
                    { name: "Jayden", age: 17, day: "Tuesday", shift: "6:00pm - 11:00pm" },
                    { name: "Jayden", age: 17, day: "Sunday", shift: "11:00am - 11:30am" },
                ],
            },
            options: [
                {
                    id: "mia_monday",
                    label: "Mia, Monday 9:00am - 1:00pm",
                    effects: { compliance: 12, safety: 6 },
                    outcome:
                        "Correct. That's a school day and Mia is 15, so she cannot lawfully be working during school hours. This is the rule that employers breach most often, usually by accident.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "mia_wed",
                    label: "Mia, Wednesday 4:00pm - 9:30pm",
                    effects: { compliance: 10, safety: 8 },
                    outcome:
                        "Correct to flag. A school night shift running to 9:30pm for a 15-year-old leaves no room for school the next day, and many state rules restrict late finishes for school-aged children. Even where it isn't a hard breach, rostering a 15-year-old to 9:30pm midweek is a decision you should be able to defend.",
                    correct: true,
                    trap: true,
                },
                {
                    id: "miA_SAT",
                    label: "Mia, Saturday 7:00am - 2:00pm",
                    effects: {},
                    outcome:
                        "This one is broadly fine in most states. A seven-hour Saturday shift for a 15-year-old, with proper breaks, is ordinary weekend casual work. Check the break requirements and make sure she gets them.",
                    correct: false,
                },
                {
                    id: "jay_tue",
                    label: "Jayden, Tuesday 6:00pm - 11:00pm",
                    effects: {},
                    outcome:
                        "Jayden is 17 and no longer at school, so a late shift is not the same problem it would be for Mia. Check the award for any penalty rates and make sure someone walks out with him at close.",
                    correct: false,
                },
                {
                    id: "jay_sun",
                    label: "Jayden, Sunday 11:00am - 11:30am",
                    effects: { compliance: 12, reputation: -4 },
                    outcome:
                        "Correct. A half-hour shift almost certainly falls under the minimum engagement a casual can be rostered for - under most awards a casual called in must get a minimum number of hours, commonly three. You'd be paying him for three hours regardless, and rostering him for thirty minutes is both a breach and a genuinely insulting ask.",
                    correct: true,
                    trap: true,
                },
            ],
            debrief: "Three of the five shifts are a problem",
            bottomLine:
                "Do not roster a school-aged worker during school hours. Be careful with late finishes on school nights. Give the breaks the award requires. And never roster a casual for less than the minimum engagement - it is both unlawful and the fastest way to lose a good junior.",
            source: S.hoursOfWork,
        },
        {
            id: "e-running-2",
            kind: "decision",
            setup:
                "Payday. You're doing the payslips at 9pm on a Friday, which is how it always goes.\n\nYou've got Mia's hours on a notepad, a calculator, and a decision to make about how much effort to put into the paperwork. Nobody has ever asked you for a payslip in fifteen years of running this place.",
            options: [
                {
                    id: "a",
                    label: "Issue proper payslips and keep the time and wage records",
                    effects: { compliance: 16, reputation: 10 },
                    outcome:
                        "Correct. Payslips are mandatory, must contain specific information, and must be given within one working day of payday. You also have to keep employee records for seven years. This is genuinely the cheapest insurance you will ever buy.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Hand over the cash and tell her the hours and the total - that's a payslip in spirit",
                    effects: { compliance: -14, reputation: -6 },
                    outcome:
                        "It isn't. A payslip must be a written record including her rate of pay, hours, gross pay, tax withheld, net pay, your name and ABN, and the pay period. A verbal total gives her no way to check she was paid correctly - and gives you nothing to defend yourself with.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "Keep records for Mia but not for Jayden, because he's nearly 18",
                    effects: { compliance: -12 },
                    outcome:
                        "Age is irrelevant to your record-keeping duty. You must keep records for every employee, and if the regulator comes asking, missing records for one person is still missing records. There's no partial credit.",
                    correct: false,
                    trap: true,
                },
            ],
            debrief: "Payslips are not optional",
            bottomLine:
                "Every employee gets a payslip containing the required details, within one working day of being paid, and you must keep time and wage records for seven years. This is also your own protection: without records you cannot prove you paid correctly.",
            source: S.recordKeeping,
        },
        {
            id: "e-running-3",
            kind: "decision",
            setup:
                "Mia's third shift. She's using the commercial dishwasher and the bench grinder for the first time, and you're flat out on the front counter.\n\nShe asks you to show her how the dishwasher works. You've shown dozens of juniors over the years and none of them have had a problem.",
            options: [
                {
                    id: "a",
                    label: "Stop, show her properly, cover the chemicals and the emergency stop, and stay nearby",
                    effects: { safety: 18, compliance: 12, reputation: 8 },
                    outcome:
                        "Correct. Young and inexperienced workers are at significantly higher risk of injury, and your duty to provide training, supervision and safe equipment is at its highest with a 15-year-old on her third shift. Ten minutes now is worth more than any insurance policy.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Tell her it's straightforward and to shout if she gets stuck",
                    effects: { safety: -18, compliance: -10 },
                    outcome:
                        "This is how young workers get hurt. 'It's straightforward' is not training, and an unsupervised 15-year-old with industrial chemicals and machinery is a serious risk. If she's injured, your failure to train and supervise is the finding.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "Ask Jayden to show her, since he's been here longer",
                    effects: { safety: -10, compliance: -6, reputation: -4 },
                    outcome:
                        "Passing your safety duty to another 17-year-old doesn't discharge it. Jayden isn't trained to train, and if something goes wrong the responsibility is still entirely yours. You can have him demonstrate, but you must own the induction.",
                    correct: false,
                    trap: true,
                },
            ],
            debrief: "Induction is not optional",
            bottomLine:
                "You must provide young workers with proper induction, training and supervision, safe equipment and safe systems of work. Inexperience is exactly the risk factor that raises your duty. Never delegate induction to another junior to save time.",
            source: S.whs,
        },
        {
            id: "e-running-4",
            kind: "decision",
            setup:
                "Monday morning. Mia asks you, in front of the other junior, what Jayden gets paid - because she's been given every Sunday and he hasn't.\n\nYour instinct is that pay is private and she's being nosy. You've had a rule about not discussing wages since you took over the shop.",
            options: [
                {
                    id: "a",
                    label: "Tell her she's allowed to ask, and deal with the actual rostering problem",
                    effects: { compliance: 16, reputation: 12 },
                    outcome:
                        "Correct, and it is the law. Since 7 June 2023 pay secrecy clauses are banned - you cannot stop an employee from asking about or discussing their pay, and telling them not to is itself unlawful. She hasn't done anything wrong. What she's raised - that every Sunday has landed on her - is a fairness problem you should fix.",
                    correct: true,
                },
                {
                    id: "b",
                    label: "Tell her pay is confidential and it's not something you discuss at work",
                    effects: { compliance: -18, reputation: -10 },
                    outcome:
                        "That instruction is unlawful. Pay secrecy clauses have been banned since June 2023, and this kind of instruction is exactly what keeps junior underpayment hidden. You've also just told a good junior that raising a fairness concern gets her shut down.",
                    correct: false,
                    trap: true,
                },
                {
                    id: "c",
                    label: "Say nothing, and quietly give Mia a few more Saturdays to smooth it over",
                    effects: { compliance: -6, reputation: 4 },
                    outcome:
                        "You've avoided a confrontation without breaking the law, but you've also left the pay secrecy rule in place and papered over the rostering issue rather than fixing it. It will come back.",
                    correct: false,
                },
            ],
            debrief: "Pay secrecy clauses are banned",
            bottomLine:
                "You cannot stop a worker from asking about or discussing their pay, and instructing them not to is unlawful. If a question about pay makes you uncomfortable, that is worth examining - it usually means something in the pay structure isn't defensible.",
            source: S.paySecrecy,
        },
    ],
};

/* ================================================================== *
 * THE MIRROR
 * ================================================================== */

const mirror: Stage = {
    id: "mirror",
    track: "employer",
    order: 4,
    title: "The Mirror",
    skill: "judging your own application the way a stranger would",
    blurb: "Four anonymous applications for one job. One of them is yours.",
    icon: "🪞",
    beats: [
        {
            id: "e-mirror-1",
            kind: "mirror",
            setup:
                "You need one junior. Four people applied.\n\nYou have exactly what they chose to send you, and nothing else - no names, no faces, no schools. Read all four and shortlist the two you would genuinely call in.\n\nOne of these is the application you built while playing the other side of this game.",
            options: [],
            debrief: "You just judged yourself",
            bottomLine:
                "The employer's view of you is built almost entirely from what you chose to put in front of them. Availability, something real you've done, and someone who will vouch for you is the entire formula at this level.",
            source: S.discrimination,
        },
        {
            id: "e-mirror-2",
            kind: "mirror",
            setup:
                "Now you've seen both sides of the desk.\n\nAs the worker, you learned what you're owed. As the employer, you learned what a business actually needs and what it isn't allowed to do. Write down the one thing you'll change before you apply for a real job.",
            options: [],
            debrief: "What you take with you",
            bottomLine:
                "Being informed is the whole qualification. You now know your minimum rate, your breaks, what a payslip must contain, what an employer may not ask you, and when to refuse unsafe work. You also know exactly what an employer is looking for. That combination is rare in an adult, let alone a teenager.",
            source: S.youngWorkers,
        },
    ],
};

export const STAGES: Stage[] = [identity, search, apply, deliver, lawful, interviewing, running, mirror];

/** Worker-track stage IDs, used by the licence to know what "both sides" means. */
export const PLAYER_STAGE_IDS = ["identity", "search", "apply", "deliver"];
export const EMPLOYER_STAGE_IDS = ["lawful", "interviewing", "running", "mirror"];
