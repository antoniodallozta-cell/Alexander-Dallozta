import React, { useState } from 'react';
import { CATEGORIES } from './constants';
import type { Preserve, AppMode, Category } from './types';
import CategoryCard from './components/CategoryCard';
import PreserveCard from './components/PreserveCard';
import PreserveDetail from './components/PreserveDetail';
import ModeSelector from './components/ModeSelector';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedPreserve, setSelectedPreserve] = useState<Preserve | null>(null);

  const handleSelectPreserve = (preserve: Preserve) => {
    setSelectedPreserve(preserve);
    window.scrollTo(0, 0);
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    window.scrollTo(0, 0);
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  }
  
  const handleBackToPreserves = () => {
    setSelectedPreserve(null);
  }

  const handleModeSelect = (selectedMode: AppMode) => {
    setMode(selectedMode);
  };

  const handleChangeMode = () => {
    setMode(null);
    setSelectedCategory(null);
    setSelectedPreserve(null);
  };

  if (!mode) {
    return <ModeSelector onSelectMode={handleModeSelect} />;
  }

  return (
    <div className="bg-light-gray min-h-screen font-sans text-gray-800">
      <main>
        {selectedPreserve ? (
          <PreserveDetail preserve={selectedPreserve} mode={mode} onBack={handleBackToPreserves} />
        ) : selectedCategory ? (
            <div className="container mx-auto px-4 py-12">
                 <header className="mb-12">
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                        <div>
                             <button 
                              onClick={handleBackToCategories} 
                              className="text-navy font-bold mb-4 flex items-center hover:underline"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                              </svg>
                              Volver a Categorías
                            </button>
                            <h1 className="text-4xl md:text-5xl font-bold text-navy">{selectedCategory.name}</h1>
                            <p className="text-lg text-gray-600 max-w-3xl mt-2">
                                Elige una receta para comenzar.
                            </p>
                        </div>
                        <button 
                          onClick={handleChangeMode} 
                          className="bg-gray-200 text-navy font-bold py-2 px-6 rounded-full hover:bg-gray-300 transition-colors duration-300 flex items-center shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Cambiar Modo
                        </button>
                    </div>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedCategory.preserves.map((preserve) => (
                        <PreserveCard 
                        key={preserve.id} 
                        preserve={preserve} 
                        onSelect={handleSelectPreserve} 
                        />
                    ))}
                </div>
                 <footer className="text-center mt-16 text-gray-500 text-sm">
                    <p className="font-bold">Escuela 4-188 Padre Eduardo Sergio Iácono</p>
                    <p>Técnica en Tecnología de los Alimentos</p>
                    <p className="mt-4">&copy; 2024 Hecho por Mi. Todos los derechos reservados.</p>
                </footer>
            </div>
        ) : (
          <div className="container mx-auto px-4 py-12">
            <header className="mb-12">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-navy">Hecho por Mi</h1>
                    <button 
                      onClick={handleChangeMode} 
                      className="bg-gray-200 text-navy font-bold py-2 px-6 rounded-full hover:bg-gray-300 transition-colors duration-300 flex items-center shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Cambiar Modo
                    </button>
                </div>
                <p className="text-lg text-gray-600 max-w-3xl">
                    Tu guía para crear conservas caseras deliciosas y seguras. Elige una categoría para explorar las recetas.
                </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {CATEGORIES.map((category) => (
                <CategoryCard
                  key={category.id} 
                  category={category} 
                  onSelect={handleSelectCategory} 
                />
              ))}
            </div>
             <footer className="text-center mt-16 text-gray-500 text-sm">
                <p className="font-bold">Escuela 4-188 Padre Eduardo Sergio Iácono</p>
                <p>Técnica en Tecnología de los Alimentos</p>
                <p className="mt-4">&copy; 2024 Hecho por Mi. Todos los derechos reservados.</p>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
