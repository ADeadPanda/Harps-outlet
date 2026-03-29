import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
        <div className="min-h-screen bg-background text-foreground">
          <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/images/harps.png" alt="Logo" className="h-8 object-contain" />
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="nav-link">Gallery</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<Gallery />} />
          </Routes>
        </main>

          <footer className="border-t border-border bg-card/30 mt-16">
            <div className="max-w-6xl mx-auto px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Built with ❤️ for Harp's Outlet
              </p>
            </div>
          </footer>
        </div>
      </Router>
  );
}

export default App;