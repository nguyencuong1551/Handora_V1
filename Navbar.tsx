
import React, { useState } from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  cartCount: number;
  onAuth: () => void;
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, cartCount, onAuth, user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 py-6 px-6 md:px-12 flex justify-between items-center transition-all">
      <div 
        className="text-2xl font-bold text-slate-800 cursor-pointer tracking-[0.3em] uppercase flex items-center gap-3"
        onClick={() => onNavigate('home')}
      >
        <span className="w-10 h-10 bg-hannora-green rounded-full flex items-center justify-center text-white text-xs font-serif">H</span>
        HANNORA
      </div>
      
      <div className="hidden lg:flex gap-12 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-hannora-green transition-colors">Home</button>
        <button onClick={() => onNavigate('shop')} className="hover:text-hannora-green transition-colors">Shop</button>
        <button onClick={() => onNavigate('quiz')} className="hover:text-hannora-green transition-colors">Skin Quiz</button>
        {user?.role === 'admin' && (
          <button onClick={() => onNavigate('admin')} className="text-hannora-green border-b-2 border-hannora-green">Admin Panel</button>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button 
          className="relative group p-2 hover:bg-white rounded-full transition-all"
          onClick={() => onNavigate('cart')}
        >
          <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-hannora-green text-[9px] font-bold text-white px-2 py-0.5 rounded-full border-2 border-white shadow-lg animate-bounce">
              {cartCount}
            </span>
          )}
        </button>

        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 bg-hannora-light pl-4 pr-2 py-2 rounded-full border border-hannora-accent/30 hover:shadow-md transition-all"
            >
              <span className="text-xs font-bold text-hannora-green">{user.name.split(' ')[0]}</span>
              <div className="w-8 h-8 bg-hannora-green text-white rounded-full flex items-center justify-center font-bold text-xs">
                {user.name[0]}
              </div>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
                <div className="px-6 py-4 bg-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase">Role</p>
                  <p className="text-sm font-bold capitalize">{user.role}</p>
                </div>
                <button 
                  onClick={() => { onLogout(); setShowDropdown(false); }}
                  className="w-full text-left px-6 py-4 text-sm font-bold text-red-400 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={onAuth}
            className="hidden md:block bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-hannora-green transition-all shadow-lg"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
