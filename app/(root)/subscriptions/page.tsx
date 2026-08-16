import { PricingTable } from '@clerk/nextjs';
import { ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

const Page = () => {
    return (
        <main className="clerk-subscriptions">
            <section className="subscriptions-header">
                <p className="hero-eyebrow">Membership</p>
                <h1 className="page-title-xl">Choose your plan</h1>
                <p className="subtitle">
                    Pick the plan that fits your reading goals. Upgrade or downgrade anytime.
                </p>
            </section>

            <div className="subscriptions-trust-row">
                <span className="subscriptions-trust-item">
                    <ShieldCheck className="w-4 h-4 text-[#B08D4F]" />
                    Secure checkout
                </span>
                <span className="subscriptions-trust-item">
                    <RefreshCw className="w-4 h-4 text-[#B08D4F]" />
                    Change plans anytime
                </span>
                <span className="subscriptions-trust-item">
                    <Zap className="w-4 h-4 text-[#B08D4F]" />
                    Instant access
                </span>
            </div>

            <div className="clerk-pricing-table-wrapper w-full">
                <PricingTable highlightedPlan="pro" newSubscriptionRedirectUrl="/" />
            </div>
        </main>
    );
};

export default Page;
