import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import DPCategoryBrowser from '../../components/dp/DPCategoryBrowser';
import DPProblemGrid from '../../components/dp/DPProblemGrid';
import DPWorkspace from '../../components/dp/DPWorkspace';
import { dpCategories } from '../../data/dpProblems';

const DPStudio = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(dpCategories[0]?.id || null);
  const [activeProblem, setActiveProblem] = useState(null);

  const activeCategory = dpCategories.find(c => c.id === activeCategoryId);

  return (
    <AppLayout>
      <div className="space-y-4 py-1">
        
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Sidebar / Category Browser */}
          <div className="hidden lg:block lg:col-span-3">
            <DPCategoryBrowser 
              categories={dpCategories}
              activeCategory={activeCategoryId}
              onSelectCategory={(id) => {
                setActiveCategoryId(id);
                setActiveProblem(null);
              }}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {activeProblem ? (
              <DPWorkspace 
                problem={activeProblem} 
                onBack={() => setActiveProblem(null)} 
              />
            ) : (
              <div className="bg-card rounded-card shadow-sm border-[1.5px] border-borderTheme p-6 min-h-[calc(100vh-8rem)]">
                <DPProblemGrid 
                  category={activeCategory} 
                  onSelectProblem={(prob) => setActiveProblem(prob)}
                />
              </div>
            )}
          </div>
          
        </div>
      </div>
    </AppLayout>
  );
};

export default DPStudio;
