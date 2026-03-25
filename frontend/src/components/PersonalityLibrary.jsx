import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Target, Heart, Sparkles, BookOpen, Gift as GiftIcon } from 'lucide-react';

const mbtiData = [
    {
        type: 'INTJ', title: 'The Architect', icon: '♟️', color: '#6366f1',
        desc: 'Strategic and logical, with an unquenchable thirst for knowledge.',
        traits: ['Strategic', 'Analytical', 'Independent'],
        examples: ['Custom Mechanical Keyboard', 'Architectural Design Ledger'],
        longDesc: 'INTJs live in a world of ideas and strategic planning. They value intelligence and competence above all else. For an Architect, a gift isn\'t just an object; it\'s a tool for their next grand design or a tribute to their specialized interests.',
        deepDive: {
            social: 'INTJs are private individuals who prefer a small circle of intellectually stimulating friends. They value authenticity and depth over small talk.',
            career: 'Often found in engineering, software development, or strategic management, where they can build complex systems and solve intricate puzzles.',
            motto: 'Knowledge is the only true power.'
        }
    },
    {
        type: 'ENFP', title: 'The Campaigner', icon: '🎨', color: '#f59e0b',
        desc: 'Enthusiastic, creative, and sociable free spirits who always find a reason to smile.',
        traits: ['Creative', 'Enthusiastic', 'Sociable'],
        examples: ['Vibrant DIY Art Kit', 'Personalized Travel Journal'],
        longDesc: 'ENFPs are true free spirits. They are often the life of the party, but they also have a deep, soulful side. They value emotional connection and creativity. A Campaigner loves gifts that spark inspiration or celebrate a shared memory.',
        deepDive: {
            social: 'Boundlessly energetic and empathetic, ENFPs are the emotional glue in many social circles, always encouraging others to find their own "magic".',
            career: 'Thrive in creative arts, counseling, or social entrepreneurship where they can champion causes and express their vibrant individuality.',
            motto: 'The world is a canvas of infinite possibilities.'
        }
    },
    {
        type: 'ESFP', title: 'The Entertainer', icon: '🥳', color: '#ec4899',
        desc: 'Spontaneous, energetic, and enthusiastic—life is never boring around them.',
        traits: ['Energetic', 'Spontaneous', 'Playful'],
        examples: ['Portable Bluetooth Speaker', 'Instant Film Camera'],
        longDesc: 'ESFPs love the spotlight and live for the moment. They have a natural ability to make everything more fun. They value sensory experiences and aesthetic beauty. An Entertainer appreciates gifts that are bold, stylish, and ready for action.',
        deepDive: {
            social: 'ESFPs are the ultimate social butterflies, bringing joy and high energy to every gathering. They have an uncanny ability to read the "vibe" of any room.',
            career: 'Excel in entertainment, fashion, or event planning—anywhere they can use their charm and sensory awareness to create memorable experiences.',
            motto: 'Life is a party, and everyone is invited.'
        }
    },
    {
        type: 'ISTJ', title: 'The Logistician', icon: '📋', color: '#10b981',
        desc: 'Practical and fact-minded individuals, whose reliability cannot be doubted.',
        traits: ['Reliable', 'Practical', 'Orderly'],
        examples: ['Premium Leather Planner', 'Precision Watch Tool Kit'],
        longDesc: 'Logisticians are the backbone of society. They take pride in their work and appreciate order and tradition. They value functionality and durability.',
        deepDive: {
            social: 'ISTJs are steady and dependable. They show their love through acts of service and by maintaining the important structures of life.',
            career: 'Highly successful in accounting, law, or military leadership where their respect for rules and detail is a core asset.',
            motto: 'Reliability is the cornerstone of success.'
        }
    },
    {
        type: 'INFJ', title: 'The Advocate', icon: '🔮', color: '#8b5cf6',
        desc: 'Quiet and mystical, yet very inspiring and tireless idealists.',
        traits: ['Idealistic', 'Insightful', 'Deep'],
        examples: ['Handcrafted Ceramic Tea Set', 'Poetry Anthology with Gold Leaf'],
        longDesc: 'INFJs are quiet visionaries. They have a deep sense of idealism and integrity. They value connection and meaning. An Advocate cherishes gifts that show you truly understand their inner world or support their creative passions.',
        deepDive: {
            social: 'Profoundly empathetic, INFJs often feel like "old souls". They seek lifelong connections and are often the people others turn to for spiritual or emotional guidance.',
            career: 'Excel in writing, psychology, or non-profit leadership where they can work towards a higher purpose and manifest their internal visions.',
            motto: 'Make the world a more meaningful place.'
        }
    },
    {
        type: 'ENTP', title: 'The Debater', icon: '⚡', color: '#fbbf24',
        desc: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
        traits: ['Innovate', 'Curious', 'Witty'],
        examples: ['3D Printing Starter Kit', 'Advanced Strategy Board Game'],
        longDesc: 'ENTPs are the ultimate devils advocates. They love to test ideas and boundaries. They value innovation and intellectual sparring.',
        deepDive: {
            social: 'ENTPs are charismatic and energetic, often using their wit to keep everyone on their toes. They love pushing people to think outside the box.',
            career: 'Natural entrepreneurs, inventors, and lawyers who thrive in environments that require rapid ideation and constant change.',
            motto: 'Question everything, especially the "rules".'
        }
    },
    {
        type: 'INFP', title: 'The Mediator', icon: '🌿', color: '#34d399',
        desc: 'Poetic, kind, and altruistic people, always eager to help a good cause.',
        traits: ['Kind', 'Altruistic', 'Reflective'],
        examples: ['Organic Weighted Blanket', 'Custom Dream Journal'],
        longDesc: 'Mediators are world-class dreamers. They have a deep well of empathy and a strong moral compass. They value authenticity and compassion.',
        deepDive: {
            social: 'Deeply private yet intensely loyal to those they trust. INFPs value souls over personas and are the first to stand up for the underdog.',
            career: 'Excel in music, social work, or independent film where they can pour their immense emotional depth into their craft.',
            motto: 'To thine own self be true.'
        }
    },
    {
        type: 'ENTJ', title: 'The Commander', icon: '👑', color: '#ef4444',
        desc: 'Bold, imaginative, and strong-willed leaders, always finding a way – or making one.',
        traits: ['Bold', 'Decisive', 'Ambitious'],
        examples: ['High-Performance Desk Organizer', 'Executive Leadership Masterclass'],
        longDesc: 'ENTJs are natural-born leaders. They have the charisma and confidence to project authority in a way that draws crowds together behind a common goal.',
        deepDive: {
            social: 'ENTJs are the force behind many social movements or business ventures. They lead by example and expect excellence from those around them.',
            career: 'Found in the highest tiers of corporate leadership, politics, or high-stakes surgery where their decisiveness is life-critical.',
            motto: 'Lead, follow, or get out of the way.'
        }
    },
    {
        type: 'INTP', title: 'The Logician', icon: '🔬', color: '#06b6d4',
        desc: 'Innovative inventors with an unquenchable thirst for knowledge.',
        traits: ['Logical', 'Theoretical', 'Inventive'],
        examples: ['Microscope Projection System', 'Retro Scientific Poster'],
        longDesc: 'Logicians pride themselves on their inventiveness and unique perspective. They are often lost in thought, dissecting the world around them.',
        deepDive: {
            social: 'Often perceived as detached, INTPs are actually intensely focused. They prefer digital or abstract interaction unless the conversation is highly technical.',
            career: 'The brilliant minds behind theoretical physics, architecture, and advanced mathematics.',
            motto: 'Curiosity is the engine of evolution.'
        }
    },
    {
        type: 'ISFJ', title: 'The Defender', icon: '🌊', color: '#a855f7',
        desc: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
        traits: ['Loyal', 'Warm', 'Protective'],
        examples: ['Embroidered Family Heirloom', 'Premium Scented Candle Set'],
        longDesc: 'Defenders are the quiet protectors of their friends and family. They have a deep-seated desire to help others and maintain harmony.',
        deepDive: {
            social: 'The heart of the family, ISFJs remember every birthday and anniversary. They create safe, warm spaces for everyone they love.',
            career: 'Highly effective in nursing, social work, or internal administration where their dedication to people is most felt.',
            motto: 'Love is in the details.'
        }
    },
    {
        type: 'ENFJ', title: 'The Protagonist', icon: '🦋', color: '#f97316',
        desc: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
        traits: ['Charismatic', 'Empathetic', 'Natural Leader'],
        examples: ['Shared Experience Voucher', 'Custom Team Jersey'],
        longDesc: 'Protagonists are charismatic leaders who inspire people to reach their full potential. They have a natural ability to connect with others.',
        deepDive: {
            social: 'Radiant and inclusive, ENFJs are the friends who make everyone feel seen and heard. They are the natural leaders of any community.',
            career: 'Exceptional teachers, public speakers, and diplomat who can align entire groups toward a shared humanitarian goal.',
            motto: 'Together, we are unstoppable.'
        }
    },
    {
        type: 'ISTP', title: 'The Virtuoso', icon: '🛠️', color: '#4ade80',
        desc: 'Bold and practical experimenters, masters of all kinds of tools.',
        traits: ['Technical', 'Fearless', 'Action-oriented'],
        examples: ['Multi-Tool Survival Kit', 'Classic Motorcycle Blueprint'],
        longDesc: 'Virtuosos are natural-born creators and explorers. They love to get their hands dirty and see how things work.',
        deepDive: {
            social: 'Quietly observant, ISTPs prefer doing over talking. They are the friends you call when something needs fixing or when you want a no-nonsense adventure.',
            career: 'Found in high-stakes fields like piloting, forensics, or technical engineering where precision and rapid adaptation are paramount.',
            motto: 'Actions speak louder than logic.'
        }
    },
    {
        type: 'ISFP', title: 'The Adventurer', icon: '🌺', color: '#f472b6',
        desc: 'Flexible and charming artists, always ready to explore and experience something new.',
        traits: ['Artistic', 'Sensitive', 'Free-spirited'],
        examples: ['Hand-painted Silk Scarf', 'Portable Watercolor Set'],
        longDesc: 'Adventurers are true artists. For them, life is a canvas for self-expression. They live for the moment and appreciate beauty in all its forms.',
        deepDive: {
            social: 'Gentle and observant, ISFPs express their feelings through art or subtle gestures rather than words. They seek quiet, authentic connection.',
            career: 'Thrive as painters, designers, or photographers—anywhere they can translate their rich internal world into sensory experiences.',
            motto: 'Beauty is everywhere.'
        }
    },
    {
        type: 'ESTJ', title: 'The Executive', icon: '🌍', color: '#3b82f6',
        desc: 'Excellent administrators, unsurpassed at managing things – or people.',
        traits: ['Organized', 'Direct', 'Honest'],
        examples: ['World Globe with Brass Finish', 'Financial Legacy Planner'],
        longDesc: 'Executives are the ultimate administrators. They are valued for their clear advice and guidance. They value honesty and tradition.',
        deepDive: {
            social: 'Organized and direct, ESTJs are the reliable planners of the group. They value structure and traditional gatherings.',
            career: 'Found in management, law enforcement, or public administration where their talent for organization and order is unmatched.',
            motto: 'Order is the first law of progress.'
        }
    },
    {
        type: 'ESFJ', title: 'The Consul', icon: '🎶', color: '#fb7185',
        desc: 'Extraordinarily caring, social, and popular people, always eager to help.',
        traits: ['Caring', 'Social', 'Dependable'],
        examples: ['Music Box with Custom Engraving', 'Gourmet Hosting Set'],
        longDesc: 'Consuls are the hearts of their communities. They are always there to provide support and ensure everyone is included.',
        deepDive: {
            social: 'The ultimate hosts, ESFJs live for supporting others. They are the ones who make sure everyone is comfortable and happy.',
            career: 'Excel in customer relations, teaching, and hospitality—wherever they can directly impact people\'s happiness.',
            motto: 'Kindness is the ultimate strength.'
        }
    },
    {
        type: 'ESTP', title: 'The Entrepreneur', icon: '🚀', color: '#fb923c',
        desc: 'Smart, energetic, and very perceptive people, who truly enjoy living on the edge.',
        traits: ['Energetic', 'Perceptive', 'Risk-taker'],
        examples: ['High-Octane Adventure Tour', 'Sport-Class Wristwatch'],
        longDesc: 'Entrepreneurs are the ultimate doers. They are often the ones living on the edge, taking risks and seeing opportunities where others see obstacles.',
        deepDive: {
            social: 'Engaging and high-energy, ESTPs love being in the center of the action. They seek excitement and immediate results.',
            career: 'Natural sales people, professional athletes, and firefighters who thrive in high-pressure, fast-moving environments.',
            motto: 'Go big or go home.'
        }
    }
];

