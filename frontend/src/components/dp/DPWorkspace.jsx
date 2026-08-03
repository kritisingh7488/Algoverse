import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { ArrowLeft, Play, RotateCcw, Box, Code2 } from 'lucide-react';

const DPWorkspace = ({ problem, onBack }) => {
  if (!problem) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4 border-[1.5px] border-borderTheme">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-heading font-bold text-textPrimary flex items-center gap-2">
              <Box className="w-5 h-5 text-primary" />
              {problem.name}
            </h2>
            <p className="text-xs text-textSecondary">
              Dynamic Programming Visualizer
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="primary" size="sm" className="flex-1 sm:flex-none">
            <Play className="w-4 h-4 mr-1.5" /> Visualize
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* State/Code Panel */}
        <Card className="lg:col-span-4 p-4 space-y-4 border-[1.5px] border-borderTheme h-[calc(100vh-14rem)] overflow-y-auto">
          <h3 className="text-sm font-heading font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" /> State Transition
          </h3>
          <div className="p-3 bg-cardAccent rounded-lg text-xs font-mono text-textSecondary space-y-2">
            <p className="text-primary font-bold">// Coming Soon</p>
            <p>dp[i] = dp[i-1] + dp[i-2];</p>
          </div>
          <div className="text-sm text-textSecondary mt-4">
            <p>The C++ engine is currently being wired up to visualize state transitions for {problem.name}.</p>
          </div>
        </Card>

        {/* Canvas Panel */}
        <Card className="lg:col-span-8 p-4 border-[1.5px] border-borderTheme h-[calc(100vh-14rem)] relative flex flex-col items-center justify-center bg-card/50">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
          
          <div className="z-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center border-[1.5px] border-primary/20">
              <Box className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-heading font-bold text-textPrimary">
              Visualization Engine Ready
            </h3>
            <p className="text-sm text-textSecondary max-w-sm mx-auto">
              Select an input configuration and click visualize to see how the DP table populates step-by-step.
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default DPWorkspace;
