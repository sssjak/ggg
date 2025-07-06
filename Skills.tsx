import React from 'react';
import type { Skill } from '../types';
import Editable from './Editable';
import { icons } from '../constants';

interface SkillsProps {
  skills: Skill[];
  isEditing: boolean;
  onItemChange: (value: Partial<Skill>, index: number) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
}

const Skills: React.FC<SkillsProps> = ({ skills, isEditing, onItemChange, onAddItem, onDeleteItem }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {skills.map((skill, index) => (
        <div key={index} className="relative group h-full flex flex-col items-center justify-start p-6 bg-secondary rounded-lg shadow-md hover:shadow-xl hover:bg-gray-800/60 transition-all duration-300 border border-gray-800 hover:border-accent">
          {isEditing && (
            <button
              onClick={() => onDeleteItem(index)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700 transition-colors z-10 opacity-70 group-hover:opacity-100"
              aria-label={`Delete ${skill.name}`}
            >
              &times;
            </button>
          )}
          <div className="text-accent mb-4 w-10 h-10 flex-shrink-0">{icons[skill.icon]}</div>
          <Editable
            as="p"
            isEditing={isEditing}
            value={skill.name}
            onChange={(value) => onItemChange({ name: value }, index)}
            className="text-center font-semibold text-lg text-text-primary"
            textareaClassName="text-center font-semibold text-lg text-text-primary bg-gray-700/80 w-full"
           />
           <Editable
            as="p"
            isEditing={isEditing}
            value={skill.description}
            onChange={(value) => onItemChange({ description: value }, index)}
            className="text-center text-sm text-text-secondary mt-2 flex-grow"
            textareaClassName="text-center text-sm text-text-secondary bg-gray-700/80 w-full mt-2"
            maxLength={500}
           />
        </div>
      ))}
      {isEditing && (
        <button
          onClick={onAddItem}
          className="flex flex-col items-center justify-center p-6 bg-secondary rounded-lg shadow-md border-2 border-dashed border-gray-700 text-text-secondary hover:border-accent hover:text-accent transition-all duration-300 min-h-[180px]"
          aria-label="Add new skill"
        >
          <div className="w-10 h-10 mb-2">{icons.add}</div>
          <span className="font-medium">Add Skill</span>
        </button>
      )}
    </div>
  );
};

export default Skills;