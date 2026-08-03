import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Card from './Card';
import AppLayout from '../../layouts/AppLayout';

const ComingSoon = ({ title = "Coming Soon", description = "We're working hard to bring you this feature. Stay tuned!" }) => {
  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[60vh] py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 text-center border-[1.5px] border-borderTheme flex flex-col items-center shadow-medium relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-surface border-[1.5px] border-borderTheme shadow-inner flex items-center justify-center mb-4 relative z-10">
              <Sparkles className="w-7 h-7 text-primary animate-pulse" />
            </div>
            
            <h1 className="text-2xl font-heading font-black text-textPrimary mb-2 relative z-10">
              {title}
            </h1>
            
            <p className="text-sm text-textSecondary font-body leading-relaxed mb-6 relative z-10">
              {description}
            </p>

            <Link to="/dashboard" className="relative z-10 w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full justify-center">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ComingSoon;
