import React, { useState } from 'react';
import { Link, Upload, Trash2, ExternalLink, Edit2, X, Check } from 'lucide-react';
import { useResourceStore } from '../../store/useResourceStore';

export const ResourcesPage: React.FC = () => {
  const { resources, addResource, removeResource, updateResource } = useResourceStore();
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', url: '' });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.trim() && newTitle.trim()) {
      addResource({
        id: crypto.randomUUID(),
        type: 'url',
        name: newTitle,
        url: newUrl,
        createdAt: new Date().toISOString(),
      });
      setNewUrl('');
      setNewTitle('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addResource({
          id: crypto.randomUUID(),
          type: 'file',
          name: file.name,
          data: reader.result as string,
          createdAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditStart = (resource: any) => {
    setEditingId(resource.id);
    setEditForm({
      name: resource.name,
      url: resource.url || '',
    });
  };

  const handleEditSave = (id: string) => {
    updateResource(id, editForm);
    setEditingId(null);
    setEditForm({ name: '', url: '' });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ name: '', url: '' });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Resources</h1>

      {/* Add Resources Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Add URL */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Link className="w-5 h-5" />
            Add URL Resource
          </h2>
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter resource title"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter URL"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add URL
            </button>
          </form>
        </div>

        {/* Upload File */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload File
          </h2>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PDF, DOC, DOCX, XLS, XLSX</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
          />
        </div>
      </div>

      {/* Resources List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your Resources</h2>
          <div className="space-y-4">
            {resources.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No resources added yet</p>
            ) : (
              resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  {editingId === resource.id ? (
                    <div className="flex-1 flex items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-1 border rounded"
                          placeholder="Resource name"
                        />
                        {resource.type === 'url' && (
                          <input
                            type="url"
                            value={editForm.url}
                            onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                            className="w-full px-3 py-1 border rounded"
                            placeholder="URL"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSave(resource.id)}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="p-1 text-gray-600 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        {resource.type === 'url' ? (
                          <ExternalLink className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Upload className="w-5 h-5 text-green-500" />
                        )}
                        <div>
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-sm text-gray-500">
                            Added on {new Date(resource.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {resource.type === 'url' ? (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600"
                          >
                            Open Link
                          </a>
                        ) : (
                          <a
                            href={resource.data}
                            download={resource.name}
                            className="text-green-500 hover:text-green-600"
                          >
                            Download
                          </a>
                        )}
                        <button
                          onClick={() => handleEditStart(resource)}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => removeResource(resource.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};