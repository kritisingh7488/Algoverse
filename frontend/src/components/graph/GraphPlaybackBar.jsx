import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, SkipBack, SkipForward, Gauge } from 'lucide-react';
import Button from '../common/Button';

export const GraphPlaybackBar = ({
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
      
      {/* Top Row: Playback Action Buttons & Speed Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Playback Control Buttons */}
        <div className="flex items-center flex-wrap gap-1.5">
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
            variant="ghost"
            size="sm"
            onClick={onRestart}
            title="Restart Traversal / Algorithm"
          >
            <RotateCcw className="w-4 h-4 text-muted" />
          </Button>
        </div>

        {/* Speed Selector Pill */}
        <div className="flex items-center flex-wrap gap-1 bg-surface px-3 py-1 rounded-full border border-borderTheme">
          <Gauge className="w-3.5 h-3.5 text-muted mr-1" />
          <span className="text-xs font-bold text-muted mr-1">Speed:</span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`text-xs px-2 py-0.5 rounded-full font-mono transition-colors ${
                speed === s
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

      </div>

      {/* Bottom Row: Full-Width Responsive Timeline Scrubber */}
      <div className="flex items-center gap-3 pt-1 border-t border-borderTheme/40">
        <span className="text-xs font-mono font-bold text-muted w-14 text-right shrink-0">
          {totalSteps > 0 ? `${stepIndex + 1}/${totalSteps}` : '0/0'}
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={stepIndex}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className="w-full accent-primary h-2 bg-surface rounded-full cursor-pointer transition-all flex-1"
          disabled={totalSteps === 0}
        />
      </div>

    </div>
  );
};

export default GraphPlaybackBar;
