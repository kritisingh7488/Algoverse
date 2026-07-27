import React from 'react';
import { Activity, Layers, Database, Cpu, Clock, HardDrive, BarChart2, GitCommit, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';

export const GraphInformationPanel = ({
  currentEvent,
  statistics,
  graphType,
  algorithm,
  stepIndex,
  totalSteps
}) => {
  const ev = currentEvent || {};
  const stats = statistics || {};

  return (
    <div className="space-y-4 font-body">
      {/* 1. Step Description & Active Status Banner */}
      <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/20 rounded-card p-4 shadow-soft">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground">
              {algorithm.toUpperCase()}
            </span>
            <span className="text-xs font-semibold text-muted capitalize">
              {graphType} Graph
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-primary">
            Step {totalSteps > 0 ? stepIndex + 1 : 0} / {totalSteps}
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground">
          {ev.desc || 'Select an operation or click Play to start visualization.'}
        </p>
      </div>

      {/* 2. Live Algorithm Structures Card */}
      <Card className="p-4 bg-card border-borderTheme space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-borderTheme">
          <Layers className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
            Live Algorithm Data Structures
          </h4>
        </div>

        {/* Queue / Stack / PQueue */}
        {ev.queue && ev.queue.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted">Queue (FIFO):</span>
            <div className="flex flex-wrap gap-1">
              {ev.queue.map((nodeId, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-mono font-bold rounded border border-primary/30">
                  {nodeId}
                </span>
              ))}
            </div>
          </div>
        )}

        {ev.stack && ev.stack.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted">Stack (LIFO):</span>
            <div className="flex flex-wrap gap-1">
              {ev.stack.map((nodeId, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-xs font-mono font-bold rounded border border-amber-500/30">
                  {nodeId}
                </span>
              ))}
            </div>
          </div>
        )}

        {ev.sequence && ev.sequence.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted">Visited Order / Traversal Sequence:</span>
            <div className="flex flex-wrap gap-1">
              {ev.sequence.map((nodeId, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold rounded border border-emerald-500/30">
                  {nodeId}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Distance & Parent Arrays */}
        {ev.distance && ev.distance.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-borderTheme/50">
            <span className="text-xs font-bold text-muted">Distance Array:</span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
              {ev.distance.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center p-1 bg-surface rounded border border-borderTheme text-center">
                  <span className="text-[10px] text-muted">V{idx}</span>
                  <span className="text-xs font-mono font-bold text-foreground">{d}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {ev.parent && ev.parent.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-borderTheme/50">
            <span className="text-xs font-bold text-muted">Parent / Union-Find Array:</span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
              {ev.parent.map((p, idx) => (
                <div key={idx} className="flex flex-col items-center p-1 bg-surface rounded border border-borderTheme text-center">
                  <span className="text-[10px] text-muted">V{idx}</span>
                  <span className="text-xs font-mono font-bold text-foreground">{p === -1 ? 'nil' : p}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MST Cost / Flow Value */}
        {(ev.mstCost > 0 || ev.flowValue > 0) && (
          <div className="flex items-center justify-between pt-2 border-t border-borderTheme text-xs font-bold">
            {ev.mstCost > 0 && (
              <span className="text-primary">MST Total Cost: <span className="font-mono">{ev.mstCost}</span></span>
            )}
            {ev.flowValue > 0 && (
              <span className="text-emerald-500">Total Network Flow: <span className="font-mono">{ev.flowValue}</span></span>
            )}
          </div>
        )}
      </Card>

      {/* 3. Structural Graph Statistics Card */}
      <Card className="p-4 bg-card border-borderTheme space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-borderTheme">
          <BarChart2 className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
            Structural Graph Statistics (C++ Engine)
          </h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="bg-surface p-2.5 rounded-lg border border-borderTheme flex flex-col">
            <span className="text-[11px] font-semibold text-muted">Vertices | Edges</span>
            <span className="text-sm font-mono font-bold text-foreground">
              {stats.verticesCount || 0} <span className="text-muted font-normal">|</span> {stats.edgesCount || 0}
            </span>
          </div>
          <div className="bg-surface p-2.5 rounded-lg border border-borderTheme flex flex-col">
            <span className="text-[11px] font-semibold text-muted">Density</span>
            <span className="text-sm font-mono font-bold text-foreground">
              {stats.density !== undefined ? `${(stats.density * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
          <div className="bg-surface p-2.5 rounded-lg border border-borderTheme flex flex-col">
            <span className="text-[11px] font-semibold text-muted">Avg | Max Degree</span>
            <span className="text-sm font-mono font-bold text-foreground">
              {stats.avgDegree || 0} <span className="text-muted font-normal">|</span> {stats.maxDegree || 0}
            </span>
          </div>
          <div className="bg-surface p-2.5 rounded-lg border border-borderTheme flex flex-col">
            <span className="text-[11px] font-semibold text-muted">Relaxations</span>
            <span className="text-sm font-mono font-bold text-primary">
              {stats.relaxationsCount || 0}
            </span>
          </div>
          <div className="bg-surface p-2.5 rounded-lg border border-borderTheme flex flex-col">
            <span className="text-[11px] font-semibold text-muted">Queue / Stack Ops</span>
            <span className="text-sm font-mono font-bold text-foreground">
              {(stats.queueOpsCount || 0) + (stats.stackOpsCount || 0)}
            </span>
          </div>
          <div className="bg-surface p-2.5 rounded-lg border border-borderTheme flex flex-col">
            <span className="text-[11px] font-semibold text-muted">Engine Runtime</span>
            <span className="text-sm font-mono font-bold text-foreground">
              {stats.runtimeMs !== undefined ? `${stats.runtimeMs} ms` : '0 ms'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GraphInformationPanel;
