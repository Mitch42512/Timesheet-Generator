import React from 'react';
import { useTrafficLightStore } from '../../store/useTrafficLightStore';

interface OverviewProps {
  role: string;
}

export const Overview: React.FC<OverviewProps> = ({ role }) => {
  const { getItemsForRole } = useTrafficLightStore();

  const categories = [
    { id: 'clientRelations', label: 'Client Relations', color: 'bg-blue-100' },
    { id: 'sellingWork', label: 'Selling Work', color: 'bg-yellow-100' },
    { id: 'projectManagement', label: 'Project Management', color: 'bg-purple-100' },
    { id: 'delivery', label: 'Delivery', color: 'bg-green-100' },
    { id: 'peopleManagement', label: 'People Management', color: 'bg-pink-100' },
    { id: 'commercialAcumen', label: 'Commercial Acumen', color: 'bg-orange-100' },
  ];

  const calculateCategoryProgress = (category: string) => {
    const items = getItemsForRole(role, category);
    if (items.length === 0) return 0;

    const totalPossibleScore = items.length * 5; // Maximum score is 5 for each item
    const currentScore = items.reduce((sum, item) => sum + (item.rating || 0), 0);
    
    return Math.round((currentScore / totalPossibleScore) * 100);
  };

  const calculateOverallProgress = () => {
    let totalScore = 0;
    let totalPossible = 0;

    categories.forEach(category => {
      const items = getItemsForRole(role, category.id);
      totalPossible += items.length * 5;
      totalScore += items.reduce((sum, item) => sum + (item.rating || 0), 0);
    });

    return totalPossible === 0 ? 0 : Math.round((totalScore / totalPossible) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Progress Overview</h2>
        <div className="mt-2">
          <div className="text-3xl font-bold text-blue-600">
            {calculateOverallProgress()}%
          </div>
          <div className="text-sm text-gray-500">Overall Progress</div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Category Progress</h3>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{category.label}</span>
                <span className="font-medium">{calculateCategoryProgress(category.id)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${category.color}`}
                  style={{
                    width: `${calculateCategoryProgress(category.id)}%`,
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