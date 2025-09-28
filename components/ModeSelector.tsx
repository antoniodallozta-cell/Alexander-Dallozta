import React from 'react';
import type { AppMode } from '../types';

interface ModeSelectorProps {
    onSelectMode: (mode: AppMode) => void;
}

const ModeCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white rounded-2xl shadow-lg p-8 text-center cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col items-center gap-4 border-2 border-transparent hover:border-blue-500"
    >
        <div className="text-blue-600">{icon}</div>
        <h3 className="text-2xl font-bold text-navy">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);


const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
    return (
        <div className="bg-light-gray min-h-screen flex flex-col justify-center items-center p-4 font-sans">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-navy mb-2">Bienvenido a Hecho por Mi</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Para empezar, elige el modo que mejor se adapte a tus conocimientos.
                </p>
            </header>
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <ModeCard
                    title="Modo Profesional"
                    description="Para estudiantes y profesionales del sector alimentario. Contenido con terminología técnica y enfoque científico."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>}
                    onClick={() => onSelectMode('profesional')}
                />
                <ModeCard
                    title="Modo Principiante"
                    description="Para familias, emprendedores y entusiastas de la cocina. Guías paso a paso con un lenguaje claro y sencillo."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                    onClick={() => onSelectMode('principiante')}
                />
            </div>
             <footer className="text-center mt-16 text-gray-500 text-sm">
                <p className="font-bold">Escuela 4-188 Padre Eduardo Sergio Iácono</p>
                <p>Técnica en Tecnología de los Alimentos</p>
            </footer>
        </div>
    );
};

export default ModeSelector;