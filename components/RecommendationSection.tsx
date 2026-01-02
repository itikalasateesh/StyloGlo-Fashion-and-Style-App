
import React from 'react';
import { Recommendation } from '../types';

interface Props {
  title: string;
  items: Recommendation[];
  icon: React.ReactNode;
}

export const RecommendationSection: React.FC<Props> = ({ title, items, icon }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl transition-all active:scale-[0.98]">
            <h4 className="font-semibold text-white mb-2">{item.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{item.description}</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, tIdx) => (
                <span key={tIdx} className="px-2.5 py-1 bg-white/5 text-slate-400 text-[11px] font-medium rounded-full tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};