import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, User, Plus, X, Upload } from 'lucide-react';
import { format, startOfToday } from 'date-fns';
import { useUserStore } from '../../store/useUserStore';
import { useEventStore } from '../../store/useEventStore';
import { MiniCalendar } from './MiniCalendar';
import { useProfileImageStore } from '../../store/useProfileImageStore';
import { useLiveQuery } from 'dexie-react-hooks';

const positions = [
    { id: 'graduate', label: 'Graduate' },
    { id: 'client-executive', label: 'Client Executive' },
    { id: 'snr-client-executive', label: 'Snr Client Executive' },
    { id: 'client-manager', label: 'Client Manager' },
    { id: 'senior-client-manager', label: 'Senior Client Manager' },
    { id: 'associate-director', label: 'Associate Director' },
];

const getEventColor = (type: 'holiday' | 'company' | 'personal') => {
  switch (type) {
    case 'holiday':
      return 'bg-green-100 text-green-800';
    case 'company':
      return 'bg-orange-100 text-orange-800';
    case 'personal':
      return 'bg-blue-100 text-blue-800';
  }
};

export const HomeLeftSidebar: React.FC = () => {
  const { name, position, updateName, updatePosition, loadUserProfile, initialized } = useUserStore();
  const { events, addEvent, removeEvent, loadEvents } = useEventStore();
  const { uploadProfileImage, getProfileImage } = useProfileImageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(startOfToday(), 'yyyy-MM-dd'),
    type: 'personal' as const,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load user profile and events on mount
  useEffect(() => {
    if (!initialized) {
      loadUserProfile();
    }
    loadEvents();
  }, [initialized, loadUserProfile, loadEvents]);

  // Use live query to get the profile image
  const profileImage = useLiveQuery(
    async () => await getProfileImage('profile-image'),
    []
  );

  const handleNameSubmit = async () => {
    try {
      setIsUpdating(true);
      await updateName(editedName);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update name:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      await uploadProfileImage(file);
      // The image will be automatically updated through the live query
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
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

  const setSelectedPosition = async (newPosition: string) => {
    try {
      setIsUpdating(true);
      await updatePosition(newPosition);
    } catch (error) {
      console.error('Failed to update position:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!initialized) {
    return <div>Loading...</div>;
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
            {profileImage ? (
              <img src={profileImage} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-xs text-white">Change</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageUpload}
          />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                  autoFocus
                  disabled={isUpdating}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleNameSubmit}
                    className="text-sm text-green-600 hover:text-green-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(name);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-700"
                    disabled={isUpdating}
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
            <select
              value={position}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="mt-1 text-sm text-gray-500 border-none bg-transparent focus:ring-0"
              disabled={isUpdating}
            >
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.label}
                </option>
              ))}
            </select>
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
                className={`flex items-center justify-between p-3 rounded-lg ${getEventColor(event.type)}`}
              >
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm opacity-75">
                    {format(new Date(event.date), 'MMM d, yyyy')}
                  </div>
                </div>
                {!event.isDefault && (
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};