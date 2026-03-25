import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const GiftCard = ({ gift, onCustomize }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="gift-card-luxury"
        >
            <div className="gift-img-wrap bg-white/5 relative">
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <span className="bg-[#f0d060]/10 border border-[#f0d060]/20 rounded-full px-3 py-1 text-[9px] text-[#f0d060] font-black uppercase tracking-widest backdrop-blur-md">
                        {gift.mbti_types ? gift.mbti_types[0] : 'Universal'}
                    </span>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-[radial-gradient(circle_at_center,_var(--gold),_transparent_70%)]" />

                {gift.image_url ? (
                    <img src={gift.image_url} alt={gift.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-white/5 to-transparent drop-shadow-[0_0_20px_rgba(240,208,96,0.2)]">
                        {gift.emoji || '🎁'}
                    </div>
                )}
            </div>

            <div className="p-8 space-y-5">
                <div>
                    <h3 className="text-white font-playfair font-black text-xl mb-2">{gift.name}</h3>
                    <p className="text-[#9090b0] text-sm leading-relaxed line-clamp-2">
                        {gift.description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#9090b0] uppercase tracking-widest font-black mb-1">Investment</span>
                        <div className="text-[#f0d060] font-playfair font-black text-2xl">
                            ₹{gift.price ? gift.price.toLocaleString() : '0'}
                        </div>
                    </div>
                    <button
                        onClick={() => onCustomize(gift)}
                        className="w-12 h-12 rounded-xl bg-[#f0d060] text-[#0a0a0f] flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_8px_16px_rgba(240,208,96,0.3)]"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default GiftCard;
