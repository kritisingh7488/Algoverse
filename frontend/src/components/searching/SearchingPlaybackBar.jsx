import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, SkipBack, SkipForward, Gauge } from 'lucide-react';
import Button from '../common/Button';

export const SearchingPlaybackBar = ({
  isPlaying,
  setIsPlaying,
  stepIndex,
  totalSteps,
  onStepChange,
  speed,
  setSpeed,
  onRestart
}) => {
  const speeds = [0.25, 0.5, 1, 2, 4, 10];

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-4 shadow-soft space-y-3 font-body">
      
      {/* Top Row: Playback Action Buttons & Timeline Scrubber */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={stepIndex === 0}
            onClick={() => onStepChange(0)}
            title="Jump to Start"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={stepIndex === 0}
            onClick={() => onStepChange(stepIndex - 1)}
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={stepIndex >= totalSteps - 1}
            onClick={() => onStepChange(stepIndex + 1)}
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={stepIndex >= totalSteps - 1}
            onClick={() => onStepChange(totalSteps - 1)}
            title="Jump to End"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Timeline Scrubber Slider */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md bg-surface px-3 py-1.5 rounded-2xl border border-borderTheme">
          <span className="text-xs font-mono font-bold text-textSecondary shrink-0">
            Step {totalSteps > 0 ? stepIndex + 1 : 0}/{totalSteps}
          </span>
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={stepIndex}
            onChange={(e) => onStepChange(parseInt(e.target.value))}
            disabled={totalSteps <= 1}
            className="w-full accent-primary cursor-pointer disabled:opacity-40"
          />
        </div>

      </div>

      {/* Bottom Row: Speed Controls Bar */}
      <div className="pt-2 border-t border-borderTheme flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-textSecondary font-bold font-mono">
          <Gauge className="w-3.5 h-3.5 text-primary" />
          <span>Playback Speed:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                speed === s
                  ? 'bg-primary text-white shadow-soft shadow-primary/20 scale-105'
                  : 'bg-surface text-textSecondary hover:bg-card border border-borderTheme'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SearchingPlaybackBar;
