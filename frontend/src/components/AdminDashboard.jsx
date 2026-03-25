import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, User, Mail, Calendar, CreditCard, ChevronRight, Search, Filter } from 'lucide-react';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/vendor/orders', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                setOrders(data.orders || []);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#06060f]">
                <div className="w-12 h-12 border-2 border-[#f0d060]/20 border-t-[#f0d060] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section className="px-6 lg:px-24 py-32 bg-[#06060f] min-h-screen animate-fadeUp">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
                    <div>
                        <div className="text-[#f0d060] font-caveat text-2xl mb-2 tracking-wide">// Admin Protocol</div>
                        <h2 className="text-6xl font-playfair font-black text-white">Central <em className="grad-text hero-gradient italic">Nexus</em></h2>
                        <p className="text-[#9090b0] mt-4 font-medium">Monitoring all personalized artifacts in the GiftGenie ecosystem.</p>
                    </div>

                    <div className="w-full lg:w-96 relative">
                        <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9090b0]" />
                        <input
                            type="text"
                            placeholder="Search Order ID or Identity..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-full pl-14 pr-8 py-4 text-sm font-medium text-white outline-none focus:border-[#f0d060]/40 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {filteredOrders.length > 0 ? filteredOrders.map(order => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 border border-white/5 rounded-[32px] p-8 hover:border-[#f0d060]/20 transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0d060]/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                                {/* Order Identity */}
                                <div className="lg:w-64 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-[#f0d060]/10 flex items-center justify-center text-[#f0d060]">
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-[#9090b0] uppercase tracking-widest font-black block">Order ID</span>
                                            <span className="text-lg font-black text-white">{order.order_id}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[10px] text-[#9090b0] font-black uppercase tracking-widest">
                                            <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-[#9090b0] font-black uppercase tracking-widest">
                                            <CreditCard size={12} /> ₹{order.amount.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className={`inline-block px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-[#f0d060]/10 text-[#f0d060] border border-[#f0d060]/20'}`}>
                                        {order.status}
                                    </div>
                                </div>

                                {/* User & Item Details */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] text-[#f0d060] font-black uppercase tracking-[0.2em] block">Customer Identity</label>
                                            <div className="flex items-center gap-3 text-white">
                                                <User size={16} className="text-[#9090b0]" />
                                                <span className="font-bold">{order.customer_name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[#9090b0]">
                                                <Mail size={16} />
                                                <span className="text-sm">{order.customer_email}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] text-[#f0d060] font-black uppercase tracking-[0.2em] block">Artifact Requested</label>
                                            <div className="text-white font-playfair font-black text-xl">
                                                {order.gift_name}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customization Details */}
                                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 lg:p-8 space-y-4">
                                        <label className="text-[9px] text-[#f0d060] font-black uppercase tracking-[0.2em] block">Custom Configuration</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-1">Engraved Name</span>
                                                <span className="text-white font-bold">{order.custom_name || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-1">Theme Color</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: order.custom_color }} />
                                                    <span className="text-[10px] text-white font-mono">{order.custom_color || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-1">Primary Message</span>
                                            <p className="text-white italic text-sm">"{order.custom_message || 'N/A'}"</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-1">Typography Style</span>
                                            <span className="text-[10px] text-[#f0d060] font-black uppercase tracking-wider">{order.custom_type?.split(',')[0]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="py-20 text-center bg-white/5 border border-white/5 rounded-[40px]">
                            <p className="text-[#9090b0] font-medium italic">No artifacts found in the nexus.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;
