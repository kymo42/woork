// woork GAME - jurisdictions
//
// Australian child-employment rules are state-based, and there is NO single
// national minimum working age. The national Fair Work system sets pay,
// conditions and safety; each state and territory sets who may be employed,
// at what age, and for how long.
//
// ---------------------------------------------------------------------------
// HONESTY RULE FOR THIS FILE
// ---------------------------------------------------------------------------
// The research behind this file verified Queensland and Western Australia in
// full, and confirmed the shape of Victoria's licence system. New South Wales,
// South Australia, Tasmania, the ACT and the Northern Territory could NOT be
// verified to the standard required to state numbers to a teenager.
//
// So this file does not guess. Where a figure is unverified it says so and
// points the player at the regulator. A game that invents a legal limit is
// worse than a game that admits it doesn't know - and a teenager acting on an
// invented number can lose money or their schooling.
//
// STATE LAWS CHANGE. The `lastVerified` field records when this was checked.

import type { Jurisdiction, StateCode } from "./types";

/** When the researched content in this file was last checked against sources. */
export const CONTENT_VERIFIED = "October 2026";

export const JURISDICTIONS: Record<StateCode, Jurisdiction> = {
    NSW: {
        code: "NSW",
        name: "New South Wales",
        regulator: "NSW Office of the Children's Guardian (child employment) and SafeWork NSW (safety)",
        minWorkingAge: null,
        minWorkingAgeNote:
            "NSW sets no single general minimum age for most work. Some kinds of employment of children need an employer authority from the Children's Guardian.",
        hoursSummary:
            "There is no single statewide hours cap. The limits that bind you come from compulsory schooling (you cannot work when you are required to be at school), the modern award that covers your job, and work health and safety law.",
        permitRequired:
            "Some employment of children requires an employer authority from the Office of the Children's Guardian. The employer's obligation - but if they can't explain what they hold, ask.",
        trap:
            "Because NSW has no simple minimum age, teens assume there is no rule at all. The rule is that school wins, your award sets your rate and shift minimums, and your employer owes you a safe workplace.",
        lastVerified: null,
    },
    VIC: {
        code: "VIC",
        name: "Victoria",
        regulator: "Wage Inspectorate Victoria",
        minWorkingAge: null,
        minWorkingAgeNote:
            "Victoria regulates this through child employment law rather than a single stated age: work for under-15s is limited to light work, and the employer generally needs a child employment licence.",
        hoursSummary:
            "Victoria's child employment laws set conditions on hours of work and rest breaks for children, and those conditions are tighter during school terms. The exact current limits are set out by the Wage Inspectorate.",
        permitRequired:
            "Yes, for many employers of children under 15: the employer needs a child employment licence per business and a permit per child. This is the employer's obligation - and if they cannot produce one, that is a serious red flag, not a paperwork detail.",
        trap:
            "A 13 or 14-year-old takes a job and nobody checks whether the business is licensed. If the employer holds no licence, the arrangement is unlawful no matter how kind they are - and the teen carries the risk of an uninsured injury.",
        lastVerified: null,
    },
    QLD: {
        code: "QLD",
        name: "Queensland",
        regulator: "Queensland Office of Industrial Relations (child employment) and WorkSafe Queensland",
        minWorkingAge: 13,
        minWorkingAgeNote:
            "Under 13: an employer must not require or permit any work at all. From 13, work is permitted subject to the hour limits below. Children aged 11 and over may do delivery work in limited circumstances. Family business work is exempt from the hours rules.",
        hoursSummary:
            "A school-aged child may work a maximum of 4 hours on a school day and 8 hours on a non-school day, and no more than 12 hours in a school week or 38 hours in a non-school week. A school-aged child cannot work more than 4 consecutive hours without at least a 1 hour rest break. There must be at least 12 hours between shifts.",
        permitRequired:
            "No general permit for ordinary work. A special circumstances certificate is available in some cases, and a parental consent form applies to school-aged and young children.",
        trap:
            "The 10pm to 6am curfew and the 12-hour break between shifts are the two rules broken constantly in hospitality - usually via a close-then-open 'clopening' roster. 'You volunteered for it' is not a defence, and neither is your parent agreeing.",
        lastVerified: "October 2026",
    },
    WA: {
        code: "WA",
        name: "Western Australia",
        regulator: "Wageline (Department of Local Government, Industry Regulation and Safety)",
        minWorkingAge: null,
        minWorkingAgeNote:
            "Work is restricted for under-15s, with family business, entertainment and charity work able to be done at any age. From 15, the ordinary rules apply.",
        hoursSummary:
            "13 and 14-year-olds must work outside school hours and cannot work before 6am or after 10pm. 10 to 12-year-olds doing delivery work cannot start before 6am or finish after 7pm and must be accompanied by an adult. From 15, you cannot work during school hours without approval.",
        permitRequired:
            "Yes - written parental permission is required for 13 and 14-year-olds. Penalties for breaching this run to tens of thousands of dollars for the employer.",
        trap:
            "A 14-year-old rostered to a 10:30pm close is unlawful even with a parent's written permission - permission does not override the prohibited hours. And the family business exemption is narrow (close relatives) and still does not excuse skipping school or unsafe work.",
        lastVerified: "October 2026",
    },
    SA: {
        code: "SA",
        name: "South Australia",
        regulator: "SafeWork SA",
        minWorkingAge: null,
        minWorkingAgeNote:
            "South Australia ties this to compulsory schooling and approved learning rather than a single employment age. The exact current position should be confirmed with SafeWork SA.",
        hoursSummary:
            "You must not work during the hours you are required to be at school, and work must not interfere with your schooling. Precise hour caps for under-18s are set by state law - check with SafeWork SA before relying on a number.",
        permitRequired:
            "No general child employment permit was identified. Specific restrictions apply to particular work, including underground mining and handling petrol or gas.",
        trap:
            "The school-hours prohibition is the one that catches teens out - including 'just one shift' during exam block. South Australia also restricts some work outright for under-18s, such as liquor service unless narrow conditions are met.",
        lastVerified: null,
    },
    TAS: {
        code: "TAS",
        name: "Tasmania",
        regulator: "WorkSafe Tasmania",
        minWorkingAge: null,
        minWorkingAgeNote:
            "Tasmania regulates the employment of children through its Education Act rather than a single stated minimum working age. Confirm the current position with WorkSafe Tasmania.",
        hoursSummary:
            "The governing rule is compulsory schooling: you cannot be employed during the hours you are required to attend school. Specific hour limits for school-aged workers should be confirmed with the regulator.",
        permitRequired:
            "No general permit was identified for ordinary work. Certain types of work and entertainment work have their own restrictions.",
        trap:
            "Small regional employers sometimes roster under-16s straight through the school day. The employer carries the penalty, but the teenager is the one who loses school.",
        lastVerified: null,
    },
    ACT: {
        code: "ACT",
        name: "Australian Capital Territory",
        regulator: "WorkSafe ACT",
        minWorkingAge: null,
        minWorkingAgeNote:
            "The ACT regulates the employment of children and young people through the Children and Young People Act. The exact age thresholds should be confirmed with WorkSafe ACT.",
        hoursSummary:
            "School is compulsory until 17 in the ACT, and you cannot be employed during the hours you are required to be at school. Adequate rest breaks are required, with a minimum of 12 hours between shifts for children and young people.",
        permitRequired:
            "No general permit was identified for ordinary work. Specific approvals apply to some entertainment and modelling work.",
        trap:
            "The 12-hour break between shifts rules out closing the shop at 10pm and opening it at 8am. The ACT's school-leaving age of 17 is higher than most states, so the 'not during school hours' rule bites for longer than teens expect.",
        lastVerified: "October 2026",
    },
    NT: {
        code: "NT",
        name: "Northern Territory",
        regulator: "NT WorkSafe (safety) and the NT Department of Education (schooling)",
        minWorkingAge: null,
        minWorkingAgeNote:
            "The Northern Territory's child employment position could not be verified to the standard needed to state figures here. Ask NT WorkSafe directly before relying on any number.",
        hoursSummary:
            "The rule that applies regardless is compulsory schooling: you cannot be employed during the hours you are required to attend school. Specific hour limits should be confirmed with the regulator.",
        permitRequired:
            "No general permit was identified for ordinary work. Confirm with NT WorkSafe.",
        trap:
            "Remote and casual work can look informal, but school-hours rules and the national pay and safety rules still apply in full. Do not assume a small or remote employer is outside the system.",
        lastVerified: null,
    },
};

