
import React, { useState } from 'react';
import type { GalleryImage } from '../types';
import Editable from './Editable';
import { icons } from '../constants';

// --- Helper Function ---
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


// --- Lightbox Component ---
interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  const image = images[currentIndex];
  if (!image) return null;

  const handleDownload = () => {
    if (!image.url || !image.url.startsWith('data:')) return;
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.fileName || 'gallery-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60]"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white text-4xl hover:text-highlight transition-colors"
        onClick={onClose}
        aria-label="Close"
      >&times;</button>
      
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl p-4 hover:text-highlight transition-colors"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous image"
      >&#8249;</button>

      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl p-4 hover:text-highlight transition-colors"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next image"
      >&#8250;</button>

      <div className="relative max-w-4xl max-h-[90vh] w-full p-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex-grow flex items-center justify-center">
          <img src={image.url} alt={image.caption} className="max-h-[80vh] w-auto mx-auto object-contain" />
        </div>
        <div className="flex-shrink-0 text-center text-white mt-4 flex items-center justify-center gap-4">
          {image.caption && <p className="flex-grow text-center">{image.caption}</p>}
          {image.url.startsWith('data:') && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/80 hover:bg-accent rounded-lg transition-colors text-sm"
              title={`Download ${image.fileName}`}
            >
              {icons.download}
              <span>Download</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// --- ImageGallery Component ---
interface ImageGalleryProps {
  images: GalleryImage[];
  isEditing: boolean;
  onItemChange: (value: Partial<GalleryImage>, index: number) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isEditing, onItemChange, onAddItem, onDeleteItem }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    if (!isEditing) {
      setLightboxIndex(index);
    }
  };
  
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
  const prevImage = () => setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE_MB = 10;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Image is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.type)) {
      alert(`Invalid file type. Allowed types: JPG, PNG, GIF, WEBP.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      onItemChange({
        url: base64Url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }, index);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group bg-secondary rounded-lg overflow-hidden shadow-md border border-gray-800 flex flex-col">
            <div 
              className={`aspect-w-4 aspect-h-3 ${!isEditing ? 'cursor-pointer' : ''}`}
              onClick={() => openLightbox(index)}
            >
              <img src={image.url} alt={image.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {!isEditing && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-bold"><p>View</p></div>}
            </div>
            
            {isEditing && (
              <button
                onClick={() => onDeleteItem(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700 transition-colors z-10 opacity-70 group-hover:opacity-100"
                aria-label="Delete image"
              >&times;</button>
            )}

            <div className="p-3 flex-grow flex flex-col">
              <Editable
                as="p"
                isEditing={isEditing}
                value={image.caption}
                onChange={(value) => onItemChange({ caption: value }, index)}
                className="text-sm text-text-primary flex-grow"
                textareaClassName="text-sm text-text-primary bg-gray-700/80 w-full"
              />
              {image.fileType && image.fileSize ? (
                 <div className="text-xs text-text-secondary mt-1 font-mono">
                    <span>{image.fileType.split('/')[1] || image.fileType}</span>
                    <span className="mx-1">|</span>
                    <span>{formatBytes(image.fileSize)}</span>
                </div>
              ) : <div className="text-xs text-text-secondary mt-1 font-mono h-[16px]"></div>}
              {isEditing && (
                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                  <label htmlFor={`img-upload-${index}`} className="cursor-pointer text-center block w-full bg-accent text-white text-xs font-semibold py-2 px-2 rounded-md hover:bg-violet-500 transition-colors">
                    Upload Image
                  </label>
                  <input type="file" id={`img-upload-${index}`} className="hidden" accept="image/jpeg,image/png,image/gif,image/webp" onChange={(e) => handleFileChange(e, index)} />
                  <p className="text-xs text-text-secondary mt-1 text-center">JPG, PNG, GIF, WEBP - Max 10MB</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {isEditing && (
          <button
            onClick={onAddItem}
            className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg shadow-md border-2 border-dashed border-gray-700 text-text-secondary hover:border-accent hover:text-accent transition-all duration-300 min-h-[250px]"
            aria-label="Add new image"
          >
            <div className="w-8 h-8 mb-2">{icons.add}</div>
            <span className="font-medium">Add Image</span>
          </button>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
};

export default ImageGallery;