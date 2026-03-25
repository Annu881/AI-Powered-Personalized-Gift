import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Palette, Type, ShieldCheck, Zap, CreditCard, MailCheck, Truck, User } from 'lucide-react';

const INDIA_REGIONS = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat"],
    "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
    "Manipur": ["Imphal"],
    "Meghalaya": ["Shillong"],
    "Mizoram": ["Aizawl"],
    "Nagaland": ["Kohima", "Dimapur"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
    "Sikkim": ["Gangtok"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
    "Tripura": ["Agartala"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
    "Andaman and Nicobar": ["Port Blair"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli": ["Silvassa"],
    "Daman and Diu": ["Daman"],
    "Delhi": ["New Delhi", "Delhi NCR"],
    "Jammu and Kashmir": ["Srinagar", "Jammu"],
    "Ladakh": ["Leh"],
    "Lakshadweep": ["Kavaratti"],
    "Puducherry": ["Puducherry"]
};

const MockupGenerator = ({ gift, user, onBack, onOrderSuccess }) => {
    const [config, setConfig] = useState({
        name: user?.name || 'Annu',
        message: 'Master of Strategy',
        color: '#c5a059',
        font: "'Playfair Display', serif"
    });

    const [orderState, setOrderState] = useState('idle'); // idle, processing, payment, success
    const [paymentSubState, setPaymentSubState] = useState('selection'); // selection, upi, card, netbank
    const [processStep, setProcessStep] = useState(0);
    const [orderId, setOrderId] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentData, setPaymentData] = useState({ upiId: '', cardNumber: '', cardExpiry: '', cardCvv: '', bank: '' });

    const processMessages = [
        "Establishing Secure Connection...",
        "Encrypting Customization Data...",
        "Verifying Neural Gift Match...",
        "Notifying Gifting Lab...",
        "Finalizing Luxury Artifact..."
    ];

    useEffect(() => {
        if (orderState === 'processing') {
            const timer = setInterval(() => {
                setProcessStep(prev => {
                    if (prev < processMessages.length - 1) return prev + 1;
                    clearInterval(timer);
                    setTimeout(() => {
                        setOrderState('success');
                        if (onOrderSuccess) onOrderSuccess();
                    }, 500);
                    return prev;
                });
            }, 800);
            return () => clearInterval(timer);
        }
    }, [orderState]);

    const colors = ['#c5a059', '#d4af37', '#888888', '#fdfdfd', '#7e22ce', '#06b6d4'];
    const fonts = [
        { name: 'Playfair (Elegant)', value: "'Playfair Display', serif" },
        { name: 'Caveat (Handwritten)', value: "'Caveat', cursive" },
        { name: 'DM Sans (Minimal)', value: "'DM Sans', sans-serif" }
    ];

    const [address, setAddress] = useState({
        name: user?.name || '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        pin: '',
        state: ''
    });

    const handleSubmitOrder = async () => {
        if (!address.phone || !address.line1 || !address.city || !address.pin) {
            alert('Please complete the delivery logistics.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const orderRes = await fetch('http://localhost:5000/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    gift_id: gift.id,
                    custom_name: config.name,
                    custom_message: config.message,
                    custom_type: 'Engraving',
                    custom_color: config.color,
                    custom_days: 7,
                    custom_fee: gift.customPrice || 0,
                    amount: gift.price + (gift.customPrice || 0),
                    address_name: address.name,
                    address_phone: address.phone,
                    address_line1: address.line1,
                    address_line2: address.line2,
                    address_city: address.city,
                    address_pin: address.pin,
                    address_state: address.state,
                    wants_custom: true
                })
            });

            const orderData = await orderRes.json();
            if (!orderData.success) throw new Error(orderData.error);

            setOrderId(orderData.order.order_id);
            setOrderState('payment');

        } catch (err) {
            console.error('Order submission failed:', err);
            alert('Checkout failed: ' + err.message);
        }
    };

    if (orderState === 'processing') {
        return (
            <section className="min-h-screen flex items-center justify-center bg-[#06060f] p-6 text-center animate-fadeUp">
                <div className="max-w-md w-full p-12 space-y-8">
                    <div className="relative w-24 h-24 mx-auto">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute inset-0 border-t-2 border-[#f0d060] rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-[#f0d060]">
                            <Zap size={32} className="animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-playfair font-black text-white">Fulfilling Your Vision</h2>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={processStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-[#f0d060] font-black uppercase tracking-[0.2em] text-[10px]"
                            >
                                {processMessages[processStep]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        );
    }

    if (orderState === 'payment') {
        const paymentMethods = [
            { id: 'upi', name: 'UPI / GPay / PhonePe', icon: <Zap size={20} />, sub: 'upi' },
            { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard size={20} />, sub: 'card' },
            { id: 'net', name: 'Net Banking', icon: <ShieldCheck size={20} />, sub: 'netbank' }
        ];

        const banks = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Bank"];

        return (
            <section className="min-h-screen flex items-center justify-center bg-[#06060f] p-4 lg:p-12 animate-fadeUp text-white">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Summary Section */}
                    <div className="space-y-6 hidden lg:block">
                        <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 space-y-8">
                            <div className="flex items-center gap-4 text-[#f0d060]">
                                <ShoppingBag size={24} />
                                <h3 className="text-2xl font-playfair font-black">Final Summary</h3>
                            </div>
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-[#9090b0] font-medium">Artifact Value</span>
                                    <span>₹{gift.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-[#9090b0] font-medium">Customization Surcharge</span>
                                    <span className="text-[#f0d060]">₹{(gift.customPrice || 0).toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-2xl font-playfair font-black">
                                    <span>Total Payable</span>
                                    <span className="text-[#f0d060]">₹{(gift.price + (gift.customPrice || 0)).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-[#f0d060]/5 rounded-2xl border border-[#f0d060]/10 text-[10px] text-[#9090b0] leading-relaxed italic">
                                <Zap size={14} className="text-[#f0d060] shrink-0" />
                                Your personalized artifact will be initialized following valid authorization of the selected protocol.
                            </div>
                        </div>
                    </div>

                    {/* Interactive Payment Panel */}
                    <div className="bg-white/5 border border-[#f0d060]/20 rounded-[40px] p-8 lg:p-12 shadow-[0_32px_128px_rgba(240,208,96,0.1)] flex flex-col overflow-hidden relative min-h-[600px]">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#f0d060]/5 blur-[100px] rounded-full pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {paymentSubState === 'selection' ? (
                                <motion.div key="selection" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 flex-1">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <ShieldCheck size={20} className="text-[#f0d060]" />
                                            <span className="text-[10px] text-[#f0d060] font-black uppercase tracking-[0.3em]">Payment Terminal</span>
                                        </div>
                                        <h2 className="text-4xl lg:text-5xl font-playfair font-black">Gifting Protocol</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {paymentMethods.map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => {
                                                    setSelectedPayment(m.id);
                                                    setPaymentSubState(m.sub);
                                                }}
                                                className="w-full p-6 rounded-2xl border-2 bg-white/5 border-white/5 text-[#9090b0] hover:border-[#f0d060]/30 hover:text-white transition-all flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="text-[#f0d060]">{m.icon}</div>
                                                    <span className="font-black text-[11px] uppercase tracking-widest">{m.name}</span>
                                                </div>
                                                <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="sub-interface" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1">
                                    <button onClick={() => setPaymentSubState('selection')} className="flex items-center gap-2 text-[#9090b0] hover:text-[#f0d060] text-[10px] font-black uppercase tracking-widest transition-colors mb-6">
                                        <ArrowLeft size={14} /> Back to Protocols
                                    </button>

                                    {paymentSubState === 'upi' && (
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-playfair font-black">UPI Identification</h3>
                                            <div className="space-y-4">
                                                <label className="text-[10px] text-[#9090b0] uppercase font-black block ml-1 tracking-widest">Enter VPA / UPI ID</label>
                                                <input
                                                    type="text"
                                                    placeholder="example@okaxis"
                                                    value={paymentData.upiId}
                                                    onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
                                                    className="w-full bg-[#06060f] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-[#f0d060]/40 transition-colors font-medium text-lg"
                                                />
                                                <div className="flex gap-2">
                                                    {['@okaxis', '@okicici', '@paytm'].map(suffix => (
                                                        <button
                                                            key={suffix}
                                                            onClick={() => setPaymentData({ ...paymentData, upiId: paymentData.upiId.split('@')[0] + suffix })}
                                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-[#9090b0] hover:border-[#f0d060]/30 transition-all"
                                                        >
                                                            {suffix}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentSubState === 'card' && (
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-playfair font-black">Secure Card Vault</h3>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] text-[#9090b0] uppercase font-black block ml-1 tracking-widest">Card Identity Number</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="0000 0000 0000 0000"
                                                            maxLength={19}
                                                            value={paymentData.cardNumber}
                                                            onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                                                            className="w-full bg-[#06060f] border border-white/10 rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-[#f0d060]/40 transition-colors font-mono text-lg"
                                                        />
                                                        <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9090b0]" size={20} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-[#9090b0] uppercase font-black block ml-1 tracking-widest">Expiry Date</label>
                                                        <input
                                                            type="text"
                                                            placeholder="MM/YY"
                                                            maxLength={5}
                                                            value={paymentData.cardExpiry}
                                                            onChange={(e) => setPaymentData({ ...paymentData, cardExpiry: e.target.value.replace(/\D/g, '').replace(/(\d{2})/, '$1/').trim() })}
                                                            className="w-full bg-[#06060f] border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#f0d060]/40 transition-colors font-mono"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-[#9090b0] uppercase font-black block ml-1 tracking-widest">CVV / CVN</label>
                                                        <input
                                                            type="password"
                                                            placeholder="•••"
                                                            maxLength={3}
                                                            className="w-full bg-[#06060f] border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#f0d060]/40 transition-colors font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentSubState === 'netbank' && (
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-playfair font-black">Financial Institution Gateway</h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {banks.map(bank => (
                                                    <button
                                                        key={bank}
                                                        onClick={() => setPaymentData({ ...paymentData, bank })}
                                                        className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${paymentData.bank === bank ? 'bg-[#f0d060] border-[#f0d060] text-[#06060f]' : 'bg-white/5 border-white/5 text-[#9090b0] hover:border-[#f0d060]/30'}`}
                                                    >
                                                        <span className="font-bold text-xs uppercase tracking-widest">{bank}</span>
                                                        {paymentData.bank === bank && <ShieldCheck size={16} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setOrderState('processing')}
                                        className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#f0d060] to-[#d4af37] text-[#06060f] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_60px_rgba(240,208,96,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Authorize Protocol Transaction →
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                            <div className="text-[8px] font-black uppercase tracking-widest text-[#9090b0]">PCI DSS 4.0 Verified</div>
                            <div className="w-px h-3 bg-white/20" />
                            <div className="text-[8px] font-black uppercase tracking-widest text-[#9090b0]">SSL AES-256 Encrypted</div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (orderState === 'success') {
        return (
            <section className="min-h-screen flex items-center justify-center bg-[#06060f] p-6 text-center animate-fadeUp text-white">
                <div className="max-w-xl w-full p-12 bg-white/5 border border-[#f0d060]/20 rounded-[48px] shadow-[0_32px_128px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#f0d060]/10 blur-[120px] rounded-full" />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-[#f0d060]/20 rounded-full flex items-center justify-center mx-auto mb-10 text-[#f0d060] border border-[#f0d060]/30"
                    >
                        <ShieldCheck size={48} />
                    </motion.div>

                    <h2 className="text-5xl font-playfair font-black mb-2">Artifact Secured</h2>
                    <p className="text-[#f0d060] font-black text-xs uppercase tracking-[0.4em] mb-12">Protocol ID: {orderId}</p>

                    <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 text-left space-y-6 mb-12">
                        <div className="flex justify-between items-center text-[#f0d060]">
                            <span className="text-[10px] font-black uppercase tracking-widest">Configuration Matrix</span>
                            <Zap size={14} />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-1">Identity</span>
                                <p className="font-bold text-lg">{config.name}</p>
                            </div>
                            <div>
                                <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-1">Theme</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                                    <span className="font-mono text-[10px]">{config.color}</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-2 italic">Secondary Signature</span>
                            <p className="text-white italic text-lg leading-tight">"{config.message}"</p>
                        </div>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f0d060] hover:text-[#06060f] hover:border-[#f0d060] transition-all duration-500 shadow-xl"
                    >
                        Return to Hub
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-[#9090b0] uppercase font-black tracking-widest pt-8 opacity-40">
                        <MailCheck size={12} /> Encrypted Confirmation Sent
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="px-6 lg:px-24 py-32 bg-[#06060f] min-h-screen animate-fadeUp">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#9090b0] hover:text-[#f0d060] transition-colors mb-12 text-[10px] font-black uppercase tracking-widest group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Selection
                </button>

                <div className="mb-16">
                    <div className="text-[#f0d060] font-caveat text-2xl mb-4 italicTransition-all group-hover:translate-x-2">// Master Customization</div>
                    <h2 className="text-6xl lg:text-7xl font-playfair font-black tracking-tight leading-none mb-6 text-white">
                        Make It <em className="grad-text hero-gradient italic">Truly Yours</em>
                    </h2>
                    <p className="text-[#9090b0] text-xl font-medium leading-relaxed max-w-xl">
                        Fine-tune every detail. Our AI suggests colors and fonts compatible with your profile.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white/5 border border-white/5 rounded-[48px] p-8 lg:p-20 shadow-[0_32px_128px_rgba(0,0,0,0.5)]">
                    {/* Controls Panel */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] text-[#9090b0] uppercase tracking-[0.2em] font-black ml-1">
                                    <User size={12} className="text-[#f0d060]" /> Recipient's Identity
                                </label>
                                <input
                                    type="text"
                                    value={config.name}
                                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                                    className="w-full bg-[#06060f] border border-white/10 rounded-2xl px-6 py-5 text-white text-lg font-medium outline-none focus:border-[#f0d060]/40 transition-colors"
                                    placeholder="Enter name..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] text-[#9090b0] uppercase tracking-[0.2em] font-black ml-1">
                                    Custom Engraving Message
                                </label>
                                <input
                                    type="text"
                                    value={config.message}
                                    onChange={(e) => setConfig({ ...config, message: e.target.value })}
                                    className="w-full bg-[#06060f] border border-white/10 rounded-2xl px-6 py-5 text-white text-lg font-medium outline-none focus:border-[#f0d060]/40 transition-colors"
                                    placeholder="Special message..."
                                />
                            </div>

                            <div className="space-y-5">
                                <label className="flex items-center gap-2 text-[10px] text-[#9090b0] uppercase tracking-[0.2em] font-black ml-1">
                                    <Palette size={12} className="text-[#f0d060]" /> Identity Theme Palette
                                </label>
                                <div className="flex gap-4 flex-wrap">
                                    {colors.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setConfig({ ...config, color: c })}
                                            className={`w-10 h-10 rounded-full border-2 transition-all p-1 ${config.color === c ? 'border-[#f0d060] scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className="w-full h-full rounded-full" style={{ backgroundColor: c }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] text-[#9090b0] uppercase tracking-[0.2em] font-black ml-1 block">Typography Style</label>
                                <select
                                    value={config.font}
                                    onChange={(e) => setConfig({ ...config, font: e.target.value })}
                                    className="w-full bg-[#06060f] border border-white/10 rounded-2xl px-6 py-5 text-white text-base font-medium outline-none focus:border-[#f0d060]/40 appearance-none transition-colors"
                                >
                                    {fonts.map(f => <option key={f.value} value={f.value} className="bg-[#06060f]">{f.name}</option>)}
                                </select>
                            </div>

                            {/* Shipping Address Section */}
                            <div className="pt-8 border-t border-white/5 space-y-6">
                                <h3 className="text-[10px] text-[#f0d060] uppercase tracking-[0.3em] font-black ml-1">// Delivery Logistics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f0d060] text-sm font-black tracking-widest">+91</span>
                                        <input
                                            type="text"
                                            placeholder="Phone Number"
                                            value={address.phone}
                                            onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                            className="w-full bg-[#06060f] border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white text-sm outline-none focus:border-[#f0d060]/40 transition-colors"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="PIN Code"
                                        value={address.pin}
                                        onChange={(e) => setAddress({ ...address, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                        className="bg-[#06060f] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#f0d060]/40 transition-colors"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Address Line 1"
                                    value={address.line1}
                                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                                    className="w-full bg-[#06060f] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#f0d060]/40 transition-colors"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                        value={address.state}
                                        onChange={(e) => setAddress({ ...address, state: e.target.value, city: '' })}
                                        className="w-full bg-[#06060f] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none appearance-none transition-colors"
                                    >
                                        <option value="">Select State</option>
                                        {Object.keys(INDIA_REGIONS).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <select
                                        value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        disabled={!address.state}
                                        className="w-full bg-[#06060f] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none appearance-none transition-colors disabled:opacity-30"
                                    >
                                        <option value="">Select City</option>
                                        {address.state && INDIA_REGIONS[address.state].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="flex flex-col gap-10">
                        <div className="flex-1 bg-white/5 border border-white/5 rounded-[40px] p-16 text-center relative overflow-hidden group min-h-[450px] flex flex-col items-center justify-center">
                            <div className="absolute top-6 right-8 bg-[#f0d060]/10 border border-[#f0d060]/20 font-black text-[9px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full text-[#f0d060]">
                                Precise Mockup
                            </div>

                            <div className="text-8xl mb-12 transform group-hover:scale-110 transition-transform duration-700 select-none">🎁</div>

                            <h4
                                className="text-5xl font-black mb-4 transition-all duration-500 tracking-tight"
                                style={{ color: config.color, fontFamily: config.font.split(',')[0].replace(/'/g, '') }}
                            >
                                {config.name}
                            </h4>
                            <p
                                className="text-2xl font-medium transition-all duration-500 opacity-60 text-white"
                                style={{ fontFamily: config.font.split(',')[0].replace(/'/g, '') }}
                            >
                                {config.message}
                            </p>
                        </div>

                        <div className="flex flex-col gap-6">
                            <button
                                onClick={handleSubmitOrder}
                                className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#f0d060] to-[#c5a059] text-[#0a0a0f] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(240,208,96,0.3)] hover:scale-[1.02] transition-all"
                            >
                                <ShoppingBag size={20} /> Checkout Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MockupGenerator;
