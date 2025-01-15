import React, { useState, useRef } from 'react';
import { Link, Edit2, Check, X, Upload } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { useResourceStore } from '../../store/useResourceStore';

interface ProfileOverviewProps {
  onTabChange: (tab: string) => void;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ onTabChange }) => {
  const { name, position, updateName } = useUserStore();
  const { resources } = useResourceStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);

  // Get the 5 most recent resources
  const recentResources = [...resources]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleNameSubmit = () => {
    updateName(editedName);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full text-center px-2 py-1 border rounded"
                autoFocus
              />
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleNameSubmit}
                  className="p-1 text-green-600 hover:text-green-700"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(name);
                  }}
                  className="p-1 text-gray-600 hover:text-gray-700"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <h2 className="text-xl font-bold">{name}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -right-6 top-1 p-1 text-gray-400 hover:text-gray-600"
                title="Edit name"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <p className="text-gray-500 mt-1">{position}</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => onTabChange('traffic-light')}
            className="block w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-center"
          >
            Traffic Light Assessment
          </button>
          <button 
            onClick={() => onTabChange('smart-goals')}
            className="block w-full py-2 px-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-center"
          >
            Smart Goals
          </button>
        </div>
      </div>

      {/* Quote Image Container */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Inspirational Quote</h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Change Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
          <img
            src={customImage || "https://raw.githubusercontent.com/yourusername/yourrepo/main/quote.jpg"}
            alt="Inspirational Quote"
            className="w-full h-full object-cover"
          />
          {customImage && (
            <button
              onClick={() => setCustomImage(null)}
              className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white"
              title="Reset to default quote"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Recent Resources */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Link className="w-5 h-5" />
          Recent Resources
        </h3>

        <div className="space-y-3">
          {recentResources.length > 0 ? (
            recentResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Link className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{resource.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {resource.type === 'url' ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Open
                  </a>
                ) : (
                  <a
                    href={resource.data}
                    download={resource.name}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Download
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No resources added yet
            </div>
          )}

          <button
            onClick={() => onTabChange('resources')}
            className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 mt-4"
          >
            View all resources →
          </button>
        </div>
      </div>
    </div>
  );
};