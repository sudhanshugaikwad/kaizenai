
'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateWebsite } from '@/ai/flows/website-builder';
import { generateWebsitePrompt } from '@/ai/flows/website-prompt-generator';
import { editWebsite } from '@/ai/flows/website-editor';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import Editor from '@monaco-editor/react';
import { Loader2, Sparkles, Plus, Globe, FileCode, FileText, FileJson, Copy, Code, Wand2, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';


const formSchema = z.object({
    name: z.string().min(2, "Website name is required."),
    languages: z.string({required_error: "Please select a language set."}),
    prompt: z.string().min(20, "Prompt must be at least 20 characters."),
});

const languageOptions = ["HTML, CSS, JS, Bootstrap", "React (JSX)", "Vue, CSS"];
type FileType = 'html' | 'css' | 'javascript';
type ViewMode = 'code' | 'preview';


export default function WebsiteBuilderPage() {
  const [generatedCode, setGeneratedCode] = useState<WebsiteBuilderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [activeFile, setActiveFile] = useState<FileType>('html');
  const [changeRequest, setChangeRequest] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const { toast } = useToast();
  const { theme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      languages: 'HTML, CSS, JS, Bootstrap',
      prompt: '',
    },
  });

   useEffect(() => {
    try {
      const reuseData = sessionStorage.getItem('kaizen-ai-reuse-website-builder');
      if (reuseData && reuseData !== 'undefined') {
        const parsedData = JSON.parse(reuseData);
        form.reset(parsedData);
        sessionStorage.removeItem('kaizen-ai-reuse-website-builder');
      }
    } catch(e) {
      console.error("Could not reuse data", e);
    }
  }, [form]);
  
  const saveToHistory = (values: z.infer<typeof formSchema>, output: WebsiteBuilderOutput, type: 'Website Generated' | 'Website Edited' = 'Website Generated') => {
    try {
        const history = JSON.parse(localStorage.getItem('kaizen-ai-history') || '[]');
        const newHistoryItem = {
            type: type,
            title: type === 'Website Generated' ? `Created website: ${values.name}` : `Edited website: ${values.name}`,
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
        if (savedCode && savedCode !== 'undefined') {
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

   const handleChangeWebsite = async () => {
    if (!changeRequest.trim() || !generatedCode) {
      toast({
        title: "Change description is empty",
        description: "Please describe the changes you want to make.",
        variant: "destructive",
      });
      return;
    }

    setIsEditing(true);
    try {
      const result = await editWebsite({
        html: generatedCode.html,
        css: generatedCode.css,
        javascript: generatedCode.javascript,
        prompt: changeRequest,
      });
      setGeneratedCode(result);
      toast({ title: "Website Updated!", description: "Your changes have been applied." });
      setChangeRequest('');
    } catch (error) {
      console.error('Failed to edit website:', error);
      toast({
        title: "Error",
        description: "Failed to apply changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };


  const handleAiPrompt = async () => {
    const websiteName = form.getValues('name');
    if (!websiteName.trim()) {
        form.setError('name', { type: 'manual', message: 'Please enter a website name first.' });
        return;
    }
    setIsPromptLoading(true);
    try {
        const result = await generateWebsitePrompt({ websiteName });
        form.setValue('prompt', result.prompt);
        toast({ title: "Prompt Generated!", description: "The AI has created a prompt for you." });
    } catch (error) {
        console.error('Failed to generate prompt:', error);
        toast({ title: "Error", description: "Failed to generate AI prompt. Please try again.", variant: "destructive" });
    } finally {
        setIsPromptLoading(false);
    }
  }

  const handleCopy = (code: string | undefined) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast({
        title: "Copied!",
        description: `${activeFile.toUpperCase()} code copied to clipboard.`,
    });
  };

  const createPreviewSrc = () => {
    if (!generatedCode) return '';
    const { html, css, javascript } = generatedCode;
    
    const srcDoc = `
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
          <script>${javascript || ''}<\/script>
        </body>
      </html>
    `;
    return srcDoc;
  }

  const activeCode = generatedCode?.[activeFile];

  const handleCodeChange = (value: string | undefined) => {
    if (generatedCode) {
      setGeneratedCode({
        ...generatedCode,
        [activeFile]: value || ''
      });
    }
  };

  const fileIcons = {
    html: <FileCode className="h-4 w-4" />,
    css: <FileText className="h-4 w-4" />,
    javascript: <FileJson className="h-4 w-4" />,
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 }},
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
        <motion.div variants={itemVariants} className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Globe className="h-8 w-8" />
                    Kaizen Ai Website Builder
                </h1>
                <p className="text-muted-foreground">No-code / low-code AI-powered builder to create, customize, and deploy websites instantly.</p>
            </div>
            <div className="flex items-center gap-4">
                 {generatedCode && (
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="view-mode-toggle" className="flex items-center gap-2"><Code className="h-4 w-4" /> Code</Label>
                        <Switch
                            id="view-mode-toggle"
                            checked={viewMode === 'preview'}
                            onCheckedChange={(checked) => setViewMode(checked ? 'preview' : 'code')}
                        />
                        <Label htmlFor="view-mode-toggle" className="flex items-center gap-2"><Eye className="h-4 w-4" /> Preview</Label>
                    </div>
                 )}
                 <Button variant="outline" onClick={() => {
                    form.reset();
                    setGeneratedCode(null);
                    localStorage.removeItem('kaizen-ai-website-builder-code');
                    setViewMode('preview');
                }}>
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>
        </motion.div>

        {!generatedCode && !isLoading && (
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
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Write a prompt for the website...</FormLabel>
                                            <Button type="button" variant="outline" size="sm" onClick={handleAiPrompt} disabled={isPromptLoading}>
                                                {isPromptLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                                AI Generate Prompt
                                            </Button>
                                        </div>
                                    <FormControl><Textarea placeholder="Describe the website you want to create. Include details about the layout, sections (e.g., hero, about, portfolio, contact), color scheme, and overall style." rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                
                                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Website</>}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        )}

        {(isLoading || isEditing) && (
            <motion.div className="flex flex-col items-center justify-center text-center pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">{isLoading ? 'Our AI is building your website...' : 'Applying your changes...'}</p>
                <p className="text-sm text-muted-foreground">This may take a few moments.</p>
            </motion.div>
        )}
      
        {generatedCode && (
             <motion.div variants={itemVariants} className="border rounded-lg overflow-hidden h-[75vh]">
                {viewMode === 'code' ? (
                     <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={65} minSize={30}>
                            <div className="flex flex-col h-full bg-background">
                                <div className="p-2 border-b flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {(Object.keys(generatedCode).filter(key => key !== 'prompt') as FileType[]).map(fileType => (
                                            <Button
                                                key={fileType}
                                                variant={activeFile === fileType ? 'secondary' : 'ghost'}
                                                size="sm"
                                                onClick={() => setActiveFile(fileType)}
                                                className="flex items-center gap-2"
                                            >
                                                {fileIcons[fileType]}
                                                {fileType === 'javascript' ? 'script.js' : `index.${fileType}`}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleCopy(activeCode)}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                                </div>
                                <div className="flex-1">
                                    <Editor
                                        height="100%"
                                        language={activeFile}
                                        value={activeCode}
                                        onChange={handleCodeChange}
                                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                        options={{ minimap: { enabled: false }, fontSize: 14 }}
                                    />
                                </div>
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={35} minSize={25}>
                            <div className="flex flex-col h-full bg-background p-4 space-y-4">
                                <Label htmlFor="change-request">Describe the changes you want to make?</Label>
                                <Textarea 
                                    id="change-request"
                                    placeholder="e.g., Change the background color to dark blue. Make all the buttons rounded." 
                                    className="flex-grow"
                                    value={changeRequest}
                                    onChange={(e) => setChangeRequest(e.target.value)}
                                    disabled={isEditing}
                                />
                                <Button onClick={handleChangeWebsite} disabled={isEditing}>
                                    {isEditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Change Website
                                </Button>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                ) : (
                    <iframe
                        srcDoc={createPreviewSrc()}
                        title="Website Preview"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                    />
                )}
             </motion.div>
        )}
    </motion.div>
  );
}

    