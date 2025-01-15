import React from 'react';
import { CategorySection } from './CategorySection';
import { useTrafficLightStore } from '../../store/useTrafficLightStore';
import { ChevronDown } from 'lucide-react';
import { Overview } from './Overview';
import { roleRequirements } from './roleRequirementsData';

export const TrafficLightPage: React.FC = () => {
  const { addItem, selectedRole, setSelectedRole } = useTrafficLightStore();

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
        {/* Left Container - 70% */}
        <div className="flex-[0.7]">
          <div className="space-y-8">
            <CategorySection
              title="Managing Clients and Relationships"
              category="clientRelations"
              role={selectedRole}
              defaultItems={roleRequirements[selectedRole][0].items}
              onAddItem={() => handleAddItem('clientRelations')}
              bgColor="rgba(0, 0, 255, 0.2)"
            />

            <CategorySection
              title="Winning and Selling Work"
              category="sellingWork"
              role={selectedRole}
              defaultItems={roleRequirements[selectedRole][1].items}
              onAddItem={() => handleAddItem('sellingWork')}
              bgColor="rgba(255, 215, 0, 0.2)"
            />

            <CategorySection
              title="Project Management"
              category="projectManagement"
              role={selectedRole}
              defaultItems={roleRequirements[selectedRole][2].items}
              onAddItem={() => handleAddItem('projectManagement')}
              bgColor="rgba(128, 0, 128, 0.2)"
            />

            <CategorySection
              title="Delivery and Execution"
              category="delivery"
              role={selectedRole}
              defaultItems={roleRequirements[selectedRole][3].items}
              onAddItem={() => handleAddItem('delivery')}
              bgColor="rgba(0, 128, 0, 0.2)"
            />

            <CategorySection
              title="People Management"
              category="peopleManagement"
              role={selectedRole}
              defaultItems={roleRequirements[selectedRole][4].items}
              onAddItem={() => handleAddItem('peopleManagement')}
              bgColor="rgba(255, 192, 203, 0.4)"
            />

            <CategorySection
              title="Commercial Acumen"
              category="commercialAcumen"
              role={selectedRole}
              defaultItems={roleRequirements[selectedRole][5].items}
              onAddItem={() => handleAddItem('commercialAcumen')}
              bgColor="rgba(139, 69, 19, 0.2)"
            />
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