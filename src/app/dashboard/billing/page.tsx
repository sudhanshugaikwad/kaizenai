
'use client';

import { PricingTable } from '@clerk/nextjs';

export default function BillingPage() {

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Billing & Plans</h1>
      <p className="text-muted-foreground mb-8">
        Choose the plan that’s right for your team. You can upgrade or downgrade anytime.
      </p>
      <PricingTable />
    </div>
  );
}
