import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CreditCard, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import axios from 'axios';

const OrderTracker = ({ userId }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOrders(res.data.orders || []);
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'confirmed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'customizing': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'shipped': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        }
    };

    return (
        <section className="px-8 mt-24 pb-20 space-y-12 animate-fadeUp">
            <div className="space-y-4">
                <div className="text-[#f0d060] font-caveat text-2xl tracking-wide">// Personal History</div>
                <h2 className="text-6xl font-black font-playfair text-white">My <em className="grad-text hero-gradient italic">Artifacts</em></h2>
                <p className="text-[#9090b0] font-medium max-w-lg leading-relaxed">Track your personalized gifts and complete the acquisition protocol.</p>
            </div>

            <div className="grid gap-8">
                {orders.length > 0 ? orders.map((order) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 border border-white/5 rounded-[40px] p-10 space-y-8 relative overflow-hidden group shadow-[0_32px_128px_rgba(0,0,0,0.5)]"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0d060]/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-8 gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-[#f0d060]/10 rounded-2xl flex items-center justify-center text-[#f0d060] shadow-inner shadow-[#f0d060]/5">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-[#9090b0] font-black uppercase tracking-[0.2em] mb-1">Nexus ID</div>
                                    <div className="text-xl font-black text-white">{order.order_id}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right hidden md:block">
                                    <div className="text-[9px] text-[#9090b0] font-black uppercase tracking-[0.2em] mb-1">Deployment Date</div>
                                    <div className="text-white font-bold">{new Date(order.created_at).toLocaleDateString()}</div>
                                </div>
                                <div className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                    {order.status}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 border border-white/5 p-6 rounded-3xl gap-6 group/item hover:border-[#f0d060]/20 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center text-4xl">
                                            {order.emoji || '🎁'}
                                        </div>
                                        {order.wants_custom && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#f0d060] rounded-full flex items-center justify-center text-[#06060f] shadow-lg">
                                                <Package size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-playfair font-black text-xl text-white mb-1">{order.gift_name}</div>
                                        <div className="text-[10px] text-[#9090b0] font-bold uppercase tracking-widest flex items-center gap-2">
                                            {order.wants_custom ? (
                                                <><CheckCircle2 size={12} className="text-[#f0d060]" /> Customization Verified</>
                                            ) : (
                                                <><TrendingUp size={12} className="text-[#f0d060]" /> Priority Deployment</>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-white font-playfair">₹{order.amount.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-white/5">
                            <div className="text-[#9090b0] text-[10px] font-black uppercase tracking-[0.2em]">
                                Total Value Acquisition
                            </div>
                            <div className="text-4xl font-black font-playfair text-white tracking-tight">
                                ₹{order.amount.toLocaleString()}
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="bg-white/5 border border-white/5 rounded-[48px] p-24 text-center space-y-6">
                        <AlertCircle className="mx-auto text-[#2a2a35]" size={80} strokeWidth={1} />
                        <h3 className="text-3xl font-black text-[#9090b0] font-playfair italic">The Nexus is Empty</h3>
                        <p className="text-[#606070] font-medium max-w-sm mx-auto">Start your journey of discovery to manifest your first personalized artifact.</p>
                        <button className="btn-primary !px-12 !py-4" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Initiate Analysis</button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrderTracker;
