import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, MessageSquare, User, Package } from 'lucide-react';
import axios from 'axios';

const VendorDashboard = ({ vendorId }) => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/vendor/orders', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const allOrders = res.data.orders || [];
            setPending(allOrders.filter(o => o.vendor_status === 'pending'));
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.patch(`http://localhost:5000/api/vendor/orders/${id}`,
                { action },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            fetchPending();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="px-8 mt-24 pb-20 space-y-12 animate-fadeUp">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <div className="text-[#f0d060] font-caveat text-2xl tracking-wide">// Artisan Portal</div>
                    <h2 className="text-6xl font-black font-playfair text-white">Design <em className="grad-text hero-gradient italic">Studio</em></h2>
                    <p className="text-[#9090b0] font-medium max-w-lg leading-relaxed">Review and authenticate custom artifact configurations from your patrons.</p>
                </div>
                <div className="bg-white/5 border border-white/5 px-8 py-6 rounded-[32px] flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f0d060]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-right relative z-10">
                        <div className="text-[10px] font-black text-[#9090b0] uppercase tracking-[0.2em] mb-1">Pending Calibration</div>
                        <div className="text-4xl font-black text-[#f0d060] font-playfair">{pending.length}</div>
                    </div>
                    <div className="w-14 h-14 bg-[#f0d060]/10 rounded-2xl flex items-center justify-center text-[#f0d060] relative z-10">
                        <Clock size={28} />
                    </div>
                </div>
            </div>

            <div className="grid gap-8">
                <AnimatePresence>
                    {pending.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="bg-white/5 border border-white/5 rounded-[40px] p-10 grid grid-cols-1 lg:grid-cols-4 gap-12 items-center relative overflow-hidden group hover:border-[#f0d060]/20 transition-all shadow-[0_32px_128px_rgba(0,0,0,0.5)]"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0d060]/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center gap-6 relative z-10">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#f0d060]/20 to-transparent border border-white/10 flex items-center justify-center text-4xl shadow-2xl">
                                        {item.emoji || '🎁'}
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#f0d060] rounded-full flex items-center justify-center text-[#06060f] shadow-lg">
                                        <Package size={14} strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-playfair font-black text-2xl text-white">{item.gift_name}</h4>
                                    <span className="text-[10px] text-[#f0d060] uppercase font-black tracking-widest block">Ref: {item.order_id}</span>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center gap-2 text-[#9090b0] font-black text-[10px] uppercase tracking-[0.2em]">
                                    <User size={14} className="text-[#f0d060]" /> Patron Identity
                                </div>
                                <div className="space-y-1">
                                    <div className="font-bold text-white text-lg">{item.customer_name || 'Anonymous Artisan'}</div>
                                    <div className="text-[10px] text-[#f0d060] font-black uppercase tracking-widest opacity-80 underline decoration-[#f0d060]/30 underline-offset-4">Persona: {item.customer_mbti}</div>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center gap-2 text-[#9090b0] font-black text-[10px] uppercase tracking-[0.2em]">
                                    <MessageSquare size={14} className="text-[#f0d060]" /> Configuration
                                </div>
                                <div className="bg-white/5 border-l-2 border-[#f0d060]/40 pl-6 py-3 rounded-r-2xl">
                                    <div className="font-black text-white text-lg mb-1 italic">"{item.custom_name}"</div>
                                    <div className="text-[#9090b0] text-sm font-medium italic">"{item.custom_message}"</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 relative z-10">
                                <button
                                    onClick={() => handleAction(item.order_id, 'accept')}
                                    className="btn-primary py-4 text-xs"
                                >
                                    <Check size={18} strokeWidth={3} /> Authenticate
                                </button>
                                <button
                                    onClick={() => handleAction(item.order_id, 'reject')}
                                    className="btn-ghost py-4 text-xs text-white/50 hover:text-rose-400"
                                >
                                    <X size={18} strokeWidth={3} /> Reject
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {pending.length === 0 && !loading && (
                    <div className="bg-white/5 border border-white/5 rounded-[48px] p-24 text-center space-y-6">
                        <Package className="mx-auto text-[#2a2a35]" size={80} strokeWidth={1} />
                        <h3 className="text-3xl font-black text-[#9090b0] font-playfair italic">Studio is Clear</h3>
                        <p className="text-[#606070] font-medium max-w-sm mx-auto">No pending configurations require artisan authentication at this time.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VendorDashboard;
