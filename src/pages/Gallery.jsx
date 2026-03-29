import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import db from '@/lib/localDB';
import { seedExamples } from '@/lib/exampleProducts';

const APPLIANCE_CATEGORIES = [
  'All',
  'Refrigerators',
  'Stoves & Ranges',
  'Dishwashers',
  'Washing Machines',
  'Dryers',
  'Microwaves',
  'Air Conditioners',
  'Ovens',
  'Small Appliances',
  'Other'
];

export default function Gallery() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      await seedExamples();
      const list = await db.entities.Appliance.list('-created_date');
      if (active) setProducts(list);
    };
    loadProducts();
    return () => { active = false; };
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <img src="/images/harps.png" alt="Harp's Outlet Logo" className="h-20 object-contain" />
        </div>
      </div>

      {products.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {APPLIANCE_CATEGORIES.map((category) => {
            const count = products.filter(p => p.category === category).length;
            if (category !== 'All' && count === 0) return null;
            
            return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category}
              {category !== 'All' && (
                <span className="ml-2 text-sm opacity-75">
                  ({count})
                </span>
              )}
            </button>
            );
          })}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No appliances available</h3>
          <p className="text-muted-foreground">Check back soon for new arrivals!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((item) => (
            <Link key={item.id} to={`/product/${item.id}`} className="card group overflow-hidden">
              <div className="aspect-square bg-muted relative overflow-hidden">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                  {item.category && (
                    <span className="inline-block mt-1 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description || 'Premium quality appliance'}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-primary">
                    ${item.price != null ? Number(item.price).toFixed(2) : '0.00'}
                  </span>
                  <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}