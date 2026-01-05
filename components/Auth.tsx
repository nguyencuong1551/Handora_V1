
import React, { useState, useRef } from 'react';

interface AuthProps {
  onLogin: (user: any) => void;
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    phone: '',
    avatar: '' 
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic mô phỏng: Lưu thông tin vào bộ nhớ tạm/JSON 
    const user = { 
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email, 
      name: formData.name || (formData.email.includes('admin') ? 'Administrator' : 'Customer'), 
      phone: formData.phone,
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${formData.name || 'User'}&background=4a7c59&color=fff`,
      role: formData.email.includes('admin') ? 'admin' : 'user' 
    };
    
    // Thay vì localStorage, ta gọi onLogin để App xử lý state
    onLogin(user);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 w-screen h-screen">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-[50px] shadow-2xl p-8 md:p-12 animate-fade-in mx-auto overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90 p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-hannora-green/10 text-hannora-green rounded-[30px] flex items-center justify-center text-4xl mx-auto mb-6">🌿</div>
          <h2 className="text-4xl font-serif text-slate-800 mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-400 text-sm italic font-medium">
            {isLogin ? 'Enter your ritual access details.' : 'Start your botanical skincare journey today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="w-24 h-24 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-hannora-green transition-all relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.avatar ? (
                    <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <span className="text-2xl text-slate-300">📷</span>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <span className="text-[8px] font-bold text-white uppercase tracking-widest">Upload</span>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-3">Profile Picture</p>
              </div>

              {/* Fix: use className instead of class for React JSX */}
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-hannora-green/10 focus:bg-white transition-all text-slate-700"
                  placeholder="Full Name"
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="tel" required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-hannora-green/10 focus:bg-white transition-all text-slate-700"
                  placeholder="Phone Number"
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </>
          )}

          <input 
            type="email" required
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-hannora-green/10 focus:bg-white transition-all text-slate-700"
            placeholder="Email Address"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" required
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-hannora-green/10 focus:bg-white transition-all text-slate-700"
            placeholder="Password"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />

          <button className="w-full btn-shimmer text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl transition-all mt-4">
            {isLogin ? 'Sign In' : 'Register Profile'}
          </button>
        </form>

        <div className="mt-10 text-center pt-8 border-t border-slate-50">
          <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">
            {isLogin ? "New to Handora?" : "Already part of the ritual?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-3 text-hannora-green font-black underline hover:text-slate-900 transition-colors"
            >
              {isLogin ? 'Register Here' : 'Log In Instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
