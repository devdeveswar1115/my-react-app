"use client";

import { useState } from 'react';

interface ImageUploadProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  folder: string;
}

export default function ImageUpload({ currentImageUrl, onUploadSuccess, folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    if (file.size > 900 * 1024) {
      setError('File is too large! Maximum size is 900KB. Please compress your image.');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUploadSuccess(base64String);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to process image. Try again.');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError('Failed to process image. Try again.');
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {currentImageUrl && (
        <div style={{ marginBottom: '0.5rem' }}>
          <img 
            src={currentImageUrl} 
            alt="Current" 
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} 
          />
        </div>
      )}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={uploading}
        style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
      />
      {uploading && <span style={{ fontSize: '0.875rem', color: '#3b82f6' }}>Uploading...</span>}
      {error && <span style={{ fontSize: '0.875rem', color: '#ef4444' }}>{error}</span>}
    </div>
  );
}