export const STATE_ORDER: StateCode[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

/**
 * Live sources. The game deliberately does NOT hard-code dollar figures,
 * because minimum wages and junior rates are re-set by the annual wage review
 * and the junior scales differ between awards.
 *
 * Note on junior rates: the Fair Work Commission decided on 31 March 2026 to
 * remove junior rates for 18 to 20-year-olds with more than 6 months' service
 * in the General Retail, Fast Food and Pharmacy awards, phasing in from
 * 1 December 2026. Under-18 rates were NOT changed. A player aged 13 to 17 is
 * therefore unaffected - but the pay guides are the place to check, not memory.
 */
export const LIVE_SOURCES = {
    payCalculator: {
        label: "Fair Work Pay Calculator",
        url: "https://calculate.fairwork.gov.au/",
        detail: "Put in your age, your award and your hours and it gives you the exact minimum you must be paid.",
    },
    payGuides: {
        label: "Fair Work Ombudsman - Pay guides",
        url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides",
        detail: "The current junior rates and casual loadings for each award.",
    },
    minimumWages: {
        label: "Fair Work Ombudsman - Minimum wages",
        url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
        detail: "The national minimum wage, updated after each annual wage review.",
    },
    juniorRates: {
        label: "Fair Work Ombudsman - Junior pay rates",
        url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/junior-pay-rates",
        detail: "How junior rates work. They are set per award as a percentage of the adult rate and they rise with your age - and the scales differ between awards, so never assume the last job's scale applies.",
    },
    minimumWorkingAge: {
        label: "Fair Work Ombudsman - Minimum working age",
        url: "https://www.fairwork.gov.au/find-help-for/young-workers-and-students/minimum-working-age",
        detail: "Why there is no single national minimum age and what actually governs it.",
    },
    paySlips: {
        label: "Fair Work Ombudsman - Pay slips",
        url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips",
        detail: "What a payslip must legally contain, and when it must be given to you.",
    },
    recordKeeping: {
        label: "Fair Work Ombudsman - Record-keeping",
        url: "https://www.fairwork.gov.au/pay-and-wages/record-keeping",
        detail: "What your employer must record and keep about your hours and pay, for seven years.",
    },
    breaks: {
        label: "Fair Work Ombudsman - Breaks",
        url: "https://www.fairwork.gov.au/employment-conditions/hours-of-work-breaks-and-rosters/breaks",
        detail: "Rest breaks and meal breaks, and when they must be paid.",
    },
    hoursOfWork: {
        label: "Fair Work Ombudsman - Hours of work, breaks and rosters",
        url: "https://www.fairwork.gov.au/employment-conditions/hours-of-work-breaks-and-rosters",
        detail: "Ordinary hours, rostering rules and minimum engagement.",
    },
    casualEmployment: {
        label: "Fair Work Ombudsman - Casual employees",
        url: "https://www.fairwork.gov.au/starting-employment/types-of-employees/casual-employees",
        detail: "Casual loading, the minimum casual shift, and the pathway to permanent work.",
    },
    becomingPermanent: {
        label: "Fair Work Ombudsman - Becoming a permanent employee",
        url: "https://www.fairwork.gov.au/starting-employment/types-of-employees/casual-employees/becoming-a-permanent-employee",
        detail: "The Employee Choice pathway. The timeframe is 6 months for larger employers and 12 months for small business.",
    },
    unpaidTrials: {
        label: "Fair Work Ombudsman - Unpaid trials",
        url: "https://www.fairwork.gov.au/starting-employment/unpaid-work",
        detail: "A trial is only lawfully unpaid as a brief, supervised demonstration of skill. The Ombudsman's own guidance is that the permissible length ranges from about an hour to one shift depending on the work - anything past that must be paid.",
    },
    workExperience: {
        label: "Fair Work Ombudsman - Work experience and internships",
        url: "https://www.fairwork.gov.au/starting-employment/unpaid-work/work-experience-and-internships",
        detail: "Unpaid work experience is only lawful with no employment relationship. Agreeing to be unpaid does not make it lawful if you are really an employee.",
    },
    shamContracting: {
        label: "Fair Work Ombudsman - Independent contractors",
        url: "https://www.fairwork.gov.au/find-help-for/independent-contractors",
        detail: "It is unlawful to push an employee onto an ABN - and a contractor paid mainly for their labour can still be owed super.",
    },
    jobAds: {
        label: "Fair Work Ombudsman - Job ads",
        url: "https://www.fairwork.gov.au/starting-employment/job-ads",
        detail: "What an employer must not put in an advertisement.",
    },
    deductions: {
        label: "Fair Work Ombudsman - Deductions",
        url: "https://www.fairwork.gov.au/pay-and-wages/deductions-and-related-issues",
        detail: "A deduction must be authorised in writing and principally for your benefit. Being charged for your own uniform or mandatory training is usually not lawful.",
    },
    paySecrecy: {
        label: "Fair Work Ombudsman - Pay secrecy",
        url: "https://www.fairwork.gov.au/pay-and-wages/pay-secrecy",
        detail: "Since 7 June 2023, pay secrecy clauses are banned. You are allowed to discuss your pay, and telling you not to is itself unlawful.",
    },
    informationStatements: {
        label: "Fair Work Ombudsman - Information statements",
        url: "https://www.fairwork.gov.au/employment-conditions/information-statements",
        detail: "Every new employee must receive the Fair Work Information Statement, and casuals also get the Casual Employment Information Statement.",
    },
    discrimination: {
        label: "Fair Work Ombudsman - Discrimination",
        url: "https://www.fairwork.gov.au/employment-conditions/protections-at-work/discrimination",
        detail: "The attributes an employer may not use to decide who gets the job. Note there is no simple list of banned questions - the test is whether the question is used for a discriminatory reason.",
    },
    protections: {
        label: "Fair Work Ombudsman - Protections at work",
        url: "https://www.fairwork.gov.au/employment-conditions/protections-at-work",
        detail: "General protections and adverse action. Cutting your shifts because you asked about your pay is actionable, and the employer has to prove it wasn't the reason.",
    },
    generalProtections: {
        label: "Fair Work Commission - General protections",
        url: "https://www.fwc.gov.au/workplace-disputes/general-protections-and-harmful-adverse-action",
        detail: "If you were dismissed, a general protections claim must be lodged within 21 days.",
    },
    bullying: {
        label: "Fair Work Ombudsman - Bullying, sexual harassment and discrimination",
        url: "https://www.fairwork.gov.au/employment-conditions/bullying-sexual-harassment-and-discrimination-at-work",
        detail: "What counts, and the duties on your employer to stop it. Casuals are covered.",
    },
    youngWorkers: {
        label: "Fair Work Ombudsman - Young workers and students",
        url: "https://www.fairwork.gov.au/find-help-for/young-workers-and-students",
        detail: "The starting point written specifically for under-18s.",
    },
    whs: {
        label: "Safe Work Australia",
        url: "https://www.safeworkaustralia.gov.au/",
        detail: "Work health and safety duties, including your right to refuse unsafe work. Victoria runs its own OHS scheme rather than the model WHS laws.",
    },
    super: {
        label: "ATO - Super for employers: do you have to pay?",
        url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/work-out-if-you-have-to-pay-super",
        detail: "If you are under 18 you are owed super for any week you work MORE than 30 hours. Hours are the actual hours in that week and cannot be averaged across a fortnight or month. Since 1 July 2026, super must be paid on each payday.",
    },
    tfn: {
        label: "ATO - Tax file number",
        url: "https://www.ato.gov.au/individuals-and-families/tax-file-number",
        detail: "You need a TFN before you start, or your employer must withhold tax at the top rate.",
    },
    taxUnder18: {
        label: "ATO - Your income if you are under 18",
        url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/income-you-must-declare/your-income-if-you-are-under-18-years-old",
        detail: "Employment income is 'excepted income' and is taxed at the same rates as an adult, so the first $18,200 is tax-free for an Australian resident.",
    },
    fairWorkStatement: {
        label: "Fair Work Information Statement",
        url: "https://www.fairwork.gov.au/employment-conditions/information-statements",
        detail: "Your employer must give you this when you start, and casuals also get the Casual Employment Information Statement.",
    },
} as const;

export function jurisdictionOrNull(code: StateCode | null): Jurisdiction | null {
    return code ? JURISDICTIONS[code] : null;
}
