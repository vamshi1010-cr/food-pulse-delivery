import React, { useState } from 'react';
import { X, Plus, Minus, CheckCircle, Flame, Clock, Sparkles } from 'lucide-react';
import type { MenuItem, AddonOption, CartAddonSelection } from '../../types/food';

interface DishModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem, 
    quantity: number, 
    selectedAddons: CartAddonSelection[], 
    instructions: string,
    totalPrice: number
  ) => void;
}

export const DishModal: React.FC<DishModalProps> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, AddonOption[]>>({});

  const handleOptionToggle = (groupId: string, option: AddonOption, isRequired: boolean, maxSelect?: number) => {
    setSelectedAddons((prev) => {
      const currentList = prev[groupId] || [];
      const exists = currentList.some((opt) => opt.id === option.id);

      if (exists) {
        return {
          ...prev,
          [groupId]: currentList.filter((opt) => opt.id !== option.id)
        };
      } else {
        if (maxSelect === 1 || isRequired) {
          // Single select group
          return {
            ...prev,
            [groupId]: [option]
          };
        } else {
          // Multi select group
          return {
            ...prev,
            [groupId]: [...currentList, option]
          };
        }
      }
    });
  };

  // Calculate total price with selected addons
  const addonTotalPrice = Object.values(selectedAddons)
    .flat()
    .reduce((sum, opt) => sum + opt.price, 0);

  const unitPrice = item.price + addonTotalPrice;
  const totalPrice = unitPrice * quantity;

  // Check if required addon groups are satisfied
  const isRequiredSatisfied = (item.addonGroups || [])
    .filter((g) => g.required)
    .every((g) => (selectedAddons[g.id] || []).length > 0);

  const handleAdd = () => {
    if (!isRequiredSatisfied) return;

    const formattedAddons: CartAddonSelection[] = Object.entries(selectedAddons).map(
      ([groupId, options]) => {
        const groupObj = item.addonGroups?.find((g) => g.id === groupId);
        return {
          groupId,
          groupTitle: groupObj?.title || 'Addon',
          selectedOptions: options
        };
      }
    );

    onAddToCart(item, quantity, formattedAddons, instructions, totalPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Hero Image */}
        <div className="relative h-56 sm:h-64 shrink-0 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full border border-slate-700 backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border ${
                  item.isVeg 
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' 
                    : 'border-rose-500 text-rose-400 bg-rose-500/10'
                }`}>
                  {item.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
                {item.isBestseller && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Bestseller
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight">{item.name}</h2>
              <div className="flex items-center space-x-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  ★ {item.rating} ({item.ratingCount} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.preparationTimeMinutes} mins prep
                </span>
                {item.calories && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Flame className="w-3.5 h-3.5 text-orange-400" /> {item.calories} kcal
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-2xl font-extrabold text-orange-400">
              ₹{item.price}
            </div>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>

          {/* Addon Groups */}
          {item.addonGroups && item.addonGroups.length > 0 ? (
            item.addonGroups.map((group) => (
              <div key={group.id} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                      {group.title}
                      {group.required && (
                        <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                          REQUIRED
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {group.maxSelect === 1 ? 'Select any 1 option' : 'Choose as many as you like'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isSelected = (selectedAddons[group.id] || []).some((o) => o.id === option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionToggle(group.id, option, group.required, group.maxSelect)}
                        className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition border ${
                          isSelected
                            ? 'bg-orange-500/15 border-orange-500/50 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-600'
                          }`}>
                            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <span className="font-medium text-sm">{option.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400">
                          {option.price > 0 ? `+ ₹${option.price}` : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50 text-xs text-slate-400 text-center">
              No extra customizations required for this dish. Ready to cook!
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Special Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, extra onions, no cutlery needed"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          
          {/* Quantity Counter */}
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 rounded-2xl p-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 flex items-center justify-center transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-white text-base">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            disabled={!isRequiredSatisfied}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-2xl font-bold flex items-center justify-between shadow-lg shadow-orange-500/25 transition active:scale-[0.99]"
          >
            <span>Add Item</span>
            <span className="text-lg font-extrabold">₹{totalPrice}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
