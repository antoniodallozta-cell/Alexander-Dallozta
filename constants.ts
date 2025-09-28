import type { Category, JarSterilizationTime } from './types';

const STERILIZATION_TIMES: JarSterilizationTime[] = [
    { name: 'Frasco Amanecer 1000cc', time: 45, image: 'https://picsum.photos/seed/jar1/200' },
    { name: 'Bote 1000cc', time: 45, image: 'https://picsum.photos/seed/can1/200' },
    { name: 'Frasco Amanecer 360cc', time: 25, image: 'https://picsum.photos/seed/jar2/200' },
    { name: 'Bote 433cc', time: 30, image: 'https://picsum.photos/seed/can2/200' },
];

export const CATEGORIES: Category[] = [
  {
    id: 'mermeladas',
    name: 'Mermeladas',
    image: 'https://picsum.photos/seed/cat-jam/400/300',
    preserves: [
      { id: 'mermelada-frutilla', name: 'Mermelada de Frutilla', image: 'https://picsum.photos/seed/jam-strawberry/400/300', criticalPoints: { ph: 'Menor a 3,8', brix: 'Mínimo 65° Brix' }, sterilizationTimes: STERILIZATION_TIMES },
      { id: 'mermelada-durazno', name: 'Mermelada de Durazno', image: 'https://picsum.photos/seed/jam-peach/400/300', criticalPoints: { ph: 'Menor a 3,8', brix: 'Mínimo 65° Brix' }, sterilizationTimes: STERILIZATION_TIMES },
      { id: 'mermelada-pera', name: 'Mermelada de Pera', image: 'https://picsum.photos/seed/jam-pear/400/300', criticalPoints: { ph: 'Menor a 3,8', brix: 'Mínimo 65° Brix' }, sterilizationTimes: STERILIZATION_TIMES },
      { id: 'mermelada-alcayota', name: 'Mermelada de Alcayota', image: 'https://picsum.photos/seed/jam-squash/400/300', criticalPoints: { ph: 'Menor a 3,8', brix: 'Mínimo 65° Brix' }, sterilizationTimes: STERILIZATION_TIMES },
    ],
  },
  {
    id: 'jaleas',
    name: 'Jaleas',
    image: 'https://picsum.photos/seed/cat-jelly/400/300',
    preserves: [
      { id: 'jalea-membrillo', name: 'Jalea de Membrillo', image: 'https://picsum.photos/seed/jelly-quince/400/300', criticalPoints: { ph: 'Menor a 3,5', brix: 'Mínimo 65° Brix' }, sterilizationTimes: STERILIZATION_TIMES },
      { id: 'jalea-manzana', name: 'Jalea de Manzana', image: 'https://picsum.photos/seed/jelly-apple/400/300', criticalPoints: { ph: 'Menor a 3,5', brix: 'Mínimo 65° Brix' }, sterilizationTimes: STERILIZATION_TIMES },
    ],
  },
  {
    id: 'dulces',
    name: 'Dulces',
    image: 'https://picsum.photos/seed/cat-sweets/400/300',
    preserves: [
      { id: 'dulce-membrillo', name: 'Dulce de Membrillo', image: 'https://picsum.photos/seed/sweet-quince/400/300', criticalPoints: { brix: 'Mínimo 75° Brix' }, sterilizationTimes: STERILIZATION_TIMES },
      { id: 'dulce-batata', name: 'Dulce de Batata', image: 'https://picsum.photos/seed/sweet-potato/400/300', criticalPoints: { brix: 'Mínimo 75° Brix' }, sterilizationTimes: STERILIZATION_TIMES },
    ],
  },
  {
    id: 'frutas-almibar',
    name: 'Frutas en almíbar',
    image: 'https://picsum.photos/seed/cat-syrup/400/300',
    preserves: [
      { id: 'duraznos-almibar', name: 'Duraznos en almíbar', image: 'https://picsum.photos/seed/syrup-peach/400/300', criticalPoints: { ph: 'Menor a 4,3', brix: 'Entre 25-35° Brix' }, sterilizationTimes: STERILIZATION_TIMES },
      { id: 'peras-almibar', name: 'Peras en almíbar', image: 'https://picsum.photos/seed/syrup-pear/400/300', criticalPoints: { ph: 'Menor a 4,3', brix: 'Entre 25-35° Brix' }, sterilizationTimes: STERILIZATION_TIMES },
    ],
  },
  {
    id: 'triturados',
    name: 'Triturados',
    image: 'https://picsum.photos/seed/cat-crushed/400/300',
    preserves: [
      { id: 'tomate-triturado', name: 'Tomate triturado', image: 'https://picsum.photos/seed/crushed-tomato/400/300', criticalPoints: { ph: 'Menor a 4,5' }, sterilizationTimes: STERILIZATION_TIMES },
      { id: 'pimiento-triturado', name: 'Pimiento triturado (morrones)', image: 'https://picsum.photos/seed/crushed-pepper/400/300', criticalPoints: { ph: 'Menor a 4,5' }, sterilizationTimes: STERILIZATION_TIMES },
    ],
  },
  {
    id: 'encurtidos',
    name: 'Encurtidos',
    image: 'https://picsum.photos/seed/cat-pickles/400/300',
    preserves: [
        { id: 'pepinillos-vinagre', name: 'Pepinillos en vinagre', image: 'https://picsum.photos/seed/pickle-cucumber/400/300', criticalPoints: { ph: 'Menor a 4,0' }, sterilizationTimes: STERILIZATION_TIMES },
        { id: 'cebollitas-vinagre', name: 'Cebollitas en vinagre', image: 'https://picsum.photos/seed/pickle-onion/400/300', criticalPoints: { ph: 'Menor a 4,0' }, sterilizationTimes: STERILIZATION_TIMES },
    ],
  },
  {
    id: 'salsas',
    name: 'Salsas',
    image: 'https://picsum.photos/seed/cat-sauces/400/300',
    preserves: [
        { id: 'salsa-tomate', name: 'Salsa de Tomate', image: 'https://picsum.photos/seed/sauce-tomato/400/300', criticalPoints: { ph: 'Menor a 4,5' }, sterilizationTimes: STERILIZATION_TIMES },
        { id: 'ketchup-casero', name: 'Kétchup Casero', image: 'https://picsum.photos/seed/sauce-ketchup/400/300', criticalPoints: { ph: 'Menor a 4,0' }, sterilizationTimes: STERILIZATION_TIMES },
    ],
  }
];
