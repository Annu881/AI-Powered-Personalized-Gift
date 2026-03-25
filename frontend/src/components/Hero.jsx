import React from 'react';
import { Sparkles, Play, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = ({ onStartQuiz }) => {
    return (
        <div className="relative min-h-screen grid place-items-center pt-24 pb-20 px-6 text-center overflow-hidden animate-fadeUp">
            <div className="relative z-10 max-w-5xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#f0d060]/5 border border-[#f0d060]/40 rounded-full px-6 py-2 text-[10px] text-[#f0d060] font-black uppercase tracking-[0.3em] inline-flex items-center gap-2"
                >
                    • AI-POWERED • PERSONALITY-BASED • TRULY PERSONAL
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-[clamp(3.5rem,9vw,6.5rem)] font-playfair font-black leading-[1.02] tracking-tight text-white mb-8"
                >
                    Gifts That Feel <br />
                    <em className="grad-text hero-gradient italic">Truly Unforgettable</em>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto text-[#9090b0] text-xl leading-relaxed font-medium"
                >
                    10 questions. Your MBTI type. The most thoughtful, personalized gift — crafted exactly for who they are.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6"
                >
                    <button
                        onClick={onStartQuiz}
                        className="btn-primary px-12 py-5 flex items-center gap-3 text-sm"
                    >
                        <Sparkles size={18} />
                        <span>Start Free Quiz</span>
                        <span className="opacity-60 text-xs ml-2">2 min</span>
                    </button>

                    <button className="btn-ghost px-10 py-5 flex items-center gap-3 font-bold text-white uppercase tracking-widest text-[10px]">
                        <Play size={18} fill="currentColor" />
                        Watch Demo
                    </button>
                </motion.div>

                {/* Floating Cards Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-6 mt-20"
                >
                    {[
                        { icon: '🧠', title: '16 Personality Types', desc: 'ML-powered detection' },
                        { icon: '🎁', title: 'Top 5 Gift Picks', desc: 'AI-matched for you' },
                        { icon: '✏️', title: 'Live Customization', desc: 'Name • Photo • Message' }
                    ].map((card, i) => (
                        <div key={i} className={`bg-white/5 border border-white/5 rounded-[32px] p-8 pr-12 flex items-center gap-6 shadow-2xl animate-float`} style={{ animationDelay: `${i * 0.4}s` }}>
                            <div className="w-14 h-14 bg-[#f0d060]/10 rounded-2xl grid place-items-center text-3xl shadow-inner shadow-[#f0d060]/5">{card.icon}</div>
                            <div className="text-left">
                                <div className="font-black text-white text-[10px] uppercase tracking-widest mb-1">{card.title}</div>
                                <div className="text-[10px] text-[#9090b0] font-bold uppercase tracking-wider">{card.desc}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-2 bg-[#f0d060] rounded-full"
                    />
                </div>
                <span className="text-[10px] font-black text-[#9090b0] tracking-[0.3em] uppercase">Scroll</span>
            </motion.div>
        </div>
    );
};

export default Hero;
