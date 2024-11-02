import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Utility function to convert speech model to readable name
export const getReadableVoiceName = (model: string): string => {
  const voiceMap: { [key: string]: string } = {
    'en-US-Standard-A': 'English US - Female (A)',
    'en-US-Standard-B': 'English US - Male (B)',
    'en-US-Standard-C': 'English US - Female (C)',
    'en-US-Standard-D': 'English US - Male (D)',
    'en-US-Standard-E': 'English US - Female (E)',
    'en-US-Standard-F': 'English US - Female (F)',
    'en-US-Standard-G': 'English US - Female (G)',
    'en-US-Standard-H': 'English US - Female (H)',
    'en-US-Standard-I': 'English US - Male (I)',
    'en-US-Standard-J': 'English US - Male (J)',
  };

  return voiceMap[model] || model; // Return the model itself if not found
};
