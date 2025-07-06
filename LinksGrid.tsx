import React from 'react';
import type { Link } from '../types';
import { icons } from '../constants';

interface LinksGridProps {
  links: Link[];
  isEditing?: boolean;
  onLinkChange?: (value: Partial<Link>, index: number) => void;
  onAddItem?: () => void;
  onDeleteItem?: (index: number) => void;
  itemType?: string;
}

const LinksGrid: React.FC<LinksGridProps> = ({ links, isEditing = false, onLinkChange = () => {}, onAddItem = () => {}, onDeleteItem = () => {}, itemType="Item" }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isEditing) {
      e.preventDefault();
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-center">
      {links.map((link, index) => (
        <div key={index} className="relative group flex flex-col p-4 bg-secondary rounded-lg shadow-md transition-all duration-300 border border-gray-800 hover:border-accent hover:-translate-y-1">
          {isEditing && (
            <button
              onClick={() => onDeleteItem(index)}
              className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700 transition-colors z-10 opacity-70 group-hover:opacity-100"
              aria-label={`Delete ${link.name}`}
            >
              &times;
            </button>
          )}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="flex flex-col items-center justify-center flex-grow"
            aria-disabled={isEditing}
          >
            <div className="w-8 h-8 mb-2 text-text-secondary group-hover:text-white transition-colors duration-300">
              {icons[link.icon]}
            </div>
            <span className="text-sm font-medium text-text-primary group-hover:text-white">{link.name}</span>
          </a>
          {isEditing && (
            <div className="mt-3">
              <label htmlFor={`link-url-${index}`} className="sr-only">URL for {link.name}</label>
              <input
                id={`link-url-${index}`}
                type="text"
                value={link.url}
                onChange={(e) => onLinkChange({ url: e.target.value }, index)}
                placeholder="https://example.com"
                className="w-full p-1.5 bg-primary text-white text-xs rounded-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-highlight"
                onClick={(e) => e.stopPropagation()} // Prevent link click when editing
              />
            </div>
          )}
        </div>
      ))}
      {isEditing && (
        <button
          onClick={onAddItem}
          className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg shadow-md border-2 border-dashed border-gray-700 text-text-secondary hover:border-accent hover:text-accent transition-all duration-300"
          aria-label={`Add new ${itemType}`}
        >
          <div className="w-8 h-8 mb-2">{icons.add}</div>
          <span className="font-medium">Add {itemType}</span>
        </button>
      )}
    </div>
  );
};

export default LinksGrid;