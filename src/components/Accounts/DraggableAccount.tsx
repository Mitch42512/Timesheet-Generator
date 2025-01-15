import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Info } from 'lucide-react';
import { Account } from '../../types';

interface DraggableAccountProps {
  account: Account;
}

export const DraggableAccount: React.FC<DraggableAccountProps> = ({ account }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: account.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-2 p-2 bg-white border rounded-md shadow-sm group"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:bg-gray-50 p-1 rounded"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      <div
        className="w-4 h-4 rounded"
        style={{ backgroundColor: account.color }}
      />
      <div className="flex-1 flex items-center gap-2">
        <div className="font-medium text-sm">{account.name}</div>
        <div className="relative group/tooltip">
          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50">
            {account.description || 'No description available'}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      </div>
      {account.jobId && (
        <div className="text-xs text-gray-500">{account.jobId}</div>
      )}
    </div>
  );
};