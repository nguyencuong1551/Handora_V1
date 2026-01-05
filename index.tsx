
import { GoogleGenAI, Type } from "@google/genai";

// --- TYPES & GLOBALS ---
declare global {
  interface Window {
    navigate: (page: string) => void;
    addToBag: (id: string) => void;
    removeFromBag: (index: number) => void;
    handleCheckout: () => void;
    openAuth: () => void;
    closeAuth: () => void;
    handleAuth: (e: Event) => void;
    runAI: (skinType: string) => void;
    // Admin Actions
    saveProduct: (e: Event) => void;
    editProduct: (id: string | null) => void;
    deleteProduct: (id: string) => void;
    handleImageUpload: (e: Event) => void;
    setAdminTab: (tab: string) => void;
    saveBlog: (e: Event) => void;
    editBlog: (id: string | null) => void;
    deleteBlog: (id: string) => void;
    handleBlogImageUpload: (e: Event) => void;
    toggleForm: (type: 'product' | 'blog') => void;
  }
}

// --- DATA ---
const INITIAL_PRODUCTS = [
  { id: '1', name: 'Pomelo Peel Wash', category: 'Hand Rituals', price: 18.00, desc: 'Natural pomelo extracts gently cleanse while maintaining essential moisture.', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800', tag: 'Refreshing', ingredients: ['Cold-pressed Pomelo', 'Vitamin E'] },
  { id: '2', name: 'Green Tea Revitalizer', category: 'Hand Rituals', price: 16.00, desc: 'Antioxidant-rich soap that protects sensitive skin with botanical barrier.', img: 'https://images.unsplash.com/photo-1600175107436-1199b44585ec?auto=format&fit=crop&q=80&w=800', tag: 'Detoxifying', ingredients: ['Matcha Leaf', 'Glycerin'] },
  { id: '3', name: 'Aloe Vera Calm', category: 'Hand Rituals', price: 17.50, desc: 'Instant hydration boost with organic, succulent aloe vera juices.', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800', tag: 'Soothing', ingredients: ['Inner Fillet Aloe', 'Cucumber'] },
  { id: '4', name: 'Lavender Hand Balm', category: 'Skin Therapy', price: 22.00, desc: 'Soothe your mind and nourish your hands with calming lavender essence.', img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800', tag: 'Nocturnal', ingredients: ['Organic Lavender', 'Shea Butter'] }
];

const INITIAL_BLOGS = [
  { id: 'b1', title: 'The Intelligence of Pomelo', date: '2024-05-15', excerpt: 'How cold-pressed citrus peel transforms daily hygiene into a ritual.', img: 'https://images.unsplash.com/photo-1563245332-692149e79f64?auto=format&fit=crop&q=80&w=800' }
];

// --- APP STATE ---
let state: any = {
  currentPage: 'home',
  cart: [],
  user: null,
  quizLoading: false,
  selectedCategory: 'All',
  products: JSON.parse(localStorage.getItem('handora_products') || JSON.stringify(INITIAL_PRODUCTS)),
  blogs: JSON.parse(localStorage.getItem('handora_blogs') || JSON.stringify(INITIAL_BLOGS)),
  editingId: null,
  editingBlogId: null,
  showProductForm: false,
  showBlogForm: false,
  tempImg: '',
  tempBlogImg: '',
  adminTab: 'products' // Defaulting to products to show the work
};

// --- RENDER ENGINE ---
window.navigate = (page: string) => {
  state.currentPage = page;
  updateNavState();
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.setAdminTab = (tab: string) => {
  state.adminTab = tab;
  state.editingId = null;
  state.editingBlogId = null;
  state.showProductForm = false;
  state.showBlogForm = false;
  state.tempImg = '';
  state.tempBlogImg = '';
  renderApp();
};

window.toggleForm = (type: 'product' | 'blog') => {
  if (type === 'product') {
    state.showProductForm = !state.showProductForm;
    state.editingId = null;
  } else {
    state.showBlogForm = !state.showBlogForm;
    state.editingBlogId = null;
  }
  renderApp();
};

const updateNavState = () => {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-page') === state.currentPage);
  });
};

const renderApp = () => {
  const root = document.getElementById('app-root');
  if (!root) return;

  switch (state.currentPage) {
    case 'home': root.innerHTML = renderHome(); break;
    case 'shop': root.innerHTML = renderShop(); break;
    case 'about': root.innerHTML = renderAbout(); break;
    case 'quiz': root.innerHTML = renderQuiz(); break;
    case 'cart': root.innerHTML = renderCart(); break;
    case 'admin': 
      if (state.user?.isAdmin) {
        root.innerHTML = renderAdmin();
      } else {
        window.navigate('home');
      }
      break;
    default: root.innerHTML = renderHome();
  }
  
  initializeAnimations();
};

const initializeAnimations = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
};

// --- VIEWS ---
const renderHome = () => `
  <section class="relative h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0 scale-110">
      <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=2000" class="w-full h-full object-cover opacity-80" />
      <div class="absolute inset-0 bg-gradient-to-b from-handora-dark/30 via-transparent to-handora-light"></div>
    </div>
    <div class="container mx-auto px-8 relative z-10 text-center reveal-on-scroll">
      <span class="inline-block px-8 py-3 rounded-full border border-handora-green/20 text-[10px] font-black uppercase tracking-[0.6em] text-handora-green mb-8 bg-white/40 backdrop-blur-md">Botanical Engineering</span>
      <h1 class="text-7xl md:text-9xl font-serif text-slate-900 leading-tight mb-12">Vegan <span class="italic font-light text-handora-green">Essence</span>,<br/>Modern Rituals.</h1>
      <div class="flex flex-col md:flex-row items-center justify-center gap-6">
        <button onclick="navigate('shop')" class="btn-shimmer px-14 py-5 rounded-full text-white font-bold text-[10px] uppercase tracking-[0.4em] shadow-2xl">Shop Now</button>
        <button onclick="navigate('quiz')" class="glass px-14 py-5 rounded-full text-slate-800 font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all shadow-xl">AI Skin Consult</button>
      </div>
    </div>
  </section>
`;

const renderShop = () => `
  <section class="pt-48 pb-40 container mx-auto px-8">
    <div class="text-center mb-24 reveal-on-scroll">
       <span class="text-[10px] font-black uppercase tracking-[0.6em] text-handora-green mb-6 block">Our Collection</span>
       <h1 class="text-7xl font-serif mb-8 text-handora-dark">Botanical Systems</h1>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      ${state.products.map((p: any) => `
        <div class="group bg-white rounded-[50px] overflow-hidden shadow-sm hover:shadow-2xl transition-all reveal-on-scroll flex flex-col h-full">
          <div class="aspect-[4/5] overflow-hidden relative">
            <img src="${p.img}" class="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
          </div>
          <div class="p-10 flex flex-col flex-grow">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-2xl font-serif text-slate-800">${p.name}</h3>
              <p class="text-lg font-light text-handora-green">$${Number(p.price).toFixed(2)}</p>
            </div>
            <p class="text-slate-400 text-sm mb-10">${p.desc}</p>
            <button onclick="addToBag('${p.id}')" class="w-full border-2 border-handora-green/20 text-handora-green py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-handora-green hover:text-white transition-all mt-auto">Add to Bag</button>
          </div>
        </div>
      `).join('')}
    </div>
  </section>
`;

const renderAbout = () => `
  <div class="overflow-x-hidden">
    <section class="pt-60 pb-32 container mx-auto px-8 text-center reveal-on-scroll">
      <span class="text-[10px] font-black uppercase tracking-[1em] text-handora-green mb-10 block">Discover Handora</span>
      <h1 class="text-8xl md:text-[10rem] font-serif leading-none text-handora-dark mb-12">
        About <span class="italic font-light text-handora-green">Us</span>
      </h1>
      <p class="text-2xl md:text-4xl font-serif italic text-slate-400 max-w-3xl mx-auto leading-relaxed">
        Blending ancient plant intelligence with modern ethical standards.
      </p>
    </section>
  </div>
`;

const renderQuiz = () => `
  <section class="pt-48 pb-40 container mx-auto px-8 text-center max-w-4xl">
    <h1 class="text-6xl font-serif mb-16 text-handora-dark">AI Botanical Consultation</h1>
    <div id="quiz-container" class="bg-white p-20 rounded-[70px] shadow-2xl border border-handora-light">
      <p class="text-2xl font-serif mb-12 italic">How does your skin feel today?</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${['Dry', 'Sensitive', 'Normal', 'Rough'].map(t => `
          <button onclick="runAI('${t}')" class="p-10 border-2 border-slate-50 rounded-3xl hover:border-handora-green hover:bg-handora-light transition-all font-bold text-slate-600">${t}</button>
        `).join('')}
      </div>
    </div>
  </section>
`;

const renderCart = () => `
  <section class="pt-48 pb-40 container mx-auto px-8 max-w-4xl">
    <h1 class="text-6xl font-serif mb-16">Your Ritual Items</h1>
    ${state.cart.length === 0 ? '<p class="text-slate-400 italic text-center text-xl">The ritual bag is currently empty.</p>' : `
      <div class="space-y-6">
        ${state.cart.map((item: any, i: number) => `
          <div class="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm">
             <div class="flex items-center gap-6">
                <img src="${item.img}" class="w-20 h-20 rounded-2xl object-cover" />
                <p class="text-xl font-serif">${item.name}</p>
             </div>
             <button onclick="removeFromBag(${i})" class="text-red-300 font-black uppercase text-[9px] tracking-widest">Remove</button>
          </div>
        `).join('')}
        <div class="pt-12 text-right">
           <p class="text-4xl font-serif mb-8 text-handora-dark">Total: $${state.cart.reduce((s: number, i: any) => s + i.price, 0).toFixed(2)}</p>
           <button onclick="handleCheckout()" class="btn-shimmer text-white px-14 py-6 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">Complete Ritual</button>
        </div>
      </div>
    `}
  </section>
`;

// --- ADMIN COMPONENTS ---

const renderAdmin = () => `
  <section class="pt-48 pb-40 container mx-auto px-8 flex flex-col lg:flex-row gap-8 items-start">
    <!-- Sidebar -->
    <div class="lg:w-72 w-full sticky top-32">
      <div class="bg-white rounded-[40px] p-10 shadow-xl border border-slate-50">
        <h2 class="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 mb-10 pl-2">Admin Control</h2>
        <nav class="flex flex-col gap-2">
          <button onclick="setAdminTab('dashboard')" class="text-left px-8 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all ${state.adminTab === 'dashboard' ? 'bg-[#1a2e21] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}">Dashboard</button>
          <button onclick="setAdminTab('products')" class="text-left px-8 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all ${state.adminTab === 'products' ? 'bg-[#1a2e21] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}">Product Management</button>
          <button onclick="setAdminTab('news')" class="text-left px-8 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all ${state.adminTab === 'news' ? 'bg-[#1a2e21] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}">News Management</button>
        </nav>
      </div>
    </div>

    <!-- Main Admin Content -->
    <div class="flex-grow w-full">
      <div class="bg-white rounded-[70px] shadow-2xl p-12 md:p-16 border border-slate-50 min-h-[70vh]">
        ${state.adminTab === 'dashboard' ? renderAdminDashboard() : ''}
        ${state.adminTab === 'products' ? renderAdminProducts() : ''}
        ${state.adminTab === 'news' ? renderAdminNews() : ''}
      </div>
    </div>
  </section>
`;

const renderAdminDashboard = () => `
  <div class="animate-reveal">
    <h2 class="text-5xl font-serif mb-12 text-handora-dark">System Overview</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div class="bg-handora-light/50 p-10 rounded-[40px] border border-handora-green/10">
        <p class="text-[10px] font-black uppercase tracking-widest text-handora-green mb-2">Total Products</p>
        <p class="text-5xl font-serif text-handora-dark">${state.products.length}</p>
      </div>
      <div class="bg-handora-light/50 p-10 rounded-[40px] border border-handora-green/10">
        <p class="text-[10px] font-black uppercase tracking-widest text-handora-green mb-2">Botanical Articles</p>
        <p class="text-5xl font-serif text-handora-dark">${state.blogs.length}</p>
      </div>
      <div class="bg-handora-light/50 p-10 rounded-[40px] border border-handora-green/10">
        <p class="text-[10px] font-black uppercase tracking-widest text-handora-green mb-2">Cart Activity</p>
        <p class="text-5xl font-serif text-handora-dark">${state.cart.length} items</p>
      </div>
    </div>
  </div>
`;

const renderAdminProducts = () => {
  const editingProduct = state.editingId ? state.products.find((p:any) => p.id === state.editingId) : null;
  const isShowForm = state.showProductForm || state.editingId !== null;

  return `
  <div class="animate-reveal">
    <div class="flex justify-between items-center mb-16">
       <h2 class="text-5xl font-serif text-handora-dark">Product Management</h2>
       <button onclick="toggleForm('product')" class="bg-handora-green text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">
          ${isShowForm ? '✕ Close' : '+ New Item'}
       </button>
    </div>

    ${isShowForm ? `
      <div class="mb-20 bg-slate-50/50 p-12 rounded-[50px] border border-slate-100 animate-reveal">
        <form onsubmit="saveProduct(event)" class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="space-y-6">
                <input id="p-name" type="text" placeholder="Product Name" required value="${editingProduct?.name || ''}" class="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 outline-none focus:ring-2 ring-handora-green/10 transition-all">
                <input id="p-price" type="number" step="0.01" placeholder="Price ($)" required value="${editingProduct?.price || ''}" class="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 outline-none focus:ring-2 ring-handora-green/10 transition-all">
                <select id="p-category" class="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 outline-none focus:ring-2 ring-handora-green/10 transition-all">
                    <option value="Hand Rituals" ${editingProduct?.category === 'Hand Rituals' ? 'selected' : ''}>Hand Rituals</option>
                    <option value="Skin Therapy" ${editingProduct?.category === 'Skin Therapy' ? 'selected' : ''}>Skin Therapy</option>
                </select>
            </div>
            <div class="space-y-6">
                <textarea id="p-desc" placeholder="Brief Description" required class="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 outline-none h-32 focus:ring-2 ring-handora-green/10 transition-all">${editingProduct?.desc || ''}</textarea>
                <div class="flex items-center gap-6">
                    <label class="flex-grow bg-white border-2 border-dashed border-slate-200 rounded-3xl px-8 py-6 text-center cursor-pointer hover:bg-slate-100 transition-all">
                        <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ritual Asset</span>
                        <input type="file" onchange="handleImageUpload(event)" accept="image/*" class="hidden">
                    </label>
                    ${state.tempImg || editingProduct?.img ? `<img src="${state.tempImg || editingProduct?.img}" class="w-24 h-24 rounded-3xl object-cover shadow-xl" />` : ''}
                </div>
            </div>
            <div class="md:col-span-2 flex gap-6">
                <button type="submit" class="flex-grow bg-[#1a2e21] text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-handora-green transition-all">
                    ${editingProduct ? 'Update Ritual Asset' : 'Manifest Ritual Item'}
                </button>
            </div>
        </form>
      </div>
    ` : ''}

    <div class="space-y-6">
      ${state.products.map((p: any) => `
        <div class="flex justify-between items-center p-8 bg-[#f8faf8] rounded-[40px] hover:bg-white border border-transparent hover:border-handora-green/5 transition-all shadow-sm">
          <div class="flex items-center gap-8">
            <img src="${p.img}" class="w-20 h-20 rounded-[30px] object-cover shadow-md" />
            <div>
              <p class="text-xl font-serif text-slate-800 mb-1">${p.name}</p>
              <p class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">$${Number(p.price).toFixed(2)}</p>
            </div>
          </div>
          <div class="flex gap-8">
            <button onclick="editProduct('${p.id}')" class="text-[10px] font-black uppercase text-handora-green tracking-widest hover:scale-110 transition-transform">Edit</button>
            <button onclick="deleteProduct('${p.id}')" class="text-[10px] font-black uppercase text-red-300 tracking-widest hover:scale-110 transition-transform">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
`;};

const renderAdminNews = () => {
  const editingBlog = state.editingBlogId ? state.blogs.find((b:any) => b.id === state.editingBlogId) : null;
  const isShowForm = state.showBlogForm || state.editingBlogId !== null;

  return `
  <div class="animate-reveal">
    <div class="flex justify-between items-center mb-16">
       <h2 class="text-5xl font-serif text-handora-dark">News Management</h2>
       <button onclick="toggleForm('blog')" class="bg-handora-green text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">
          ${isShowForm ? '✕ Close' : '+ New Article'}
       </button>
    </div>

    ${isShowForm ? `
      <div class="mb-20 bg-slate-50/50 p-12 rounded-[50px] border border-slate-100 animate-reveal">
        <form onsubmit="saveBlog(event)" class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="space-y-6">
                <input id="b-title" type="text" placeholder="Article Title" required value="${editingBlog?.title || ''}" class="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 outline-none focus:ring-2 ring-handora-green/10 transition-all">
                <input id="b-date" type="date" required value="${editingBlog?.date || new Date().toISOString().split('T')[0]}" class="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 outline-none focus:ring-2 ring-handora-green/10 transition-all">
            </div>
            <div class="space-y-6">
                <textarea id="b-excerpt" placeholder="Short Excerpt" required class="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 outline-none h-32 focus:ring-2 ring-handora-green/10 transition-all">${editingBlog?.excerpt || ''}</textarea>
                <div class="flex items-center gap-6">
                    <label class="flex-grow bg-white border-2 border-dashed border-slate-200 rounded-3xl px-8 py-6 text-center cursor-pointer hover:bg-slate-100 transition-all">
                        <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Header Asset</span>
                        <input type="file" onchange="handleBlogImageUpload(event)" accept="image/*" class="hidden">
                    </label>
                    ${state.tempBlogImg || editingBlog?.img ? `<img src="${state.tempBlogImg || editingBlog?.img}" class="w-24 h-24 rounded-3xl object-cover shadow-xl" />` : ''}
                </div>
            </div>
            <div class="md:col-span-2 flex gap-6">
                <button type="submit" class="flex-grow bg-[#1a2e21] text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-handora-green transition-all">
                    ${editingBlog ? 'Update Chronicle' : 'Publish Article'}
                </button>
            </div>
        </form>
      </div>
    ` : ''}

    <div class="space-y-6">
      ${state.blogs.map((b: any) => `
        <div class="flex justify-between items-center p-8 bg-[#f8faf8] rounded-[40px] hover:bg-white border border-transparent hover:border-handora-green/5 transition-all shadow-sm">
          <div class="flex items-center gap-8">
            <img src="${b.img}" class="w-20 h-20 rounded-[30px] object-cover shadow-md" />
            <div>
              <p class="text-xl font-serif text-slate-800 mb-1">${b.title}</p>
              <p class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">${b.date}</p>
            </div>
          </div>
          <div class="flex gap-8">
            <button onclick="editBlog('${b.id}')" class="text-[10px] font-black uppercase text-handora-green tracking-widest hover:scale-110 transition-transform">Edit</button>
            <button onclick="deleteBlog('${b.id}')" class="text-[10px] font-black uppercase text-red-300 tracking-widest hover:scale-110 transition-transform">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
`;};

// --- HANDLERS ---

window.handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => { state.tempImg = reader.result; renderApp(); };
        reader.readAsDataURL(file);
    }
};

window.handleBlogImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => { state.tempBlogImg = reader.result; renderApp(); };
        reader.readAsDataURL(file);
    }
};

