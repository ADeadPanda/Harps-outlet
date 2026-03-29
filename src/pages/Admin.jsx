import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import db from '@/lib/localDB';
import { removeExamples } from '@/lib/exampleProducts';

const APPLIANCE_CATEGORIES = [
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

const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin');
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', description: '', price: '', image: null });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ password: '' });
  const [loginError, setLoginError] = useState('');

  // Check if admin is already logged in
  useEffect(() => {
    const saved = localStorage.getItem('admin_authenticated');
    const timestamp = localStorage.getItem('admin_login_time');
    
    if (saved === 'true' && timestamp) {
      const elapsed = Date.now() - parseInt(timestamp);
      if (elapsed < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_login_time');
      }
    }
  }, []);

  // Load products only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const load = async () => {
      const list = await db.entities.Appliance.list('-created_date');
      setProducts(list);
    };
    load();
  }, [isAuthenticated]);

  // Check session timeout periodically
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      const timestamp = localStorage.getItem('admin_login_time');
      if (timestamp) {
        const elapsed = Date.now() - parseInt(timestamp);
        if (elapsed >= SESSION_TIMEOUT) {
          handleLogout();
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (loginForm.password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_login_time', Date.now().toString());
      setIsAuthenticated(true);
      setLoginForm({ password: '' });
    } else {
      setLoginError('Invalid password');
      setLoginForm({ password: '' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
    setProducts([]);
    setForm({ name: '', category: '', description: '', price: '', image: null });
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="card p-8 w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Admin Access</h1>
            <p className="text-muted-foreground">Enter the password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ password: e.target.value })}
                className="input w-full"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{loginError}</p>
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </form>

          <div className="pt-4 border-t border-border">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const syncProducts = async () => setProducts(await db.entities.Appliance.list('-created_date'));

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      alert('Name, category, and price are required');
      return;
    }

    const createProduct = async (imageUrl) => {
      await db.entities.Appliance.create({
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        images: imageUrl ? [imageUrl] : [],
        created_date: Date.now(),
      });
      await removeExamples();
      setForm({ name: '', category: '', description: '', price: '', image: null });
      await syncProducts();
    };

    if (form.image) {
      const reader = new FileReader();
      reader.onload = async () => { await createProduct(reader.result); };
      reader.readAsDataURL(form.image);
    } else {
      await createProduct('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await db.entities.Appliance.delete(id);
    await syncProducts();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-center space-y-2 flex-1">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your appliance inventory</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Appliance</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="input"
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="input"
              required
            >
              <option value="">Select a category</option>
              {APPLIANCE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="input"
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="input min-h-[100px] resize-none"
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange('image', e.target.files?.[0] || null)}
              className="input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-full md:w-auto">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Inventory ({products.length})</h2>
        {products.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground">Add your first product using the form above.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="card overflow-hidden group">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                    {product.category && (
                      <span className="inline-block mt-1 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                        {product.category}
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {product.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      ${product.price?.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      title="Delete product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}