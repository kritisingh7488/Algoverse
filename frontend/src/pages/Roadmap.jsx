import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Layers, 
  BarChart2, 
  GitFork, 
  Network, 
  ChevronRight 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import MascotRole from '../components/mascots/MascotRole';

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
        <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-primary/15 text-primary border border-primary/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-heading font-bold text-textPrimary">Curated Learning Roadmap</h1>
            </div>
            <p className="text-sm font-body text-textSecondary mt-1">
              Step-by-step master path designed for computer science students and interview candidates.
            </p>
          </div>
          <MascotRole role="teacher" activity="reading" dialogue="Follow the path to algorithm mastery!" className="w-20 h-20" />
        </Card>

        {/* Roadmap Timeline Grid */}
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'Completed';

            return (
              <Card key={idx} hover className="flex flex-col sm:flex-row items-start gap-5 relative overflow-hidden">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-soft ${
                  isCompleted ? 'bg-success' : 'bg-primary'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-heading font-bold text-textSecondary">{step.stage}</span>
                    <Badge variant={isCompleted ? 'success' : 'primary'}>
                      {step.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-textPrimary">{step.title}</h3>
                  <p className="text-xs font-body text-textSecondary leading-relaxed">{step.desc}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {step.items.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-surface border border-borderTheme text-[11px] font-mono text-textPrimary">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </AppLayout>
  );
};

export default Roadmap;
