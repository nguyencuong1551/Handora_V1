
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  return (
    <div className="group relative bg-white overflow-hidden rounded-[40px] hover-lift transition-all duration-500 h-full flex flex-col border border-transparent hover:border-slate-100">
      <div 
        className="aspect-[4/5] bg-hannora-light cursor-pointer overflow-hidden relative flex-shrink-0"
        onClick={onClick}
      >
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        
        <div className="absolute top-8 left-8 reveal delay-3 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
             Essential
           </span>
        </div>
      </div>
      
      <div className="p-10 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-grow">
            <p className="text-xs uppercase tracking-[0.4em] text-hannora-green font-black mb-3">{product.category}</p>
            <h3 className="text-3xl font-serif text-slate-800 leading-[1.2] cursor-pointer hover:text-hannora-green transition-colors" onClick={onClick}>
              {product.name}
            </h3>
          </div>
          <p className="text-2xl font-light text-slate-400 ml-6 tracking-tighter">${product.price.toFixed(2)}</p>
        </div>
        
        <p className="text-base text-slate-500 line-clamp-2 mb-10 leading-relaxed font-medium">
          {product.description}
        </p>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="w-full border-2 border-hannora-green/20 text-hannora-green py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-hannora-green hover:text-white hover:border-hannora-green transition-all duration-500 mt-auto shadow-sm"
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
