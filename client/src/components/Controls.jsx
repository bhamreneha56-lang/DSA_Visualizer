import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Gauge
} from 'lucide-react';

export default function Controls({
  currentStep,
  totalSteps,
  isPlaying,
  onPlayPause,
  onStepNext,
  onStepPrev,
  onReset,
  onJumpToEnd,
  onSeek,
  speed,
  onSpeedChange
}) {
  return (
    <div className="bg-white border border-border rounded-xl p-3.5 shadow-sm flex flex-col space-y-3">
      {/* Timeline Scrubbing Bar */}
      <div className="flex items-center space-x-3">
        <span className="text-xs font-mono font-semibold text-slate-500 w-16">
          Step {currentStep} / {totalSteps || 1}
        </span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="1"
            max={Math.max(1, totalSteps)}
            value={currentStep}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          {totalSteps > 0 ? `${Math.round((currentStep / totalSteps) * 100)}%` : '0%'}
        </span>
      </div>

      {/* Control Buttons & Speed */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          {/* Jump to Beginning */}
          <button
            onClick={onReset}
            disabled={currentStep <= 1}
            className="p-2 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-slate-700 transition-colors"
            title="Reset to Beginning"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Step Backward */}
          <button
            onClick={onStepPrev}
            disabled={currentStep <= 1}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-slate-800 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          {/* Play / Pause Primary Action */}
          <button
            onClick={onPlayPause}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepNext}
            disabled={currentStep >= totalSteps}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-slate-800 transition-colors"
            title="Next Step"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Jump to End */}
          <button
            onClick={onJumpToEnd}
            disabled={currentStep >= totalSteps}
            className="p-2 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-slate-700 transition-colors"
            title="Jump to Final State"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Adjustment */}
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <Gauge className="w-4 h-4 text-indigo-600" />
          <span className="font-medium">Speed:</span>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => onSpeedChange(spd)}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                speed === spd
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
