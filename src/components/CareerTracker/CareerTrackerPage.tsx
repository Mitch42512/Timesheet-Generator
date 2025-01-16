import React, { useState, useEffect } from 'react';
import { RoleSelector } from './RoleSelector';
import { RoleRequirements } from './RoleRequirements';
import { ProfileOverview } from './ProfileOverview';
import { useUserStore } from '../../store/useUserStore';

interface CareerTrackerPageProps {
  onTabChange: (tab: string) => void;
}

export const CareerTrackerPage: React.FC<CareerTrackerPageProps> = ({ onTabChange }) => {
  const { position } = useUserStore();
  const [selectedRole, setSelectedRole] = useState(position);

  // Update selectedRole when position changes
  useEffect(() => {
    setSelectedRole(position);
  }, [position]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Career Tracker</h1>
      <div className="flex gap-6">
        <div className="flex-[0.65]">
          <div className="bg-white rounded-lg shadow p-6">
            <RoleSelector selectedRole={selectedRole} onRoleChange={handleRoleChange} />
            <RoleRequirements role={selectedRole} />
          </div>
        </div>

        <div className="flex-[0.35]">
          <ProfileOverview onTabChange={onTabChange} />
        </div>
      </div>
    </div>
  );
};