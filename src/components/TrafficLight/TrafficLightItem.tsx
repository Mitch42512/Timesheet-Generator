import React, { useState } from 'react';
import { useTrafficLightStore } from '../../store/useTrafficLightStore';
import { Frown, MehIcon, Smile, SmileIcon, Trash2, ChevronDown } from 'lucide-react';

interface TrafficLightItemProps {
  role: string;
  category: string;
  item: {
    id: string;
    text: string;
    rating: number | null;
    notes: string;
    itemType?: 'daily' | 'training' | 'wider';
  };
}

const itemTypes = [
  { id: 'daily', label: 'Daily Project Life', color: '#006400' }, // Dark Green
  { id: 'training', label: 'Kantar Training', color: '#8B0000' }, // Dark Red
  { id: 'wider', label: 'Wider Kantar Assimilation', color: '#00008B' }, // Dark Blue
];

export const TrafficLightItem: React.FC<TrafficLightItemProps> = ({
  role,
  category,
  item,
}) => {
  const { updateItem, removeItem } = useTrafficLightStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const ratings = [
    { value: 1, icon: Frown, color: 'text-red-500' },
    { value: 2, icon: Frown, color: 'text-orange-500' },
    { value: 3, icon: MehIcon, color: 'text-yellow-500' },
    { value: 4, icon: SmileIcon, color: 'text-lime-500' },
    { value: 5, icon: Smile, color: 'text-green-500' },
  ];

  const handleRatingClick = (value: number) => {
    // If the same rating is clicked again, set to null (unselected)
    const newRating = item.rating === value ? null : value;
    updateItem(item.id, { rating: newRating });
  };

  const getBorderColor = () => {
    switch (item.itemType) {
      case 'daily': return '#006400';
      case 'training': return '#8B0000';
      case 'wider': return '#00008B';
      default: return 'transparent';
    }
  };

  return (
    <div 
      className="border rounded-lg p-4 space-y-3"
      style={{ 
        borderLeft: `4px solid ${getBorderColor()}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={item.text}
              onChange={(e) =>
                updateItem(item.id, { text: e.target.value })
              }
              className="w-full px-2 py-1 border rounded"
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          ) : (
            <div
              className="cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {item.text || 'Click to edit'}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
            >
              <span style={{ color: getBorderColor() }}>
                {item.itemType ? itemTypes.find(t => t.id === item.itemType)?.label : 'Select Type'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showTypeDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                {itemTypes.map((type) => (
                  <button
                    key={type.id}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                    onClick={() => {
                      updateItem(item.id, { itemType: type.id as 'daily' | 'training' | 'wider' });
                      setShowTypeDropdown(false);
                    }}
                    style={{ color: type.color }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {ratings.map(({ value, icon: Icon, color }) => (
            <button
              key={value}
              onClick={() => handleRatingClick(value)}
              className={`p-1 rounded-full hover:bg-gray-100 ${
                item.rating === value ? color : 'text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
          
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {showNotes ? 'Hide notes' : 'Show notes'}
        </button>
        
        {showNotes && (
          <textarea
            value={item.notes}
            onChange={(e) =>
              updateItem(item.id, { notes: e.target.value })
            }
            placeholder="Add notes here..."
            className="mt-2 w-full px-3 py-2 border rounded-lg resize-none"
            rows={3}
          />
        )}
      </div>
    </div>
  );
};