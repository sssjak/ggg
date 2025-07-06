import React from 'react';
import type { GalleryVideo } from '../types';
import Editable from './Editable';
import { icons } from '../constants';

interface VideoGalleryProps {
  videos: GalleryVideo[];
  isEditing: boolean;
  onItemChange: (value: Partial<GalleryVideo>, index: number) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos, isEditing, onItemChange, onAddItem, onDeleteItem }) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE_MB = 50;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Video file is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedMimeTypes.includes(file.type)) {
      alert(`Invalid file type. Allowed types: MP4, WebM, OGG.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      onItemChange({ url: base64Url, fileName: file.name }, index);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg mb-8" role="alert">
        <p>
          <strong className="font-bold">Note:</strong> Uploading large videos may impact performance. For a production site, using a dedicated video hosting service like YouTube or Vimeo is recommended.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <div key={index} className="relative group bg-secondary rounded-lg overflow-hidden shadow-md border border-gray-800 flex flex-col">
            <div className="aspect-w-16 aspect-h-9 bg-black">
              {video.url ? (
                <video src={video.url} controls className="w-full h-full object-cover"></video>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary">
                  <div className="w-12 h-12">{icons.video}</div>
                  <p className="mt-2 text-sm">No video uploaded</p>
                </div>
              )}
            </div>

            {isEditing && (
              <button
                onClick={() => onDeleteItem(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700 transition-colors z-10 opacity-70 group-hover:opacity-100"
                aria-label="Delete video"
              >&times;</button>
            )}

            <div className="p-4 flex-grow flex flex-col">
              <Editable
                as="p"
                isEditing={isEditing}
                value={video.caption}
                onChange={(value) => onItemChange({ caption: value }, index)}
                className="text-sm text-text-secondary flex-grow"
                textareaClassName="text-sm text-text-secondary bg-gray-700/80 w-full"
              />
              {isEditing && (
                <div className="mt-3">
                  <label htmlFor={`video-upload-${index}`} className="cursor-pointer text-center block w-full bg-accent text-white text-xs font-semibold py-2 px-2 rounded-md hover:bg-violet-500 transition-colors">
                    Upload Video
                  </label>
                  <input type="file" id={`video-upload-${index}`} className="hidden" accept="video/mp4,video/webm,video/ogg" onChange={(e) => handleFileChange(e, index)} />
                  <p className="text-xs text-text-secondary mt-1 text-center">Max 50MB</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {isEditing && (
          <button
            onClick={onAddItem}
            className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg shadow-md border-2 border-dashed border-gray-700 text-text-secondary hover:border-accent hover:text-accent transition-all duration-300 min-h-[250px]"
            aria-label="Add new video"
          >
            <div className="w-8 h-8 mb-2">{icons.add}</div>
            <span className="font-medium">Add Video</span>
          </button>
        )}
      </div>
    </>
  );
};

export default VideoGallery;
