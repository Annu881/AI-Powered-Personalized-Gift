import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';

const QuizCTA = ({ onStartQuiz }) => {
    return (
        <section className="py-32 px-6 lg:px-24 bg-[#06060f] border-t border-white/5 relative overflow-hidden animate-fadeUp">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f0d060]/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                    <div>
                        <div className="text-[#f0d060] font-caveat text-2xl mb-2 tracking-wide">// Interactive Quiz</div>
                        <h2 className="text-6xl font-playfair font-black text-white tracking-tight leading-loose mb-2">
                            Discover Their <br />
                            <em className="grad-text hero-gradient italic">Personality</em>
                        </h2>
                        <p className="text-[#9090b0] text-xl font-medium leading-relaxed max-w-lg mt-6">
                            Our 10-question assessment uses neural logic to accurately predict personality types. No fluff — just precise, meaningful insights.
                        </p>
                    </div>

                    <ul className="space-y-5">
                        {[
                            'High-precision neural analysis',
                            'Completes in under 2 minutes',
                            'Saved to your Personal Nexus'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-4 text-white font-black text-[10px] uppercase tracking-widest opacity-80">
                                <div className="w-5 h-5 rounded-full bg-[#f0d060]/10 border border-[#f0d060]/40 flex items-center justify-center text-[#f0d060]">
                                    <Check size={10} strokeWidth={4} />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f0d060]/20 to-transparent blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="relative bg-white/5 border border-white/5 rounded-[48px] p-12 shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="space-y-10">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 3 ? 'bg-[#f0d060]' : 'bg-white/5'}`} />
                                ))}
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <span className="text-[#9090b0] text-[10px] uppercase tracking-[0.2em] font-black">Segment 2 of 10</span>
                                    <h3 className="text-3xl font-black text-white mt-4 leading-snug font-playfair">You focus more on facts than theories.</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 rounded-2xl border border-[#f0d060] bg-[#f0d060]/10 flex items-center gap-4">
                                        <div className="w-5 h-5 rounded-full border-2 border-[#f0d060] flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#f0d060]" />
                                        </div>
                                        <span className="text-white font-bold text-lg">Strongly Agree</span>
                                    </div>
                                    <div className="p-6 rounded-2xl border border-white/10 bg-transparent flex items-center gap-4 opacity-50">
                                        <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                                        <span className="text-white font-bold text-lg">Disagree</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                <span className="text-[10px] text-[#9090b0] font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">← Back</span>
                                <button
                                    onClick={onStartQuiz}
                                    className="btn-primary px-10 py-4"
                                >
                                    Continue <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuizCTA;