window.saveProduct = (e: Event) => {
    e.preventDefault();
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const category = (document.getElementById('p-category') as HTMLSelectElement).value;
    const desc = (document.getElementById('p-desc') as HTMLTextAreaElement).value;
    const img = state.tempImg || (state.editingId ? state.products.find((p:any)=>p.id === state.editingId).img : 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800');

    if (state.editingId) {
        state.products = state.products.map((p: any) => p.id === state.editingId ? { ...p, name, price: parseFloat(price), category, desc, img } : p);
    } else {
        state.products.unshift({ id: Date.now().toString(), name, price: parseFloat(price), category, desc, img, ingredients: ['Botanical Base'] });
    }
    localStorage.setItem('handora_products', JSON.stringify(state.products));
    state.editingId = null;
    state.showProductForm = false;
    state.tempImg = '';
    renderApp();
};

window.saveBlog = (e: Event) => {
    e.preventDefault();
    const title = (document.getElementById('b-title') as HTMLInputElement).value;
    const date = (document.getElementById('b-date') as HTMLInputElement).value;
    const excerpt = (document.getElementById('b-excerpt') as HTMLTextAreaElement).value;
    const img = state.tempBlogImg || (state.editingBlogId ? state.blogs.find((b:any)=>b.id === state.editingBlogId).img : 'https://images.unsplash.com/photo-1563245332-692149e79f64?auto=format&fit=crop&q=80&w=800');

    if (state.editingBlogId) {
        state.blogs = state.blogs.map((b: any) => b.id === state.editingBlogId ? { ...b, title, date, excerpt, img } : b);
    } else {
        state.blogs.unshift({ id: 'b'+Date.now().toString(), title, date, excerpt, img });
    }
    localStorage.setItem('handora_blogs', JSON.stringify(state.blogs));
    state.editingBlogId = null;
    state.showBlogForm = false;
    state.tempBlogImg = '';
    renderApp();
};

window.editProduct = (id: string | null) => { state.editingId = id; state.showProductForm = false; state.tempImg = ''; renderApp(); };
window.editBlog = (id: string | null) => { state.editingBlogId = id; state.showBlogForm = false; state.tempBlogImg = ''; renderApp(); };

window.deleteProduct = (id: string) => {
    if (confirm('Remove item from collection?')) {
        state.products = state.products.filter((p: any) => p.id !== id);
        localStorage.setItem('handora_products', JSON.stringify(state.products));
        renderApp();
    }
};

window.deleteBlog = (id: string) => {
    if (confirm('Delete this article?')) {
        state.blogs = state.blogs.filter((b: any) => b.id !== id);
        localStorage.setItem('handora_blogs', JSON.stringify(state.blogs));
        renderApp();
    }
};

// --- GLOBAL ACTIONS ---
window.addToBag = (id: string) => {
  const p = state.products.find((x:any) => x.id === id);
  if (p) {
    state.cart.push(p);
    updateCartUI();
  }
};

window.removeFromBag = (index: number) => {
  state.cart.splice(index, 1);
  updateCartUI();
  renderApp();
};

const updateCartUI = () => {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    countEl.innerText = state.cart.length.toString();
    countEl.classList.toggle('hidden', state.cart.length === 0);
  }
};

