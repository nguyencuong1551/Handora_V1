
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import SkinQuiz from './components/SkinQuiz';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import { Product, CartItem, Order, BlogPost } from './types';
import { INITIAL_PRODUCTS, INITIAL_BLOGS } from './constants';

const App: React.FC = () => {
  const [page, setPage] = useState('home');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('handora_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('handora_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOGS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('handora_orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('handora_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('handora_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('handora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, subscription: 'none' }];
    });
  };

  const handleLogin = (u: any) => {
    setUser(u);
    setShowAuth(false);
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-hannora-light">
      <Navbar 
        onNavigate={setPage} 
        cartCount={cart.length} 
        onAuth={() => setShowAuth(true)} 
        user={user} 
        onLogout={() => { setUser(null); setPage('home'); }}
        isScrolled={scrolled}
        currentPage={page}
      />

      {showAuth && <Auth onLogin={handleLogin} onClose={() => setShowAuth(false)} />}

      <main>
        {page === 'home' && (
          <div className="animate-fade-in">
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-90" alt="Botanical Background" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-hannora-light" />
              </div>
              <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="reveal">
                  <span className="inline-block px-8 py-3 rounded-full border border-hannora-green/30 text-[10px] font-black uppercase tracking-[0.5em] text-hannora-green mb-10 bg-white/50 backdrop-blur-md">Botanical Engineering</span>
                  {/* Corrected: use className instead of class for React JSX */}
                  <h1 className="text-7xl md:text-9xl font-serif text-slate-900 leading-tight mb-12">Vegan <span className="italic font-light text-handora-green">Essence</span>,<br/>Modern Rituals.</h1>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <button onClick={() => setPage('shop')} className="btn-shimmer px-12 py-5 rounded-full text-white font-bold text-xs uppercase tracking-[0.3em] shadow-xl">Explore Now</button>
                    <button onClick={() => setPage('quiz')} className="glass px-12 py-5 rounded-full text-slate-800 font-bold text-xs uppercase tracking-[0.3em] hover:bg-white transition-all">Find Your Ritual</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {page === 'shop' && (
          <section className="pt-48 pb-40 container mx-auto px-6 reveal">
            <div className="text-center mb-24">
               <h1 className="text-8xl font-serif mb-8 text-slate-900">Collection</h1>
               <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  {['All', 'Skincare', 'Hand Wash', 'Refill'].map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`transition-all pb-1 ${selectedCategory === cat ? 'text-hannora-green border-b-2 border-hannora-green' : 'hover:text-hannora-green'}`}>{cat}</button>
                  ))}
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => {}} onAddToCart={() => addToCart(p)} />
              ))}
            </div>
          </section>
        )}

        {page === 'admin' && user?.role === 'admin' && (
          <section className="pt-48 pb-40 container mx-auto px-6">
            <AdminDashboard 
              products={products} 
              orders={orders} 
              blogs={blogs}
              onUpdateProducts={setProducts} 
              onUpdateOrders={setOrders} 
              onUpdateBlogs={setBlogs}
            />
          </section>
        )}

        {page === 'about' && (
          <section className="pt-48 pb-40 container mx-auto px-6 text-center">
             <h1 className="text-8xl font-serif mb-8 text-slate-900">About Us</h1>
             <p className="text-xl text-slate-500 max-w-3xl mx-auto italic">Connecting modern souls with the pure intelligence of plants.</p>
          </section>
        )}

        {page === 'quiz' && (
          <section className="pt-48 pb-40 container mx-auto px-6 text-center">
             <SkinQuiz availableProducts={products} onRecommendation={(rec) => alert(rec)} />
          </section>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-24">
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-8 text-slate-300">Customer Care</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Direct</p>
                  <p className="text-lg font-serif text-slate-700">+84 1800 5588</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Email</p>
                  <p className="text-lg font-serif text-slate-700">care@handora.com</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
               <span className="text-[120px] font-serif text-slate-50 select-none pointer-events-none opacity-50">Handora</span>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="text-slate-200">© 2024 HANDORA Botanical Systems</span>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <a href="#" className="hover:text-hannora-green transition-colors">Instagram</a>
              <a href="#" className="hover:text-hannora-green transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
