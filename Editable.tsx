import React, { useRef, useLayoutEffect } from 'react';

interface EditableProps {
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'time';
  className?: string;
  textareaClassName?: string;
  maxLength?: number;
}

const Editable: React.FC<EditableProps> = ({
  isEditing,
  value,
  onChange,
  as = 'p',
  className = '',
  textareaClassName = '',
  maxLength,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height based on content
  useLayoutEffect(() => {
    if (textareaRef.current) {
      // We need to reset the height for the scrollHeight to be calculated correctly.
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  // Rerun this effect when the value changes or when we enter/exit edit mode
  }, [value, isEditing]);

  if (isEditing) {
    const defaultTextareaClass = "w-full bg-secondary/80 p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent transition-all break-all";
    const showCounter = maxLength !== undefined;
    
    return (
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          className={`${defaultTextareaClass} ${textareaClassName} ${showCounter ? 'pb-7' : ''}`}
          style={{ resize: 'none', overflow: 'hidden' }} // Hide scrollbar and prevent manual resize
        />
        {showCounter && (
          <div 
            className="absolute bottom-2 right-3 text-xs font-mono select-none pointer-events-none text-text-secondary"
          >
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    );
  }

  const Tag = as;
  // This is the fix. Add 'break-all' to ensure long strings without spaces wrap and don't overflow their container.
  return <Tag className={`${className} break-all`}>{value}</Tag>;
};

export default Editable;