window.handleCheckout = () => {
    alert("Order processed. Nature is on the way.");
    state.cart = [];
    updateCartUI();
    window.navigate('home');
};

window.openAuth = () => document.getElementById('auth-modal')?.classList.remove('hidden');
window.closeAuth = () => document.getElementById('auth-modal')?.classList.add('hidden');

window.handleAuth = (e: Event) => {
  e.preventDefault();
  const emailInput = document.getElementById('auth-email') as HTMLInputElement;
  const email = emailInput?.value || '';
  state.user = { 
    name: email.split('@')[0], 
    isAdmin: email.toLowerCase().includes('admin'),
    email: email
  };
  
  const authArea = document.getElementById('auth-area');
  if (authArea) {
    authArea.innerHTML = `
      <div class="flex items-center gap-4 bg-handora-light pl-4 pr-1 py-1 rounded-full border border-handora-green/20">
        <span class="text-[9px] font-black uppercase text-handora-green tracking-widest">${state.user.name}</span>
        <div onclick="sessionStorage.clear(); location.reload();" class="w-9 h-9 bg-handora-green text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer hover:bg-red-400 transition-colors">${state.user.name[0].toUpperCase()}</div>
      </div>
    `;
  }

  if (state.user.isAdmin) {
    const navLinks = document.getElementById('nav-links');
    if (navLinks && !document.querySelector('[data-page="admin"]')) {
      const adminBtn = document.createElement('button');
      adminBtn.onclick = () => window.navigate('admin');
      adminBtn.className = 'nav-link';
      adminBtn.setAttribute('data-page', 'admin');
      adminBtn.innerText = 'Admin';
      navLinks.appendChild(adminBtn);
    }
  }
  
  window.closeAuth();
  updateNavState();
  if (state.user.isAdmin) window.navigate('admin');
};

