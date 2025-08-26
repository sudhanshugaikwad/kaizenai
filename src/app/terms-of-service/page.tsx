
'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className="bg-background text-foreground min-h-screen">
            <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Link href="/">
                    <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Home</Button>
                </Link>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <motion.div 
                    className="max-w-4xl mx-auto space-y-8"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants}>
                        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                        <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                        <p>Welcome to Kaizen AI! These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms.</p>
                        
                        <h2 className="text-2xl font-semibold mt-6">1. Use of Services</h2>
                        <p>You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use the services:</p>
                        <ul>
                            <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                            <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the services.</li>
                            <li>To impersonate or attempt to impersonate Kaizen AI, a Kaizen AI employee, another user, or any other person or entity.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold mt-6">2. Intellectual Property</h2>
                        <p>The service and its original content, features, and functionality are and will remain the exclusive property of Kaizen AI and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Kaizen AI.</p>
                        
                        <h2 className="text-2xl font-semibold mt-6">3. User Accounts</h2>
                        <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>

                        <h2 className="text-2xl font-semibold mt-6">4. Termination</h2>
                        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                        <h2 className="text-2xl font-semibold mt-6">5. Limitation of Liability</h2>
                        <p>In no event shall Kaizen AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
                        
                        <h2 className="text-2xl font-semibold mt-6">6. Changes to Terms</h2>
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

                        <h2 className="text-2xl font-semibold mt-6">7. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us at <a href="mailto:kaizenai.io@gmail.com" className="text-primary">kaizenai.io@gmail.com</a>.</p>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
