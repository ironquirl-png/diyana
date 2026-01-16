import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickActions = [
    {
      icon: FileText,
      title: 'Generate Text',
      description: 'Create blogs, articles, or social posts',
      path: '/dashboard/text',
      color: 'bg-primary',
      testId: 'quick-action-text'
    },
    {
      icon: Image,
      title: 'Generate Image',
      description: 'Create AI-powered visuals',
      path: '/dashboard/image',
      color: 'bg-secondary',
      testId: 'quick-action-image'
    }
  ];

  return (
    <div className="space-y-8" data-testid="dashboard-home">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight">
          Welcome back, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-lg text-gray-600">What would you like to create today?</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={action.testId}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg border border-slate-100 cursor-pointer group"
            >
              <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-outfit font-bold mb-2">{action.title}</h3>
              <p className="text-gray-600 mb-4">{action.description}</p>
              <Button className="bg-slate-100 text-gray-900 hover:bg-slate-200 rounded-full font-semibold group-hover:bg-primary group-hover:text-white">
                Get Started
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 text-white"
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-outfit font-bold mb-2">Pro Tips</h3>
            <ul className="space-y-2 text-white/90">
              <li>• Be specific with your prompts for better results</li>
              <li>• Try different content styles: blog, article, or social media</li>
              <li>• Save your favorite generations to history for easy access</li>
              <li>• Export your content as PDF or text files</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;