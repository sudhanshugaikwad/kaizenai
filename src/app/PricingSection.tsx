
'use client';

import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

const plans = [
    {
        name: 'Free Plan (3 Days Trial)',
        price: '$0',
        priceDetails: 'for 3 days',
        description: 'Get started with Kaizen AI at no cost. Explore essential tools.',
        features: [
            { text: 'Kaizen AI Chat – 50 messages per day', included: true },
            { text: 'Roadmap Generator – 1 roadmap per day', included: true },
            { text: 'Resume Analyser – 1 analysis per day', included: true },
            { text: 'Sticky Notes – Unlimited usage', included: true },
            { text: 'Website Generator – 1 per day', included: true },
            { text: 'Cover Letter Writer', included: false },
            { text: 'Job Matcher', included: false },
            { text: 'HR Contact Finder', included: false },
            { text: 'Interview Practice', included: false },
            { text: 'Free Certification', included: false },
            { text: 'Customer Support', included: false },
        ],
        buttonText: 'Get Started Free',
        buttonVariant: 'outline',
        highlight: false,
    },
    {
        name: 'Pro Plan',
        price: '$2.77',
        priceDetails: '/ month',
        description: 'Perfect for students and professionals who want consistent access to AI tools.',
        features: [
            { text: 'Kaizen AI Chat – Unlimited messages', included: true },
            { text: 'Roadmap Generator – Up to 10 per day', included: true },
            { text: 'Resume Analyser – 5 analyses per day', included: true },
            { text: 'Cover Letter Writer – Unlimited usage', included: true },
            { text: 'Job Matcher – Unlimited', included: true },
            { text: 'HR Contact Finder – Unlimited', included: true },
            { text: 'Interview Practice – Unlimited', included: true },
            { text: 'Sticky Notes – Unlimited usage', included: true },
            { text: 'Free Certification', included: true },
            { text: 'Website Builder', included: true },
            { text: 'Customer Support & Email Support', included: true },
            { text: 'Access to New Features', included: true },
        ],
        buttonText: 'Get Started Pro',
        buttonVariant: 'default',
        highlight: true,
        badge: 'Best for students & job seekers'
    },
    {
        name: 'Premium Plan',
        price: '$22.96',
        priceDetails: '/ year',
        description: 'Go all-in with the Premium Yearly Plan. Enjoy unlimited usage of all Kaizen AI tools.',
        features: [
            { text: 'Kaizen AI Chat – Unlimited messages', included: true },
            { text: 'Roadmap Generator – Unlimited', included: true },
            { text: 'Resume Analyser – Unlimited', included: true },
            { text: 'Cover Letter Writer – Unlimited', included: true },
            { text: 'Job Matcher – Unlimited', included: true },
            { text: 'HR Contact Finder – Unlimited', included: true },
            { text: 'Interview Practice – Unlimited', included: true },
            { text: 'Sticky Notes – Unlimited usage', included: true },
            { text: 'Website Builder', included: true },
            { text: 'Free Certification', included: true },
            { text: 'Access to New Features', included: true },
            { text: 'Priority Customer Support & More', included: true },
        ],
        buttonText: 'Get Started Premium',
        buttonVariant: 'outline',
        highlight: false,
    },
];

export default function PricingSection() {
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Pricing Plans</h2>
                <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">
                    Choose the plan that best fits your journey with Kaizen AI. Whether you’re just starting out or looking for unlimited access, we have flexible options designed to empower your career growth.
                </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.name} className={cn('flex flex-col', plan.highlight && 'border-primary ring-2 ring-primary shadow-lg')}>
                        <CardHeader className="relative">
                            {plan.badge && <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center"><div className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">{plan.badge}</div></div>}
                            <CardTitle>{plan.name}</CardTitle>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">{plan.priceDetails}</span>
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-3">
                                {plan.features.slice(0, 5).map((feature, i) => (
                                     <li key={i} className="flex items-center gap-2">
                                        {feature.included ? <Check className="w-5 h-5 text-primary" /> : <X className="w-5 h-5 text-muted-foreground" />}
                                        <span className="text-muted-foreground">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="link">See More</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{plan.name} Features</DialogTitle>
                                        <DialogDescription>
                                            Full list of features available in this plan.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ul className="space-y-3 py-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                {feature.included ? <Check className="w-5 h-5 text-primary" /> : <X className="w-5 h-5 text-muted-foreground/50" />}
                                                <span className={cn(!feature.included && 'text-muted-foreground/50 line-through')}>{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button>Close</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Link href="/sign-up" className="w-full">
                                <Button className="w-full" variant={plan.buttonVariant as any}>
                                    {plan.buttonText}
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
