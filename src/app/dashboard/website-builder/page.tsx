
'use client';

import { useState, useEffect } from 'react';
import type { WebsiteBuilderOutput } from '@/ai/flows/website-builder.types';
import { generateWebsite } from '@/ai/flows/website-builder';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Editor from '@monaco-editor/react';

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Sparkles, Plus, Globe, Eye, File, FileCode, FileJson, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

const formSchema = z.object({
    name: z.string().min(2, "Website name is required."),
    languages: z.string({required_error: "Please select a language set."}),
    prompt: z.string().min(20, "Prompt must be at least 20 characters."),
});

const languageOptions = ["HTML, CSS, JS, Tailwind, Bootstrap"];

type EditorFile = 'html' | 'css' | 'javascript';

export default function WebsiteBuilderPage() {
  const [generatedCode, setGeneratedCode] = useState<WebsiteBuilderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFile, setActiveFile] = useState<EditorFile>('html');
  const { toast } = useToast();
  const { theme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      languages: languageOptions[0],
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

  const handleCodeChange = (value: string | undefined) => {
    if (!generatedCode || value === undefined) return;
    setGeneratedCode(prev => prev ? { ...prev, [activeFile]: value } : null);
  }

  const createPreviewSrc = () => {
    if (!generatedCode) return '';
    const { html, css, javascript } = generatedCode;
    const srcDoc = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${javascript}</script>
        </body>
      </html>
    `;
    // The AI is instructed to generate a full HTML document including CDN links,
    // so we can just use that directly.
    return generatedCode.html.replace(
        '</head>',
        `<style>${generatedCode.css}</style></head>`
      ).replace(
        '</body>',
        `<script>${generatedCode.javascript}</script></body>`
      );
  }

  const fileIcons: Record<EditorFile, React.ReactNode> = {
    html: <FileCode className="h-4 w-4 text-orange-500" />,
    css: <FileJson className="h-4 w-4 text-blue-500" />,
    javascript: <FileText className="h-4 w-4 text-yellow-500" />
  };

  const fileNames: Record<EditorFile, string> = {
    html: 'index.html',
    css: 'style.css',
    javascript: 'script.js'
  };

  const getActiveCode = () => {
    if (!generatedCode) return '';
    return generatedCode[activeFile] || '';
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
    >
        <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Globe className="h-8 w-8" />
                    Kaizen AI Website Builder
                </h1>
                <p className="text-muted-foreground">AI-powered builder to create websites with a VS Code-like editor.</p>
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
                                className="w-full h-full border rounded-md bg-white"
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

        <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1, transition:{delay: 0.1}}}>
            <Card>
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Website Name</FormLabel><FormControl><Input placeholder="e.g., My Awesome Portfolio" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="languages" render={({ field }) => (
                                <FormItem><FormLabel>Select Technologies</FormLabel>
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
                                <FormItem><FormLabel>Describe the website you want...</FormLabel><FormControl><Textarea placeholder="e.g., A modern portfolio for a photographer with a dark theme, a gallery section with a grid layout, and a contact form." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            
                            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Website</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </motion.div>

        {(isLoading || generatedCode) && (
            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1, transition:{delay: 0.2}}}>
                <Card className="min-h-[60vh] flex flex-col">
                    <CardHeader>
                        <CardTitle>VS Code Editor</CardTitle>
                        <CardDescription>Your generated code will appear here. You can edit it live.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col md:flex-row gap-0 overflow-hidden p-0">
                       {isLoading ? (
                            <div className="flex flex-col items-center justify-center w-full h-full text-center p-6">
                                <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
                                <p className="mt-4 text-lg text-muted-foreground">Our AI is building your website...</p>
                                <p className="text-sm text-muted-foreground">This may take a few moments.</p>
                            </div>
                       ) : (
                            <>
                            {/* File Explorer */}
                            <div className="w-full md:w-48 bg-muted/50 p-2 border-b md:border-b-0 md:border-r">
                                <h3 className="text-sm font-semibold mb-2 px-2">EXPLORER</h3>
                                <ul className="space-y-1">
                                    {(['html', 'css', 'javascript'] as EditorFile[]).map(file => (
                                        <li key={file}>
                                            <button 
                                                onClick={() => setActiveFile(file)}
                                                className={`w-full flex items-center gap-2 p-2 text-sm rounded-md text-left ${activeFile === file ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}
                                            >
                                                {fileIcons[file]}
                                                <span>{fileNames[file]}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Editor */}
                            <div className="flex-grow relative">
                                <Editor
                                    height="50vh"
                                    language={activeFile === 'javascript' ? 'javascript' : activeFile}
                                    value={getActiveCode()}
                                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                    onChange={handleCodeChange}
                                    options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-6 bg-muted/80 px-4 text-xs flex items-center border-t">
                                    <span>{fileNames[activeFile]}</span>
                                </div>
                            </div>
                            </>
                       )}
                    </CardContent>
                </Card>
            </motion.div>
        )}
    </motion.div>
  );
}