const PersonalityLibrary = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [isDiscovering, setIsDiscovering] = useState(false);

    const handleOpenModal = (mbti) => {
        setSelectedType(mbti);
        setIsDiscovering(false);
    };

    return (
        <div className="py-20 animate-fadeUp">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mbtiData.map((mbti, index) => (
                    <motion.div
                        key={mbti.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        onClick={() => handleOpenModal(mbti)}
                        className="group relative bg-white/5 border border-white/5 hover:border-[#f0d060]/30 rounded-[32px] p-10 cursor-pointer transition-all overflow-hidden min-h-[180px] flex flex-col justify-between"
                    >
                        <div
                            className="absolute -top-10 -right-10 w-40 h-40 transition-opacity opacity-0 group-hover:opacity-10 blur-[60px] pointer-events-none rounded-full"
                            style={{ backgroundColor: mbti.color }}
                        />

                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-2xl font-black transition-all group-hover:translate-x-1 inline-block" style={{ color: mbti.color }}>{mbti.type}</span>
                                <p className="text-[#9090b0] text-[10px] font-black uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">{mbti.title}</p>
                            </div>
                            <span className="text-4xl transition-all duration-700 scale-100 group-hover:scale-125 group-hover:rotate-6">
                                {mbti.icon}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedType && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedType(null)}
                            className="fixed inset-0 bg-[#06060f]/95 backdrop-blur-3xl"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="relative w-full max-w-2xl bg-white/5 border border-white/5 rounded-[56px] overflow-hidden shadow-[0_64px_128px_rgba(0,0,0,0.9)] p-8 lg:p-16"
                        >
                            <div
                                className="absolute inset-0 opacity-10 pointer-events-none blur-[120px]"
                                style={{ backgroundColor: selectedType.color }}
                            />

                            <button
                                onClick={() => setSelectedType(null)}
                                className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[#888888] transition-all z-10"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = selectedType.color;
                                    e.currentTarget.style.borderColor = `${selectedType.color}44`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#888888';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                }}
                            >
                                <X size={24} />
                            </button>

                            <AnimatePresence mode="wait">
                                {!isDiscovering ? (
                                    <motion.div
                                        key="teaser"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="relative z-10 space-y-10"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-[28px] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-5xl shadow-inner shadow-white/5" style={{ borderColor: `${selectedType.color}44` }}>
                                                {selectedType.icon}
                                            </div>
                                            <div>
                                                <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: selectedType.color }}>Personality Identity</span>
                                                <h2 className="text-5xl font-playfair font-black text-[#fdfdfd]">{selectedType.type}</h2>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-playfair font-bold text-[#fdfdfd] italic">"{selectedType.title}"</h3>
                                            <p className="text-[#888888] text-lg font-medium leading-relaxed">
                                                {selectedType.desc}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3 pb-8 border-b border-white/[0.05]">
                                            {selectedType.traits.map(trait => (
                                                <span key={trait} className="px-4 py-2 bg-white/[0.03] border border-white/[0.05] rounded-full text-[10px] font-black uppercase tracking-widest text-[#fdfdfd]">
                                                    {trait}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <button
                                                onClick={() => setIsDiscovering(true)}
                                                className="w-full py-6 flex items-center justify-center gap-3 shadow-2xl rounded-2xl text-[#0a0a0a] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 group"
                                                style={{ backgroundColor: selectedType.color }}
                                            >
                                                Discover <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="relative z-10 space-y-10"
                                    >
                                        <div className="flex items-center gap-4 text-[#888888] font-black text-[10px] uppercase tracking-widest">
                                            <BookOpen size={14} style={{ color: selectedType.color }} /> Detailed Insight
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-3xl font-playfair font-black text-white leading-tight">
                                                Exploring the <span style={{ color: selectedType.color }}>{selectedType.type}</span> Perspective
                                            </h4>
                                            <p className="text-[#888888] text-base leading-relaxed font-medium">
                                                {selectedType.longDesc}
                                            </p>
                                        </div>

                                        <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[32px] space-y-8 shadow-inner shadow-white/5">
                                            {/* Deep Dive Content */}
                                            {selectedType.deepDive && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-white/5">
                                                    <div className="space-y-3">
                                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-[#c5a059]">Social Dynamics</h5>
                                                        <p className="text-sm text-[#888888] leading-relaxed">{selectedType.deepDive.social}</p>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-[#c5a059]">Career Path</h5>
                                                        <p className="text-sm text-[#888888] leading-relaxed">{selectedType.deepDive.career}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#fdfdfd]">
                                                    <GiftIcon size={14} style={{ color: selectedType.color }} /> Thoughtful Gift Curation
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {selectedType.examples.map(ex => (
                                                        <div key={ex} className="p-4 bg-[#0a0a0a] border border-white/[0.05] rounded-2xl text-sm font-medium text-[#888888] flex items-center gap-3 hover:border-[#c5a059]/20 transition-all">
                                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedType.color }} />
                                                            {ex}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {selectedType.deepDive && (
                                                <div className="pt-4 text-center">
                                                    <p className="font-playfair italic text-[#c5a059] text-lg">
                                                        "{selectedType.deepDive.motto}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setIsDiscovering(false)}
                                            className="text-[#888888] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors"
                                        >
                                            <ArrowRight size={14} className="rotate-180" /> Back to Summary
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PersonalityLibrary;
