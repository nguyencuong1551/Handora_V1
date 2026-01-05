
import React, { useState } from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  cartCount: number;
  onAuth: () => void;
  user: any;
  onLogout: () => void;
  isScrolled: boolean;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, cartCount, onAuth, user, onLogout, isScrolled, currentPage }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getLinkClass = (page: string) => {
    const baseClass = "transition-all duration-300 relative pb-1 ";
    const activeClass = "text-hannora-green font-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-hannora-green";
    const inactiveClass = "text-slate-600 hover:text-hannora-green after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-hannora-green hover:after:w-full after:transition-all";
    
    return baseClass + (currentPage === page ? activeClass : inactiveClass);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 md:px-12 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className={`mx-auto max-w-7xl glass rounded-[32px] px-10 py-5 flex justify-between items-center transition-all ${isScrolled ? 'shadow-2xl translate-y-2 bg-white/90' : 'bg-white/70'}`}>
        <div 
          className="text-2xl font-bold text-slate-900 cursor-pointer tracking-[0.4em] flex items-center gap-4 group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-12 h-12 bg-hannora-green rounded-full flex items-center justify-center text-white text-sm font-serif transition-transform group-hover:rotate-12 shadow-lg overflow-hidden">
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : 'H'}
          </div>
          <span className="hidden md:block">HANDORA</span>
        </div>
        
        <div className="hidden lg:flex gap-14 text-sm font-extrabold uppercase tracking-[0.3em]">
          <button onClick={() => onNavigate('home')} className={getLinkClass('home')}>Home</button>
          <button onClick={() => onNavigate('shop')} className={getLinkClass('shop')}>Our Product</button>
          <button onClick={() => onNavigate('about')} className={getLinkClass('about')}>About Us</button>
          <button onClick={() => onNavigate('quiz')} className={getLinkClass('quiz')}>Skin Quiz</button>
          {user?.role === 'admin' && (
            <button onClick={() => onNavigate('admin')} className={getLinkClass('admin')}>Admin</button>
          )}
        </div>

        <div className="flex items-center gap-8">
          <button 
            className="relative p-2.5 hover:bg-slate-50 rounded-full transition-all group"
            onClick={() => onNavigate('cart')}
          >
            <svg className={`w-7 h-7 transition-transform group-hover:scale-110 ${currentPage === 'cart' ? 'text-hannora-green' : 'text-slate-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span 
                key={cartCount} 
                className="absolute -top-1 -right-1 bg-hannora-green text-white text-xs font-black px-2 py-0.5 min-w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(74,124,89,0.5)] border-2 border-white animate-reveal z-10"
              >
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-4 bg-white/50 pl-5 pr-2 py-2 rounded-full border border-hannora-green/10 hover:shadow-md transition-all"
              >
                {/* Fix: use className instead of class for React JSX */}
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-hannora-green uppercase tracking-widest">{user.name.split(' ')[0]}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">{user.role}</p>
                </div>
                <div className="w-10 h-10 bg-hannora-green text-white rounded-full flex items-center justify-center font-bold text-sm uppercase shadow-sm overflow-hidden">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
                </div>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-5 w-64 bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden animate-reveal p-2">
                  <div className="px-6 py-5 border-b border-slate-50 mb-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Session Active</p>
                    <p className="text-sm font-bold text-slate-800">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => { onLogout(); setShowDropdown(false); }}
                    className="w-full text-left px-6 py-4 text-xs font-black text-red-400 hover:bg-red-50 rounded-xl transition-all uppercase tracking-[0.2em] flex items-center justify-between group"
                  >
                    Logout
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onAuth}
              className="bg-slate-900 text-white text-xs font-black uppercase tracking-[0.3em] px-10 py-5 rounded-full hover:bg-hannora-green transition-all shadow-xl"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
