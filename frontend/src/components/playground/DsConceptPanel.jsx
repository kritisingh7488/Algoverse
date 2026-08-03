import React, { useState } from 'react';
import { Code, Lightbulb, AlertTriangle, Sparkles, BookOpen, Clock, Activity, Maximize2, X } from 'lucide-react';

export const DsConceptPanel = ({ spec, stepData, currentOpName }) => {
  const [activeTab, setActiveTab] = useState('pseudocode'); // 'pseudocode' | 'concept'
  const [isExpanded, setIsExpanded] = useState(false);

  // Resolve active pseudocode lines array
  const pseudocodeLines = spec.pseudocode[currentOpName] || spec.pseudocode.default || spec.pseudocode.insert || Object.values(spec.pseudocode)[0] || [];

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-5 shadow-soft space-y-5 font-body">
      
      {/* Tab Switcher */}
      <div className="flex bg-surface p-1 rounded-2xl border-2 border-borderTheme">
        <button
          onClick={() => setActiveTab('pseudocode')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'pseudocode'
              ? 'bg-card text-textPrimary shadow-soft border border-borderTheme'
              : 'text-textSecondary hover:text-textPrimary'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-primary" /> Code & State
        </button>
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'concept'
              ? 'bg-card text-textPrimary shadow-soft border border-borderTheme'
              : 'text-textSecondary hover:text-textPrimary'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-secondary" /> Concept & Tips
        </button>
      </div>

      {activeTab === 'pseudocode' ? (
        <div className="space-y-4">
          
          {/* Active Pseudocode */}
          <div className="space-y-2">
            <h4 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5"><Code className="w-3.5 h-3.5 text-primary" /> Pseudocode Execution</div>
              <button onClick={() => setIsExpanded(true)} className="hover:text-primary transition-colors" title="Expand Pseudocode">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </h4>
            <div className="bg-surface border-2 border-borderTheme rounded-2xl p-3.5 font-mono text-[11px] text-textPrimary space-y-1 overflow-x-auto">
              {pseudocodeLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    stepData?.line === idx
                      ? 'bg-primary/20 text-primary font-bold border-l-4 border-primary pl-3'
                      : 'opacity-70'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Explanation & Live Variables */}
          <div className="space-y-2 pt-2 border-t-2 border-borderTheme">
            <h4 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-warning" /> Step Details & Metrics
            </h4>
            <div className="p-3.5 rounded-2xl bg-surface border-2 border-borderTheme space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-primary">{stepData?.op || 'Initialized'}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-card border border-borderTheme text-textSecondary">
                  Time: {stepData?.time || spec.bestTime}
                </span>
              </div>
              <p className="text-xs text-textSecondary leading-relaxed">{stepData?.desc || spec.description}</p>
            </div>
          </div>

          {/* Time & Space Complexity Summary Card */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-borderTheme text-center">
            <div className="p-2.5 rounded-2xl bg-surface border border-borderTheme">
              <span className="text-[10px] font-heading font-bold text-textSecondary uppercase block">Best Time</span>
              <span className="text-xs font-mono font-bold text-success">{spec.bestTime}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-surface border border-borderTheme">
              <span className="text-[10px] font-heading font-bold text-textSecondary uppercase block">Space</span>
              <span className="text-xs font-mono font-bold text-secondary">{spec.space}</span>
            </div>
          </div>

        </div>
      ) : (
        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
          
          {/* Concept Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-heading font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> Conceptual Intuition
            </h4>
            <p className="text-xs text-textSecondary leading-relaxed">{spec.intuition}</p>
          </div>

          {/* Advantages & Disadvantages */}
          <div className="space-y-2 pt-2 border-t-2 border-borderTheme">
            <h5 className="text-[11px] font-heading font-bold text-success uppercase">Advantages</h5>
            <ul className="space-y-1 text-xs text-textSecondary list-disc list-inside">
              {spec.advantages?.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>

            <h5 className="text-[11px] font-heading font-bold text-danger uppercase pt-2">Disadvantages</h5>
            <ul className="space-y-1 text-xs text-textSecondary list-disc list-inside">
              {spec.disadvantages?.map((dis, i) => (
                <li key={i}>{dis}</li>
              ))}
            </ul>
          </div>

          {/* Pitfalls & Interview Tips */}
          <div className="space-y-2 pt-2 border-t-2 border-borderTheme">
            <div className="space-y-1">
              <span className="text-[10px] font-heading font-bold text-danger uppercase flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Common Mistake
              </span>
              <p className="text-[11px] text-textSecondary leading-tight">{spec.mistakes}</p>
            </div>

            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-heading font-bold text-success uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-warning" /> Technical Interview Tip
              </span>
              <p className="text-[11px] text-textSecondary leading-tight">{spec.interviewTip}</p>
            </div>
          </div>

        </div>
      )}

      {/* Fullscreen Pseudocode Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-card w-full max-w-4xl max-h-full rounded-2xl border-2 border-borderTheme shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b-2 border-borderTheme flex items-center justify-between bg-surface">
              <h2 className="text-lg font-heading font-bold text-textPrimary flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                {spec.name} ({currentOpName}) Pseudocode
              </h2>
              <button onClick={() => setIsExpanded(false)} className="p-2 rounded-xl hover:bg-card text-textSecondary hover:text-danger transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-950 font-mono text-sm text-slate-300 leading-relaxed space-y-1">
               {pseudocodeLines.map((line, idx) => (
                  <div key={idx} className={`py-1.5 px-3 rounded-lg flex items-start gap-4 transition-colors ${stepData?.line === idx + 1 || stepData?.line === idx ? 'bg-primary/30 text-white font-bold border-l-4 border-primary' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
                    <span className="text-slate-600 select-none shrink-0 w-6 text-right">{idx}</span>
                    <span className="whitespace-pre-wrap">{line}</span>
                  </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DsConceptPanel;
