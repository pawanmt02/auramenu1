import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  Glasses, 
  Receipt,
  QrCode
} from 'lucide-react';
import type { Dish } from '../../types';
import { soundFx } from '../../services/soundFx';

export interface CartItem {
  dish: Dish;
  quantity: number;
}

interface OrderCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onLaunchAR: (dish: Dish) => void;
  onClearCart: () => void;
}

export const OrderCartDrawer: React.FC<OrderCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onLaunchAR,
  onClearCart
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [orderCheckedOut, setOrderCheckedOut] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
  const totalCalories = cartItems.reduce((acc, item) => acc + item.dish.calories * item.quantity, 0);
  const discount = discountApplied ? Math.round(subtotal * 0.2) : 0;
  const taxes = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + taxes;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toLowerCase() === 'auravip' || promoCode.trim().toLowerCase() === 'spatial') {
      soundFx.playAnchorThud();
      setDiscountApplied(true);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } else {
      alert('Try promo code "AURAVIP" or "SPATIAL" for 20% off!');
    }
  };

  const handleCheckout = () => {
    soundFx.playAnchorThud();
    soundFx.playSizzleSound(2.0);
    setOrderCheckedOut(true);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Slide-over Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="relative z-10 w-full max-w-md bg-zinc-900 border-l border-white/10 h-full flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          {/* Top Header */}
          <div className="p-5 bg-zinc-900/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-zinc-100 font-heading">
                  Spatial Culinary Tray
                </h3>
                <span className="text-[11px] text-zinc-400">
                  {cartItems.length} items • {totalCalories} kcal total
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Content Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            {orderCheckedOut ? (
              /* Animated Receipt Pass */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-zinc-950 border border-amber-500/40 text-center space-y-4 shadow-2xl"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check size={28} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                    Order Synchronized to Kitchen
                  </span>
                  <h4 className="text-xl font-black text-zinc-100 font-heading">
                    Table Pass #AR-942
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Your chef is handcrafting these heritage dishes. Track live steam and prep in WebXR.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Total Paid</span>
                  <span className="text-base font-black text-amber-400">₹{total}</span>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl flex items-center justify-center gap-2 text-zinc-300 text-xs">
                  <QrCode size={24} className="text-amber-400" />
                  <span className="font-mono text-[11px]">AURAPASS-TABLE-04</span>
                </div>

                <button
                  onClick={() => {
                    setOrderCheckedOut(false);
                    onClearCart();
                    onClose();
                  }}
                  className="w-full py-3 rounded-2xl bg-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider"
                >
                  Return to Menu
                </button>
              </motion.div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-20 text-zinc-500">
                <ShoppingBag size={48} className="mx-auto text-zinc-700 mb-3" />
                <h4 className="text-base font-bold text-zinc-400">Your table tray is empty</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Add dishes from the Culinary Library to stage your customized feast!
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <motion.div
                  key={item.dish.id}
                  layout
                  className="p-3.5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-100 truncate font-heading">
                      {item.dish.name}
                    </h4>
                    <span className="text-[11px] text-amber-400 font-serif italic">
                      ₹{item.dish.price} each
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.dish.id, -1)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-bold text-zinc-100 min-w-[16px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.dish.id, 1)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Launch AR preview for this dish */}
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchAR(item.dish);
                    }}
                    className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                    title="Inspect in AR"
                  >
                    <Glasses size={15} />
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => onRemoveItem(item.dish.id)}
                    className="p-2 rounded-xl hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {/* Bottom Billing Breakdown & Checkout */}
          {!orderCheckedOut && cartItems.length > 0 && (
            <div className="p-5 bg-zinc-950 border-t border-white/10 space-y-3">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo (try AURAVIP)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-zinc-100 uppercase"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-400 border border-amber-400/30"
                >
                  Apply
                </button>
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200">₹{subtotal}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Member Discount (20%)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Culinary Taxes (5% GST)</span>
                  <span className="text-zinc-200">₹{taxes}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-zinc-100 pt-2 border-t border-white/10">
                  <span>Total Due</span>
                  <span className="text-amber-400">₹{total}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.6)] cursor-pointer"
              >
                <Receipt size={16} />
                <span>CONFIRM SPATIAL ORDER (₹{total})</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
