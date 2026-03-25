import React, { useState } from 'react';

const Quiz = ({ onFinish }) => {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isFinishing, setIsFinishing] = useState(false);

    const questions = [
        {
            id: 1,
            question: "What is the occasion?",
            options: [
                { text: "Birthday", value: "Birthday" },
                { text: "Anniversary", value: "Anniversary" },
                { text: "Promotion", value: "Promotion" },
                { text: "Just Like That", value: "Just Like That" }
            ],
            dimension: "OCCASION"
        },
        {
            id: 2,
            question: "What is your budget?",
            options: [
                { text: "₹500", value: "500" },
                { text: "₹1500", value: "1500" },
                { text: "₹3000", value: "3000" },
                { text: "₹5000+", value: "5000" }
            ],
            dimension: "BUDGET"
        },
        {
            id: 3,
            question: "Are they a serious worker or creative dreamer?",
            options: [
                { text: "Serious worker", value: 0 },
                { text: "Creative dreamer", value: 1 }
            ],
            dimension: "JP"
        },
        {
            id: 4,
            question: "Do they rehearse before phone calls?",
            options: [
                { text: "Never rehearses", value: 0 },
                { text: "Always rehearses", value: 1 }
            ],
            dimension: "EI"
        },
        {
            id: 5,
            question: "Do they speak facts directly or use stories/examples?",
            options: [
                { text: "Facts only", value: 0 },
                { text: "Stories + Examples", value: 1 }
            ],
            dimension: "SN"
        },
        {
            id: 6,
            question: "Are visionary ideas waste of time or interesting?",
            options: [
                { text: "Waste of time", value: 0 },
                { text: "Interesting", value: 1 }
            ],
            dimension: "SN"
        },
        {
            id: 7,
            question: "Do they make decisions with pure logic or feelings?",
            options: [
                { text: "Pure logic", value: 0 },
                { text: "Feelings matter", value: 1 }
            ],
            dimension: "TF"
        },
        {
            id: 8,
            question: "Which is worse - unfair decision or cruel decision?",
            options: [
                { text: "Unfair", value: 0 },
                { text: "Cruel", value: 1 }
            ],
            dimension: "TF"
        },
        {
            id: 9,
            question: "Do they prefer strict plans or flexible flow?",
            options: [
                { text: "Strict plans", value: 0 },
                { text: "Flexible flow", value: 1 }
            ],
            dimension: "JP"
        },
        {
            id: 10,
            question: "Where do they get energy from - people or alone time?",
            options: [
                { text: "People", value: 0 },
                { text: "Alone time", value: 1 }
            ],
            dimension: "EI"
        }
    ];

    const handleSelect = (value) => {
        setAnswers({ ...answers, [questions[current].id]: value });
    };

    const handleNext = () => {
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsFinishing(true);
        // We'll call onFinish with the raw answers
        onFinish(Object.values(answers));
    };

    const q = questions[current];

    return (
        <section className="min-h-[80vh] grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center px-6 lg:px-24 py-12 animate-fadeUp">
            <div className="space-y-6">
                <div className="text-[#f0d060] font-caveat text-xl">// Interactive Quiz</div>
                <h2 className="text-5xl font-playfair font-black text-white leading-tight">
                    Discover Their <em className="grad-text hero-gradient italic">Personality</em>
                </h2>
                <p className="text-[#9090b0] text-lg leading-relaxed max-w-md font-medium">
                    Our 10-question MBTI assessment uses neural logic to accurately predict personality archetypes based on behavior.
                </p>
                <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3 text-[#9090b0] text-sm">
                        <span className="text-[#f0d060] text-lg">✓</span> Neural-driven prediction logic
                    </div>
                    <div className="flex items-center gap-3 text-[#9090b0] text-sm">
                        <span className="text-[#f0d060] text-lg">✓</span> High-fidelity gift matchmaking
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-[40px] p-12 relative overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.5)]">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#f0d060]/5 rounded-full blur-3xl" />

                <div className="flex gap-2 mb-10">
                    {questions.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-all duration-500 ${i < current ? 'bg-[#f0d060]' : i === current ? 'bg-gradient-to-r from-[#f0d060] to-[#c084fc]' : 'bg-white/5'
                                }`}
                        />
                    ))}
                </div>

                <div className="text-[#9090b0] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Segment {current + 1} of 10
                </div>

                <div className="text-3xl font-playfair font-black text-white mb-10 leading-snug">
                    {q.question}
                </div>

                <div className="flex flex-col gap-4">
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(opt.value)}
                            className={`p-6 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 group/opt ${answers[q.id] === opt.value
                                ? 'border-[#f0d060] bg-[#f0d060]/10 text-white shadow-[0_0_32px_rgba(240,208,96,0.1)]'
                                : 'border-white/5 bg-transparent text-[#9090b0] hover:border-[#f0d060]/30 hover:bg-[#f0d060]/5 hover:text-white'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${answers[q.id] === opt.value ? 'border-[#f0d060]' : 'border-white/20'
                                }`}>
                                {answers[q.id] === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-[#f0d060]" />}
                            </div>
                            <span className="font-bold text-lg">{opt.text}</span>
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-12">
                    <button
                        onClick={() => current > 0 && setCurrent(current - 1)}
                        className={`text-[10px] font-black uppercase tracking-widest transition-colors ${current === 0 ? 'text-[#9090b0]/30 cursor-not-allowed' : 'text-[#9090b0] hover:text-white'
                            }`}
                        disabled={current === 0}
                    >
                        ← Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={answers[q.id] === undefined || isFinishing}
                        className={`btn-primary !px-10 !py-4 ${answers[q.id] === undefined || isFinishing ? 'opacity-50 cursor-not-allowed saturate-0 shadow-none' : ''
                            }`}
                    >
                        {isFinishing ? 'Processing Artifacts...' : current === questions.length - 1 ? 'Analyze Persona →' : 'Continue →'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Quiz;
