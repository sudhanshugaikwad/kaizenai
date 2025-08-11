
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { findHrContacts, type HrContactOutput } from '@/ai/flows/hr-contact-finder';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Loader2, FileUp, Sparkles, UserSearch, Building, Mail, Phone, ExternalLink, MessageCircle, Linkedin, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const formSchema = z.object({
  department: z.string({ required_error: "Please select a department." }),
  resume: z.any().optional(),
});

const departments = [
    "IT HR",
    "Data Science HR",
    "Non-Tech HR",
    "Marketing HR",
    "Sales HR",
    "Finance HR",
    "University Relations"
];

type HrContact = HrContactOutput['hrContacts'][0];

export default function HrContactFinderPage() {
  const [result, setResult] = useState<HrContactOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<HrContact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const contactsPerPage = 5;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      form.setValue('resume', selectedFile);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setCurrentPage(1);

    try {
      let resumeDataUri: string | undefined = undefined;
      if (file) {
        resumeDataUri = await fileToDataUri(file);
      }
      const hrResult = await findHrContacts({ department: values.department, resumeDataUri });
      setResult(hrResult);
    } catch (error) {
      console.error('Failed to find HR contacts:', error);
      toast({
        title: "Error",
        description: "Failed to find HR contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = result?.hrContacts.slice(indexOfFirstContact, indexOfLastContact) || [];
  const totalPages = result ? Math.ceil(result.hrContacts.length / contactsPerPage) : 0;

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
  };


  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">HR Contact Finder</h1>
        <p className="text-muted-foreground">Find HR professionals by department or by uploading your resume.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
            <CardHeader>
                <CardTitle>Search for HR Contacts</CardTitle>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="department" render={({ field }) => (
                        <FormItem>
                        <FormLabel>HR Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )} />

                    <div>
                        <FormLabel>Resume-Based Search (Optional)</FormLabel>
                        <div className="flex items-center justify-center w-full mt-2">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {fileName ? fileName : <><span className="font-semibold">Upload your resume</span> to find relevant HR</>}
                                    </p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                            </label>
                        </div>
                    </div>
                    
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Finding...</> : <><UserSearch className="mr-2 h-4 w-4" />Find HR Details</>}
                    </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
      </motion.div>

      {isLoading && (
        <motion.div className="flex flex-col items-center justify-center pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Our AI is searching for HR contacts...</p>
        </motion.div>
      )}

      {result && result.hrContacts.length > 0 && (
        <motion.div className="space-y-6" variants={containerVariants}>
            {result.userRole &&
                <motion.div variants={itemVariants}>
                    <Card>
                    <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                        <Briefcase className="w-8 h-8 text-primary" />
                        <div>
                            <CardTitle>Identified Role from Resume</CardTitle>
                            <CardDescription className="text-lg font-semibold text-foreground">{result.userRole}</CardDescription>
                        </div>
                    </CardHeader>
                    </Card>
                </motion.div>
            }
            
            <motion.h2 className="text-2xl font-bold tracking-tight" variants={itemVariants}>Found {result.hrContacts.length} HR Contacts</motion.h2>

            <div className="space-y-4">
                {currentContacts.map((contact, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="flex flex-col sm:flex-row items-center justify-between p-4">
                            <div className="flex-grow">
                                <p className="font-semibold text-lg">{contact.companyName}</p>
                                <p className="text-muted-foreground">{contact.department}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedContact(null)}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" onClick={() => setSelectedContact(contact)}>See all Details</Button>
                                    </DialogTrigger>
                                </Dialog>
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={`mailto:${contact.email}`}><Mail className="w-5 h-5"/></Link>
                                </Button>
                                {contact.contactNumber && 
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`https://wa.me/${contact.contactNumber.replace(/\D/g, '')}`} target="_blank"><MessageCircle className="w-5 h-5"/></Link>
                                    </Button>
                                }
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {totalPages > 1 && (
                <motion.div className="flex justify-center items-center gap-4" variants={itemVariants}>
                    <Button variant="outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>
                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button variant="outline" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </motion.div>
            )}


             <Dialog open={!!selectedContact} onOpenChange={(isOpen) => !isOpen && setSelectedContact(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedContact?.hrName}</DialogTitle>
                        <DialogDescription>{selectedContact?.jobTitle} at {selectedContact?.companyName}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                       <div className="flex items-center gap-3"><Building className="w-5 h-5 text-muted-foreground"/> <span>{selectedContact?.companyName}</span></div>
                       <div className="flex items-center gap-3"><Briefcase className="w-5 h-5 text-muted-foreground"/> <span>{selectedContact?.department}</span></div>
                       <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-muted-foreground"/> <span>{selectedContact?.email}</span></div>
                       {selectedContact?.contactNumber && <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-muted-foreground"/> <span>{selectedContact.contactNumber}</span></div>}
                    </div>
                    <DialogFooter className="sm:justify-start gap-2">
                        {selectedContact?.linkedInUrl && <Button asChild variant="outline"><Link href={selectedContact.linkedInUrl} target="_blank"><Linkedin className="w-4 h-4 mr-2"/> LinkedIn</Link></Button>}
                        {selectedContact?.naukriUrl && <Button asChild variant="outline"><Link href={selectedContact.naukriUrl} target="_blank"><ExternalLink className="w-4 h-4 mr-2"/> Naukri</Link></Button>}
                        <DialogClose asChild><Button type="button" variant="secondary">Close</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </motion.div>
      )}

       {result && result.hrContacts.length === 0 && !isLoading && (
        <motion.div 
            className="flex flex-col items-center justify-center pt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <UserSearch className="w-12 h-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-semibold">No HR Contacts Found</p>
            <p className="text-muted-foreground">We couldn't find any contacts for the selected criteria. Try a different department or upload a resume for a more targeted search.</p>
        </motion.div>
       )}
    </motion.div>
  );
}
