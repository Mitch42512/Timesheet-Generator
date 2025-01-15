import React from 'react';
import { ChevronDown } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  const roles = [
    { id: 'graduate', label: 'Graduate' },
    { id: 'client-executive', label: 'Client Executive' },
    { id: 'snr-client-executive', label: 'Snr Client Executive' },
    { id: 'client-manager', label: 'Client Manager' },
    { id: 'associate-director', label: 'Associate Director' },
    { id: 'director', label: 'Director' },
  ];

  return (
    <div className="relative mb-6">
      <select
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
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
  );
};