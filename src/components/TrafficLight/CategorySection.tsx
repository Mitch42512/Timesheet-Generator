import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { TrafficLightItem } from './TrafficLightItem';
import { useTrafficLightStore } from '../../store/useTrafficLightStore';
import { trafficLightRequirements } from './trafficLightRequirements';

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
  const { initializeCategory, getItemsForRole } = useTrafficLightStore();
  const items = getItemsForRole(role, category);

  useEffect(() => {
    initializeCategory(role, category, defaultItems);
  }, [role, category, defaultItems, initializeCategory]);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4" style={{ backgroundColor: bgColor }}>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {items.map((item) => (
            <TrafficLightItem
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