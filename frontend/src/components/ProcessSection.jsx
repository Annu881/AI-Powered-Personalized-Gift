import React from 'react';
import { motion } from 'framer-motion';

const ProcessSection = () => {
    const steps = [
        {
            id: '01',
            title: 'Take the Quiz',
            description: 'Answer 10 thoughtfully crafted questions. Our ML model predicts your MBTI type instantly.'
        },
        {
            id: '02',
            title: 'Get Recommendations',
            description: 'Our AI surfaces the top 5 gifts perfectly matched to your (or your recipient\'s) personality.'
        },
        {
            id: '03',
            title: 'Customize It',
            description: 'Add names, photos, messages. Pick personality-matched colors and fonts in real time.'
        },
        {
            id: '04',
            title: 'Order & Deliver',
            description: 'Seamlessly order via Printful or Flipkart. Your personalized gift ships right to the door.'
        }
    ];

    return (
        <section className="py-32 px-6 lg:px-24 bg-[#06060f] border-t border-white/5 relative overflow-hidden animate-fadeUp">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#f0d060]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-24">
                    <div className="text-[#f0d060] font-caveat text-2xl mb-2 tracking-wide">// The Protocol</div>
                    <h2 className="text-6xl font-playfair font-black text-white tracking-tight">
                        From Analysis to <br />
                        <em className="grad-text hero-gradient italic">Perfect Artifact</em>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    <div className="hidden lg:block absolute top-[2.2rem] left-[5rem] right-[5rem] h-[1px] bg-gradient-to-r from-transparent via-[#f0d060]/20 to-transparent" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-8 group"
                        >
                            <div className="relative flex justify-center lg:justify-start">
                                <div className="w-16 h-16 rounded-full bg-[#06060f] border border-white/10 flex items-center justify-center text-[#9090b0] font-black text-xs z-10 group-hover:border-[#f0d060]/50 group-hover:text-[#f0d060] group-hover:shadow-[0_0_32px_rgba(240,208,96,0.15)] transition-all duration-500">
                                    {step.id}
                                </div>
                            </div>

                            <div className="text-center lg:text-left space-y-4">
                                <h3 className="text-2xl font-bold text-white group-hover:text-[#f0d060] transition-colors">{step.title}</h3>
                                <p className="text-[#9090b0] text-sm leading-relaxed font-medium">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
