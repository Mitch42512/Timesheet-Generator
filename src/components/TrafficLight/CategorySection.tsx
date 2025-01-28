import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { TrafficLightItem as TrafficLightItemComponent } from './TrafficLightItem';
import { useTrafficLightStore, useTrafficLightItems } from '../../store/useTrafficLightStore';

interface CategorySectionProps {
  title: string;
  category: string;
  role: string;
  defaultItems: string[];
  onAddItem: () => void;
  bgColor: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  category,
  role,
  defaultItems,
  onAddItem,
  bgColor,
}) => {
  const { initializeCategory } = useTrafficLightStore();
  const items = useTrafficLightItems(role, category);

  const calculateCategoryProgress = () => {
    if (items.length === 0) return 0;
    
    const totalPossibleScore = items.length * 5; // Maximum score is 5 for each item
    const currentScore = items.reduce((sum, item) => sum + (item.rating || 0), 0);
    
    return Math.round((currentScore / totalPossibleScore) * 100);
  };

  useEffect(() => {
    console.log('Initializing category:', {
      role,
      category,
      defaultItems,
    });
    initializeCategory(role, category, defaultItems);
  }, [role, category, defaultItems, initializeCategory]);

  console.log('Current items:', items);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4" style={{ backgroundColor: bgColor }}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm font-medium">
            {calculateCategoryProgress()}% Complete
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {items.map((item) => (
            <TrafficLightItemComponent
              key={item.id}
              role={role}
              category={category}
              item={item}
            />
          ))}
        </div>

        <button
          onClick={onAddItem}
          className="mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <Plus className="w-4 h-4" />
          Add new item
        </button>
      </div>
    </div>
  );
};