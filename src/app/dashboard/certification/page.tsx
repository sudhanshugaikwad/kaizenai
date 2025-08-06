
'use client';

import { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Logo } from '@/components/icons';

const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  certification: z.string({ required_error: "Please select a certification." }),
});

const availableCertifications = [
  'Web Developer',
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Python Certification',
  'Data Science',
  'Machine Learning',
  'DevOps Engineer',
  'UI/UX Designer',
];

type CertificateData = z.infer<typeof formSchema> & {
  issueDate: string;
  certNumber: string;
};

export default function CertificationPage() {
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.fullName || '',
      certification: '',
    },
  });

  const generateCertificate = (values: z.infer<typeof formSchema>) => {
    const issueDate = new Date().toLocaleDateString('en-GB');
    const certNumber = `KAIZEN-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
    setCertificateData({ ...values, issueDate, certNumber });
  };

  const handleDownload = async () => {
    if (!certificateRef.current) {
      toast({
        title: "Error",
        description: "Could not download certificate. Please generate one first.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Generating PDF...", description: "Please wait a moment." });

    const canvas = await html2canvas(certificateRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${certificateData?.name}-KaizenAI-${certificateData?.certification}.pdf`);
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
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Generate Certification</h1>
        <p className="text-muted-foreground">Select a certification and enter your name to generate your certificate.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(generateCertificate)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="certification" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a certification" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCertifications.map(cert => (
                            <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full">
                    <Award className="mr-2 h-4 w-4" />
                    Generate Certificate
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Certificate</CardTitle>
                <CardDescription>Your generated certificate will appear here.</CardDescription>
              </div>
              {certificateData && (
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {certificateData ? (
                <div 
                    ref={certificateRef} 
                    className="p-4 bg-background" // Added padding and bg for html2canvas
                >
                  <div className="border-4 border-primary p-8 rounded-lg aspect-[1.414/1] flex flex-col items-center justify-center text-center relative overflow-hidden bg-card">
                     <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                     <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>

                    <div className="mb-4">
                        <Logo className="h-12 w-auto" />
                    </div>

                    <h2 className="text-xl font-semibold text-muted-foreground mt-4">Certificate of Achievement</h2>
                    <p className="text-muted-foreground mt-2">This certificate is proudly presented to</p>
                    
                    <h1 className="text-4xl font-bold text-primary my-4">{certificateData.name}</h1>
                    
                    <p className="text-muted-foreground max-w-md">
                      for successfully demonstrating knowledge and proficiency in
                    </p>
                    <h3 className="text-2xl font-semibold mt-2">{certificateData.certification}</h3>
                    
                    <div className="flex justify-between w-full mt-12 text-xs text-muted-foreground">
                        <div className="text-center">
                            <p className="font-semibold border-t border-dashed pt-1">Sudhanshu Gaikwad</p>
                            <p>Founder, Kaizen AI</p>
                        </div>
                         <div className="text-center">
                            <p className="font-semibold border-t border-dashed pt-1">{certificateData.issueDate}</p>
                            <p>Issue Date</p>
                        </div>
                    </div>

                    <div className="absolute bottom-4 text-center w-full text-[8px] text-muted-foreground/50">
                        <p>Kaizen AI | Hyderabad, Telangana | kaizenai.io@gmail.com</p>
                        <p>Certificate No: {certificateData.certNumber}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center rounded-lg border-2 border-dashed bg-muted/50">
                  <Award className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Your certificate will be shown here once generated.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
