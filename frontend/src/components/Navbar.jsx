import React from 'react';
import { Sparkles, ShoppingCart } from 'lucide-react';

const Navbar = ({ onNavigate, user, onLogout, cartCount = 0 }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 py-5 bg-[#06060f]/80 backdrop-blur-xl border-b border-white/5">
            <div
                className="logo text-2xl font-black cursor-pointer group flex items-center gap-3"
                onClick={() => onNavigate('home')}
            >
                <img src="/favicon.png" alt="GiftGenie" className="w-10 h-10 object-contain rounded-xl shadow-lg border border-[#f0d060]/20" />
                <span className="text-white tracking-tight">Gift<span className="italic text-[#f0d060]">Genie</span></span>
            </div>

            <ul className="hidden md:flex items-center gap-8">
                <li>
                    <button
                        onClick={() => onNavigate('home')}
                        className="text-[#9090b0] text-sm font-bold tracking-wide hover:text-[#f0d060] transition-colors"
                    >
                        Home
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => onNavigate('library')}
                        className="text-[#9090b0] text-sm font-bold tracking-wide hover:text-[#f0d060] transition-colors"
                    >
                        The Matrix
                    </button>
                </li>
                {user ? (
                    <li className="flex items-center gap-4">
                        <div className="relative group">
                            <button
                                onClick={() => onNavigate('cart')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-all"
                            >
                                <ShoppingCart size={18} className="text-[#f0d060]" />
                                <span>Cart</span>
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#f0d060] text-[#0a0a0f] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#06060f]">
                                    {cartCount}
                                </div>
                            </button>
                        </div>

                        <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/5 rounded-full">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f0d060] to-[#c084fc] flex items-center justify-center text-[#0a0a0f] text-xs font-black">
                                {user?.name ? user.name[0].toUpperCase() : 'U'}
                            </div>
                            <span className="text-white font-bold text-sm pr-2">{user?.name || 'Guest'}</span>
                        </div>

                        {(user?.role === 'ADMIN' || user?.role === 'VENDOR') && (
                            <button
                                onClick={() => onNavigate('admin')}
                                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[#9090b0] font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                            >
                                Vendor
                            </button>
                        )}

                        <button
                            onClick={onLogout}
                            className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[#9090b0] font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                        >
                            Logout
                        </button>
                    </li>
                ) : (
                    <li>
                        <button
                            onClick={() => onNavigate('quiz')}
                            className="btn-primary py-2 px-6"
                        >
                            Analyze Personality →
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
