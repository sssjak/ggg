import React from 'react';
import type { Document } from '../types';
import { icons } from '../constants';
import Editable from './Editable';

interface DocumentsProps {
  hasAccess: boolean;
  documents: Document[];
  isEditing: boolean;
  onRequestAccess: () => void;
  onDocChange: (value: Partial<Document>, index: number) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
}

const Documents: React.FC<DocumentsProps> = ({ hasAccess, documents, isEditing, onRequestAccess, onDocChange, onAddItem, onDeleteItem }) => {
  if (!hasAccess) {
    return (
      <div className="text-center p-10 bg-secondary rounded-lg shadow-lg border border-gray-800">
        <div className="w-16 h-16 mx-auto text-highlight mb-4">{icons.lock}</div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">Secure Section</h3>
        <p className="text-text-secondary mb-6">This area contains sensitive personal documents and requires a password for access.</p>
        <button
          onClick={onRequestAccess}
          className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-violet-500 transition-colors duration-300"
        >
          Enter Password to View
        </button>
      </div>
    );
  }
  
  const DocumentItem: React.FC<{doc: Document, index: number}> = ({ doc, index }) => {
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // --- File Validation ---
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      
      const allowedMimeTypes: {[key: string]: string[]} = {
        photo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        nid: ['image/jpeg', 'image/png', 'image/webp'],
        cv: ['application/pdf'],
        bank: ['application/pdf', 'image/jpeg', 'image/png'],
        other: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
      };
      
      const allowedTypes = allowedMimeTypes[doc.type];
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type for "${doc.name}". Allowed types: ${allowedTypes.join(', ')}`);
        return;
      }

      // --- File Reading ---
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        onDocChange({
          url: base64Url,
          preview: file.type.startsWith('image/') ? base64Url : doc.preview,
          fileName: file.name,
        }, index);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Sorry, there was an error uploading the file.");
      };
      reader.readAsDataURL(file);
    };

    const hasRealFile = doc.url.startsWith('data:');

    const handleDownload = () => {
      // Prevent download if in editing mode or if there's no real file to download
      if (isEditing || !hasRealFile) {
        if (!isEditing && !hasRealFile) {
            alert("No file has been uploaded for this item. Please upload a file in edit mode.");
        }
        return;
      }
      
      // Programmatically create and click a link to trigger the download.
      // This is a robust method that works across browsers for data URLs.
      const link = document.createElement("a");
      link.href = doc.url;
      link.download = doc.fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const isImagePreview = hasRealFile && doc.url.startsWith('data:image/');

    const getIconForType = () => {
      const fileName = doc.fileName?.toLowerCase() || '';
      if (fileName.endsWith('.pdf') || doc.type === 'cv') return icons.pdf;
      if (doc.type === 'photo' || doc.type === 'nid') return icons.image_file;
      return icons.document;
    };
    
    const UploadGuidelines = () => {
        const types = {
            photo: 'Image only',
            nid: 'Image only',
            cv: 'PDF only',
            bank: 'Image or PDF',
            other: 'Image or PDF',
        };
        return <p className="text-xs text-text-secondary mt-2 text-center">{types[doc.type]}, max {MAX_FILE_SIZE_MB}MB.</p>
    }

    const PreviewContent = () => {
      // If we have an uploaded image, show it
      if (isImagePreview) {
        return <img src={doc.url} alt={doc.name} className="w-full h-40 object-cover" />;
      }
      // If we have a non-image file uploaded, show its icon
      if (hasRealFile) {
        return (
          <div className="w-full h-40 bg-primary flex items-center justify-center text-highlight">
            <div className="w-16 h-16">{getIconForType()}</div>
          </div>
        );
      }
      // Otherwise, show the placeholder image from initial data
      return <img src={doc.preview} alt={doc.name} className="w-full h-40 object-cover" />;
    };

    return (
      <div
        onClick={handleDownload}
        className={`relative group flex flex-col bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-800 ${!isEditing && hasRealFile ? 'cursor-pointer' : 'cursor-default'}`}
        aria-label={!isEditing && hasRealFile ? `Download ${doc.name}` : doc.name}
      >
        {isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent the download handler on the parent div
              onDeleteItem(index);
            }}
            className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700 transition-colors z-20 opacity-70 group-hover:opacity-100"
            aria-label={`Delete ${doc.name}`}
          >
            &times;
          </button>
        )}

        <div className="relative w-full h-40">
            <PreviewContent />
            {!isEditing && hasRealFile && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                    <div className="w-10 h-10">{icons.download}</div>
                    <span className="font-bold mt-1">Download</span>
                </div>
            )}
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <Editable
            as="p"
            isEditing={isEditing}
            value={doc.name}
            onChange={(value) => onDocChange({ name: value }, index)}
            className="font-semibold text-text-primary truncate"
            textareaClassName="font-semibold text-text-primary bg-gray-700/80 w-full"
          />
          <p className="text-sm text-text-secondary capitalize flex-grow">{doc.type}</p>
          {isEditing && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}> {/* Stop propagation to prevent div's onClick */}
              <label
                htmlFor={`doc-upload-${index}`}
                className="cursor-pointer text-center block w-full bg-accent text-white text-xs font-semibold py-2 px-2 rounded-md hover:bg-violet-500 transition-colors"
              >
                Upload New File
              </label>
              <input
                type="file"
                id={`doc-upload-${index}`}
                className="hidden"
                onChange={handleFileChange}
              />
              <UploadGuidelines />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg mb-8" role="alert">
          <p><strong className="font-bold">Persistent Storage:</strong> All changes, including file uploads, are saved to your browser's local storage.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {documents.map((doc, index) => (
          <DocumentItem doc={doc} index={index} key={index} />
        ))}
        {isEditing && (
           <button
            onClick={onAddItem}
            className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg shadow-md border-2 border-dashed border-gray-700 text-text-secondary hover:border-accent hover:text-accent transition-all duration-300 min-h-[260px]"
            aria-label="Add new document"
          >
            <div className="w-8 h-8 mb-2">{icons.add}</div>
            <span className="font-medium">Add Document</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Documents;