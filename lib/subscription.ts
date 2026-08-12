import { auth } from '@clerk/nextjs/server';
import { getPlanLimits, PlanLimits, PlanType } from './subscription-constants';

// Minimal shape shared by the server `auth().has()` and client `useAuth().has()`
type PlanHas = (params: { plan: string }) => boolean;

/**
 * Resolve the user's plan from a Clerk `has()` function.
 * Plan slugs are checked from most to least permissive so that a user on a
 * higher plan is never downgraded to a lower one.
 */
export const resolvePlan = (has: PlanHas): PlanType => {
    if (has({ plan: 'pro' })) return 'pro';
    if (has({ plan: 'standard' })) return 'standard';
    return 'free';
};

/**
 * Server-side helper that returns the current user's plan.
 * Users without an active subscription resolve to the 'free' tier.
 */
export const getUserPlan = async (): Promise<PlanType> => {
    const { has } = await auth();
    return resolvePlan(has);
};

/** Server-side helper returning the current user's plan limits. */
export const getUserPlanLimits = async (): Promise<PlanLimits> => {
    return getPlanLimits(await getUserPlan());
};
