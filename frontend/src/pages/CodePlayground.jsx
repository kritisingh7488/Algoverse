import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Download, TerminalSquare, Maximize2, Minimize2, Code2, Copy, CheckCircle2, Settings2, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import api from '../api/axios';

// Language templates and configuration
const LANGUAGE_CONFIG = {
  javascript: {
    name: 'JavaScript (Node.js)',
    monacoLanguage: 'javascript',
    pistonLanguage: 'javascript',
    defaultCode: `// Welcome to the AlgoVerse JavaScript Playground!

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Calculating Fibonacci(10)...");
const result = fibonacci(10);
console.log("Result:", result);
`
  },
  python: {
    name: 'Python 3',
    monacoLanguage: 'python',
    pistonLanguage: 'python',
    defaultCode: `# Welcome to the AlgoVerse Python Playground!

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("Calculating Fibonacci(10)...")
result = fibonacci(10)
print(f"Result: {result}")
`
  },
  cpp: {
    name: 'C++ (GCC)',
    monacoLanguage: 'cpp',
    pistonLanguage: 'c++',
    defaultCode: `// Welcome to the AlgoVerse C++ Playground!
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
    cout << "Calculating Fibonacci(10)..." << endl;
    int result = fibonacci(10);
    cout << "Result: " << result << endl;
    return 0;
}
`
  },
  java: {
    name: 'Java (OpenJDK)',
    monacoLanguage: 'java',
    pistonLanguage: 'java',
    defaultCode: `// Welcome to the AlgoVerse Java Playground!
// Note: Class must be named Main

public class Main {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n-1) + fibonacci(n-2);
    }
    
    public static void main(String[] args) {
        System.out.println("Calculating Fibonacci(10)...");
        int result = fibonacci(10);
        System.out.println("Result: " + result);
    }
}
`
  },
  go: {
    name: 'Go',
    monacoLanguage: 'go',
    pistonLanguage: 'go',
    defaultCode: `// Welcome to the AlgoVerse Go Playground!
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println("Calculating Fibonacci(10)...")
    result := fibonacci(10)
    fmt.Printf("Result: %d\\n", result)
}
`
  },
  rust: {
    name: 'Rust',
    monacoLanguage: 'rust',
    pistonLanguage: 'rust',
    defaultCode: `// Welcome to the AlgoVerse Rust Playground!

fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    println!("Calculating Fibonacci(10)...");
    let result = fibonacci(10);
    println!("Result: {}", result);
}
`
  }
};

const THEMES = [
  { id: 'vs-dark', name: 'VS Dark' },
  { id: 'light', name: 'Light' },
  { id: 'hc-black', name: 'High Contrast' }
];

const FONT_SIZES = [12, 14, 16, 18, 20];

