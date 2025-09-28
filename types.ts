export type Shape = 'rectangle' | 'diamond' | 'oval' | 'terminator';

export interface FlowchartStep {
  id: number;
  title: string;
  description: string;
  shape: Shape;
}

export interface JarSterilizationTime {
  name: string;
  time: number; // in minutes
  image?: string;
}

export interface Preserve {
  id: string;
  name: string;
  image: string;
  criticalPoints?: {
    ph?: string;
    brix?: string;
  };
  sterilizationTimes: JarSterilizationTime[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  preserves: Preserve[];
}

export interface GeminiData {
    definition: string;
    process: FlowchartStep[];
    youtubePlaylistId: string;
}

export type AppMode = 'profesional' | 'principiante';
