
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, Search, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import Image from "next/image";
import logo from "../Kaizenai.png"

type CertificateData = {
  name: string;
  certification: string;
  issueDate: string;
  certNumber: string;
};

const mockCertificates: CertificateData[] = [
    {
        name: 'Sudhanshu Gaikwad',
        certification: 'Full Stack AI Developer',
        issueDate: '18/08/2025',
        certNumber: 'KAIZEN-2025-08-001'
    },
    {
        name: 'Rohan Verma',
        certification: 'AI/ML Engineer',
        issueDate: '15/06/2025',
        certNumber: 'KAIZEN-2025-06-002'
    },
    {
        name: 'Anjali Mehta',
        certification: 'Prompt Engineer',
        issueDate: '16/05/2025',
        certNumber: 'KAIZEN-2025-05-003'
    }
];

export default function VerifyCertificatePage() {
  const [certNumber, setCertNumber] = useState('');
  const [foundCertificate, setFoundCertificate] = useState<CertificateData | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNumber) {
      toast({
        title: "Certificate Number Required",
        description: "Please enter a certificate number to verify.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setSearched(false);
    setFoundCertificate(null);

    // This is a placeholder for a real backend verification.
    // In a real application, you would make an API call here.
    setTimeout(() => {
      const certificate = mockCertificates.find(c => c.certNumber === certNumber);
      if (certificate) {
         setFoundCertificate(certificate);
      } else {
        setFoundCertificate(null);
      }
      setSearched(true);
      setIsLoading(false);
    }, 1500);

  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-background text-foreground">
         <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
               <Image src={logo} alt="Kaizen Ai" width={150} height={100}/>
            </Link>
            <Link href="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
            </Link>
        </header>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
            className="max-w-2xl mx-auto space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            >
            <motion.div variants={itemVariants} className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Verify Certificate</h1>
                <p className="text-muted-foreground">Enter the certificate number to verify its authenticity.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card>
                    <CardContent className="p-6">
                    <form onSubmit={handleVerify} className="flex gap-2">
                        <Input 
                            placeholder="Enter certificate number..."
                            value={certNumber}
                            onChange={(e) => setCertNumber(e.target.value)}
                        />
                        <Button type="submit" disabled={isLoading}>
                            <Search className="mr-2 h-4 w-4" />
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                    </form>
                    </CardContent>
                </Card>
            </motion.div>

            {searched && (
                 <motion.div variants={itemVariants}>
                    {foundCertificate ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-600">Certificate Verified!</CardTitle>
                                <CardDescription>This certificate is valid.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border-4 border-primary p-8 rounded-lg aspect-[1.414/1] flex flex-col items-center justify-center text-center relative overflow-hidden bg-card">
                                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>

                                    <div className="mb-4">
                                        <Logo className="h-12 w-auto" />
                                    </div>

                                    <h2 className="text-xl font-semibold text-muted-foreground mt-4">Certificate of Achievement</h2>
                                    <p className="text-muted-foreground mt-2">This certificate is proudly presented to</p>
                                    
                                    <h1 className="text-4xl font-bold text-primary my-4">{foundCertificate.name}</h1>
                                    
                                    <p className="text-muted-foreground max-w-md">
                                    for successfully demonstrating knowledge and proficiency in
                                    </p>
                                    <h3 className="text-2xl font-semibold mt-2">{foundCertificate.certification}</h3>
                                    
                                    <div className="flex justify-between w-full mt-12 text-xs text-muted-foreground">
                                        <div className="text-center">
                                            <p className="font-semibold border-t border-dashed pt-1">Sudhanshu Gaikwad</p>
                                            <p>Founder, Kaizen AI</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold border-t border-dashed pt-1">{foundCertificate.issueDate}</p>
                                            <p>Issue Date</p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-4 text-center w-full text-[8px] text-muted-foreground/50">
                                        <p>Kaizen AI | Hyderabad, Telangana | kaizenai.io@gmail.com</p>
                                        <p>Certificate No: {foundCertificate.certNumber}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                         <Card className="text-center">
                            <CardContent className="p-10 flex flex-col items-center">
                                <XCircle className="h-16 w-16 text-destructive mb-4" />
                                <h2 className="text-xl font-semibold">Certificate Not Found</h2>
                                <p className="text-muted-foreground">The certificate number you entered is not valid or could not be found. Please check the number and try again.</p>
                            </CardContent>
                        </Card>
                    )}
                 </motion.div>
            )}
            </motion.div>
        </main>
    </div>
  );
}
