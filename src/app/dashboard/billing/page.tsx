
'use client';

import { Protect, useOrganization, useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CheckCircle, Crown, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const plans = [
    {
        name: 'Free',
        price: '$0',
        features: [
            '3 Resume Analyses per month',
            '1 Roadmap Generation',
            '5 Cover Letters per month',
            'Basic Job Matching',
            'Standard AI Chat Support'
        ],
        cta: 'You are on this plan'
    },
    {
        name: 'Pro',
        price: '$15',
        features: [
            'Unlimited Resume Analyses',
            'Unlimited Roadmap Generations',
            'Unlimited Cover Letters',
            'Advanced Job Matching',
            'Priority AI Chat Support',
            'Early access to new features',
        ],
        cta: 'Upgrade to Pro',
        pro: true,
    }
]

export default function BillingPage() {
    const { organization } = useOrganization();
    const { has } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const isPro = has && has({ permission: 'org:feature:pro_plan' });
    
    // In a real app, you'd get this from your backend
    const manageUrl = 'https://dashboard.clerk.com/apps/app_2jZ3X9a8A7s6G8f5K4N1Z2w/instances/ins_2jZ3X9B7c6S5g7H4L3o0P1x/billing';

    const handleSubscription = async () => {
        setIsLoading(true);
        try {
            // Here you would typically make an API call to your backend to create a checkout session
            // For this example, we'll just redirect to a placeholder
            window.location.href = manageUrl;
        } catch (error) {
            console.error("Subscription failed:", error);
            toast({
                title: "Something went wrong",
                description: "Could not initiate subscription. Please try again.",
                variant: "destructive"
            });
            setIsLoading(false);
        }
    };


    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.1,
        },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
    
  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and view plan details.</p>
      </motion.div>

       <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={itemVariants}
        >
        {plans.map(plan => (
            <Card key={plan.name} className={`flex flex-col ${plan.pro ? 'border-primary shadow-lg' : ''}`}>
                <CardHeader>
                   <div className="flex justify-between items-center">
                     <CardTitle className="text-2xl">{plan.name}</CardTitle>
                     {plan.pro && <Crown className="w-6 h-6 text-primary" />}
                   </div>
                    <CardDescription className="text-4xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                    {plan.features.map(feature => (
                        <div key={feature} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-muted-foreground">{feature}</span>
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    {plan.pro ? (
                        isPro ? (
                             <Button className="w-full" variant="outline" asChild>
                                <Link href={manageUrl} target="_blank">Manage Subscription</Link>
                            </Button>
                        ) : (
                            <Button className="w-full" onClick={handleSubscription} disabled={isLoading}>
                               {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                               {plan.cta}
                           </Button>
                        )
                    ) : (
                         <Button className="w-full" disabled variant="outline">{plan.cta}</Button>
                    )}
                </CardFooter>
            </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
