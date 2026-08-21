import React, { useMemo } from 'react';
import Card from '../common/Card';

// ----------------------------------------------------
// 1. DP TABLE VISUALIZER (Supports 1D, 2D, and Space Optimized)
// ----------------------------------------------------
export const DPTableVisualizer = ({ problem, events, currentStep, spaceOptimized }) => {
  const currentEvent = events[currentStep] || {};
  const tableData = currentEvent.table || [];
  const activeIndex = currentEvent.active !== undefined ? currentEvent.active : -1;
  const is2D = problem.id === 'unique-paths' || problem.id === 'lcs' || problem.id === '01-knapsack';

  // For Space Optimized, render the variables dynamically
  if (spaceOptimized) {
    const vars = currentEvent.vars || { prev2: -1, prev: -1, curr: -1 };
    return (
      <div className="w-full flex flex-col items-center justify-center p-6 space-y-6">
        <div className="text-xs font-mono text-textSecondary uppercase tracking-wider">
          Space Optimized State (O(1) Auxiliary Space)
        </div>
        <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
          {/* prev2 */}
          <div className="flex flex-col items-center p-3 rounded-xl border border-borderTheme bg-card">
            <span className="text-[10px] text-textSecondary font-bold font-mono">prev2</span>
            <span className="text-lg font-black font-mono text-textPrimary">
              {vars.prev2 === -1 ? 'N/A' : vars.prev2}
            </span>
          </div>
          {/* prev */}
          <div className="flex flex-col items-center p-3 rounded-xl border border-borderTheme bg-card">
            <span className="text-[10px] text-textSecondary font-bold font-mono">prev</span>
            <span className="text-lg font-black font-mono text-textPrimary">
              {vars.prev === -1 ? 'N/A' : vars.prev}
            </span>
          </div>
          {/* curr */}
          <div className="flex flex-col items-center p-3 rounded-xl border border-primary/40 bg-primary/10 shadow-lg shadow-primary/5">
            <span className="text-[10px] text-primary font-bold font-mono">curr</span>
            <span className="text-lg font-black font-mono text-primary animate-pulse">
              {vars.curr === -1 ? 'N/A' : vars.curr}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (is2D) {
    const rows = 5;
    const cols = 5;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center overflow-auto p-4">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: rows }).map((_, r) => {
            return Array.from({ length: cols }).map((_, c) => {
              const flatIdx = r * cols + c;
              const isActive = activeIndex === flatIdx;
              const val = tableData[flatIdx] !== undefined ? tableData[flatIdx] : -1;
              return (
                <div
                  key={flatIdx}
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono text-xs border transition-all duration-300 ${
                    isActive
                      ? 'border-primary bg-primary/20 text-primary scale-105 font-black shadow-lg shadow-primary/10'
                      : val !== -1
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-borderTheme bg-card/40 text-textSecondary'
                  }`}
                >
                  <span className="text-[9px] opacity-45">{r},{c}</span>
                  <span className="text-sm">{val === -1 ? '-' : val}</span>
                </div>
              );
            });
          })}
        </div>
      </div>
    );
  }

  // 1D Table View
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="flex flex-wrap gap-3 justify-center max-w-lg">
        {tableData.map((val, idx) => {
          const isActive = idx === activeIndex;
          const hasValue = val !== -1 && val !== null;
          return (
            <div
              key={idx}
              className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-mono text-xs border transition-all duration-300 ${
                isActive
                  ? 'border-primary bg-primary/20 text-primary scale-110 font-black shadow-xl shadow-primary/20'
                  : hasValue
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500 font-bold'
                  : 'border-borderTheme bg-card text-textSecondary'
              }`}
            >
              <span className="text-[9px] opacity-40">[{idx}]</span>
              <span className="text-sm">{hasValue ? val : '?'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ----------------------------------------------------
// 2. RECURSION TREE VISUALIZER (SVG Nodes & Connections)
// ----------------------------------------------------
export const DPRecursionTree = ({ events, currentStep }) => {
  const treeData = useMemo(() => {
    const nodes = [];
    const relations = [];
    const nodeMap = new Map();
    let idCounter = 0;

    for (let i = 0; i <= currentStep; i++) {
      const ev = events[i];
      if (!ev || !ev.stack || ev.stack.length === 0) continue;

      const pathKey = ev.stack.join('->');
      if (!nodeMap.has(pathKey)) {
        const nodeId = idCounter++;
        const label = `solve(${ev.active})`;
        const parentKey = ev.stack.slice(0, -1).join('->');
        const parentId = nodeMap.get(parentKey);

        nodes.push({ 
          id: nodeId, 
          label, 
          val: ev.active, 
          active: i === currentStep, 
          type: ev.type, 
          result: ev.val 
        });
        nodeMap.set(pathKey, nodeId);

        if (parentId !== undefined) {
          relations.push({ parent: parentId, child: nodeId });
        }
      } else {
        const existingId = nodeMap.get(pathKey);
        const nodeIndex = nodes.findIndex(n => n.id === existingId);
        if (nodeIndex !== -1) {
          nodes[nodeIndex].active = (i === currentStep);
          nodes[nodeIndex].type = ev.type;
          if (ev.val !== undefined && ev.val !== 0) {
            nodes[nodeIndex].result = ev.val;
          }
        }
      }
    }

    // Coordinates layout generator
    const layoutNodes = (rootId, depth = 0, minX = 50, maxX = 750) => {
      const rootNode = nodes.find(n => n.id === rootId);
      if (!rootNode) return;

      const midX = (minX + maxX) / 2;
      rootNode.x = midX;
      rootNode.y = 50 + depth * 70;

      const children = relations.filter(r => r.parent === rootId).map(r => r.child);
      if (children.length === 1) {
        layoutNodes(children[0], depth + 1, minX, maxX);
      } else if (children.length > 1) {
        const seg = (maxX - minX) / children.length;
        children.forEach((childId, idx) => {
          layoutNodes(childId, depth + 1, minX + idx * seg, minX + (idx + 1) * seg);
        });
      }
    };

    const rootNode = nodes[0];
    if (rootNode) {
      layoutNodes(rootNode.id);
    }

    return { nodes, relations };
  }, [events, currentStep]);

  if (treeData.nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-textSecondary text-xs">
        Start visualizer to populate recursion tree.
      </div>
    );
  }

  return (
    <svg className="w-full h-full min-h-[350px]">
      <g>
        {treeData.relations.map((rel, i) => {
          const parentNode = treeData.nodes.find(n => n.id === rel.parent);
          const childNode = treeData.nodes.find(n => n.id === rel.child);
          if (!parentNode || !childNode) return null;
          return (
            <line
              key={i}
              x1={parentNode.x}
              y1={parentNode.y}
              x2={childNode.x}
              y2={childNode.y}
              className="stroke-borderTheme stroke-[2px]"
            />
          );
        })}
        {treeData.nodes.map((node) => {
          const isMemoHit = node.type === 'memo_hit';
          const isBase = node.type === 'base_case';
          return (
            <g key={node.id} transform={`translate(${node.x || 0}, ${node.y || 0})`}>
              <circle
                r="22"
                className={`transition-all duration-300 ${
                  node.active 
                    ? 'fill-primary stroke-primary/30 stroke-[8px]' 
                    : isMemoHit 
                    ? 'fill-amber-500/10 stroke-amber-500 stroke-[2px] shadow-sm'
                    : isBase
                    ? 'fill-emerald-500/10 stroke-emerald-500 stroke-[2px]'
                    : 'fill-card stroke-borderTheme stroke-[2px]'
                }`}
              />
              <text
                textAnchor="middle"
                dy="4"
                className={`text-[10px] font-mono font-bold select-none ${
                  node.active ? 'fill-white' : 'fill-textPrimary'
                }`}
              >
                {node.label}
              </text>
              {node.result !== undefined && node.result !== 0 && (
                <text
                  x="20"
                  y="-15"
                  className="text-[9px] font-bold font-mono fill-emerald-500 bg-card px-1"
                >
                  ={node.result}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};


// ----------------------------------------------------
// 3. MEMOIZATION CACHE VISUALIZER
// ----------------------------------------------------
export const DPCacheVisualizer = ({ events, currentStep }) => {
  const currentEvent = events[currentStep] || {};
  const tableData = currentEvent.table || [];
  const activeIndex = currentEvent.active !== undefined ? currentEvent.active : -1;

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      <div className="text-xs font-mono text-textSecondary border-b border-borderTheme pb-2 flex justify-between">
        <span>Lookup / Hash Map Keys</span>
        <span className="text-emerald-500">✔ Cache Hit</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
        {tableData.map((val, idx) => {
          const hasValue = val !== -1 && val !== null;
          const isActive = idx === activeIndex;
          const isHit = currentEvent.type === 'memo_hit' && isActive;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs transition-all ${
                isHit
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500 scale-105 font-bold shadow-md shadow-amber-500/10 animate-pulse'
                  : isActive
                  ? 'border-primary bg-primary/10 text-primary scale-105 font-bold shadow-md shadow-primary/10'
                  : hasValue
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                  : 'border-borderTheme bg-card text-textSecondary opacity-40'
              }`}
            >
              <div>
                <span className="block text-[9px] text-textSecondary">dp[{idx}]</span>
                <span className="text-sm font-bold">{hasValue ? val : 'Empty'}</span>
              </div>
              {hasValue && (
                <span className="text-emerald-500 font-bold text-sm">✔</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ----------------------------------------------------
// 4. STATE GRAPH VISUALIZER (Directed DAG Transitions)
// ----------------------------------------------------
export const DPStateGraph = ({ events, currentStep }) => {
  const currentEvent = events[currentStep] || {};
  const activeIndex = currentEvent.active !== undefined ? currentEvent.active : -1;

  const graphNodes = useMemo(() => {
    const nodes = [];
    const links = [];
    
    for (let i = 0; i <= Math.min(activeIndex, 6); i++) {
      nodes.push({ id: i, label: `dp[${i}]`, x: 80 + i * 110, y: 150 + (i % 2 === 0 ? -40 : 40) });
      if (i >= 1) {
        links.push({ source: i - 1, target: i });
      }
      if (i >= 2) {
        links.push({ source: i - 2, target: i });
      }
    }
    return { nodes, links };
  }, [activeIndex]);

  if (graphNodes.nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-textSecondary text-xs">
        Execute steps to visualize dynamic state dependencies.
      </div>
    );
  }

  return (
    <svg className="w-full h-full min-h-[350px]">
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="20"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-borderTheme" />
        </marker>
      </defs>
      <g>
        {graphNodes.links.map((link, i) => {
          const sourceNode = graphNodes.nodes.find(n => n.id === link.source);
          const targetNode = graphNodes.nodes.find(n => n.id === link.target);
          if (!sourceNode || !targetNode) return null;
          return (
            <path
              key={i}
              d={`M ${sourceNode.x} ${sourceNode.y} Q ${(sourceNode.x + targetNode.x)/2} ${(sourceNode.y + targetNode.y)/2 - 30} ${targetNode.x} ${targetNode.y}`}
              className="stroke-borderTheme stroke-[2px] fill-none"
              markerEnd="url(#arrow)"
            />
          );
        })}
        {graphNodes.nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <circle
              r="24"
              className={`transition-all duration-300 ${
                node.id === activeIndex
                  ? 'fill-primary stroke-primary/30 stroke-[8px]'
                  : 'fill-card stroke-borderTheme stroke-[2.5px]'
              }`}
            />
            <text
              textAnchor="middle"
              dy="4"
              className={`text-xs font-mono font-bold select-none ${
                node.id === activeIndex ? 'fill-white' : 'fill-textPrimary'
              }`}
            >
              {node.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};
