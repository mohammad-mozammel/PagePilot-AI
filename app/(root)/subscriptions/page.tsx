import { PricingTable } from '@clerk/nextjs';
import { ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

const Page = () => {
    return (
        <main id="main-content" className="clerk-subscriptions">
            <section className="subscriptions-header">
                <p className="hero-eyebrow"><span className="studio-label-dot" aria-hidden="true" />Membership</p>
                <h1 className="page-title-xl !text-4xl md:!text-5xl mt-2">Choose your listening plan</h1>
                <p className="subtitle mx-auto !max-w-md">
                    Pick the plan that fits your reading goals. Upgrade or downgrade anytime.
                </p>
            </section>

            <div className="subscriptions-trust-row">
                <span className="subscriptions-trust-item">
                    <ShieldCheck className="w-4 h-4 text-[var(--accent-warm)]" aria-hidden="true" />
                    Secure checkout
                </span>
                <span className="subscriptions-trust-item">
                    <RefreshCw className="w-4 h-4 text-[var(--accent-warm)]" aria-hidden="true" />
                    Change plans anytime
                </span>
                <span className="subscriptions-trust-item">
                    <Zap className="w-4 h-4 text-[var(--accent-warm)]" aria-hidden="true" />
                    Instant access
                </span>
            </div>

            <div className="clerk-pricing-table-wrapper w-full">
                <PricingTable
                    highlightedPlan="pro"
                    newSubscriptionRedirectUrl="/"
                    appearance={{
                        variables: {
                            colorPrimary: '#E8A33D',
                            colorPrimaryForeground: '#231A07',
                            colorForeground: '#221D13',
                            colorBackground: '#FFFEF9',
                            colorMuted: '#EFE9D9',
                            colorMutedForeground: '#5C5545',
                            colorInput: '#FFFEF9',
                            borderRadius: '0.75rem',
                        },
                    }}
                />
            </div>
        </main>
    );
};

export default Page;
