import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GitFork, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Code, 
  Activity, 
  Crown, 
  Sparkles 
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/common/Button';

const BACKTRACKING_PROBLEMS = {
  nqueens: {
    name: 'N-Queens Problem (4×4 Grid)',
    category: 'Backtracking',
    time: 'O(N!)',
    space: 'O(N)',
    pseudocode: [
      'function solve(row):',
      '  if row == N: return true',
      '  for col = 0 to N-1:',
      '    if isSafe(row, col):',
      '      placeQueen(row, col)',
      '      if solve(row + 1): return true',
      '      removeQueen(row, col) // Backtrack'
    ]
  }
};

const BacktrackingLab = () => {
  const [boardSize] = useState(4);
  const [board, setBoard] = useState(Array(4).fill(null).map(() => Array(4).fill(0)));
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [backtracks, setBacktracks] = useState(0);
  const [desc, setDesc] = useState('');

  const generateNQueensEvents = () => {
    let steps = [];
    let grid = Array(4).fill(null).map(() => Array(4).fill(0));
    let countBacktracks = 0;

    const isSafe = (g, row, col) => {
      for (let i = 0; i < row; i++) if (g[i][col] === 1) return false;
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (g[i][j] === 1) return false;
      for (let i = row, j = col; i >= 0 && j < 4; i--, j++) if (g[i][j] === 1) return false;
      return true;
    };

    const solve = (row) => {
      if (row === 4) {
        steps.push({
          grid: grid.map(r => [...r]), row: 4, col: -1, backtracks: countBacktracks,
          desc: 'Solution Found! All 4 Queens placed safely.'
        });
        return true;
      }

      for (let col = 0; col < 4; col++) {
        grid[row][col] = 1;
        steps.push({
          grid: grid.map(r => [...r]), row, col, backtracks: countBacktracks,
          desc: `Trying Queen at row ${row}, col ${col}...`
        });

        if (isSafe(grid, row, col)) {
          steps.push({
            grid: grid.map(r => [...r]), row, col, backtracks: countBacktracks,
            desc: `Safe position at row ${row}, col ${col}. Moving to next row.`
          });
          if (solve(row + 1)) return true;
        }

        // Backtrack
        grid[row][col] = 0;
        countBacktracks++;
        steps.push({
          grid: grid.map(r => [...r]), row, col, backtracks: countBacktracks,
          desc: `Conflict! Backtracking queen from row ${row}, col ${col}.`
        });
      }
      return false;
    };

    solve(0);
    return steps;
  };

  useEffect(() => {
    const steps = generateNQueensEvents();
    setEvents(steps);
    setStepIndex(0);
    setIsPlaying(false);
    if (steps.length > 0) applyStep(steps[0]);
  }, []);

  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < events.length - 1) {
      timer = setTimeout(() => {
        const next = stepIndex + 1;
        setStepIndex(next);
        applyStep(events[next]);
      }, 700 / speed);
    } else if (stepIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, events, speed]);

  const applyStep = (step) => {
    if (!step) return;
    setBoard(step.grid);
    setBacktracks(step.backtracks);
    setDesc(step.desc);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <GitFork className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Backtracking Studio</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Visualize recursive space exploration, constraint satisfaction, and dynamic state rollbacks.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-gray-400">Total Backtracks:</span>
            <span className="px-3 py-1 rounded-xl bg-red-50 text-red-600 font-bold border border-red-100">{backtracks}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Grid Canvas */}
          <div className="lg:col-span-8 space-y-6">

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs h-[380px] flex flex-col justify-between items-center relative overflow-hidden">
              <div className="w-full flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-100 pb-3">
                <span>CHESSBOARD STATE (4×4)</span>
                <span>QUEENS PLACED: {board.flat().filter(x => x === 1).length}</span>
              </div>

              {/* 4x4 Chessboard */}
              <div className="grid grid-cols-4 gap-2.5 my-auto">
                {board.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isDark = (rIdx + cIdx) % 2 === 1;
                    const hasQueen = cell === 1;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                          hasQueen
                            ? 'bg-amber-400 border-amber-500 text-white shadow-lg shadow-amber-400/30 scale-105 ring-4 ring-amber-200'
                            : isDark
                            ? 'bg-purple-900/10 border-purple-200/40 text-purple-900'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        {hasQueen && <Crown className="w-8 h-8 text-white drop-shadow-md animate-bounce" />}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Description */}
              <div className="w-full text-center pt-2 border-t border-gray-50">
                <p className="text-xs font-mono text-gray-600 truncate">{desc || 'Ready to run backtracking.'}</p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => { if (stepIndex > 0) { setStepIndex(stepIndex - 1); applyStep(events[stepIndex - 1]); } }} 
                  disabled={stepIndex === 0}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { if (stepIndex < events.length - 1) { setStepIndex(stepIndex + 1); applyStep(events[stepIndex + 1]); } }}
                  disabled={stepIndex >= events.length - 1}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setStepIndex(0); if (events.length > 0) applyStep(events[0]); }}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Switcher */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-400">Speed:</span>
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      speed === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pseudocode & Specs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-primary" /> Backtracking Pseudocode
              </h3>
              <div className="bg-gray-900 rounded-2xl p-4 font-mono text-[11px] text-gray-300 space-y-1.5 overflow-x-auto">
                {BACKTRACKING_PROBLEMS.nqueens.pseudocode.map((line, idx) => (
                  <div key={idx} className="opacity-80 px-2 py-0.5">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default BacktrackingLab;
