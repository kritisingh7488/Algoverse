import React, { useState, useEffect } from 'react';
import { Layers, PanelLeftClose, PanelLeftOpen, BarChart2 } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import MascotRole from '../components/mascots/MascotRole';

import { STRUCTURE_SPECS, generateEngineSteps } from '../components/playground/DataStructureEngines';
import DsConfigPanel from '../components/playground/DsConfigPanel';
import DsCanvas from '../components/playground/DsCanvas';
import DsControls from '../components/playground/DsControls';
import DsPlaybackBar from '../components/playground/DsPlaybackBar';
import DsConceptPanel from '../components/playground/DsConceptPanel';
import DsComparisonView from '../components/playground/DsComparisonView';

const Playground = () => {
  const [structureKey, setStructureKey] = useState('array');
  const [items, setItems] = useState([12, 34, 56, 78, 90, 23]);
  const [config, setConfig] = useState({
    capacity: 8,
    heapType: 'min'
  });

  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Playback & Stepper State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [currentOpName, setCurrentOpName] = useState('insert');

  const currentSpec = STRUCTURE_SPECS[structureKey] || STRUCTURE_SPECS.array;

  // Initialize or reset when structure changes
  useEffect(() => {
    setIsPlaying(false);
    setStepIndex(0);
    setEvents([]);
    setCurrentOpName('default');

    if (structureKey === 'array') {
      setItems([12, 34, 56, 78, 90, 23]);
    } else if (structureKey === 'stack') {
      setItems([45, 67, 89]);
    } else if (structureKey === 'queue' || structureKey === 'cqueue' || structureKey === 'deque') {
      setItems([10, 20, 30, 40]);
    } else if (structureKey === 'singlylist' || structureKey === 'doublylist' || structureKey === 'circularlist') {
      setItems([5, 15, 25, 35]);
    } else if (structureKey === 'priorityqueue' || structureKey === 'minheap' || structureKey === 'maxheap') {
      setItems([10, 25, 15, 40, 50, 30, 20]);
    }
  }, [structureKey]);

  // Stepper Effect
  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < events.length - 1) {
      timer = setTimeout(() => {
        setStepIndex(prev => prev + 1);
      }, 800 / speed);
    } else if (stepIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, events, speed]);

  const currentStep = events[stepIndex] || {
    items,
    highlight: null,
    pointers: {},
    line: 0,
    op: 'Ready',
    desc: `${currentSpec.name} engine initialized and ready for execution.`,
    time: currentSpec.bestTime,
    space: currentSpec.space
  };

  // Execute Operation in Engine
  const handleExecuteOp = (opName, opArgs) => {
    setCurrentOpName(opName);
    const generatedSteps = generateEngineSteps(
      structureKey,
      opName,
      opArgs,
      items,
      config
    );

    setEvents(generatedSteps);
    setStepIndex(0);
    if (generatedSteps.length > 0) {
      setItems(generatedSteps[generatedSteps.length - 1].items);
    }
    setIsPlaying(true);
  };

  // Presets Loader
  const handleLoadPreset = (type) => {
    let presetItems = [];
    if (type === 'sorted') presetItems = [10, 20, 30, 40, 50, 60];
    else if (type === 'reverse') presetItems = [60, 50, 40, 30, 20, 10];
    else if (type === 'nearly') presetItems = [10, 20, 40, 30, 50, 60];
    else if (type === 'duplicates') presetItems = [25, 10, 25, 50, 10, 25];

    setItems(presetItems);
    setEvents([]);
    setStepIndex(0);
  };

  const handleReset = () => {
    setEvents([]);
    setStepIndex(0);
    setIsPlaying(false);
  };

  const handleClear = () => {
    setItems([]);
    setEvents([]);
    setStepIndex(0);
    setIsPlaying(false);
  };

  const handleRandomize = () => {
    const randomItems = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);
    setItems(randomItems);
    setEvents([]);
    setStepIndex(0);
  };

  const handleImportCSV = (importedValues) => {
    setItems(importedValues);
    setEvents([]);
    setStepIndex(0);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Top Header Card with Mascot */}
        <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Expand Engine Panel' : 'Collapse Engine Panel'}
              className="shrink-0"
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-primary/15 text-primary border border-primary/30">
                  <Layers className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-heading font-bold text-textPrimary">Data Structure Laboratory</h1>
              </div>
              <p className="text-sm font-body text-textSecondary mt-1">
                Interactive memory layout inspector, pointer visualizer, step-by-step engine, and comparison studio for 11 data structures.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={isComparisonMode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setIsComparisonMode(!isComparisonMode)}
            >
              <BarChart2 className="w-4 h-4 mr-1.5" />
              {isComparisonMode ? 'Single Visualizer' : 'Multi-DS Comparison Studio'}
            </Button>
            <MascotRole role="teacher" activity="reading" dialogue={`Exploring ${currentSpec.name}!`} className="w-20 h-20" />
          </div>
        </Card>

        {isComparisonMode ? (
          <DsComparisonView
            specs={STRUCTURE_SPECS}
            onBackToSingle={() => setIsComparisonMode(false)}
          />
        ) : (
          /* Collapsible Laboratory Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300">

            {/* LEFT PANEL: Configuration & Selectors */}
            {!isSidebarCollapsed && (
              <div className="lg:col-span-3 transition-all duration-300">
                <DsConfigPanel
                  structureKey={structureKey}
                  setStructureKey={setStructureKey}
                  specs={STRUCTURE_SPECS}
                  config={config}
                  setConfig={setConfig}
                  onReset={handleReset}
                  onClear={handleClear}
                  onRandomize={handleRandomize}
                  onImportCSV={handleImportCSV}
                  onLoadPreset={handleLoadPreset}
                />
              </div>
            )}

            {/* CENTER PANEL: Canvas, Operations, & Playback */}
            <div className={`${isSidebarCollapsed ? 'lg:col-span-8' : 'lg:col-span-6'} space-y-4 transition-all duration-300`}>
              
              {/* Visualization Canvas */}
              <DsCanvas
                structureKey={structureKey}
                setStructureKey={setStructureKey}
                items={currentStep.items || items}
                activeHighlight={currentStep.highlight}
                pointers={currentStep.pointers}
                spec={currentSpec}
                specs={STRUCTURE_SPECS}
                onLoadPreset={handleLoadPreset}
                onImportCSV={handleImportCSV}
                onClear={handleClear}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                stepIndex={stepIndex}
                totalSteps={events.length}
                onStepChange={setStepIndex}
                speed={speed}
                setSpeed={setSpeed}
                onRestart={() => setStepIndex(0)}
              />

              {/* Action Operations Control Bar */}
              <DsControls
                structureKey={structureKey}
                onExecuteOp={handleExecuteOp}
              />

              {/* Bottom Playback & Scrubber Controls */}
              <DsPlaybackBar
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                stepIndex={stepIndex}
                totalSteps={events.length}
                onStepChange={setStepIndex}
                speed={speed}
                setSpeed={setSpeed}
                onRestart={() => setStepIndex(0)}
              />

            </div>

            {/* RIGHT PANEL: Pseudocode, Variables, & Concept Intuition */}
            <div className={`${isSidebarCollapsed ? 'lg:col-span-4' : 'lg:col-span-3'} transition-all duration-300`}>
              <DsConceptPanel
                spec={currentSpec}
                stepData={currentStep}
                currentOpName={currentOpName}
              />
            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default Playground;
