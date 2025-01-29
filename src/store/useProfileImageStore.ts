import { create } from 'zustand';
import { db } from '../db/db';

interface ProfileImageStore {
  uploadProfileImage: (file: File) => Promise<string>;
  getProfileImage: (id: string) => Promise<string | null>;
  validateImage: (file: File) => Promise<{ isValid: boolean; error?: string }>;
}

export const useProfileImageStore = create<ProfileImageStore>()((set, get) => ({
  validateImage: async (file: File) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, or GIF image.'
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size too large. Maximum size is 5MB.'
      };
    }

    return { isValid: true };
  },

  uploadProfileImage: async (file: File) => {
    try {
      // Validate the image
      const validation = await get().validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Convert to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert image to base64'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      // Store in IndexedDB
      const imageData = {
        id: 'profile-image', // We'll use a fixed ID since we only need one profile image
        data: base64Data,
        type: file.type,
        updatedAt: new Date().toISOString()
      };

      await db.profileImages.put(imageData);
      return base64Data;
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      throw error;
    }
  },

  getProfileImage: async (id: string) => {
    try {
      const image = await db.profileImages.get(id);
      return image?.data || null;
    } catch (error) {
      console.error('Failed to get profile image:', error);
      return null;
    }
  }
})); 