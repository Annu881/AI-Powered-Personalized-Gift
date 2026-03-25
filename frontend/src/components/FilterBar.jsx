import React from 'react';
import { Filter, DollarSign, Tag, User } from 'lucide-react';

const FilterBar = ({ onFilterChange, activeFilters }) => {
    const budgetRanges = [
        { label: 'All Budgets', value: 'all' },
        { label: 'Under ₹600', value: 'under-600' },
        { label: '₹600 - ₹1,500', value: '600-1500' },
        { label: '₹1,500 - ₹4,000', value: '1500-4000' },
        { label: 'Over ₹4,000', value: 'over-4000' }
    ];

    const categories = [
        { label: 'All Categories', value: 'all' },
        { label: 'Anniversary', value: 'Anniversary' },
        { label: 'Promotional', value: 'Promotional' },
        { label: 'Personality Match', value: 'Personality' }
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8 mb-16 p-8 lg:p-10 bg-white/5 border border-white/5 rounded-[40px] animate-fadeUp shadow-[0_32px_128px_rgba(0,0,0,0.5)]">
            <div className="flex-1 space-y-6">
                <label className="flex items-center gap-2 text-[10px] text-[#f0d060] uppercase tracking-[0.25em] font-black ml-1">
                    <DollarSign size={14} /> Investment Range
                </label>
                <div className="flex flex-wrap gap-3">
                    {budgetRanges.map(range => (
                        <button
                            key={range.value}
                            onClick={() => onFilterChange('budget', range.value)}
                            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-full border transition-all duration-300 ${activeFilters.budget === range.value ? 'bg-[#f0d060] border-[#f0d060] text-[#06060f] shadow-[0_8px_24px_rgba(240,208,96,0.3)]' : 'bg-transparent border-white/10 text-[#9090b0] hover:border-[#f0d060]/40 hover:text-white'}`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 space-y-6">
                <label className="flex items-center gap-2 text-[10px] text-[#f0d060] uppercase tracking-[0.25em] font-black ml-1">
                    <Tag size={14} /> Experience Category
                </label>
                <div className="flex flex-wrap gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => onFilterChange('category', cat.value)}
                            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-full border transition-all duration-300 ${activeFilters.category === cat.value ? 'bg-[#f0d060] border-[#f0d060] text-[#06060f] shadow-[0_8px_24px_rgba(240,208,96,0.3)]' : 'bg-transparent border-white/10 text-[#9090b0] hover:border-[#f0d060]/40 hover:text-white'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="lg:border-l border-white/5 lg:pl-10 flex items-center">
                <div className="flex items-center gap-5 px-8 py-5 bg-[#f0d060]/5 border border-[#f0d060]/20 rounded-3xl">
                    <div className="w-12 h-12 rounded-2xl bg-[#f0d060] flex items-center justify-center text-[#06060f] font-black shadow-lg">
                        <User size={20} />
                    </div>
                    <div>
                        <span className="text-[9px] text-[#9090b0] uppercase tracking-[0.2em] block mb-1">Active Persona</span>
                        <span className="text-base font-playfair font-black text-white">{activeFilters.mbti || 'Analyzing...'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
