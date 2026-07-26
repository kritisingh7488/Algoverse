import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

export const DsPlaybackBar = ({
  isPlaying,
  setIsPlaying,
  stepIndex,
  totalSteps,
  onStepChange,
  speed,
  setSpeed,
  onRestart
}) => {
  const speeds = [0.25, 0.5, 1, 2, 4];

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-4 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4 font-body">
      
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
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
          onClick={onRestart}
          title="Restart Animation"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Timeline Step Scrubber */}
      <div className="flex-1 w-full flex items-center gap-3 max-w-md">
        <span className="text-xs font-mono font-bold text-textSecondary min-w-[50px]">
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

      {/* Speed Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-mono text-textSecondary font-bold mr-1">Speed:</span>
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
              speed === s
                ? 'bg-primary text-white shadow-soft shadow-primary/20'
                : 'bg-surface text-textSecondary hover:bg-card border border-borderTheme'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

    </div>
  );
};

export default DsPlaybackBar;
