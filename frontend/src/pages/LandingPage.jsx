import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  BarChart3, 
  Cpu, 
  BookOpen, 
  Code, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

// Mock Interactive Sorting Demo Component for Hero
const HeroVisualization = () => {
  const [array, setArray] = useState([45, 80, 20, 95, 60, 30, 70, 15, 85, 40]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIdx, setActiveIdx] = useState([1, 2]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setArray((prev) => {
          const next = [...prev];
          const i = Math.floor(Math.random() * (next.length - 1));
          if (next[i] > next[i + 1]) {
            const temp = next[i];
            next[i] = next[i + 1];
            next[i + 1] = temp;
          }
          setActiveIdx([i, i + 1]);
          return next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const resetArray = () => {
    setArray([45, 80, 20, 95, 60, 30, 70, 15, 85, 40]);
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-2xl rounded-3xl border border-gray-100 p-6 shadow-2xl shadow-primary/10 relative overflow-hidden group">
      {/* Visual Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-2 text-xs font-mono text-gray-400">BubbleSort Visualizer — 60 FPS</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={resetArray}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Array Canvas Demo */}
      <div className="h-56 flex items-end justify-center gap-2 px-4 py-2">
        {array.map((val, idx) => {
          const isActive = activeIdx.includes(idx);
          return (
            <motion.div
              key={idx}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ height: `${val}%` }}
              className={`w-full rounded-t-xl transition-colors duration-200 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-sm ${
                isActive
                  ? 'bg-gradient-to-t from-accent to-[#FF9BE2] shadow-lg shadow-accent/30'
                  : 'bg-gradient-to-t from-primary to-[#8E44AD]'
              }`}
            >
              <span className="hidden sm:inline opacity-80">{val}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: Layers,
      title: 'Interactive Visualizers',
      desc: 'Step forward, backward, or auto-play through data structures and algorithm steps in 60 FPS clarity.',
      color: 'from-purple-500/10 to-primary/10'
    },
    {
      icon: BarChart3,
      title: 'Benchmark Center',
      desc: 'Run multi-algorithm comparisons against identical data arrays with live time and memory usage metrics.',
      color: 'from-pink-500/10 to-accent/10'
    },
    {
      icon: Cpu,
      title: 'C++ Execution Engine',
      desc: 'Powered by native high-performance C++ binaries compiled to JSON visualization event streams.',
      color: 'from-blue-500/10 to-indigo-500/10'
    },
    {
      icon: BookOpen,
      title: 'Structured Roadmaps',
      desc: 'Follow curated learning paths tailored for university exams, LeetCode mastery, and coding interviews.',
      color: 'from-amber-500/10 to-orange-500/10'
    },
    {
      icon: Code,
      title: 'Built-in Code Editor',
      desc: 'Write custom algorithm implementations in C++, Java, or JavaScript with Monaco editor syntax support.',
      color: 'from-emerald-500/10 to-teal-500/10'
    },
    {
      icon: Users,
      title: 'Community & Contests',
      desc: 'Participate in weekly algorithm contests, solve daily challenges, and discuss techniques with peers.',
      color: 'from-rose-500/10 to-red-500/10'
    }
  ];

  const faqs = [
    { q: 'Is AlgoVerse free to use?', a: 'Yes! Core interactive visualizers, algorithm labs, and basic practice problems are completely free.' },
    { q: 'How are visualizations generated?', a: 'Visualizations are generated by recording execution state events from underlying algorithm scripts and rendering them using React and Framer Motion.' },
    { q: 'Can I write my own algorithm code?', a: 'Absolutely. The Code Playground lets you edit, compile, and run algorithm implementations right inside your browser.' },
    { q: 'Is AlgoVerse responsive on mobile devices?', a: 'Yes! Every canvas and visual control is optimized for desktop, tablet, and mobile devices.' }
  ];

  return (
    <AppLayout showSidebar={false}>
      <div className="space-y-24 py-6">

        {/* Hero Section */}
        <section className="relative pt-6 pb-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold font-poppins shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Algorithm Laboratory</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-poppins text-gray-900 tracking-tight leading-[1.15]">
                Master Data Structures & Algorithms <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-purple-600">Visually</span>.
              </h1>

              <p className="text-lg text-gray-600 font-inter leading-relaxed max-w-xl">
                Step inside an interactive laboratory where every algorithm execution is rendered step-by-step with real-time memory and time complexity analysis.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full sm:w-auto px-8 py-3.5 text-base shadow-lg shadow-primary/25">
                    Start Learning Free &rarr;
                  </Button>
                </Link>
                <Link to="/playground" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto px-8 py-3.5 text-base">
                    Explore Playground
                  </Button>
                </Link>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                <div>
                  <h3 className="text-2xl font-bold font-poppins text-gray-900">50+</h3>
                  <p className="text-xs text-gray-500 font-inter">Algorithms</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-poppins text-gray-900">20+</h3>
                  <p className="text-xs text-gray-500 font-inter">Data Structures</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-poppins text-gray-900">60 FPS</h3>
                  <p className="text-xs text-gray-500 font-inter">Animations</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visualization Demo */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6"
            >
              <HeroVisualization />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-12 text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-900 tracking-tight">
              Everything You Need to Master DSA
            </h2>
            <p className="text-gray-500 text-[15px] font-inter">
              Designed from the ground up to help university students, self-taught developers, and interview candidates excel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className={`p-8 rounded-3xl bg-white border border-gray-100 shadow-md shadow-gray-100/50 text-left space-y-4 relative overflow-hidden group`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-primary`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-inter leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-poppins text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm">Everything you need to know about getting started with AlgoVerse.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-base font-semibold font-poppins text-gray-900 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-gray-500 font-inter leading-relaxed border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="rounded-3xl bg-gradient-to-br from-primary via-[#8E44AD] to-[#7C3AED] p-10 sm:p-14 text-center text-white space-y-6 shadow-2xl shadow-primary/30 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins tracking-tight">
              Ready to Accelerate Your Algorithm Learning?
            </h2>
            <p className="text-white/90 text-base font-inter">
              Join thousands of developers mastering DSA visually. Create your account in under a minute.
            </p>
            <div className="pt-2">
              <Link to="/signup">
                <Button className="bg-white text-primary hover:bg-white/90 px-8 py-3.5 text-base font-semibold shadow-lg">
                  Create Account Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </AppLayout>
  );
};

export default LandingPage;
