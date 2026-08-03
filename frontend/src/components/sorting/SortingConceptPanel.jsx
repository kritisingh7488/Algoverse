import React, { useState } from 'react';
import { Code, BookOpen, Lightbulb, AlertTriangle, Sparkles, CheckCircle2, XCircle, Maximize2, X } from 'lucide-react';

export const SortingConceptPanel = ({ spec, stepLine, stepDesc }) => {
  const [activeTab, setActiveTab] = useState('pseudocode');
  const [isExpanded, setIsExpanded] = useState(false);

  const pseudocodeLines = spec.pseudocode || [];

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
          <Code className="w-3.5 h-3.5 text-primary" /> Code & Execution
        </button>
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'concept'
              ? 'bg-card text-textPrimary shadow-soft border border-borderTheme'
              : 'text-textSecondary hover:text-textPrimary'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-secondary" /> Concept & Properties
        </button>
      </div>

      {activeTab === 'pseudocode' ? (
        <div className="space-y-4">
          
          {/* Active Pseudocode */}
          <div className="space-y-2">
            <h4 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5"><Code className="w-3.5 h-3.5 text-primary" /> Pseudocode Line Tracker</div>
              <button onClick={() => setIsExpanded(true)} className="hover:text-primary transition-colors" title="Expand Pseudocode">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </h4>
            <div className="bg-surface border-2 border-borderTheme rounded-2xl p-3.5 font-mono text-[11px] text-textPrimary space-y-1 overflow-x-auto">
              {pseudocodeLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    stepLine === idx + 1 || stepLine === idx
                      ? 'bg-primary/20 text-primary font-bold border-l-4 border-primary pl-3'
                      : 'opacity-70'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Description */}
          <div className="p-3.5 rounded-2xl bg-surface border-2 border-borderTheme space-y-1.5">
            <span className="text-[10px] font-heading font-bold text-textSecondary uppercase">Active Step Event</span>
            <p className="text-xs font-mono text-textPrimary leading-relaxed">{stepDesc || 'Algorithm initialized.'}</p>
          </div>

          {/* Algorithm Property Badges */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-heading font-bold pt-2 border-t-2 border-borderTheme">
            <div className={`p-2 rounded-xl border ${spec.stable ? 'bg-success/15 border-success/30 text-success' : 'bg-danger/15 border-danger/30 text-danger'}`}>
              {spec.stable ? 'STABLE' : 'UNSTABLE'}
            </div>
            <div className={`p-2 rounded-xl border ${spec.inPlace ? 'bg-success/15 border-success/30 text-success' : 'bg-danger/15 border-danger/30 text-danger'}`}>
              {spec.inPlace ? 'IN-PLACE' : 'OUT-OF-PLACE'}
            </div>
            <div className={`p-2 rounded-xl border ${spec.adaptive ? 'bg-success/15 border-success/30 text-success' : 'bg-warning/20 border-warning/30 text-textPrimary'}`}>
              {spec.adaptive ? 'ADAPTIVE' : 'NON-ADAPTIVE'}
            </div>
          </div>

        </div>
      ) : (
        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
          
          {/* Conceptual Intuition */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-heading font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> Conceptual Intuition
            </h4>
            <p className="text-xs text-textSecondary leading-relaxed">{spec.intuition}</p>
          </div>

          {/* Complexity Metadata */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-borderTheme text-center">
            <div className="p-2 rounded-2xl bg-surface border border-borderTheme">
              <span className="text-[9px] font-heading font-bold text-textSecondary uppercase block">Best Time</span>
              <span className="text-xs font-mono font-bold text-success">{spec.best}</span>
            </div>
            <div className="p-2 rounded-2xl bg-surface border border-borderTheme">
              <span className="text-[9px] font-heading font-bold text-textSecondary uppercase block">Avg Time</span>
              <span className="text-xs font-mono font-bold text-primary">{spec.avg}</span>
            </div>
            <div className="p-2 rounded-2xl bg-surface border border-borderTheme">
              <span className="text-[9px] font-heading font-bold text-textSecondary uppercase block">Worst Time</span>
              <span className="text-xs font-mono font-bold text-danger">{spec.worst}</span>
            </div>
            <div className="p-2 rounded-2xl bg-surface border border-borderTheme">
              <span className="text-[9px] font-heading font-bold text-textSecondary uppercase block">Space</span>
              <span className="text-xs font-mono font-bold text-secondary">{spec.space}</span>
            </div>
          </div>

          {/* Common Mistakes & Interview Tips */}
          <div className="space-y-2 pt-2 border-t-2 border-borderTheme">
            <div className="space-y-1">
              <span className="text-[10px] font-heading font-bold text-danger uppercase flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Common Mistake
              </span>
              <p className="text-[11px] text-textSecondary leading-tight">{spec.mistakes}</p>
            </div>

            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-heading font-bold text-success uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-warning" /> Interview Tip
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
                {spec.name} Pseudocode
              </h2>
              <button onClick={() => setIsExpanded(false)} className="p-2 rounded-xl hover:bg-card text-textSecondary hover:text-danger transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-950 font-mono text-sm text-slate-300 leading-relaxed space-y-1">
               {pseudocodeLines.map((line, idx) => (
                  <div key={idx} className={`py-1.5 px-3 rounded-lg flex items-start gap-4 transition-colors ${stepLine === idx + 1 || stepLine === idx ? 'bg-primary/30 text-white font-bold border-l-4 border-primary' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
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

export default SortingConceptPanel;
