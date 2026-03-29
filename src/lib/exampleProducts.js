import db from './localDB';

export const EXAMPLE_PRODUCTS = [
  {
    name: 'Stainless Steel Refrigerator',
    category: 'Refrigerators',
    description: 'Modern French door refrigerator with ice maker',
    price: 1299,
    images: ['https://images.unsplash.com/photo-1584568669919-1f2cd9db0dec?w=500&h=500&fit=crop'],
    isExample: true,
  },
  {
    name: 'Electric Stove Range',
    category: 'Stoves & Ranges',
    description: 'Smooth top electric range with convection oven',
    price: 799,
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop'],
    isExample: true,
  },
  {
    name: 'Dishwasher',
    category: 'Dishwashers',
    description: 'Energy efficient dishwasher with stainless steel finish',
    price: 549,
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop'],
    isExample: true,
  },
  {
    name: 'Front Load Washing Machine',
    category: 'Washing Machines',
    description: 'High capacity front load washer with steam cycle',
    price: 899,
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=500&fit=crop'],
    isExample: true,
  },
  {
    name: 'Electric Dryer',
    category: 'Dryers',
    description: 'Energy star certified electric dryer',
    price: 649,
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=500&fit=crop'],
    isExample: true,
  },
];

export const seedExamples = async () => {
  const existing = await db.entities.Appliance.list();
  const hasRealProducts = existing.some(p => !p.isExample);
  const hasExamples = existing.some(p => p.isExample);
  
  if (!hasExamples && !hasRealProducts) {
    for (const product of EXAMPLE_PRODUCTS) {
      await db.entities.Appliance.create(product);
    }
  }
};

export const removeExamples = async () => {
  const existing = await db.entities.Appliance.list();
  const examples = existing.filter(p => p.isExample);
  for (const example of examples) {
    await db.entities.Appliance.delete(example.id);
  }
};
