import React, { useState, useRef } from 'react';
import { Calendar as CalendarIcon, User, Plus, X } from 'lucide-react';
import { format, startOfToday } from 'date-fns';
import { useUserStore } from '../../store/useUserStore';
import { useEventStore } from '../../store/useEventStore';
import { MiniCalendar } from './MiniCalendar';

const positions = [
    { id: 'graduate', label: 'Graduate' },
    { id: 'client-executive', label: 'Client Executive' },
    { id: 'snr-client-executive', label: 'Snr Client Executive' },
    { id: 'client-manager', label: 'Client Manager' },
    { id: 'associate-director', label: 'Associate Director' },
    { id: 'director', label: 'Director' },
];

export const HomeLeftSidebar: React.FC = () => {
  const { name, avatarUrl, updateName, position, updateAvatar, updatePosition } = useUserStore();
  const { events, addEvent, removeEvent } = useEventStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(startOfToday(), 'yyyy-MM-dd'),
    type: 'personal' as const,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameSubmit = () => {
    updateName(editedName);
    setIsEditing(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEvent = () => {
    addEvent(newEvent);
    setNewEvent({
      title: '',
      date: format(startOfToday(), 'yyyy-MM-dd'),
      type: 'personal',
    });
    setShowEventForm(false);
  };

  const setSelectedPosition = (newPosition) => {
    updatePosition(newPosition);
  }

  return (
    <div className="w-80 space-y-6">
      {/* User Profile */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div 
            className="relative w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-xs text-white">Change</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="flex-1">
            <div>
              {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleNameSubmit}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(name);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="font-medium text-lg cursor-pointer hover:text-blue-600"
                onClick={() => setIsEditing(true)}
              >
                {name}
              </div>
            )}
            </div>
            <div>
              <select
                value={position}
                onChange={e => setSelectedPosition(e.target.value)}
              >
                {positions.map(({id, label}) => (<option key={id} value={id}>{label}</option>))}
              </select>
            </div>
            <div className="text-sm text-gray-500">Welcome back!</div>
          </div>
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium">Today</h3>
        </div>
        <div className="text-2xl font-bold text-[#4F81BD]">
          {format(new Date(), 'MMMM d, yyyy')}
        </div>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE')}
        </div>
      </div>

      {/* Calendar Widget */}
      <MiniCalendar />

      {/* Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Upcoming Events</h3>
          <button
            onClick={() => setShowEventForm(true)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Plus className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {showEventForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="holiday">Holiday</option>
              <option value="company">Company Event</option>
              <option value="personal">Personal</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEventForm(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-3 py-1 text-sm bg-[#4F81BD] text-white rounded hover:bg-[#385D8A]"
              >
                Add Event
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {events
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(event.date), 'MMM d, yyyy')}
                  </div>
                </div>
                <button
                  onClick={() => removeEvent(event.id)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};