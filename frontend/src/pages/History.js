import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Image, Trash2, Download, Copy, Check } from 'lucide-react';
import { getContents, deleteContent } from '@/lib/api';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const History = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const data = await getContents();
      setContents(data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContent(id);
      setContents(contents.filter(c => c.id !== id));
      toast.success('Content deleted');
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadText = (content, id) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const handleDownloadPDF = (content, id) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;
    
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, maxWidth);
    doc.text(lines, margin, 20);
    doc.save(`content-${id}.pdf`);
    toast.success('Downloaded as PDF!');
  };

  const handleDownloadImage = (base64, id) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64}`;
    link.download = `image-${id}.png`;
    link.click();
    toast.success('Image downloaded!');
  };

  const filteredContents = activeTab === 'all' 
    ? contents 
    : contents.filter(c => c.content_type === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl" data-testid="history-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl font-outfit font-bold tracking-tight mb-2" data-testid="history-title">
            Content History
          </h1>
          <p className="text-lg text-gray-600">View and manage your generated content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
            <TabsTrigger value="text" data-testid="tab-text">Text</TabsTrigger>
            <TabsTrigger value="image" data-testid="tab-image">Images</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredContents.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center" data-testid="empty-history">
                <p className="text-gray-500">No content found. Start creating!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4" data-testid="history-list">
                {filteredContents.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    data-testid={`history-item-${index}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.content_type === 'text' ? 'bg-primary/10' : 'bg-secondary/10'
                        }`}>
                          {item.content_type === 'text' ? (
                            <FileText className={`w-5 h-5 ${
                              item.content_type === 'text' ? 'text-primary' : 'text-secondary'
                            }`} />
                          ) : (
                            <Image className="w-5 h-5 text-secondary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleDateString()} at{' '}
                            {new Date(item.created_at).toLocaleTimeString()}
                          </p>
                          <p className="text-sm font-medium text-gray-700 mt-1">
                            <strong>Prompt:</strong> {item.prompt}
                          </p>
                        </div>
                      </div>
                      <Button
                        data-testid={`delete-btn-${index}`}
                        onClick={() => handleDelete(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {item.content_type === 'text' ? (
                      <>
                        <div className="p-4 bg-slate-50 rounded-xl mb-4">
                          <p className="text-gray-800 content-preview">{item.result}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            data-testid={`copy-btn-${index}`}
                            onClick={() => handleCopy(item.result, item.id)}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                          >
                            {copiedId === item.id ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copiedId === item.id ? 'Copied' : 'Copy'}
                          </Button>
                          <Button
                            data-testid={`download-txt-btn-${index}`}
                            onClick={() => handleDownloadText(item.result, item.id)}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            TXT
                          </Button>
                          <Button
                            data-testid={`download-pdf-btn-${index}`}
                            onClick={() => handleDownloadPDF(item.result, item.id)}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-xl overflow-hidden border border-slate-200 mb-4">
                          <img
                            src={`data:image/png;base64,${item.result}`}
                            alt="Generated"
                            className="w-full h-auto max-h-96 object-contain"
                          />
                        </div>
                        <Button
                          data-testid={`download-image-btn-${index}`}
                          onClick={() => handleDownloadImage(item.result, item.id)}
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default History;