import React from 'react';
import Card from '../common/Card';
import { Award, Zap, HardDrive, Hash } from 'lucide-react';

export default function DPComparisonSuite({ problem }) {
  // Configured default benchmarks based on problem theoretical complexity
  const approaches = [
    {
      name: "Recursive",
      time: "O(2^N)",
      space: "O(N) recursion",
      metricTime: 100, // percentage for visualization bars
      metricSpace: 40,
      calls: "2^N calls",
      efficiency: "Low"
    },
    {
      name: "Memoization",
      time: "O(N)",
      space: "O(N) table + stack",
      metricTime: 15,
      metricSpace: 60,
      calls: "N calls",
      efficiency: "Medium"
    },
    {
      name: "Tabulation",
      time: "O(N)",
      space: "O(N) table",
      metricTime: 8,
      metricSpace: 45,
      calls: "0 calls (Iterative)",
      efficiency: "High"
    },
    {
      name: "Space Optimized",
      time: "O(N)",
      space: "O(1) storage",
      metricTime: 5,
      metricSpace: 5,
      calls: "0 calls (Iterative)",
      efficiency: "Max"
    }
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-borderTheme pb-4">
        <div>
          <h3 className="text-lg font-heading font-bold text-textPrimary">
            Approach Comparison Suite
          </h3>
          <p className="text-xs text-textSecondary mt-0.5">
            Racing all 4 optimization states side-by-side for {problem?.name || "current algorithm"}.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold mt-2 md:mt-0">
          <Award className="w-3.5 h-3.5" /> Space Optimized is standard best
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {approaches.map((app) => (
          <Card key={app.name} className="p-4 border-[1.5px] border-borderTheme bg-card/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-textPrimary">{app.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  app.efficiency === 'Max' ? 'bg-emerald-500/10 text-emerald-500' :
                  app.efficiency === 'High' ? 'bg-cyan-500/10 text-cyan-500' :
                  app.efficiency === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {app.efficiency}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {/* Time Complexity */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-textSecondary mb-1">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Time</span>
                    <span>{app.time}</span>
                  </div>
                  <div className="w-full bg-borderTheme h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        app.efficiency === 'Low' ? 'bg-danger' : 'bg-primary'
                      }`}
                      style={{ width: `${app.metricTime}%` }} 
                    />
                  </div>
                </div>

                {/* Space Complexity */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-textSecondary mb-1">
                    <span className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-cyan-500" /> Space</span>
                    <span>{app.space}</span>
                  </div>
                  <div className="w-full bg-borderTheme h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${app.metricSpace}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-borderTheme flex items-center justify-between text-[10px] font-mono text-textSecondary">
              <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> Calls:</span>
              <span>{app.calls}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
