import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { useSmartGoalsStore, SmartGoal } from '../../store/useSmartGoalsStore';
import { SmartGoalModal } from './SmartGoalModal';

export const SmartGoalsPage: React.FC = () => {
  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});
  const [editingGoal, setEditingGoal] = useState<SmartGoal | null>(null);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const { goals, addGoal, updateGoal, toggleMilestone, deleteGoal } = useSmartGoalsStore();

  const handleSubmit = (goalData: Omit<SmartGoal, 'id' | 'createdAt'>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
      setModalStates(prev => ({
        ...prev,
        [editingGoal.id]: false
      }));
    } else {
      addGoal({
        ...goalData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
      setModalStates(prev => ({
        ...prev,
        new: false
      }));
    }
    setEditingGoal(null);
  };

  const handleEdit = (goal: SmartGoal) => {
    setEditingGoal(goal);
    setModalStates(prev => ({
      ...prev,
      [goal.id]: true
    }));
  };

  const handleCloseModal = () => {
    setModalStates({});
    setEditingGoal(null);
  };

  const handleAddNewClick = () => {
    setEditingGoal(null);
    setModalStates(prev => ({
      ...prev,
      new: true
    }));
  };

  const calculateProgress = (milestones: SmartGoal['milestones']) => {
    if (milestones.length === 0) return 0;
    return Math.round(
      (milestones.filter((m) => m.isCompleted).length / milestones.length) * 100
    );
  };

  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">SMART Goals</h1>
      </div>

      <div className="space-y-4">
        {/* Goals Grid */}
        <div className="grid grid-cols-1 gap-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-lg shadow">
              {/* Header - Always Visible */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleGoalExpansion(goal.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expandedGoalId === goal.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      <p className="text-sm text-gray-500">{goal.areaOfFocus}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-600">
                      {calculateProgress(goal.milestones)}% Complete
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(goal);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteGoal(goal.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedGoalId === goal.id && (
                <div className="px-4 pb-4 pt-2 border-t">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Actions</h4>
                      <div className="space-y-2">
                        {goal.actions.map((action) => (
                          <div
                            key={action.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5" />
                            <span>{action.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Milestones</h4>
                      <div className="space-y-2">
                        {goal.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <button
                              onClick={() => toggleMilestone(goal.id, milestone.id)}
                              className={`w-4 h-4 border rounded flex items-center justify-center ${
                                milestone.isCompleted
                                  ? 'bg-blue-500 border-blue-500 text-white'
                                  : 'border-gray-300'
                              }`}
                            >
                              {milestone.isCompleted && <Check className="w-3 h-3" />}
                            </button>
                            <span
                              className={
                                milestone.isCompleted ? 'line-through text-gray-400' : ''
                              }
                            >
                              {milestone.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    Due: {new Date(goal.dueDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Goal Button - Now centered below goals */}
        <div className="flex justify-center">
          <button
            onClick={handleAddNewClick}
            className="w-full max-w-3xl flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Goal
          </button>
        </div>
      </div>

      {goals.map(goal => (
        <SmartGoalModal
          key={goal.id}
          isOpen={!!modalStates[goal.id]}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={goal}
        />
      ))}

      <SmartGoalModal
        isOpen={!!modalStates.new}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={undefined}
      />
    </div>
  );
};