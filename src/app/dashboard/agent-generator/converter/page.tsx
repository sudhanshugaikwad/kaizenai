
'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Wand2, Copy, CheckCircle, XCircle, ArrowLeft, GitBranch, FileJson, Check, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { convertJson } from '@/ai/flows/json-converter';
import type { JsonConverterOutput } from '@/ai/flows/json-converter.types';
import { Label } from '@/components/ui/label';


const platformNames = ["n8n", "Make.com", "Zapier", "General Purpose"];

const defaultN8nWorkflow = `{
  "name": "Genkit AI Chat Agent",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "genkit-ai",
        "options": {}
      },
      "name": "Webhook Input",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "functionCode": "return [{ json: { prompt: \`User said: \${$json[\\"userMessage\\"]}\`, context: $json[\\"context\\"] || {} } }];"
      },
      "name": "Pre-Processing",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [500, 300]
    },
    {
      "parameters": {
        "resource": "completion",
        "operation": "create",
        "model": "gpt-3.5-turbo",
        "prompt": "={{$json[\\"prompt\\"]}}",
        "temperature": 0.7,
        "maxTokens": 300
      },
      "name": "OpenAI Chat",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [750, 300],
      "credentials": {
        "openAiApi": {
          "id": "your-credential-id",
          "name": "OpenAI Account"
        }
      }
    },
    {
      "parameters": {
        "functionCode": "const responseText = $json[\\"data\\"]?.[0]?.[\\"text\\"] || ($json[\\"choices\\"] && $json[\\"choices\\"][0]?.[\\"message\\"]?.[\\"content\\"]) || \\"(no response)\\";\\nreturn [{ json: { response: responseText, context: $json[\\"context\\"], timestamp: new Date().toISOString() } }];"
      },
      "name": "Post-Processing",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [1000, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "options": {}
      },
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1250, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json[\\"response\\"]}}",
              "operation": "contains",
              "value2": "code"
            }
          ]
        }
      },
      "name": "Conditional Branch",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [1000, 500]
    }
  ],
  "connections": {
    "Webhook Input": {
      "main": [
        [
          {
            "node": "Pre-Processing",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Pre-Processing": {
      "main": [
        [
          {
            "node": "OpenAI Chat",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI Chat": {
      "main": [
        [
          {
            "node": "Post-Processing",
            "type": "main",
            "index": 0
          },
          {
            "node": "Conditional Branch",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Post-Processing": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`;

const formSchema = z.object({
  jsonString: z.string().refine(val => {
    try {
        JSON.parse(val);
        return true;
    } catch {
        return false;
    }
  }, { message: "Invalid JSON format." }),
  targetPlatform: z.string({ required_error: "Please select a platform." }),
});

export default function JsonConverterPage() {
    const [result, setResult] = useState<JsonConverterOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jsonString: defaultN8nWorkflow,
            targetPlatform: 'n8n',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setResult(null);
        try {
            const conversionResult = await convertJson(values);
            setResult(conversionResult);
        } catch (error) {
            console.error('Failed to convert JSON:', error);
            toast({ title: "Error", description: "Failed to process JSON.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    const handleCopyJson = () => {
        if (!result?.fixedJson) return;
        navigator.clipboard.writeText(result.fixedJson);
        toast({ title: "Copied!", description: "Fixed JSON copied to clipboard." });
    }

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
            <motion.div variants={itemVariants} className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">JSON Validator & Converter</h1>
                <Link href="/dashboard/agent-generator">
                    <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Agent Tools</Button>
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Input JSON</CardTitle>
                            <CardDescription>Paste your JSON and select the target platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField control={form.control} name="jsonString" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your JSON</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder='{ "key": "value" }' {...field} rows={15} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={form.control} name="targetPlatform" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Platform</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {platformNames.map(platform => <SelectItem key={platform} value={platform}>{platform}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button type="submit" disabled={isLoading} className="w-full">
                                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : <><Wand2 className="mr-2 h-4 w-4" />Validate & Convert</>}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center pt-10 h-full">
                            <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-lg text-muted-foreground">Our AI is analyzing your JSON...</p>
                        </div>
                    )}
                    {result && (
                         <Card className="flex-1 flex flex-col">
                            <CardHeader>
                                <CardTitle>Result</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col space-y-4">
                                <Alert variant={result.isSuccess ? 'default' : 'destructive'}>
                                    {result.isSuccess ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                    <AlertTitle>{result.isSuccess ? 'Success' : 'Validation Failed'}</AlertTitle>
                                    <AlertDescription>
                                        {result.feedback}
                                    </AlertDescription>
                                </Alert>
                                {result.isSuccess && (
                                    <div className="flex-1 flex flex-col space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label>Corrected & Converted JSON</Label>
                                            <Button variant="ghost" size="sm" onClick={handleCopyJson}>
                                                <Copy className="mr-2 h-4 w-4" /> Copy
                                            </Button>
                                        </div>
                                        <Textarea value={result.fixedJson} readOnly rows={15} className="font-mono text-xs flex-1" />
                                    </div>
                                )}
                            </CardContent>
                         </Card>
                    )}
                </motion.div>
            </div>

        </motion.div>
    );
}
