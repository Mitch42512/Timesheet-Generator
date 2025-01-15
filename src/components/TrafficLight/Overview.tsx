import React from 'react';
import { useTrafficLightStore } from '../../store/useTrafficLightStore';
import { PieChart, BarChart } from 'lucide-react';

interface OverviewProps {
  role: string;
}

export const Overview: React.FC<OverviewProps> = ({ role }) => {
  const { getItemsForRole } = useTrafficLightStore();

  const calculateCategoryStats = (category: string) => {
    const categoryItems = getItemsForRole(role, category) || [];
    const ratedItems = categoryItems.filter(item => item.rating !== null);
    if (ratedItems.length === 0) return 0;
    
    const total = ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0);
    return (total / (ratedItems.length * 5)) * 100;
  };

  const categories = [
    { id: 'clientRelations', label: 'Client Relations', color: 'bg-blue-200' },
    { id: 'sellingWork', label: 'Selling Work', color: 'bg-yellow-200' },
    { id: 'projectManagement', label: 'Project Management', color: 'bg-purple-200' },
    { id: 'delivery', label: 'Delivery', color: 'bg-green-200' },
    { id: 'peopleManagement', label: 'People Management', color: 'bg-pink-200' },
    { id: 'commercialAcumen', label: 'Commercial Acumen', color: 'bg-amber-200' },
  ];

  const overallProgress = categories.reduce((sum, category) => 
    sum + calculateCategoryStats(category.id), 0
  ) / categories.length;

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Overall Progress
        </h2>
        <div className="text-3xl font-bold text-blue-600">
          {overallProgress.toFixed(1)}%
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Category Progress
        </h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="flex justify-between text-sm mb-1">
                <span>{category.label}</span>
                <span>{calculateCategoryStats(category.id).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${category.color}`}
                  style={{
                    width: `${calculateCategoryStats(category.id)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};