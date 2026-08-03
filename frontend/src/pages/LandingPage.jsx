import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  BarChart3, 
  Cpu, 
  BookOpen, 
  Code, 
  Users, 
  ArrowRight, 
  ChevronDown 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import MascotRole from '../components/mascots/MascotRole';
import { PaperClip, SparkleStar, TapeAccent } from '../components/notebook/PaperClip';

// Interactive Sorting Demo Component for Hero
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
    <Card className="relative overflow-hidden border-[1.5px] border-borderTheme p-4 shadow-medium bg-card">
      <PaperClip className="absolute top-2 right-4 w-6 h-10 text-secondary z-10" />
      {/* Visual Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-[1.5px] border-borderTheme">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-danger" />
          <span className="w-3 h-3 rounded-full bg-warning" />
          <span className="w-3 h-3 rounded-full bg-success" />
          <span className="ml-2 text-xs font-mono text-textSecondary">BubbleSort Visualizer — Real Step Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-2xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={resetArray}
            className="p-2 rounded-2xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-colors"
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
              className={`w-full rounded-t-2xl transition-colors duration-200 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-xs ${
                isActive
                  ? 'bg-accent shadow-md shadow-accent/30'
                  : 'bg-primary'
              }`}
            >
              <span className="hidden sm:inline opacity-90">{val}</span>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: Layers,
      title: 'Interactive Visualizers',
      desc: 'Step forward, backward, or auto-play through data structures and algorithm steps with clear line-by-line pseudocode highlighting.'
    },
    {
      icon: BarChart3,
      title: 'Benchmark Center',
      desc: 'Run multi-algorithm comparisons against identical data arrays with live performance.now() microsecond metrics.'
    },
    {
      icon: Cpu,
      title: 'Execution Engine',
      desc: 'Powered by real algorithm execution event streams with zero hardcoded or static mock demonstrations.'
    },
    {
      icon: BookOpen,
      title: 'Structured Roadmaps',
      desc: 'Follow curated learning paths tailored for university exams, LeetCode mastery, and technical interview preparation.'
    },
    {
      icon: Code,
      title: 'Built-in Code Editor',
      desc: 'Write custom algorithm implementations in C++, Java, Python, or JavaScript with live STDOUT/STDERR output.'
    },
    {
      icon: Users,
      title: 'Community & Quizzes',
      desc: 'Participate in weekly algorithm quizzes, solve challenges, and share insights with fellow computer science learners.'
    }
  ];

  const faqs = [
    { q: 'Is AlgoVerse free to use?', a: 'Yes! Core interactive visualizers, algorithm labs, and basic practice problems are completely free.' },
    { q: 'How are visualizations generated?', a: 'Visualizations are driven by step-by-step event streams recorded directly from real algorithm execution logic.' },
    { q: 'Can I write my own algorithm code?', a: 'Targeting C++, Java, Python, and JavaScript, the Code Playground executes custom source code and streams console output.' },
    { q: 'Is AlgoVerse responsive across devices?', a: 'Yes! Every canvas and visual control is optimized for desktop, laptop, tablet, and mobile displays.' }
  ];

  return (
    <AppLayout showSidebar={false}>
      <div className="space-y-14 py-4">

        {/* Hero Section */}
        <section className="relative pt-6 pb-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-4 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border-[1.5px] border-primary text-primary text-xs font-heading font-bold shadow-soft">
                <SparkleStar className="w-3.5 h-3.5 text-warning" />
                <span>Handcrafted Algorithm Playground</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-textPrimary tracking-tight leading-[1.15]">
                Master Algorithms <span className="text-primary">Visually & Interactively</span>.
              </h1>

              <p className="text-lg text-textSecondary font-body leading-relaxed max-w-xl">
                Step inside a cozy study notebook where every algorithm execution is rendered step-by-step with real-time memory and time complexity analysis.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Start Learning Free <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/playground" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Playground
                  </Button>
                </Link>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t-[1.5px] border-borderTheme">
                <div>
                  <h3 className="text-2xl font-heading font-bold text-textPrimary">50+</h3>
                  <p className="text-xs text-textSecondary font-body">Algorithms</p>
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-textPrimary">20+</h3>
                  <p className="text-xs text-textSecondary font-body">Data Structures</p>
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-textPrimary">100%</h3>
                  <p className="text-xs text-textSecondary font-body">Engine Driven</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visualization Demo & Mascot */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 space-y-4"
            >
              <HeroVisualization />
              <div className="flex justify-end">
                <MascotRole role="teacher" activity="reading" dialogue="Click Play to watch BubbleSort in action!" className="w-16 h-16" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-12 text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-textPrimary tracking-tight">
              Everything You Need to Master DSA
            </h2>
            <p className="text-textSecondary text-[15px] font-body">
              Designed from the ground up to make algorithms intuitive, approachable, and fun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx} hover className="text-left space-y-4 relative overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-textPrimary">{item.title}</h3>
                  <p className="text-sm text-textSecondary font-body leading-relaxed">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-heading font-bold text-textPrimary">Frequently Asked Questions</h2>
            <p className="text-textSecondary text-sm font-body">Everything you need to know about getting started with AlgoVerse.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-0 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-base font-heading font-bold text-textPrimary focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-textSecondary transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-textSecondary font-body leading-relaxed border-t border-borderTheme pt-3">
                    {faq.a}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Banner with Mascot */}
        <Card className="bg-cardAccent p-6 sm:p-8 text-center space-y-4 shadow-medium relative overflow-hidden border-[1.5px] border-borderTheme">
          <TapeAccent className="absolute top-3 left-6" />
          <div className="max-w-2xl mx-auto space-y-4 relative z-10 flex flex-col items-center">
            <MascotRole role="companion" activity="star" className="w-20 h-20 mb-2" />
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-textPrimary tracking-tight">
              Ready to Accelerate Your Algorithm Learning?
            </h2>
            <p className="text-textSecondary text-base font-body">
              Join thousands of developers mastering DSA visually. Create your account in under a minute.
            </p>
            <div className="pt-2">
              <Link to="/signup">
                <Button variant="primary" size="lg">
                  Create Account Free Now
                </Button>
              </Link>
            </div>
          </div>
        </Card>

      </div>
    </AppLayout>
  );
};

export default LandingPage;
