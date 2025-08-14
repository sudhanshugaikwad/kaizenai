
'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateWebsite } from '@/ai/flows/website-builder';
import type { WebsiteBuilderOutput } from '@/ai/flows/website-builder.types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Sparkles, Copy, Plus, Globe, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';

const formSchema = z.object({
    name: z.string().min(2, "Website name is required."),
    languages: z.string({required_error: "Please select a language set."}),
    prompt: z.string().min(20, "Prompt must be at least 20 characters."),
});

const languageOptions = ["HTML, CSS, JS, Tailwind, Bootstrap", "React (JSX), CSS", "Vue, CSS"];

export default function WebsiteBuilderPage() {
  const [generatedCode, setGeneratedCode] = useState<WebsiteBuilderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      languages: '',
      prompt: '',
    },
  });
  
  const saveToHistory = (values: z.infer<typeof formSchema>, output: WebsiteBuilderOutput) => {
    try {
        const history = JSON.parse(localStorage.getItem('kaizen-ai-history') || '[]');
        const newHistoryItem = {
            type: 'Website Generated',
            title: `Created website: ${values.name}`,
            timestamp: new Date().toISOString(),
            data: {
                input: values,
                output: output,
            }
        };
        history.unshift(newHistoryItem);
        localStorage.setItem('kaizen-ai-history', JSON.stringify(history.slice(0, 50)));
    } catch (e) {
        console.error("Could not save to history", e);
    }
  };

  useEffect(() => {
    try {
        const savedCode = localStorage.getItem('kaizen-ai-website-builder-code');
        if (savedCode) {
            setGeneratedCode(JSON.parse(savedCode));
        }
    } catch (e) {
        console.error("Could not load code from localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (generatedCode) {
        try {
            localStorage.setItem('kaizen-ai-website-builder-code', JSON.stringify(generatedCode));
        } catch(e) {
            console.error("Could not save code to localStorage", e);
        }
    }
  }, [generatedCode]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedCode(null);
    try {
      const result = await generateWebsite(values);
      setGeneratedCode(result);
      saveToHistory(values, result);
    } catch (error) {
      console.error('Failed to generate website:', error);
       toast({
        title: "Error",
        description: "Failed to generate website. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (code: string | undefined, language: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast({
        title: "Copied!",
        description: `${language} code copied to clipboard.`,
    });
  };

  const createPreviewSrc = () => {
    if (!generatedCode) return '';
    const { html, css, javascript } = generatedCode;
    
    let finalHtml = html;
    
    if (css) {
        finalHtml = finalHtml.replace('</head>', `<style>${css}</style></head>`);
    }

    if (javascript) {
        finalHtml = finalHtml.replace('</body>', `<script>${javascript}<\/script></body>`);
    }
    
    return finalHtml;
  }

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
        <motion.div variants={itemVariants} className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Globe className="h-8 w-8" />
                    Kaizen AI Website Builder
                </h1>
                <p className="text-muted-foreground">No-code / low-code AI-powered builder to create, customize, and deploy websites instantly.</p>
            </div>
            <div className='flex items-center gap-2'>
                {generatedCode && (
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Eye className="mr-2 h-4 w-4" /> Live Preview
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-7xl h-[90vh]">
                           <DialogHeader>
                            <DialogTitle>Live Website Preview</DialogTitle>
                           </DialogHeader>
                           <iframe
                                srcDoc={createPreviewSrc()}
                                title="Website Preview"
                                className="w-full h-full border rounded-md"
                                sandbox="allow-scripts allow-same-origin"
                           />
                        </DialogContent>
                    </Dialog>
                )}
                <Button variant="outline" onClick={() => {
                    form.reset();
                    setGeneratedCode(null);
                    localStorage.removeItem('kaizen-ai-website-builder-code');
                }}>
                    <Plus className="mr-2 h-4 w-4" /> New
                </Button>
            </div>
        </motion.div>

        <motion.div variants={itemVariants}>
            <Card>
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Website Name</FormLabel><FormControl><Input placeholder="e.g., My Awesome Portfolio" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="languages" render={({ field }) => (
                                <FormItem><FormLabel>Select Languages</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a language set" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {languageOptions.map(lang => (
                                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="prompt" render={({ field }) => (
                                <FormItem><FormLabel>Write a prompt for the website...</FormLabel><FormControl><Textarea placeholder="Describe the website you want to create. Include details about the layout, sections (e.g., hero, about, portfolio, contact), color scheme, and overall style." rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            
                            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Website</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </motion.div>

        {isLoading && (
            <motion.div className="flex flex-col items-center justify-center text-center pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Our AI is building your website...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments.</p>
            </motion.div>
        )}

      {generatedCode && (
        <motion.div className="space-y-4" variants={itemVariants}>
          <Tabs defaultValue="html" className="w-full">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            </TabsList>
            
            <TabsContent value="html">
                <Card className="bg-[#1e1e1e]">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle className="text-gray-300">HTML Code</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(generatedCode.html, 'HTML')} className="text-gray-300 hover:bg-gray-700 hover:text-white"><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                       <Textarea
                          value={generatedCode.html}
                          onChange={(e) => setGeneratedCode(prev => prev ? {...prev, html: e.target.value} : null)}
                          placeholder="Your HTML will be generated here..."
                          className="h-[40vh] min-h-[200px] resize-none font-mono bg-[#1e1e1e] text-gray-300 border-t border-gray-700 rounded-t-none focus-visible:ring-offset-[#1e1e1e] focus-visible:ring-primary"
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="css">
                 <Card className="bg-[#1e1e1e]">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle className="text-gray-300">CSS Code</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(generatedCode.css, 'CSS')} className="text-gray-300 hover:bg-gray-700 hover:text-white"><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                         <Textarea
                            value={generatedCode.css}
                            onChange={(e) => setGeneratedCode(prev => prev ? {...prev, css: e.target.value} : null)}
                            placeholder="Your CSS will be generated here..."
                            className="h-[40vh] min-h-[200px] resize-none font-mono bg-[#1e1e1e] text-gray-300 border-t border-gray-700 rounded-t-none focus-visible:ring-offset-[#1e1e1e] focus-visible:ring-primary"
                            />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="javascript">
                <Card className="bg-[#1e1e1e]">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle className="text-gray-300">JavaScript Code</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(generatedCode.javascript, 'JavaScript')} className="text-gray-300 hover:bg-gray-700 hover:text-white"><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Textarea
                            value={generatedCode.javascript || ''}
                            onChange={(e) => setGeneratedCode(prev => prev ? {...prev, javascript: e.target.value} : null)}
                            placeholder="// No JavaScript was generated for this website."
                             className="h-[40vh] min-h-[200px] resize-none font-mono bg-[#1e1e1e] text-gray-300 border-t border-gray-700 rounded-t-none focus-visible:ring-offset-[#1e1e1e] focus-visible:ring-primary"
                        />
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </motion.div>
  );
}
