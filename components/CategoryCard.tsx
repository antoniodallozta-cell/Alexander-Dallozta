import React from 'react';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onSelect: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out group"
      onClick={() => onSelect(category)}
    >
      <img src={category.image} alt={category.name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold text-navy group-hover:text-blue-700 transition-colors duration-300">{category.name}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;
