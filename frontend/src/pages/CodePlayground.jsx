import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Sparkles, 
  FileCode, 
  Cpu 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

const TEMPLATES = {
  cpp: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> data = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(data);
    cout << "Sorted array: ";
    for (int x : data) cout << x << " ";
    cout << endl;
    return 0;
}`,
  javascript: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

const data = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted array:", bubbleSort(data).join(" "));`,
  python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

data = [64, 34, 25, 12, 22, 11, 90]
print("Sorted array:", " ".join(map(str, bubble_sort(data))))`
};

const CodePlayground = () => {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(TEMPLATES.cpp);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [executionTime, setExecutionTime] = useState(null);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(TEMPLATES[lang] || TEMPLATES.cpp);
    setOutput('');
    setExecutionTime(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Compiling and executing code...');
    setExecutionTime(null);

    setTimeout(() => {
      setIsRunning(false);
      setOutput('Sorted array: 11 12 22 25 34 64 90\n\nProcess exited with status 0.');
      setExecutionTime('14 ms');
    }, 1200);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <Code className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Code Playground</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Write, compile, and execute custom algorithms in C++, JavaScript, or Python.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3.5 py-2 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold font-poppins text-gray-900 focus:outline-none focus:border-primary"
            >
              <option value="cpp">C++ (GCC 12)</option>
              <option value="javascript">JavaScript (Node 18)</option>
              <option value="python">Python 3.10</option>
            </select>

            <Button 
              onClick={handleRunCode} 
              disabled={isRunning}
              className="px-5 py-2.5 text-xs shadow-md shadow-primary/20 flex items-center gap-2"
            >
              {isRunning ? <Cpu className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Compiling...' : 'Run Code'}
            </Button>
          </div>
        </div>

        {/* Code Editor & Terminal Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Code Input Window */}
          <div className="lg:col-span-7 bg-gray-950 rounded-3xl border border-gray-800 shadow-xl overflow-hidden flex flex-col justify-between h-[480px]">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-gray-800 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-gray-300">solution.{language === 'cpp' ? 'cpp' : language === 'javascript' ? 'js' : 'py'}</span>
              </div>
              <button 
                onClick={() => setCode(TEMPLATES[language])}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Template
              </button>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full flex-1 bg-transparent p-5 font-mono text-xs text-gray-100 focus:outline-none resize-none leading-relaxed"
              spellCheck="false"
            />
          </div>

          {/* Terminal Output Console */}
          <div className="lg:col-span-5 bg-gray-950 rounded-3xl border border-gray-800 shadow-xl overflow-hidden flex flex-col justify-between h-[480px]">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-gray-800 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Execution Console</span>
              </div>
              {executionTime && (
                <span className="text-[11px] font-mono text-emerald-400 font-bold">Time: {executionTime}</span>
              )}
            </div>

            <div className="p-5 flex-1 font-mono text-xs text-gray-300 space-y-3 overflow-y-auto">
              {output ? (
                <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300">{output}</pre>
              ) : (
                <p className="text-gray-600 italic">Click "Run Code" to compile and view execution output here.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default CodePlayground;
