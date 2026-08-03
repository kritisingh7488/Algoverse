import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Download, TerminalSquare, Maximize2, Minimize2, Code2, Copy, CheckCircle2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const DEFAULT_CODE = `// Welcome to the AlgoVerse JavaScript Playground!
// Write your code below and hit "Run Code"

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Calculating Fibonacci(10)...");
const result = fibonacci(10);
console.log("Result:", result);

// Try creating your own classes and algorithms!
class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

const head = new Node(42);
console.log("Linked List Head:", head);
`;

const CodePlayground = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput([]);
    
    // Simulate slight delay for effect
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const logs = [];
    
    // Override console.log temporarily to capture output
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    const captureLog = (type, ...args) => {
      const formattedArgs = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      
      logs.push({ type, message: formattedArgs, timestamp: new Date().toLocaleTimeString() });
    };

    console.log = (...args) => captureLog('log', ...args);
    console.error = (...args) => captureLog('error', ...args);
    console.warn = (...args) => captureLog('warn', ...args);
    console.info = (...args) => captureLog('info', ...args);

    try {
      // Create a secure function context
      // Note: In a real production environment, you should use Web Workers or a sandbox iframe
      const executeCode = new Function(code);
      executeCode();
    } catch (err) {
      captureLog('error', err.toString());
    } finally {
      // Restore console
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
      
      if (logs.length === 0) {
        logs.push({ type: 'info', message: 'Code executed successfully with no output.', timestamp: new Date().toLocaleTimeString() });
      }
      
      setOutput(logs);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setOutput([]);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'algoverse_script.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className={\`space-y-4 py-1 font-body \${isFullScreen ? 'fixed inset-0 z-50 bg-background overflow-y-auto p-4' : ''}\`}>
        
        {/* Header bar */}
        <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-[1.5px] border-borderTheme p-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-primary/15 text-primary border border-primary/30">
              <Code2 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-heading font-bold text-textPrimary">
                Code Playground
              </h1>
              <p className="text-sm font-body text-textSecondary mt-0.5">
                Write, test, and execute JavaScript algorithms directly in your browser.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsFullScreen(!isFullScreen)} title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}>
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} title="Download Code">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyCode} title="Copy Code">
              {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} title="Reset to Default">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>
            <Button variant="primary" size="sm" onClick={handleRunCode} isLoading={isRunning}>
              <Play className="w-4 h-4 mr-1.5" />
              Run Code
            </Button>
          </div>
        </Card>

        {/* Editor & Output Container */}
        <div className={\`grid grid-cols-1 \${isFullScreen ? 'lg:grid-cols-2 h-[calc(100vh-120px)]' : 'lg:grid-cols-2 h-[650px]'} gap-4\`}>
          
          {/* Editor Side */}
          <Card className="flex flex-col border border-borderTheme overflow-hidden rounded-xl shadow-large">
            <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-borderTheme">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-xs font-mono text-muted uppercase font-bold tracking-wider">script.js</span>
              </div>
              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-mono font-bold">
                JavaScript
              </span>
            </div>
            <div className="flex-1 w-full bg-[#1e1e1e]">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  lineHeight: 24,
                  padding: { top: 16, bottom: 16 },
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  formatOnPaste: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </Card>

          {/* Terminal / Output Side */}
          <Card className="flex flex-col border border-borderTheme overflow-hidden rounded-xl shadow-large bg-[#0D0D0D]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-[#2A2A2A]">
              <div className="flex items-center gap-2 text-gray-300">
                <TerminalSquare className="w-4 h-4" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider text-gray-400">Terminal Output</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setOutput([])}
                className="text-gray-400 hover:text-white hover:bg-white/10 h-7 text-xs"
              >
                Clear
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-[13px] leading-relaxed scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
              {output.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-3">
                  <TerminalSquare className="w-10 h-10 opacity-20" />
                  <p className="font-mono text-sm">Waiting for execution...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {output.map((log, index) => (
                    <div 
                      key={index} 
                      className={\`flex gap-3 \${
                        log.type === 'error' ? 'text-red-400 bg-red-400/10 p-2 rounded' : 
                        log.type === 'warn' ? 'text-amber-400' : 
                        log.type === 'info' ? 'text-blue-400' : 'text-gray-300'
                      }\`}
                    >
                      <span className="text-gray-600 select-none shrink-0 text-[11px] mt-0.5">{log.timestamp}</span>
                      <span className="whitespace-pre-wrap break-words">{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CodePlayground;
