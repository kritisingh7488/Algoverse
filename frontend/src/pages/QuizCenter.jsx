import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

const QUIZ_TOPICS = [
  {
    id: 'sorting',
    title: 'Sorting Algorithm Complexities',
    questions: [
      {
        question: 'What is the worst-case time complexity of Quick Sort when selecting the first element as pivot on an already sorted array?',
        options: ['O(N log N)', 'O(N²)', 'O(N)', 'O(log N)'],
        answer: 1,
        explanation: 'Selecting a boundary element on a sorted array causes unbalanced partitions, degenerating Quick Sort into O(N²) time.'
      },
      {
        question: 'Which sorting algorithm is guaranteed to be stable and run in O(N log N) worst-case time?',
        options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'],
        answer: 2,
        explanation: 'Merge Sort divides arrays evenly and merges equal elements without swapping relative order, ensuring stability and O(N log N).'
      }
    ]
  },
  {
    id: 'graphs',
    title: 'Graph Traversals & Shortest Paths',
    questions: [
      {
        question: 'Which data structure is typically used to implement Breadth First Search (BFS)?',
        options: ['Stack (LIFO)', 'Queue (FIFO)', 'Priority Queue', 'Array'],
        answer: 1,
        explanation: 'BFS uses a FIFO Queue to explore graph vertices level by level.'
      },
      {
        question: 'Does Dijkstra’s algorithm work correctly on graphs with negative edge weights?',
        options: ['Yes, always', 'No, it may produce incorrect shortest paths', 'Only if graph has no cycles', 'Only for directed graphs'],
        answer: 1,
        explanation: 'Dijkstra assumes greedily that path weights never decrease, so negative weights can lead to wrong distances (Bellman-Ford is needed).'
      }
    ]
  }
];

const QuizCenter = () => {
  const [selectedTopic, setSelectedTopic] = useState(QUIZ_TOPICS[0]);
  const [currQ, setCurrQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = selectedTopic.questions[currQ];

  const handleSelectOption = (idx) => {
    if (!isSubmitted) setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === question.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currQ < selectedTopic.questions.length - 1) {
      setCurrQ(currQ + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrQ(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2 max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Self-Assessment Quiz Center</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Reinforce theoretical knowledge of algorithm complexity, traversal mechanics, and edge cases.
            </p>
          </div>
        </div>

        {/* Quiz Topic Pills */}
        <div className="flex gap-2">
          {QUIZ_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                setSelectedTopic(topic);
                handleRestart();
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold font-poppins border transition-all ${
                selectedTopic.id === topic.id
                  ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                  : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>

        {/* Quiz Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          {!quizFinished ? (
            <div className="space-y-6">
              
              {/* Progress Header */}
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-gray-100 pb-3">
                <span>QUESTION {currQ + 1} OF {selectedTopic.questions.length}</span>
                <span>SCORE: {score}</span>
              </div>

              {/* Question Text */}
              <h3 className="text-base font-bold font-poppins text-gray-900 leading-relaxed">
                {question.question}
              </h3>

              {/* Options List */}
              <div className="space-y-3">
                {question.options.map((opt, idx) => {
                  let optStyle = 'border-gray-100 bg-gray-50/70 hover:border-gray-200 text-gray-800';
                  
                  if (selectedOption === idx) {
                    optStyle = 'border-primary bg-primary/5 text-primary font-semibold';
                  }

                  if (isSubmitted) {
                    if (idx === question.answer) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                    } else if (selectedOption === idx) {
                      optStyle = 'border-red-400 bg-red-50 text-red-700';
                    }
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-2xl border text-xs font-inter cursor-pointer transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && idx === question.answer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {isSubmitted && selectedOption === idx && idx !== question.answer && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isSubmitted && (
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 space-y-1">
                  <span className="font-bold font-poppins block">Explanation:</span>
                  <p className="font-inter leading-relaxed">{question.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                {!isSubmitted ? (
                  <Button onClick={handleSubmit} disabled={selectedOption === null} variant="primary" className="px-6 py-2.5 text-xs">
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNext} variant="primary" className="px-6 py-2.5 text-xs">
                    Next Question &rarr;
                  </Button>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold font-poppins text-gray-900">Quiz Completed!</h2>
              <p className="text-xs text-gray-500 font-inter">
                You scored <span className="font-bold text-primary">{score} / {selectedTopic.questions.length}</span> on {selectedTopic.title}.
              </p>
              <Button onClick={handleRestart} variant="outline" className="px-6 py-2.5 text-xs mx-auto">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Retake Quiz
              </Button>
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
};

export default QuizCenter;
