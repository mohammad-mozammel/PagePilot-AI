// ============================================
// SUBSCRIPTION PLANS & LIMITS
// ============================================
// Plan slugs match the Clerk Dashboard billing configuration.
// Users without an active subscription fall back to the 'free' tier.

export type PlanType = 'free' | 'standard' | 'pro';

export interface PlanLimits {
    /** Maximum number of books a user can upload */
    books: number;
    /** Maximum number of voice sessions per calendar month */
    sessionsPerMonth: number;
    /** Maximum duration of a single voice session, in minutes */
    maxSessionMinutes: number;
    /** Whether past session transcripts are retained/historical */
    sessionHistory: boolean;
}

export const PLAN_ORDER: PlanType[] = ['free', 'standard', 'pro'];

export const PLANS: Record<PlanType, PlanLimits> = {
    free: {
        books: 1,
        sessionsPerMonth: 50,
        maxSessionMinutes: 5,
        sessionHistory: false,
    },
    standard: {
        books: 10,
        sessionsPerMonth: 100,
        maxSessionMinutes: 15,
        sessionHistory: true,
    },
    pro: {
        books: 100,
        sessionsPerMonth: Infinity,
        maxSessionMinutes: 60,
        sessionHistory: true,
    },
};

export const getPlanLimits = (plan: PlanType): PlanLimits => PLANS[plan] ?? PLANS.free;

// Start of the current calendar month, used to bucket voice sessions
export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
};
