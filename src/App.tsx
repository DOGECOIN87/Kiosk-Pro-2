import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Plus,
  Image as ImageIcon,
  ChevronLeft,
  X,
  Edit2,
  Trash2,
  Coffee,
  CupSoda,
  Croissant,
  Sandwich,
  ShoppingBag,
  Star,
  Loader2
} from 'lucide-react';

// --- Types ---
type Product = {
  id: string;
  name: string;
  imagePath: string;
  description?: string;
  price?: number;
};

type ProductCategory = {
  id: string;
  name: string;
  iconPath: string;
  iconType?: 'coffee' | 'tea' | 'pastry' | 'sandwich' | 'merch' | 'star';
  products: Product[];
};

// --- Dummy Data ---
const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat_tobacco',
    name: 'Tobacco & Vapes',
    iconPath: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&q=80&w=800',
    products: [
      { id: 'p_marlboro_red', name: 'Marlboro Red', price: 8.50, imagePath: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800', description: 'Classic full flavor.' },
      { id: 'p_marlboro_gold', name: 'Marlboro Gold', price: 8.50, imagePath: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800', description: 'Smooth flavor.' },
      { id: 'p_camel_crush', name: 'Camel Crush', price: 8.00, imagePath: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800', description: 'Menthol on demand.' },
      { id: 'p_newport', name: 'Newport Menthol', price: 9.00, imagePath: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800', description: 'Premium menthol.' },
      { id: 'p_copenhagen', name: 'Copenhagen Wintergreen', price: 6.50, imagePath: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800', description: 'Long cut smokeless tobacco.' },
      { id: 'p_vuse', name: 'Vuse Alto Pods', price: 12.99, imagePath: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800', description: '2-pack replacement pods. Menthol 5%.' },
    ]
  },
  {
    id: 'cat_drinks',
    name: 'Beverages',
    iconPath: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    products: [
      { id: 'p_coke', name: 'Coca-Cola 20oz', price: 2.29, imagePath: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800', description: 'Classic cola.' },
      { id: 'p_redbull', name: 'Red Bull 8.4oz', price: 2.99, imagePath: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800', description: 'Energy drink.' },
    ]
  },
  {
    id: 'cat_snacks',
    name: 'Snacks',
    iconPath: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=800',
    products: [
      { id: 'p_doritos', name: 'Doritos Nacho Cheese', price: 1.99, imagePath: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=800', description: 'Tortilla chips.' },
      { id: 'p_snickers', name: 'Snickers Bar', price: 1.89, imagePath: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=800', description: 'Chocolate, peanuts, caramel.' },
    ]
  },
  {
    id: 'cat_auto',
    name: 'Automotive',
    iconPath: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&q=80&w=800',
    products: [
      { id: 'p_oil', name: 'Motor Oil 5W-30', price: 7.99, imagePath: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&q=80&w=800', description: '1 Quart synthetic blend.' },
    ]
  }
];

// --- Main App Component ---
export default function App() {
  const [categories, setCategories] = useState<ProductCategory[]>(INITIAL_CATEGORIES);
  const [currentView, setCurrentView] = useState<'kiosk' | 'gallery' | 'admin' | 'screensaver'>('kiosk');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  
  // Idle Timer for Screensaver
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const IDLE_TIME = 30000; // 30 seconds for demo purposes

  const resetIdleTimer = () => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    if (currentView !== 'admin') {
      idleTimeoutRef.current = setTimeout(() => {
        setCurrentView('screensaver');
      }, IDLE_TIME);
    }
  };

  useEffect(() => {
    resetIdleTimer();
    const handleActivity = () => {
      if (currentView === 'screensaver') {
        setCurrentView('kiosk');
      }
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [currentView]);

  // --- Handlers ---
  const handleCategoryTap = (category: ProductCategory) => {
    setSelectedCategory(category);
    setCurrentView('gallery');
  };

  const handleBackToKiosk = () => {
    setSelectedCategory(null);
    setCurrentView('kiosk');
  };

  const handleAdminToggle = () => {
    setCurrentView(currentView === 'admin' ? 'kiosk' : 'admin');
  };

  return (
    <div className="w-full h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans select-none">
      <AnimatePresence mode="wait">
        {currentView === 'screensaver' && (
          <Screensaver key="screensaver" />
        )}
        
        {currentView === 'kiosk' && (
          <KioskView 
            key="kiosk" 
            categories={categories} 
            onCategoryTap={handleCategoryTap} 
            onAdminToggle={handleAdminToggle} 
          />
        )}

        {currentView === 'gallery' && selectedCategory && (
          <GalleryView 
            key="gallery" 
            category={selectedCategory} 
            onBack={handleBackToKiosk} 
          />
        )}

        {currentView === 'admin' && (
          <AdminView 
            key="admin" 
            categories={categories} 
            setCategories={setCategories} 
            onClose={handleAdminToggle} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Screensaver Component ---
function Screensaver() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-white">
          TEXACO<span className="font-light text-red-600"> Kiosk</span>
        </h1>
        <p className="text-xl md:text-3xl text-zinc-400 font-light tracking-widest uppercase">
          Touch anywhere to begin
        </p>
      </motion.div>
      
      {/* Background atmospheric effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.15),_transparent_50%)] pointer-events-none" />
    </motion.div>
  );
}

// --- Kiosk View Component ---
function KioskView({ 
  categories, 
  onCategoryTap, 
  onAdminToggle 
}: { 
  key?: React.Key,
  categories: ProductCategory[], 
  onCategoryTap: (c: ProductCategory) => void,
  onAdminToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full flex flex-col p-6 md:p-12 relative"
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-10 relative">
        <div className="w-16"></div> {/* Spacer */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center flex-1">
          TEXACO MENU
        </h1>
        
        {/* Hidden Admin Button (Top Right Corner) */}
        <button 
          onClick={onAdminToggle}
          className="w-16 h-16 opacity-0 hover:opacity-20 transition-opacity flex items-center justify-center rounded-full"
        >
          <Settings size={24} />
        </button>
      </header>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              index={index}
              onTap={() => onCategoryTap(category)} 
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// --- Category Card Component ---
function CategoryCard({ 
  category, 
  index,
  onTap 
}: { 
  key?: React.Key,
  category: ProductCategory, 
  index: number,
  onTap: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/5 shadow-xl"
    >
      {/* Background Image */}
      {category.iconPath ? (
        <img 
          src={category.iconPath} 
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
          <ImageIcon size={48} className="text-zinc-600" />
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
          {category.name}
        </h3>
        <p className="text-zinc-200 text-sm mt-1 font-medium">
          {category.products.length} Items
        </p>
      </div>
    </motion.div>
  );
}

// --- Gallery View Component ---
function GalleryView({ 
  category, 
  onBack 
}: { 
  key?: React.Key,
  category: ProductCategory, 
  onBack: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full flex flex-col bg-zinc-950"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-6 md:p-8 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10 relative">
        <button 
          onClick={onBack}
          className="flex items-center justify-center px-5 h-14 rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-95 z-10"
        >
          <ChevronLeft size={24} className="mr-2" />
          <span className="font-medium text-lg">Back</span>
        </button>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
          <p className="text-zinc-400 mt-1">{category.products.length} products available</p>
        </div>
        <div className="w-24"></div>
      </header>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        {category.products.length === 0 ? (
          <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-500">
            <ShoppingBag size={48} className="mb-4 opacity-50" />
            <p className="text-xl">No items in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// --- Product Card Component ---
function ProductCard({ product, index }: { key?: React.Key, product: Product, index: number }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 flex flex-col group"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-zinc-800">
        {product.imagePath ? (
          <img 
            src={product.imagePath} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={32} className="text-zinc-600" />
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col items-center text-center">
        <div className="flex flex-col items-center mb-2">
          <h3 className="text-xl font-bold leading-tight">{product.name}</h3>
          {product.price && (
            <span className="text-red-500 font-bold mt-2 text-lg">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-zinc-400 text-sm line-clamp-2 mt-1 flex-1">
            {product.description}
          </p>
        )}
        <button 
          onClick={handleAdd}
          className={`mt-6 w-full py-3 font-bold rounded-xl transition-colors active:scale-[0.98] ${
            added ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {added ? 'Added to Order!' : 'Add to Order'}
        </button>
      </div>
    </motion.div>
  );
}

// --- Admin View Component ---
function AdminView({ 
  categories, 
  setCategories, 
  onClose 
}: { 
  key?: React.Key,
  categories: ProductCategory[], 
  setCategories: React.Dispatch<React.SetStateAction<ProductCategory[]>>,
  onClose: () => void 
}) {
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  const handleAddCategory = () => {
    const newCategory: ProductCategory = {
      id: `cat_${Date.now()}`,
      name: 'New Category',
      iconPath: `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800`,
      products: []
    };
    setCategories([...categories, newCategory]);
    setEditingCategory(newCategory);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSaveCategory = (updatedCategory: ProductCategory) => {
    setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    setEditingCategory(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-zinc-950 z-50 flex flex-col"
    >
      <header className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Texaco Kiosk Admin</h1>
          <p className="text-zinc-400 text-sm">Manage categories and products</p>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl mx-auto w-full">
        {editingCategory ? (
          <CategoryEditor 
            category={editingCategory} 
            onSave={handleSaveCategory} 
            onCancel={() => setEditingCategory(null)} 
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Categories</h2>
              <button 
                onClick={handleAddCategory}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
              >
                <Plus size={20} className="mr-2" />
                Add Category
              </button>
            </div>

            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-zinc-900 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                      {category.iconPath ? (
                        <img src={category.iconPath} alt={category.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-zinc-500" /></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{category.name}</h3>
                      <p className="text-zinc-400 text-sm">{category.products.length} products</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingCategory(category)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function CategoryEditor({ 
  category, 
  onSave, 
  onCancel 
}: { 
  category: ProductCategory, 
  onSave: (c: ProductCategory) => void, 
  onCancel: () => void 
}) {
  const [name, setName] = useState(category.name);
  const [iconPath, setIconPath] = useState(category.iconPath);
  const [products, setProducts] = useState(category.products);

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `p_${Date.now()}`,
      name: 'New Product',
      price: 0.00,
      imagePath: '',
      description: ''
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSave = () => {
    onSave({
      ...category,
      name,
      iconPath,
      products
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Edit Category</h2>
        <div className="flex space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Category Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Image URL</label>
          <input 
            type="text" 
            value={iconPath}
            onChange={(e) => setIconPath(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
          />
          <ImageSearchSelector 
            query={name} 
            currentUrl={iconPath}
            onSelect={(url) => setIconPath(url)} 
          />
          {iconPath && (
            <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden bg-zinc-800 border border-white/10">
              <img src={iconPath} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Products</h3>
          <button 
            onClick={handleAddProduct}
            className="flex items-center px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus size={16} className="mr-1.5" />
            Add Product
          </button>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-zinc-900 border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Product Details</h4>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Name</label>
                  <input 
                    type="text" 
                    value={product.name}
                    onChange={(e) => handleUpdateProduct(product.id, 'name', e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={product.price || ''}
                    onChange={(e) => handleUpdateProduct(product.id, 'price', parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Description</label>
                  <input 
                    type="text" 
                    value={product.description || ''}
                    onChange={(e) => handleUpdateProduct(product.id, 'description', e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Image URL</label>
                  <input 
                    type="text" 
                    value={product.imagePath}
                    onChange={(e) => handleUpdateProduct(product.id, 'imagePath', e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <ImageSearchSelector 
                    query={product.name} 
                    currentUrl={product.imagePath}
                    onSelect={(url) => handleUpdateProduct(product.id, 'imagePath', url)} 
                  />
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-8 text-zinc-500 bg-zinc-900/50 rounded-xl border border-white/5">
              No products in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Image Search Component ---
function ImageSearchSelector({ 
  query, 
  onSelect, 
  currentUrl 
}: { 
  query: string, 
  onSelect: (url: string) => void,
  currentUrl: string
}) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 3) {
      setImages([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const urls: string[] = [];
        
        // OpenFoodFacts (good for snacks/drinks)
        try {
          const offRes = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=4`);
          const offData = await offRes.json();
          if (offData.products) {
            urls.push(...offData.products.map((p: any) => p.image_front_url || p.image_url).filter(Boolean));
          }
        } catch (e) {}

        // Wikimedia Commons (good for brands, tobacco, auto)
        if (urls.length < 4) {
          try {
            const wikiRes = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url&format=json&origin=*`);
            const wikiData = await wikiRes.json();
            if (wikiData.query && wikiData.query.pages) {
              const wikiUrls = Object.values(wikiData.query.pages)
                .map((p: any) => p.imageinfo?.[0]?.url)
                .filter((url: any) => url && typeof url === 'string' && !url.toLowerCase().endsWith('.svg') && !url.toLowerCase().endsWith('.pdf'));
              urls.push(...wikiUrls);
            }
          } catch (e) {}
        }

        setImages(Array.from(new Set(urls)).slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 800); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  if (!query || query.length < 3) return null;

  return (
    <div className="mt-3">
      <p className="text-xs text-zinc-400 mb-2 flex items-center">
        {loading ? (
          <><Loader2 size={14} className="animate-spin mr-1.5" /> Searching images for "{query}"...</>
        ) : images.length > 0 ? (
          'Suggested Images (Click to select):'
        ) : (
          'No image suggestions found.'
        )}
      </p>
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => onSelect(url)}
              className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${currentUrl === url ? 'border-red-500 scale-105' : 'border-transparent hover:border-white/30'}`}
            >
              <img src={url} alt="Suggestion" className="w-full h-full object-cover bg-white" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
