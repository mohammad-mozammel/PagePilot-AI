'use server';

import VoiceSession from "@/Database/models/voice-session.model";
import { connectToDatabase } from "@/Database/mongoose";
import { EndSessionResult, SessionCheckResult, StartSessionResult } from "@/types";
import { getCurrentBillingPeriodStart, getPlanLimits } from "../subscription-constants";
import { getUserPlan } from "../subscription";

export const checkSessionLimit = async (clerkId: string): Promise<SessionCheckResult> => {
    try {
        await connectToDatabase();

        const plan = await getUserPlan();
        const planLimits = getPlanLimits(plan);
        const billingPeriodStart = getCurrentBillingPeriodStart();

        const currentCount = await VoiceSession.countDocuments({
            clerkId,
            billingPeriodStart,
        });

        const allowed = currentCount < planLimits.sessionsPerMonth;

        return {
            allowed,
            currentCount,
            limit: planLimits.sessionsPerMonth,
            plan,
            maxDurationMinutes: planLimits.maxSessionMinutes,
            error: allowed
                ? undefined
                : `You've reached your ${planLimits.sessionsPerMonth}-session monthly limit on the ${plan} plan. Upgrade or wait for the next billing period.`,
        }
    } catch (e) {
        console.error('Error checking session limit:', e)
        return {
            allowed: false,
            currentCount: 0,
            limit: 0,
            plan: 'free',
            maxDurationMinutes: 0,
            error: 'Failed to check session limit',
        }
    }
}

export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        await connectToDatabase();

        const check = await checkSessionLimit(clerkId);

        if (!check.allowed) {
            return {
                success: false,
                sessionId: undefined,
                error: check.error,
                isBillingError: true,
            }
        }

        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart: getCurrentBillingPeriodStart(),
            durationSeconds: 0
        })

        return {
            success: true,
            sessionId: session._id.toString(),
            maxDurationMinutes: check.maxDurationMinutes,
        }
    } catch (e) {
        console.error('Error starting voice session:', e)
        return { success: false, error: 'Failed to start voice session' }
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<EndSessionResult> => {
    try {
        await connectToDatabase();

        const result = await VoiceSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            durationSeconds
        })

        if (!result) return { success: false, error: 'Session not found' }

        return { success: true }
    } catch (e) {
        console.error('Error ending voice session:', e)
        return { success: false, error: 'Failed to end voice session' }
    }
}