window.runAI = async (skinType: string) => {
  state.quizLoading = true;
  renderApp();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Suggest a botanical skincare ritual for ${skinType} skin. Use: ${state.products.map((p:any) => p.name).join(', ')}. Return {advice: string, suggest: string} as JSON.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING },
            suggest: { type: Type.STRING }
          }
        }
      }
    });
    const result = JSON.parse(response.text || '{}');
    const container = document.getElementById('quiz-container');
    if (container) {
      container.innerHTML = `
        <div class="text-center reveal-active">
          <p class="text-2xl text-slate-500 mb-10 italic">"${result.advice}"</p>
          <div class="bg-handora-light p-10 rounded-[50px] mb-12">
             <p class="text-4xl font-serif text-handora-dark">${result.suggest}</p>
          </div>
          <button onclick="navigate('shop')" class="btn-shimmer text-white px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest">Shop Recommendations</button>
        </div>
      `;
    }
  } catch (e) {
    alert("AI service unavailable.");
    state.quizLoading = false;
    renderApp();
  }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const nav = document.getElementById('navbar');
    if (scrolled > 50) {
      nav?.classList.add('py-3');
      nav?.firstElementChild?.classList.add('shadow-2xl');
    } else {
      nav?.classList.remove('py-3');
      nav?.firstElementChild?.classList.remove('shadow-2xl');
    }
  });
});
