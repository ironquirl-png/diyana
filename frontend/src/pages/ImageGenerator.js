import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Download } from 'lucide-react';
import { generateImage } from '@/lib/api';
import { toast } from 'sonner';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const data = await generateImage(prompt);
      setResult(data);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result?.image_base64) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${result.image_base64}`;
      link.download = `image-${Date.now()}.png`;
      link.click();
      toast.success('Image downloaded!');
    }
  };

  return (
    <div className="max-w-5xl" data-testid="image-generator-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl font-outfit font-bold tracking-tight mb-2" data-testid="image-generator-title">
            AI Image Generator
          </h1>
          <p className="text-lg text-gray-600">Create stunning visuals with OpenAI GPT Image 1</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Image Description</Label>
            <Textarea
              id="prompt"
              data-testid="image-prompt-input"
              placeholder="E.g., A futuristic city with flying cars at sunset, cyberpunk style..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 resize-none"
            />
          </div>

          <Button
            data-testid="generate-image-btn"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-secondary text-white hover:bg-secondary/90 h-12 rounded-full font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating... (this may take up to 1 minute)
              </>
            ) : (
              'Generate Image'
            )}
          </Button>

          {loading && (
            <div className="text-center text-sm text-gray-600">
              <p>Please wait while we create your image...</p>
              <p className="text-xs mt-1">Image generation can take 30-60 seconds</p>
            </div>
          )}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-4"
            data-testid="image-result-container"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-outfit font-bold">Generated Image</h3>
              <Button
                data-testid="download-image-btn"
                onClick={handleDownload}
                variant="outline"
                className="rounded-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <img
                src={`data:image/png;base64,${result.image_base64}`}
                alt="Generated"
                data-testid="generated-image"
                className="w-full h-auto"
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-gray-600">
                <strong>Prompt:</strong> {result.prompt}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ImageGenerator;