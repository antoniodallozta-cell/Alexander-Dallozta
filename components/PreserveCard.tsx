import React from 'react';
import type { Preserve } from '../types';

interface PreserveCardProps {
  preserve: Preserve;
  onSelect: (preserve: Preserve) => void;
}

const PreserveCard: React.FC<PreserveCardProps> = ({ preserve, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out group"
      onClick={() => onSelect(preserve)}
    >
      <img src={preserve.image} alt={preserve.name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold text-navy group-hover:text-blue-700 transition-colors duration-300">{preserve.name}</h3>
      </div>
    </div>
  );
};

export default PreserveCard;
