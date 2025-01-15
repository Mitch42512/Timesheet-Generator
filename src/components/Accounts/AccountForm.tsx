import React, { useState } from 'react';
import { useAccountStore } from '../../store/useAccountStore';

type AccountType = 'chargeable' | 'non-chargeable' | 'extra';

export const AccountForm: React.FC = () => {
  const addAccount = useAccountStore((state) => state.addAccount);
  const [formData, setFormData] = useState({
    name: '',
    jobNumber: '',
    jobId: '',
    description: '',
    accountType: 'chargeable' as AccountType,
    color: '#B8CCE4',
    budgetedHours: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount({
      ...formData,
      id: crypto.randomUUID(),
      isActive: true,
      isChargeable: formData.accountType === 'chargeable',
      group: formData.accountType,
      budgetedHours: formData.budgetedHours ? parseFloat(formData.budgetedHours) : undefined,
    });
    setFormData({
      name: '',
      jobNumber: '',
      jobId: '',
      description: '',
      accountType: 'chargeable',
      color: '#B8CCE4',
      budgetedHours: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Account Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Job Number</label>
        <input
          type="text"
          value={formData.jobNumber}
          onChange={(e) => setFormData({ ...formData, jobNumber: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Job ID</label>
        <input
          type="text"
          value={formData.jobId}
          onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <input
          type="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Budgeted Hours</label>
        <input
          type="number"
          step="0.5"
          min="0"
          value={formData.budgetedHours}
          onChange={(e) => setFormData({ ...formData, budgetedHours: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter budgeted hours"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="md:col-span-2 space-y-4">
        <label className="block text-sm font-medium text-gray-700">Account Type</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={formData.accountType === 'chargeable'}
              onChange={() => setFormData({ ...formData, accountType: 'chargeable' })}
              className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Chargeable Account</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={formData.accountType === 'non-chargeable'}
              onChange={() => setFormData({ ...formData, accountType: 'non-chargeable' })}
              className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Non-Chargeable Account</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={formData.accountType === 'extra'}
              onChange={() => setFormData({ ...formData, accountType: 'extra' })}
              className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Extra</span>
          </label>
        </div>
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full bg-[#4F81BD] text-white py-2 px-4 rounded-md hover:bg-[#385D8A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Account
        </button>
      </div>
    </form>
  );
};