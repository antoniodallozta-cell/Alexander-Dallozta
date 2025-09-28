import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import { fetchChatbotResponse } from '../services/geminiService';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
    preserveName: string;
}

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, preserveName }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if(isOpen) {
            setMessages([
                { sender: 'bot', text: `¡Hola! Soy tu asistente. ¿Tienes alguna pregunta sobre cómo hacer ${preserveName}?` }
            ]);
        }
    }, [isOpen, preserveName]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponseText = await fetchChatbotResponse(input, preserveName);
            const botMessage: Message = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'bot', text: "Lo siento, algo salió mal. Por favor, intenta de nuevo." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Asistente de IA">
            <div className="flex flex-col h-[60vh]">
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                             <div className="bg-gray-200 text-gray-800 rounded-2xl px-4 py-2">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75 ml-1"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150 ml-1"></span>
                                </div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-4 flex items-center border-t border-gray-200 pt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Escribe tu pregunta..."
                        className="flex-1 border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || input.trim() === ''}
                        className="ml-3 bg-navy text-white rounded-full p-2 disabled:bg-gray-400 hover:bg-blue-800 transition-colors"
                        aria-label="Enviar mensaje"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default Chatbot;