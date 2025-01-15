import React, { useState } from 'react';
import { Search, Trash2, Edit2, X, Check } from 'lucide-react';
import { Account } from '../../types';
import { useAccountStore } from '../../store/useAccountStore';

interface AccountsTableProps {
  accounts: Account[];
}

export const AccountsTable: React.FC<AccountsTableProps> = ({ accounts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'chargeable' | 'non-chargeable' | 'extra'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Account>>({});
  
  const { updateAccount, deleteAccount } = useAccountStore();

  const handleEditStart = (account: Account) => {
    setEditingId(account.id);
    setEditForm({
      name: account.name,
      jobNumber: account.jobNumber,
      jobId: account.jobId,
      description: account.description,
      color: account.color,
      isChargeable: account.isChargeable,
      group: account.group,
      budgetedHours: account.budgetedHours,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditSave = (id: string) => {
    updateAccount(id, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleStatusChange = (accountId: string, isActive: boolean) => {
    updateAccount(accountId, { isActive });
  };

  const handleDelete = (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      deleteAccount(accountId);
    }
  };

  const getAccountType = (account: Account) => {
    if (account.group === 'extra') return 'Extra';
    return account.isChargeable ? 'Chargeable' : 'Non-Chargeable';
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.jobNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.jobId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'chargeable') return matchesSearch && account.isChargeable && account.group !== 'extra';
    if (filter === 'non-chargeable') return matchesSearch && !account.isChargeable && account.group !== 'extra';
    return matchesSearch && account.group === 'extra';
  });

  const renderEditableRow = (account: Account) => (
    <tr key={account.id}>
      <td className="px-4 py-3 whitespace-nowrap">
        <input
          type="color"
          value={editForm.color || account.color}
          onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
          className="w-10 h-8 rounded border-gray-300"
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <input
          type="text"
          value={editForm.name || ''}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <input
          type="text"
          value={editForm.jobNumber || ''}
          onChange={(e) => setEditForm({ ...editForm, jobNumber: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <input
          type="text"
          value={editForm.jobId || ''}
          onChange={(e) => setEditForm({ ...editForm, jobId: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <select
          value={editForm.group === 'extra' ? 'extra' : (editForm.isChargeable ? 'chargeable' : 'non-chargeable')}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'extra') {
              setEditForm({ ...editForm, group: 'extra' });
            } else {
              setEditForm({
                ...editForm,
                isChargeable: value === 'chargeable',
                group: value === 'chargeable' ? 'chargeable' : 'non-chargeable'
              });
            }
          }}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="chargeable">Chargeable</option>
          <option value="non-chargeable">Non-Chargeable</option>
          <option value="extra">Extra</option>
        </select>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <input
          type="number"
          step="0.5"
          min="0"
          value={editForm.budgetedHours || ''}
          onChange={(e) => setEditForm({ ...editForm, budgetedHours: parseFloat(e.target.value) })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <select
          value={account.isActive ? 'active' : 'inactive'}
          onChange={(e) => handleStatusChange(account.id, e.target.value === 'active')}
          className={`text-sm font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-offset-2 ${
            account.isActive
              ? 'bg-green-100 text-green-800 focus:ring-green-500'
              : 'bg-red-100 text-red-800 focus:ring-red-500'
          }`}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditSave(account.id)}
            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
            title="Save changes"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={handleEditCancel}
            className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-50"
            title="Cancel editing"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderRow = (account: Account) => (
    <tr key={account.id}>
      <td className="px-4 py-3 whitespace-nowrap">
        <div
          className="w-6 h-6 rounded"
          style={{ backgroundColor: account.color }}
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">{account.name}</td>
      <td className="px-4 py-3 whitespace-nowrap">{account.jobNumber}</td>
      <td className="px-4 py-3 whitespace-nowrap">{account.jobId}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        {getAccountType(account)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {account.budgetedHours || '-'}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <select
          value={account.isActive ? 'active' : 'inactive'}
          onChange={(e) => handleStatusChange(account.id, e.target.value === 'active')}
          className={`text-sm font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-offset-2 ${
            account.isActive
              ? 'bg-green-100 text-green-800 focus:ring-green-500'
              : 'bg-red-100 text-red-800 focus:ring-red-500'
          }`}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditStart(account)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
            title="Edit account"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(account.id)}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
            title="Delete account"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'chargeable' | 'non-chargeable' | 'extra')}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Accounts</option>
          <option value="chargeable">Chargeable</option>
          <option value="non-chargeable">Non-Chargeable</option>
          <option value="extra">Extra</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#DCE6F1]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Number</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budgeted Hours</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAccounts.map((account) => (
              editingId === account.id ? renderEditableRow(account) : renderRow(account)
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};