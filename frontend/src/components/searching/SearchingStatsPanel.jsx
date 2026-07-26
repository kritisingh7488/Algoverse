import React from 'react';
import { Activity, Clock, Cpu, Eye, CheckCircle2, XCircle, Percent, ArrowRightLeft } from 'lucide-react';
import Card from '../common/Card';

export const SearchingStatsPanel = ({ stats = {}, stepIndex, totalSteps, isFound }) => {
  const progressPercent = totalSteps > 1 ? Math.min(100, Math.round(((stepIndex + 1) / totalSteps) * 100)) : 100;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-body">
      
      {/* Target Status Badge */}
      <Card className="p-3.5 flex items-center justify-between col-span-2 sm:col-span-1">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Target Status</span>
          <div className="flex items-center gap-1.5 mt-1">
            {isFound === true ? (
              <span className="text-xs font-heading font-bold text-success flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-success" /> FOUND
              </span>
            ) : isFound === false && stepIndex === totalSteps - 1 ? (
              <span className="text-xs font-heading font-bold text-danger flex items-center gap-1">
                <XCircle className="w-4 h-4 text-danger" /> NOT FOUND
              </span>
            ) : (
              <span className="text-xs font-heading font-bold text-warning flex items-center gap-1">
                <Activity className="w-4 h-4 text-warning animate-pulse" /> SEARCHING
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Comparisons */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Comparisons</span>
          <h4 className="text-lg font-mono font-bold text-info">{stats.comparisons || 0}</h4>
        </div>
        <Activity className="w-5 h-5 text-info/40" />
      </Card>

      {/* Reads */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Reads</span>
          <h4 className="text-lg font-mono font-bold text-primary">{stats.reads || 0}</h4>
        </div>
        <Cpu className="w-5 h-5 text-primary/40" />
      </Card>

      {/* Visited Count */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Visited Nodes</span>
          <h4 className="text-lg font-mono font-bold text-accent">{stats.visitedCount || 0}</h4>
        </div>
        <Eye className="w-5 h-5 text-accent/40" />
      </Card>

      {/* Pointer Moves */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Pointer Moves</span>
          <h4 className="text-lg font-mono font-bold text-secondary">{stats.pointerMoves || 0}</h4>
        </div>
        <ArrowRightLeft className="w-5 h-5 text-secondary/40" />
      </Card>

      {/* C++ Execution Time */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">C++ Time</span>
          <h4 className="text-lg font-mono font-bold text-success">{stats.runtimeMs || 0.0} ms</h4>
        </div>
        <Clock className="w-5 h-5 text-success/40" />
      </Card>

      {/* Search Progress */}
      <Card className="p-3.5 flex items-center justify-between col-span-2 sm:col-span-1">
        <div>
          <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Progress %</span>
          <h4 className="text-lg font-mono font-bold text-textPrimary">{progressPercent}%</h4>
        </div>
        <Percent className="w-5 h-5 text-textSecondary/40" />
      </Card>

    </div>
  );
};

export default SearchingStatsPanel;
