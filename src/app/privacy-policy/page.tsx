
'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
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
                        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                        <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="text-sm text-muted-foreground space-y-6 leading-relaxed">
                        <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                        
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">1. Information Collection and Use</h2>
                            <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Types of Data Collected</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to, your email address, name, and usage data.</li>
                                <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">2. Use of Data</h2>
                            <p>Kaizen AI uses the collected data for various purposes:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>To provide and maintain our Service</li>
                                <li>To notify you about changes to our Service</li>
                                <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                                <li>To provide customer support</li>
                                <li>To gather analysis or valuable information so that we can improve our Service</li>
                                <li>To monitor the usage of our Service</li>
                                <li>To detect, prevent and address technical issues</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">3. Security of Data</h2>
                            <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
                        </div>
                        
                        <div>
                             <h2 className="text-xl font-semibold text-foreground mb-2">4. Service Providers</h2>
                            <p>We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">5. Changes to This Privacy Policy</h2>
                            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">6. Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:kaizenai.io@gmail.com" className="text-primary hover:underline">kaizenai.io@gmail.com</a>.</p>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
