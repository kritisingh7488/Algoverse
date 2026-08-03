import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { ArrowRight, Code2 } from 'lucide-react';

const DPProblemGrid = ({ category, onSelectProblem }) => {
  if (!category) return null;

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-heading font-bold text-textPrimary">{category.name}</h2>
        <p className="text-sm text-textSecondary">{category.description}</p>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {category.problems.map((problem) => (
          <Card key={problem.id} hover className="flex flex-col p-5 group transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Code2 className="w-5 h-5" />
              </div>
              <Badge 
                variant={
                  problem.difficulty === 'Easy' ? 'success' : 
                  problem.difficulty === 'Medium' ? 'warning' : 'danger'
                }
              >
                {problem.difficulty}
              </Badge>
            </div>
            
            <h3 className="text-lg font-heading font-bold text-textPrimary mb-2 group-hover:text-primary transition-colors">
              {problem.name}
            </h3>
            
            <div className="mt-auto pt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto"
                onClick={() => onSelectProblem(problem)}
              >
                Solve <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DPProblemGrid;
