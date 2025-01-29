import React from 'react';
import { roleRequirements } from './roleRequirementsData';

interface RoleRequirementsProps {
  role: string;
}

type CategoryColor = {
  [key: string]: string;
};

const categoryColors: CategoryColor = {
  'Managing Clients and Relationships': 'rgba(0, 0, 255, 0.2)', // Blue
  'Winning and Selling Work': 'rgba(255, 215, 0, 0.2)', // Gold
  'Project Management': 'rgba(128, 0, 128, 0.2)', // Purple
  'Delivery and Execution': 'rgba(0, 128, 0, 0.2)', // Green
  'People Management': 'rgba(255, 192, 203, 0.2)', // Pink
  'Commercial Acumen': 'rgba(139, 69, 19, 0.2)', // Brown
};

export const RoleRequirements: React.FC<RoleRequirementsProps> = ({ role }) => {
  const requirements = roleRequirements[role];

  if (!requirements) {
    return (
      <div className="p-6 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">No requirements found for this role.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requirements.map((requirement, index) => (
        <div 
          key={index} 
          className="rounded-lg p-6"
          style={{ backgroundColor: categoryColors[requirement.title] || 'rgba(200, 200, 200, 0.2)' }}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">{requirement.title}</h3>
          <div className="space-y-3">
            {requirement.items?.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0" />
                <p className="text-gray-800">{item}</p>
              </div>
            )) || (
              <p className="text-gray-500">No items available</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};