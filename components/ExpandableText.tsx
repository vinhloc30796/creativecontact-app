import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  textClassName?: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  text, 
  maxLength = 50, 
  textClassName = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  if (text.length <= maxLength) {
    return <p className={textClassName}>{text}</p>;
  }

  const displayText = isExpanded ? text : text.slice(0, maxLength);

  return (
    <div className="space-y-1">
      <p className={textClassName}>
        {displayText}{!isExpanded && '...'}
      </p>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          toggleExpansion();
        }}
        className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
      >
        <ChevronDown 
          className={`w-4 h-4 mr-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
        />
        <span className="text-sm">{isExpanded ? 'Show Less' : 'Show More'}</span>
      </a>
    </div>
  );
};

export default ExpandableText;