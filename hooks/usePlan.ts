'use client';

import { useAuth } from '@clerk/nextjs';
import { getPlanLimits, PlanLimits, PlanType } from '@/lib/subscription-constants';

interface UsePlanResult {
    isLoaded: boolean;
    isSignedIn: boolean;
    plan: PlanType;
    limits: PlanLimits;
}

/**
 * Client-side plan resolution based on Clerk's `has()` method.
 * `has()` returns `false` while loading or signed out, so this hook is safe
 * to call in any state - unauthenticated users resolve to the 'free' tier.
 */
export const usePlan = (): UsePlanResult => {
    const { isLoaded, isSignedIn, has } = useAuth();

    const plan: PlanType = has({ plan: 'pro' })
        ? 'pro'
        : has({ plan: 'standard' })
            ? 'standard'
            : 'free';

    return {
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
        plan,
        limits: getPlanLimits(plan),
    };
};

export default usePlan;
