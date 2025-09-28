import React from 'react';
import type { FlowchartStep, Shape } from '../types';

interface FlowchartProps {
  steps: FlowchartStep[];
  activeStepId: number | null;
  onStepClick: (id: number) => void;
}

const ShapeComponent: React.FC<{ shape: Shape; children: React.ReactNode, isActive: boolean }> = ({ shape, children, isActive }) => {
  const baseClasses = "w-full min-h-[80px] flex items-center justify-center p-4 text-center font-semibold text-navy transition-all duration-300 cursor-pointer shadow-md";
  const activeClasses = "bg-blue-200 border-blue-600 scale-105 shadow-xl";
  const inactiveClasses = "bg-white border-navy hover:bg-blue-50";
  const borderClass = "border-2";

  const shapeClasses: Record<Shape, string> = {
    rectangle: "rounded-lg",
    diamond: "transform -skew-x-0 rotate-45 w-48 h-48",
    oval: "rounded-full",
    terminator: "rounded-full"
  };
  
  const textContainerClasses: Record<Shape, string> = {
    rectangle: "",
    diamond: "transform -rotate-45",
    oval: "",
    terminator: ""
  }

  if (shape === 'diamond') {
    return (
        <div className="flex justify-center items-center my-4 h-48">
            <div className={`${baseClasses} ${shapeClasses[shape]} ${isActive ? activeClasses : inactiveClasses} ${borderClass}`}>
                <div className={textContainerClasses[shape]}>{children}</div>
            </div>
        </div>
    );
  }

  return (
    <div className={`${baseClasses} ${shapeClasses[shape]} ${isActive ? activeClasses : inactiveClasses} ${borderClass}`}>
        <div className={textContainerClasses[shape]}>{children}</div>
    </div>
  );
};

const ArrowDown: React.FC = () => (
  <div className="flex justify-center my-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-navy opacity-50">
      <path d="M12 5V19M12 19L18 13M12 19L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);


const Flowchart: React.FC<FlowchartProps> = ({ steps, activeStepId, onStepClick }) => {
  return (
    <div>
      <div className="max-w-md mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div onClick={() => onStepClick(step.id)}>
              <ShapeComponent shape={step.shape} isActive={activeStepId === step.id}>
                {step.title}
              </ShapeComponent>
            </div>
            {index < steps.length - 1 && <ArrowDown />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Flowchart;