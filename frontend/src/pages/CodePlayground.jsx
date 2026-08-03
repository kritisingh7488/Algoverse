import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Download, TerminalSquare, Maximize2, Minimize2, Code2, Copy, CheckCircle2, Settings2, Loader2, AlertCircle, Trash2, StopCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { io } from 'socket.io-client';

const apiBase = import.meta.env.VITE_API_URL || 
  (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}` : 'http://localhost:5000');

// Language templates and configuration
const LANGUAGE_CONFIG = {
  javascript: {
    name: 'JavaScript (Node.js)',
    monacoLanguage: 'javascript',
    pistonLanguage: 'javascript',
    defaultCode: `// Welcome to the AlgoVerse JavaScript Playground!

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter your name: ', name => {
  console.log(\`Hello, \${name}! Welcome to the interactive terminal.\`);
  readline.close();
});
`
  },
  python: {
    name: 'Python 3',
    monacoLanguage: 'python',
    pistonLanguage: 'python',
    defaultCode: `# Welcome to the AlgoVerse Python Playground!

name = input("Enter your name: ")
print(f"Hello, {name}! Welcome to the interactive terminal.")
`
  },
  cpp: {
    name: 'C++ (GCC)',
    monacoLanguage: 'cpp',
    pistonLanguage: 'c++',
    defaultCode: `// Welcome to the AlgoVerse C++ Playground!
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    cout << "Enter your name: ";
    getline(cin, name);
    cout << "Hello, " << name << "! Welcome to the interactive terminal." << endl;
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

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "! Welcome to the interactive terminal.");
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

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    fmt.Print("Enter your name: ")
    name, _ := reader.ReadString('\\n')
    name = strings.TrimSpace(name)
    fmt.Printf("Hello, %s! Welcome to the interactive terminal.\\n", name)
}
`
  },
  rust: {
    name: 'Rust',
    monacoLanguage: 'rust',
    pistonLanguage: 'rust',
    defaultCode: `// Welcome to the AlgoVerse Rust Playground!
use std::io::{self, Write};

fn main() {
    print!("Enter your name: ");
    io::stdout().flush().unwrap();
    let mut name = String::new();
    io::stdin().read_line(&mut name).unwrap();
    let name = name.trim();
    println!("Hello, {}! Welcome to the interactive terminal.", name);
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
  const [isRunning, setIsRunningState] = useState(false);
  const isRunningRef = useRef(false);
  
  const setIsRunning = (val) => {
    setIsRunningState(val);
    isRunningRef.current = val;
  };

  const [isCopied, setIsCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Settings
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef(null);

  // Resize logic
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);

  // Terminal & Socket refs
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const socketRef = useRef(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const containerWidth = window.innerWidth;
      let newWidth = (e.clientX / containerWidth) * 100;
      if (newWidth < 20) newWidth = 20;
      if (newWidth > 80) newWidth = 80;
      setEditorWidth(newWidth);
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (fitAddonRef.current) {
      setTimeout(() => fitAddonRef.current.fit(), 100);
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
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

  useEffect(() => {
    // Initialize xterm
    xtermRef.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#0D0D0D',
        foreground: '#D4D4D4',
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 13,
    });
    fitAddonRef.current = new FitAddon();
    xtermRef.current.loadAddon(fitAddonRef.current);
    
    if (terminalRef.current) {
      xtermRef.current.open(terminalRef.current);
      fitAddonRef.current.fit();
    }

    xtermRef.current.writeln('\\x1b[90mWelcome to AlgoVerse Interactive Terminal!\\x1b[0m');
    xtermRef.current.writeln('\\x1b[90mWaiting for execution...\\x1b[0m');

    // Connect Socket
    socketRef.current = io(apiBase);

    socketRef.current.on('connect', () => {
      console.log('Terminal connected to server');
    });

    socketRef.current.on('terminal_data', (data) => {
      if (xtermRef.current) {
        xtermRef.current.write(data);
      }
    });

    socketRef.current.on('process_exit', (code) => {
      setIsRunning(false);
    });

    // Handle user input in terminal
    xtermRef.current.onData((data) => {
      if (isRunningRef.current && socketRef.current) {
        socketRef.current.emit('terminal_input', data);
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      if (fitAddonRef.current && xtermRef.current?.element) {
        try {
          fitAddonRef.current.fit();
        } catch (e) {}
      }
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      resizeObserver.disconnect();
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(LANGUAGE_CONFIG[newLang].defaultCode);
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.writeln('\\x1b[90mSwitched to ' + LANGUAGE_CONFIG[newLang].name + '\\x1b[0m');
    }
  };

  const handleRunCode = () => {
    if (!code.trim() || !socketRef.current) return;
    
    setIsRunning(true);
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.writeln('\\x1b[36mRunning code via AlgoVerse Secure Backend Container...\\x1b[0m\\r\\n');
      xtermRef.current.focus();
    }
    
    const langConfig = LANGUAGE_CONFIG[selectedLanguage];
    
    socketRef.current.emit('run_code', {
      language: langConfig.pistonLanguage,
      code: code
    });
  };

  const handleKillProcess = () => {
    if (socketRef.current && isRunning) {
      socketRef.current.emit('kill_process');
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(LANGUAGE_CONFIG[selectedLanguage].defaultCode);
  };

  const handleClearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  const handleClearCode = () => {
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
                  Interactive TTY
                </span>
              </div>
              <p className="text-sm font-body text-textSecondary mt-0.5">
                Write and execute code interactively in Python, C++, and JS natively on our servers.
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
            <Button variant="outline" size="sm" onClick={handleClearCode} title="Clear All Code" className="text-red-500 hover:bg-red-500/10 hover:text-red-600 border-red-500/20">
              <Trash2 className="w-4 h-4 mr-1.5" />
              Clear
            </Button>
            
            {isRunning ? (
              <Button variant="outline" size="sm" onClick={handleKillProcess} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/50">
                <StopCircle className="w-4 h-4 mr-1.5" />
                Stop
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleRunCode}>
                <Play className="w-4 h-4 mr-1.5" />
                Run Code
              </Button>
            )}
            
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
            <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-[#2A2A2A] flex-shrink-0">
              <div className="flex items-center gap-2 text-gray-300">
                <TerminalSquare className="w-4 h-4" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider text-gray-400">Interactive Terminal</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearTerminal}
                className="text-gray-400 hover:text-white hover:bg-white/10 h-7 text-xs"
              >
                Clear
              </Button>
            </div>
            <div className="flex-1 w-full h-full overflow-hidden p-2" ref={terminalRef}>
              {/* xterm.js will attach here */}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CodePlayground;
