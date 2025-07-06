import React from 'react';
import type { Education } from '../types';
import Editable from './Editable';
import { icons } from '../constants';

interface EducationProps {
  items: Education[];
  isEditing: boolean;
  onItemChange: (value: Partial<Education>, index: number) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
}

const Education: React.FC<EducationProps> = ({ items, isEditing, onItemChange, onAddItem, onDeleteItem }) => {
  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <div key={index} className="relative group p-6 bg-secondary rounded-lg shadow-md border border-gray-800">
          {isEditing && (
             <button
              onClick={() => onDeleteItem(index)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700 transition-colors z-10 opacity-70 group-hover:opacity-100"
              aria-label={`Delete ${item.degree}`}
            >
              &times;
            </button>
          )}
          <Editable 
            as="h3"
            isEditing={isEditing}
            value={item.degree}
            onChange={(value) => onItemChange({ degree: value }, index)}
            className="text-xl font-bold text-highlight"
            textareaClassName="text-xl font-bold text-highlight"
          />
          <Editable 
            as="p"
            isEditing={isEditing}
            value={`${item.institution} - ${item.year}`}
            onChange={(value) => {
              const parts = value.split(' - ');
              onItemChange({ institution: parts[0] || '', year: parts[1] || '' }, index);
            }}
            className="text-text-secondary"
            textareaClassName="text-text-secondary"
          />
        </div>
      ))}
      {isEditing && (
        <button
          onClick={onAddItem}
          className="w-full flex items-center justify-center gap-2 text-center p-6 bg-secondary rounded-lg shadow-md border-2 border-dashed border-gray-700 text-text-secondary hover:border-accent hover:text-accent transition-all duration-300"
          aria-label="Add new education entry"
        >
          <div className="w-6 h-6">{icons.add}</div>
          Add Education
        </button>
      )}
    </div>
  );
};

export default Education;