import { PricingTable } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

const Page = () => {
    return (
        <main className="clerk-subscriptions">
            <h1 className="page-title">Choose Your Plan</h1>
            <p className="page-description">
                Pick the plan that fits your reading goals. Upgrade or downgrade at any time.
            </p>
            <div className="clerk-pricing-table-wrapper w-full">
                <PricingTable highlightedPlan="pro" newSubscriptionRedirectUrl="/" />
            </div>
        </main>
    );
};

export default Page;
