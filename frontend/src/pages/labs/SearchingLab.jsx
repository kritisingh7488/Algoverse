import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import MascotRole from '../../components/mascots/MascotRole';
import api from '../../api/axios';

import { SEARCHING_ALGORITHMS_REGISTRY } from '../../data/searchingAlgorithmsRegistry';

import SearchingConfigPanel from '../../components/searching/SearchingConfigPanel';
import SearchingCanvas from '../../components/searching/SearchingCanvas';
import SearchingPlaybackBar from '../../components/searching/SearchingPlaybackBar';
import SearchingStatsPanel from '../../components/searching/SearchingStatsPanel';
import SearchingConceptPanel from '../../components/searching/SearchingConceptPanel';
import SearchingComparisonView from '../../components/searching/SearchingComparisonView';

const SearchingLab = () => {
  const [algoKey, setAlgoKey] = useState('binary');
  const [array, setArray] = useState([12, 24, 36, 45, 60, 72, 84, 96, 108, 120]);
  const [target, setTarget] = useState(45);
  const [datasetSize, setDatasetSize] = useState(10);
  const [viewMode, setViewMode] = useState('bars_vertical');
  const [autoSort, setAutoSort] = useState(true);
  const [showMid, setShowMid] = useState(true);
  const [selectedCompareAlgos, setSelectedCompareAlgos] = useState(['linear', 'binary', 'jump', 'interpolation']);
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  // Playback Stepper State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [backendData, setBackendData] = useState({});
  const [error, setError] = useState(null);

  const currentSpec = SEARCHING_ALGORITHMS_REGISTRY[algoKey] || SEARCHING_ALGORITHMS_REGISTRY.binary;

  // Sync viewMode with selected algorithm's defaultViewMode
  useEffect(() => {
    if (currentSpec?.defaultViewMode) {
      setViewMode(currentSpec.defaultViewMode);
    }
  }, [algoKey]);

  // Fetch execution steps from C++ Engine backend API
  const fetchCppSteps = async () => {
    try {
      setError(null);
      const algoCode = currentSpec.cppCode || `${algoKey}_search`;
      const response = await api.post('/searching/run', {
        algorithm: algoCode,
        target,
        input: array,
        autoSort
      });

      if (response.data?.success) {
        setEvents(response.data.data.events || []);
        setBackendData(response.data.data || {});
        setStepIndex(0);
      } else {
        setError(response.data?.message || 'Failed to fetch searching steps from C++ engine.');
      }
    } catch (err) {
      console.error('Error fetching C++ searching steps:', err);
      setError('C++ Searching Engine Connection Failure.');
    }
  };

  useEffect(() => {
    if (!isComparisonMode) {
      fetchCppSteps();
    }
  }, [algoKey, target, array, autoSort, isComparisonMode]);

  // Stepper playback effect
  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < events.length - 1) {
      timer = setTimeout(() => {
        setStepIndex(prev => prev + 1);
      }, 700 / speed);
    } else if (stepIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, events, speed]);

  const handleGenerateDataset = (type, customSize = datasetSize) => {
    let newArr = [];
    if (type === 'sorted' || type === 'random') {
      newArr = Array.from({ length: customSize }, () => Math.floor(Math.random() * 90) + 10).sort((a, b) => a - b);
    } else if (type === 'target_start') {
      newArr = Array.from({ length: customSize }, (_, i) => i * 10 + 10);
      setTarget(newArr[0]);
    } else if (type === 'target_mid') {
      newArr = Array.from({ length: customSize }, (_, i) => i * 10 + 10);
      setTarget(newArr[Math.floor(customSize / 2)]);
    } else if (type === 'target_end') {
      newArr = Array.from({ length: customSize }, (_, i) => i * 10 + 10);
      setTarget(newArr[customSize - 1]);
    } else if (type === 'missing') {
      newArr = Array.from({ length: customSize }, (_, i) => i * 10 + 10);
      setTarget(999);
    }
    setDatasetSize(customSize);
    setArray(newArr);
    setIsPlaying(false);
  };

  const handleImportCSV = (imported) => {
    setArray(imported);
    setIsPlaying(false);
  };

  const currentStep = events[stepIndex] || {};
  const isFoundStatus = backendData.found;

  const liveStats = {
    comparisons: currentStep.stats?.comparisons ?? backendData.statistics?.comparisons ?? 0,
    reads: currentStep.stats?.reads ?? backendData.statistics?.reads ?? 0,
    visitedCount: currentStep.stats?.visitedCount ?? backendData.statistics?.visitedCount ?? 0,
    pointerMoves: currentStep.stats?.pointerMoves ?? backendData.statistics?.pointerMoves ?? 0,
    recursiveCalls: currentStep.stats?.recursiveCalls ?? backendData.statistics?.recursiveCalls ?? 0,
    runtimeMs: backendData.statistics?.runtimeMs || 0.12
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Top Header Card */}
        <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-primary/15 text-primary border border-primary/30">
                <Search className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-heading font-bold text-textPrimary">Searching Laboratory</h1>
            </div>
            <p className="text-sm font-body text-textSecondary mt-1">
              Deterministic C++ Searching Engine with real-time target pointers, search space reduction, and multi-search comparison.
            </p>
          </div>
          <MascotRole role="teacher" activity="reading" dialogue={`Searching for ${target} in C++!`} className="w-20 h-20" />
        </Card>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-danger/15 border-2 border-danger/30 text-danger text-xs font-mono font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchCppSteps}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Connection
            </Button>
          </div>
        )}

        {isComparisonMode ? (
          <SearchingComparisonView
            array={array}
            setArray={setArray}
            target={target}
            setTarget={setTarget}
            algorithms={SEARCHING_ALGORITHMS_REGISTRY}
            onBackToSingle={() => setIsComparisonMode(false)}
          />
        ) : (
          <div className="space-y-6">

            {/* Live Stats Dashboard */}
            <SearchingStatsPanel
              stats={liveStats}
              stepIndex={stepIndex}
              totalSteps={events.length}
              isFound={isFoundStatus}
            />

            {/* 3-Column Laboratory Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT: Engine Configuration */}
              <div className="lg:col-span-3">
                <SearchingConfigPanel
                  algoKey={algoKey}
                  setAlgoKey={setAlgoKey}
                  algorithms={SEARCHING_ALGORITHMS_REGISTRY}
                  target={target}
                  setTarget={setTarget}
                  datasetSize={datasetSize}
                  setDatasetSize={setDatasetSize}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  autoSort={autoSort}
                  setAutoSort={setAutoSort}
                  showMid={showMid}
                  setShowMid={setShowMid}
                  selectedCompareAlgos={selectedCompareAlgos}
                  setSelectedCompareAlgos={setSelectedCompareAlgos}
                  isComparisonMode={isComparisonMode}
                  setIsComparisonMode={setIsComparisonMode}
                  onRunComparison={() => setIsComparisonMode(true)}
                  onGenerateDataset={handleGenerateDataset}
                  onImportCSV={handleImportCSV}
                />
              </div>

              {/* CENTER: Canvas & Controls */}
              <div className="lg:col-span-6 space-y-4">
                <SearchingCanvas
                  array={array}
                  events={events}
                  stepIndex={stepIndex}
                  target={target}
                  viewMode={viewMode}
                  spec={currentSpec}
                />

                <SearchingPlaybackBar
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

              {/* RIGHT: Pseudocode & Concepts */}
              <div className="lg:col-span-3">
                <SearchingConceptPanel
                  spec={currentSpec}
                  stepLine={currentStep.line || 0}
                  stepDesc={currentStep.desc || ''}
                />
              </div>

            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default SearchingLab;
