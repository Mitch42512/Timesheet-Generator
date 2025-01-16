import React from 'react';
import { CategorySection } from './CategorySection';
import { useTrafficLightStore } from '../../store/useTrafficLightStore';
import { ChevronDown } from 'lucide-react';
import { Overview } from './Overview';
import { trafficLightRequirements } from './trafficLightRequirements';

export const TrafficLightPage: React.FC = () => {
  const { addItem, selectedRole, setSelectedRole } = useTrafficLightStore();

  console.log('Selected Role:', selectedRole);
  console.log('Requirements:', trafficLightRequirements[selectedRole]);

  const roles = [
    { id: 'graduate', label: 'Graduate' },
    { id: 'client-executive', label: 'Client Executive' },
    { id: 'snr-client-executive', label: 'Snr Client Executive' },
    { id: 'client-manager', label: 'Client Manager' },
    { id: 'associate-director', label: 'Associate Director' },
    { id: 'director', label: 'Director' },
  ];

  const handleAddItem = (category: string) => {
    addItem(selectedRole, category, {
      id: crypto.randomUUID(),
      text: '',
      rating: null,
      notes: '',
    });
  };

  if (!trafficLightRequirements[selectedRole]) {
    console.error('No requirements found for role:', selectedRole);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Traffic Light Assessment</h1>
        <div className="w-64">
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="flex gap-6">
        <div className="flex-[0.7]">
          <div className="space-y-8">
            {trafficLightRequirements[selectedRole].map((section) => (
              <CategorySection
                key={section.category}
                title={getCategoryTitle(section.category)}
                category={section.category}
                role={selectedRole}
                defaultItems={section.items}
                onAddItem={() => handleAddItem(section.category)}
                bgColor={getCategoryColor(section.category)}
              />
            ))}
          </div>
        </div>

        {/* Right Container - 30% */}
        <div className="flex-[0.3]">
          <Overview role={selectedRole} />
        </div>
      </div>
    </div>
  );
};

const getCategoryTitle = (category: string) => {
  const titles: Record<string, string> = {
    clientRelations: 'Managing Clients and Relationships',
    sellingWork: 'Winning and Selling Work',
    projectManagement: 'Project Management',
    delivery: 'Delivery and Execution',
    peopleManagement: 'People Management',
    commercialAcumen: 'Commercial Acumen',
  };
  return titles[category] || category;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    clientRelations: 'rgba(0, 0, 255, 0.2)',
    sellingWork: 'rgba(255, 215, 0, 0.2)',
    projectManagement: 'rgba(128, 0, 128, 0.2)',
    delivery: 'rgba(0, 128, 0, 0.2)',
    peopleManagement: 'rgba(255, 192, 203, 0.4)',
    commercialAcumen: 'rgba(139, 69, 19, 0.2)',
  };
  return colors[category] || 'rgba(0, 0, 0, 0.1)';
};