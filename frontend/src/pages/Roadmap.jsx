import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  BarChart2, 
  GitFork, 
  Network, 
  Cpu 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

const Roadmap = () => {
  const steps = [
    {
      stage: 'Phase 1',
      title: 'Linear Data Structures',
      desc: 'Master Array memory layouts, Dynamic Arrays, Stacks (LIFO), and Queues (FIFO).',
      status: 'Completed',
      icon: Layers,
      items: ['Array Memory Mapping', 'Stack Operations', 'Queue & Deque']
    },
    {
      stage: 'Phase 2',
      title: 'Sorting & Searching Laboratory',
      desc: 'Explore Bubble, Quick, Merge sort along with Binary Search range reduction.',
      status: 'Completed',
      icon: BarChart2,
      items: ['Elementary Sorts', 'Divide & Conquer', 'Binary & Interpolation Search']
    },
    {
      stage: 'Phase 3',
      title: 'Trees & Hierarchical Structures',
      desc: 'Understand Binary Search Trees, AVL balance rotations, and Tree Traversals.',
      status: 'Completed',
      icon: GitFork,
      items: ['BST Insertion', 'AVL Tree Rotations', 'In-Order / Pre-Order Traversal']
    },
    {
      stage: 'Phase 4',
      title: 'Graphs & Dynamic Programming',
      desc: 'Master BFS, DFS, Dijkstra shortest path, and 1D/2D DP state tables.',
      status: 'In Progress',
      icon: Network,
      items: ['BFS / DFS Graph Search', 'Dijkstra Shortest Path', '0/1 Knapsack & Memoization']
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 py-2 max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Curated Learning Roadmap</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Step-by-step master path designed for computer science students and interview candidates.
            </p>
          </div>
        </div>

        {/* Roadmap Timeline Grid */}
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'Completed';

            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start gap-5 relative overflow-hidden">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
                  isCompleted ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-primary shadow-primary/20 animate-pulse'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold font-mono text-gray-400">{step.stage}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/10 text-primary'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-poppins text-gray-900">{step.title}</h3>
                  <p className="text-xs text-gray-500 font-inter leading-relaxed">{step.desc}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {step.items.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[11px] font-mono text-gray-600">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </AppLayout>
  );
};

export default Roadmap;
