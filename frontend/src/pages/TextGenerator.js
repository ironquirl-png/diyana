import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Copy, Check } from 'lucide-react';
import { generateText } from '@/lib/api';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const TextGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [contentStyle, setContentStyle] = useState('blog');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const data = await generateText(prompt, contentStyle);
      setResult(data);
      toast.success('Text generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate text');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTXT = () => {
    if (result?.content) {
      const blob = new Blob([result.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Downloaded as TXT!');
    }
  };

  const handleDownloadPDF = () => {
    if (result?.content) {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(result.content, maxWidth);
      doc.text(lines, margin, 20);
      doc.save(`content-${Date.now()}.pdf`);
      toast.success('Downloaded as PDF!');
    }
  };

  return (
    <div className="max-w-5xl" data-testid="text-generator-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl font-outfit font-bold tracking-tight mb-2" data-testid="text-generator-title">
            AI Text Generator
          </h1>
          <p className="text-lg text-gray-600">Create engaging content with GPT-5.2</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content-style">Content Style</Label>
            <Select value={contentStyle} onValueChange={setContentStyle}>
              <SelectTrigger data-testid="content-style-select" className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog" data-testid="style-blog">Blog Post</SelectItem>
                <SelectItem value="article" data-testid="style-article">Article</SelectItem>
                <SelectItem value="social" data-testid="style-social">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Your Prompt</Label>
            <Textarea
              id="prompt"
              data-testid="text-prompt-input"
              placeholder="E.g., Write a blog post about the future of AI in content creation..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 resize-none"
            />
          </div>

          <Button
            data-testid="generate-text-btn"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-primary text-white hover:bg-primary/90 h-12 rounded-full font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Text'
            )}
          </Button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-4"
            data-testid="text-result-container"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-outfit font-bold">Generated Content</h3>
              <div className="flex gap-2">
                <Button
                  data-testid="copy-text-btn"
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  data-testid="download-txt-btn"
                  onClick={handleDownloadTXT}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  TXT
                </Button>
                <Button
                  data-testid="download-pdf-btn"
                  onClick={handleDownloadPDF}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed" data-testid="generated-text-content">
                {result.content}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TextGenerator;