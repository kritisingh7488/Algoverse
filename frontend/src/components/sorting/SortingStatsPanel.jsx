import React from 'react';
import { Activity, Clock, Cpu, HardDrive, RefreshCcw, Percent } from 'lucide-react';
import Card from '../common/Card';

export const SortingStatsPanel = ({ stats = {}, stepIndex, totalSteps }) => {
  const sortedPercent = totalSteps > 1 ? Math.min(100, Math.round(((stepIndex + 1) / totalSteps) * 100)) : 100;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-body">
      
      {/* Comparisons */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Comparisons</span>
          <h4 className="text-lg font-mono font-bold text-info">{stats.comparisons || 0}</h4>
        </div>
        <Activity className="w-5 h-5 text-info/40" />
      </Card>

      {/* Swaps */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Swaps</span>
          <h4 className="text-lg font-mono font-bold text-accent">{stats.swaps || 0}</h4>
        </div>
        <RefreshCcw className="w-5 h-5 text-accent/40" />
      </Card>

      {/* Writes */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Writes</span>
          <h4 className="text-lg font-mono font-bold text-primary">{stats.writes || 0}</h4>
        </div>
        <HardDrive className="w-5 h-5 text-primary/40" />
      </Card>

      {/* Reads */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Reads</span>
          <h4 className="text-lg font-mono font-bold text-secondary">{stats.reads || 0}</h4>
        </div>
        <Cpu className="w-5 h-5 text-secondary/40" />
      </Card>

      {/* Execution Time */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">C++ Time</span>
          <h4 className="text-lg font-mono font-bold text-success">{stats.runtimeMs || 0.0} ms</h4>
        </div>
        <Clock className="w-5 h-5 text-success/40" />
      </Card>

      {/* Recursive Calls */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Rec Calls</span>
          <h4 className="text-lg font-mono font-bold text-warning">{stats.recursiveCalls || 0}</h4>
        </div>
        <Activity className="w-5 h-5 text-warning/40" />
      </Card>

      {/* Sorted Progress */}
      <Card className="p-3.5 flex items-center justify-between col-span-2 sm:col-span-1">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Sorted %</span>
          <h4 className="text-lg font-mono font-bold text-textPrimary">{sortedPercent}%</h4>
        </div>
        <Percent className="w-5 h-5 text-textSecondary/40" />
      </Card>

    </div>
  );
};

export default SortingStatsPanel;
