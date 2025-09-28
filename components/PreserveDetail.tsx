import React, { useState, useEffect } from 'react';
import { fetchPreserveDetails } from '../services/geminiService';
import type { Preserve, GeminiData, AppMode } from '../types';
import Flowchart from './Flowchart';
import Modal from './Modal';
import Chatbot from './Chatbot';

// @ts-ignore
const { jsPDF } = window.jspdf;

interface PreserveDetailProps {
  preserve: Preserve;
  mode: AppMode;
  onBack: () => void;
}

const loadingMessages = [
    "Cargando información sobre el producto...",
    "Consultando el Código Alimentario...",
    "Generando diagrama de flujo a medida...",
    "Escribiendo puntos críticos de control...",
    "Cargando los tuturiales elaborados...",
    "¡Casi listo!",
];

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-8 text-navy">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg">{message}</p>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h3 className="text-2xl font-bold text-navy mb-4 border-b-2 border-gray-200 pb-2">{title}</h3>
        {children}
    </div>
);

const PreserveDetail: React.FC<PreserveDetailProps> = ({ preserve, mode, onBack }) => {
  const [geminiData, setGeminiData] = useState<GeminiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStepId, setActiveStepId] = useState<number | null>(null);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPreserveDetails(preserve.name, mode);
        setGeminiData(data);
      } catch (e: any) {
        setError(e.message || "Ocurrió un error inesperado.");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [preserve.name, mode]);
  
  useEffect(() => {
      if (loading) {
          let index = 0;
          const interval = setInterval(() => {
              index = (index + 1) % loadingMessages.length;
              setCurrentLoadingMessage(loadingMessages[index]);
          }, 2000);
          return () => clearInterval(interval);
      }
  }, [loading]);

  const handleStepClick = (id: number) => {
    setActiveStepId(id);
  };

  const handleCloseModal = () => {
    setActiveStepId(null);
  };
  
  const handleDownloadPdf = async () => {
    if (!geminiData || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    try {
        const doc = new jsPDF();
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let currentY = 20;

        const schoolName = "Escuela 4-188 Padre Eduardo Sergio Iácono";
        const now = new Date();
        const dateTimeString = `${now.toLocaleDateString('es-AR')} ${now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
        const modeText = mode === 'profesional' ? 'Modo Profesional' : 'Modo Principiante';

        // --- CONTENT GENERATION ---
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(preserve.name, pageWidth / 2, currentY, { align: 'center' });
        currentY += 15;
        
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Definición del Producto", margin, currentY);
        currentY += 8;
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const definitionLines = doc.splitTextToSize(geminiData.definition, pageWidth - margin * 2);
        doc.text(definitionLines, margin, currentY);
        currentY += definitionLines.length * 5 + 10;

        if (preserve.criticalPoints) {
            if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Puntos Críticos de Control", margin, currentY);
            currentY += 8;
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            if (preserve.criticalPoints.ph) {
                doc.text(`- pH Objetivo: ${preserve.criticalPoints.ph}`, margin, currentY);
                currentY += 6;
            }
            if (preserve.criticalPoints.brix) {
                doc.text(`- Brix Objetivo: ${preserve.criticalPoints.brix}`, margin, currentY);
                currentY += 6;
            }
            currentY += 10;
        }

        if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Proceso de Elaboración", margin, currentY);
        currentY += 8;

        geminiData.process.forEach(step => {
            const titleLines = doc.splitTextToSize(`${step.id}. ${step.title}`, pageWidth - margin * 2);
            const descLines = doc.splitTextToSize(step.description, pageWidth - margin * 2 - 5);
            const stepHeight = (titleLines.length * 6) + (descLines.length * 5) + 8;
            
            if (currentY + stepHeight > pageHeight - margin) {
                doc.addPage();
                currentY = 20;
            }
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(titleLines, margin, currentY);
            currentY += titleLines.length * 6;
            
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.text(descLines, margin + 5, currentY);
            currentY += descLines.length * 5 + 8;
        });

        const youtubeUrl = `https://www.youtube.com/playlist?list=${geminiData.youtubePlaylistId}`;
        const toDataURL = (url: string): Promise<string> => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }));
        const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(youtubeUrl)}`;
        const qrCodeBase64 = await toDataURL(qrCodeApiUrl);
        if (currentY > pageHeight - 80) { doc.addPage(); currentY = 20; }
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Tutoriales en Video", margin, currentY);
        currentY += 8;
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 238);
        doc.textWithLink("Ver la lista de reproducción en YouTube", margin, currentY, { url: youtubeUrl });
        doc.setTextColor(0);
        currentY += 10;
        doc.addImage(qrCodeBase64, 'PNG', margin, currentY, 40, 40);
        currentY += 50;


        const footerText = `Extraído de la App Hecho por Mi de la ${schoolName}.`;
        if (currentY + 20 > pageHeight - margin) { doc.addPage(); currentY = 20; }
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(footerText, pageWidth / 2, pageHeight - 20, { align: 'center' });

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(150);
            doc.text(`Descargado: ${dateTimeString} - ${modeText}`, margin, 10);
            doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, 10, { align: 'right' });
            doc.setTextColor(0);
        }

        doc.save(`Guia_${preserve.name.replace(/\s/g, '_')}.pdf`);
    } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Hubo un error al generar el PDF. Por favor, intenta de nuevo.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  const activeStep = geminiData?.process.find(step => step.id === activeStepId);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onBack} 
          className="bg-navy text-white font-bold py-2 px-6 rounded-full hover:bg-blue-800 transition-colors duration-300 flex items-center shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
         <button 
          onClick={handleDownloadPdf} 
          disabled={!geminiData || isGeneratingPdf}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition-colors duration-300 flex items-center justify-center shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed w-56"
        >
            {isGeneratingPdf ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando...
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Descargar Guía en PDF
                </>
            )}
        </button>
      </div>

      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-navy">{preserve.name}</h1>
      </header>
      
      {loading && <LoadingSpinner message={currentLoadingMessage} />}
      {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}

      {geminiData && (
        <>
          <Section title="Definición del Producto">
            <p className="text-gray-700 italic">{geminiData.definition}</p>
          </Section>

          <Section title="Proceso de Elaboración">
             <p className="text-gray-600 mb-6 text-center">Haz clic en cada etapa del diagrama para ver los detalles.</p>
            <Flowchart steps={geminiData.process} activeStepId={activeStepId} onStepClick={handleStepClick} />
          </Section>

          {preserve.criticalPoints && (
            <Section title="Puntos Críticos de Control">
                <div className="flex flex-wrap gap-4">
                    {preserve.criticalPoints.ph && (
                        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg flex-1 text-center">
                            <span className="font-bold text-lg">pH Objetivo:</span>
                            <p className="text-xl">{preserve.criticalPoints.ph}</p>
                        </div>
                    )}
                    {preserve.criticalPoints.brix && (
                         <div className="bg-green-100 text-green-800 p-4 rounded-lg flex-1 text-center">
                            <span className="font-bold text-lg">Brix Objetivo:</span>
                            <p className="text-xl">{preserve.criticalPoints.brix}</p>
                        </div>
                    )}
                </div>
            </Section>
          )}

          <Section title="Video Tutoriales">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                <iframe 
                    className="w-full h-full"
                    style={{ aspectRatio: '16/9' }}
                    src={`https://www.youtube.com/embed/videoseries?list=${geminiData.youtubePlaylistId}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>
            </div>
          </Section>

          <Section title="Esterilización">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg mb-6" role="alert">
                    <p className="font-bold">¡Atención!</p>
                    <p>El correcto cumplimiento de los tiempos de esterilización es crucial para eliminar la carga microbiana y garantizar la inocuidad del producto final.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {preserve.sterilizationTimes.map((item) => (
                        <div key={item.name} className="bg-white p-4 border border-gray-200 rounded-lg flex flex-col items-center text-center shadow">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mb-3 rounded-full bg-gray-100 p-2" />
                            <p className="font-semibold text-navy">{item.name}</p>
                            <p className="text-2xl font-bold text-blue-700 mt-1">{item.time} min</p>
                        </div>
                    ))}
                </div>
           </Section>

           <Section title="Más Información">
                <p className="text-gray-700">
                Para garantizar la máxima seguridad, se aconseja verificar los Puntos Críticos de Control. Puedes realizar una medición precisa de pH o grados Brix en nuestro establecimiento:
                </p>
                <div className="my-4 text-center">
                    <a 
                        href="https://maps.app.goo.gl/66CjQkvAAtGXTgLo6" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300"
                    >
                        Ver Dirección en Google Maps
                    </a>
                </div>
                <p className="text-gray-700 mt-2">
                Alternativamente, para una estimación del pH desde casa, recomendamos utilizar la app <span className="font-bold text-navy">Moracol</span>, que ofrece una mayor precisión que las tiras reactivas.
                </p>
                <div className="mt-6 text-center">
                    <a 
                        href="https://play.google.com/store/apps/details?id=com.moracol.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-navy text-white font-bold py-3 px-8 rounded-full hover:bg-blue-800 transition-colors duration-300 shadow-lg"
                    >
                        Descargar App Moracol
                    </a>
                </div>
           </Section>
        </>
      )}
       
       <Modal
            isOpen={!!activeStep}
            onClose={handleCloseModal}
            title={activeStep?.title || ''}
        >
            {activeStep && <p className="text-gray-700 whitespace-pre-wrap">{activeStep.description}</p>}
        </Modal>

        <button 
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 bg-navy text-white rounded-full p-4 shadow-lg hover:bg-blue-800 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Abrir asistente de IA"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.5 5.5 0 00-5.5 5.5A.5.5 0 005 18h10a.5.5 0 00.5-.5A5.5 5.5 0 0010 12z" clipRule="evenodd" />
            </svg>
        </button>
        
        <Chatbot 
            isOpen={isChatOpen} 
            onClose={() => setChatOpen(false)}
            preserveName={preserve.name}
        />

    </div>
  );
};

export default PreserveDetail;