const CodePlayground = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(LANGUAGE_CONFIG['javascript'].defaultCode);
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Settings
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef(null);

  // Resize logic
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const containerWidth = window.innerWidth; // Approximate, but good enough for percentage calculation
      let newWidth = (e.clientX / containerWidth) * 100;
      if (newWidth < 20) newWidth = 20;
      if (newWidth > 80) newWidth = 80;
      setEditorWidth(newWidth);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(LANGUAGE_CONFIG[newLang].defaultCode);
    setOutput([]);
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setOutput([{ type: 'system', message: 'Executing code via AlgoVerse Secure Backend Container...' }]);
    
    const langConfig = LANGUAGE_CONFIG[selectedLanguage];
    const backendLang = langConfig.pistonLanguage;

    try {
      const response = await api.post('/execute', {
        language: backendLang,
        code: code
      });

      const data = response.data;
      const newOutput = [];
      
      if (data.run) {
        if (data.run.stdout) {
          newOutput.push({ type: 'info', message: data.run.stdout });
        }
        if (data.run.stderr) {
          newOutput.push({ type: 'error', message: data.run.stderr });
        }
        
        if (data.run.code !== 0) {
           newOutput.push({ type: 'error', message: `\nProcess exited with code ${data.run.code}` });
        } else if (!data.run.stdout && !data.run.stderr) {
           newOutput.push({ type: 'system', message: 'Process finished successfully with no output.' });
        }
      } else if (data.error) {
        newOutput.push({ type: 'error', message: data.error });
      } else {
        newOutput.push({ type: 'error', message: 'Failed to execute: ' + JSON.stringify(data) });
      }

      setOutput(newOutput);
    } catch (err) {
      setOutput([{ type: 'error', message: 'Execution failed: ' + (err.response?.data?.error || err.response?.data?.run?.stderr || err.toString()) }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(LANGUAGE_CONFIG[selectedLanguage].defaultCode);
    setOutput([]);
  };

  const handleClear = () => {
    setCode('');
    editorRef.current?.focus();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensionMap = {
      javascript: 'js',
      python: 'py',
      cpp: 'cpp',
      java: 'java',
      go: 'go',
      rust: 'rs'
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algoverse_script.${extensionMap[selectedLanguage]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className={`flex flex-col space-y-4 py-1 font-body ${isFullScreen ? 'fixed inset-0 z-50 bg-background overflow-hidden p-4' : ''}`}>
        
        {/* Header bar */}
        <Card className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-[1.5px] border-borderTheme p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-primary/15 text-primary border border-primary/30">
              <Code2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-heading font-bold text-textPrimary">
                  Code Playground IDE
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  Native Execution
                </span>
              </div>
              <p className="text-sm font-body text-textSecondary mt-0.5">
                Write and execute code in Python, C++, and JS natively on our servers.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Language Selector */}
            <select 
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-surface border border-borderTheme text-foreground text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary font-semibold"
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>

            {/* Theme Selector */}
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-surface border border-borderTheme text-foreground text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
            >
              {THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>

            {/* Font Size Selector */}
            <select 
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-surface border border-borderTheme text-foreground text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
            >
              {FONT_SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
            </select>

            <div className="w-px h-6 bg-borderTheme mx-1"></div>

            <Button variant="outline" size="sm" onClick={() => setIsFullScreen(!isFullScreen)} title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}>
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} title="Download Code">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyCode} title="Copy Code">
              {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} title="Reset to Default Boilerplate">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear} title="Clear All Code" className="text-red-500 hover:bg-red-500/10 hover:text-red-600 border-red-500/20">
              <Trash2 className="w-4 h-4 mr-1.5" />
              Clear
            </Button>
            <Button variant="primary" size="sm" onClick={handleRunCode} isLoading={isRunning}>
              <Play className="w-4 h-4 mr-1.5" />
              Run Code
            </Button>
          </div>
        </Card>

        {/* Resizable Editor & Output Container */}
        <div className={`flex flex-col lg:flex-row gap-2 ${isFullScreen ? 'flex-1' : 'h-[650px]'}`}>
          
          {/* Editor Side */}
          <Card 
            className="flex flex-col border border-borderTheme overflow-hidden rounded-xl shadow-large"
            style={{ width: `${editorWidth}%` }}
          >
            <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-borderTheme">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-xs font-mono text-muted uppercase font-bold tracking-wider">
                  main.{selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'python' ? 'py' : selectedLanguage === 'rust' ? 'rs' : selectedLanguage}
                </span>
              </div>
              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-mono font-bold">
                {LANGUAGE_CONFIG[selectedLanguage].name}
              </span>
            </div>
            <div className={`flex-1 w-full ${theme === 'vs-dark' || theme === 'hc-black' ? 'bg-[#1e1e1e]' : 'bg-[#fffffe]'}`}>
              <Editor
                height="100%"
                language={LANGUAGE_CONFIG[selectedLanguage].monacoLanguage}
                theme={theme}
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: fontSize,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  lineHeight: fontSize * 1.5,
                  padding: { top: 16, bottom: 16 },
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  formatOnPaste: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </Card>

          {/* Draggable Divider (Only visible on large screens) */}
          <div 
            className="hidden lg:flex w-2 bg-transparent hover:bg-primary/20 cursor-col-resize items-center justify-center rounded-full transition-colors active:bg-primary/40 group"
            onMouseDown={handleMouseDown}
          >
            <div className="w-0.5 h-12 bg-borderTheme group-hover:bg-primary/50 rounded-full"></div>
          </div>

          {/* Terminal / Output Side */}
          <Card 
            className="flex flex-col border border-borderTheme overflow-hidden rounded-xl shadow-large bg-[#0D0D0D]"
            style={{ width: `${100 - editorWidth}%` }}
          >
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
                  <p className="text-xs text-gray-700 max-w-xs text-center mt-2">
                    Code is executed natively on our backend servers.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {output.map((log, index) => (
                    <div 
                      key={index} 
                      className={`flex gap-3 ${
                        log.type === 'error' ? 'text-red-400 bg-red-400/10 p-3 rounded font-bold' : 
                        log.type === 'system' ? 'text-emerald-400/80 italic text-xs' : 
                        'text-gray-300'
                      }`}
                    >
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
