import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
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
    <div className="bg-card rounded-card border-2 border-borderTheme p-4 shadow-soft flex flex-col xl:flex-row items-center justify-between gap-4 font-body max-w-full overflow-hidden">
      
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 shrink-0">
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

      {/* Timeline Step Scrubber */}
      <div className="flex-1 w-full flex items-center gap-3 min-w-[200px] max-w-md">
        <span className="text-xs font-mono font-bold text-textSecondary min-w-[65px] shrink-0">
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

      {/* Speed Options - Responsive Flex Wrap to prevent boundary overflow */}
      <div className="flex flex-wrap items-center justify-center gap-1 shrink-0">
        <span className="text-xs font-mono text-textSecondary font-bold mr-1 shrink-0">Speed:</span>
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
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

export default SearchingPlaybackBar;
