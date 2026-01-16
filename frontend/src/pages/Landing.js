import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Image, FileText, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1763259373848-9d56552e2146?crop=entropy&cs=srgb&fm=jpg&q=85')] bg-cover bg-center opacity-20"></div>
        
        <nav className="relative z-10 px-6 md:px-12 lg:px-24 py-6">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Sparkles className="w-8 h-8" />
              <span className="text-2xl font-outfit font-bold">ContentAI</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4"
            >
              <Button 
                data-testid="nav-login-btn"
                onClick={() => navigate('/login')} 
                variant="ghost" 
                className="text-white hover:bg-white/20 rounded-full"
              >
                Login
              </Button>
              <Button 
                data-testid="nav-signup-btn"
                onClick={() => navigate('/signup')} 
                className="bg-white text-primary hover:bg-white/90 rounded-full font-semibold px-6"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </nav>

        <div className="relative z-10 px-6 md:px-12 lg:px-24 py-20 md:py-32">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-outfit font-bold tracking-tight leading-none">
                Revolutionize Your
                <br />
                <span className="text-gradient">Content Creation</span>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-white/80 max-w-2xl mx-auto">
                Create stunning blogs, articles, and social media content with AI.
                Generate text and images in seconds, not hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button
                  data-testid="hero-cta-btn"
                  onClick={() => navigate('/signup')}
                  className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 font-medium px-8 py-6 rounded-full text-lg"
                >
                  Start Creating Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  data-testid="hero-demo-btn"
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-2 border-white bg-transparent hover:bg-white hover:text-primary text-white font-medium px-8 py-6 rounded-full text-lg"
                >
                  View Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#f8fafc] text-gray-900 py-20 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful AI tools designed for modern content creators
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md border border-slate-100"
              data-testid="feature-text-card"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-outfit font-semibold mb-3">AI Text Generation</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate engaging blogs, professional articles, and catchy social media posts powered by GPT-5.2
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md border border-slate-100"
              data-testid="feature-image-card"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-outfit font-semibold mb-3">AI Image Creation</h3>
              <p className="text-gray-600 leading-relaxed">
                Create stunning visuals with OpenAI's latest image generation technology. Perfect for any content.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md border border-slate-100"
              data-testid="feature-export-card"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-outfit font-semibold mb-3">Export & Save</h3>
              <p className="text-gray-600 leading-relaxed">
                Save your content history and export as PDF, TXT, or image files. Access your work anytime.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#09090b] text-white py-20 px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight">
            Ready to Transform Your Content?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Join thousands of creators using AI to produce amazing content faster than ever.
          </p>
          <Button
            data-testid="footer-cta-btn"
            onClick={() => navigate('/signup')}
            className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 font-medium px-8 py-6 rounded-full text-lg"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;