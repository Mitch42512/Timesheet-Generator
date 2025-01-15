import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Account } from '../../types';

interface DraggableAccountItemProps {
  account: Account;
}

export const DraggableAccountItem: React.FC<DraggableAccountItemProps> = ({ account }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: account.id,
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-2 p-2 rounded-md cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50' : ''}
        hover:bg-gray-50
      `}
      style={style}
    >
      <div 
        className="w-3 h-3 rounded-full flex-shrink-0" 
        style={{ backgroundColor: account.color }} 
      />
      <div className="min-w-0">
        <div className="font-medium text-sm truncate">{account.name}</div>
        <div className="text-xs text-gray-500 truncate">{account.jobId}</div>
      </div>
    </div>
  );
};