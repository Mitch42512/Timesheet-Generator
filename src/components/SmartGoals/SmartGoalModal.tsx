import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SmartGoal } from '../../store/useSmartGoalsStore';

interface SmartGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<SmartGoal, 'id' | 'createdAt'>) => void;
  initialData?: SmartGoal;
}

export const SmartGoalModal: React.FC<SmartGoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<Omit<SmartGoal, 'id' | 'createdAt'>>({
    name: '',
    areaOfFocus: '',
    currentState: '',
    futureState: '',
    dueDate: '',
    actions: [],
    milestones: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        areaOfFocus: initialData.areaOfFocus,
        currentState: initialData.currentState,
        futureState: initialData.futureState,
        dueDate: initialData.dueDate,
        actions: initialData.actions,
        milestones: initialData.milestones,
      });
    } else {
      setFormData({
        name: '',
        areaOfFocus: '',
        currentState: '',
        futureState: '',
        dueDate: '',
        actions: [],
        milestones: [],
      });
    }
  }, [initialData]);

  const [newAction, setNewAction] = useState('');
  const [newMilestone, setNewMilestone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addAction = () => {
    if (newAction.trim()) {
      setFormData({
        ...formData,
        actions: [
          ...formData.actions,
          { id: crypto.randomUUID(), text: newAction.trim(), isCompleted: false },
        ],
      });
      setNewAction('');
    }
  };

  const addMilestone = () => {
    if (newMilestone.trim()) {
      setFormData({
        ...formData,
        milestones: [
          ...formData.milestones,
          { id: crypto.randomUUID(), text: newMilestone.trim(), isCompleted: false },
        ],
      });
      setNewMilestone('');
    }
  };

  const removeAction = (id: string) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter(action => action.id !== id),
    });
  };

  const removeMilestone = (id: string) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter(milestone => milestone.id !== id),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {initialData ? 'Edit Goal' : 'Add New Goal'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area of Focus
              </label>
              <input
                type="text"
                value={formData.areaOfFocus}
                onChange={(e) => setFormData({ ...formData, areaOfFocus: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current State
              </label>
              <textarea
                value={formData.currentState}
                onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Future State
              </label>
              <textarea
                value={formData.futureState}
                onChange={(e) => setFormData({ ...formData, futureState: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actions
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="Add a new action"
                  onKeyPress={(e) => e.key === 'Enter' && addAction()}
                />
                <button
                  type="button"
                  onClick={addAction}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.actions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                  >
                    <span>{action.text}</span>
                    <button
                      type="button"
                      onClick={() => removeAction(action.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Milestones
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="Add a new milestone"
                  onKeyPress={(e) => e.key === 'Enter' && addMilestone()}
                />
                <button
                  type="button"
                  onClick={addMilestone}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                  >
                    <span>{milestone.text}</span>
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {initialData ? 'Save Changes' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};