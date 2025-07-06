import React from 'react';
import type { TimelineEvent } from '../types';
import Editable from './Editable';
import { icons } from '../constants';

interface TimelineProps {
  events: TimelineEvent[];
  isEditing: boolean;
  onEventChange: (value: Partial<TimelineEvent>, index: number) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, isEditing, onEventChange, onAddItem, onDeleteItem }) => {
  return (
    <div className="relative border-l-2 border-accent/30 ml-6 md:ml-0">
      {events.map((event, index) => (
        <div key={index} className="mb-10 ml-8 relative group">
          <span className="absolute flex items-center justify-center w-8 h-8 bg-highlight rounded-full -left-4 ring-8 ring-primary text-primary font-bold">
            {index + 1}
          </span>
          <div className="relative p-4 bg-secondary rounded-lg shadow-md border border-gray-800">
            {isEditing && (
              <button
                onClick={() => onDeleteItem(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700 transition-colors z-10 opacity-70 group-hover:opacity-100"
                aria-label={`Delete ${event.title}`}
              >
                &times;
              </button>
            )}
            <Editable 
              as="h3"
              isEditing={isEditing}
              value={event.title}
              onChange={(value) => onEventChange({ title: value }, index)}
              className="text-lg font-semibold text-text-primary"
              textareaClassName="text-lg font-semibold text-text-primary"
            />
             <Editable 
              as="time"
              isEditing={isEditing}
              value={event.year}
              onChange={(value) => onEventChange({ year: value }, index)}
              className="block mb-2 text-sm font-normal leading-none text-text-secondary"
              textareaClassName="block mb-2 text-sm font-normal leading-none text-text-secondary"
            />
            <Editable 
              as="p"
              isEditing={isEditing}
              value={event.description}
              onChange={(value) => onEventChange({ description: value }, index)}
              className="text-base font-normal text-text-secondary"
               textareaClassName="text-base font-normal text-text-secondary"
            />
          </div>
        </div>
      ))}
       {isEditing && (
        <div className="ml-8">
          <button
            onClick={onAddItem}
            className="w-full flex items-center justify-center gap-2 text-center p-4 bg-secondary rounded-lg shadow-md border-2 border-dashed border-gray-700 text-text-secondary hover:border-accent hover:text-accent transition-all duration-300"
            aria-label="Add new timeline event"
          >
             <div className="w-6 h-6">{icons.add}</div>
            Add Event
          </button>
        </div>
      )}
    </div>
  );
};

export default Timeline;