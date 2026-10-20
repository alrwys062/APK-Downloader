'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { SupportedLanguage, translations } from '@/lib/translations';

interface TrendingTagsProps {
  currentLang: SupportedLanguage;
  onSelectTag: (query: string) => void;
}

export const TrendingTags: React.FC<TrendingTagsProps> = ({
  currentLang,
  onSelectTag,
}) => {
  const t = translations[currentLang];

  const trendingList = [
    { name: '🔥 Free Fire', query: 'https://play.google.com/store/apps/details?id=com.dts.freefireth' },
    { name: 'PUBG Mobile', query: 'https://play.google.com/store/apps/details?id=com.tencent.ig' },
    { name: 'Clash of Clans', query: 'https://play.google.com/store/apps/details?id=com.supercell.clashofclans' },
    { name: 'Roblox', query: 'https://play.google.com/store/apps/details?id=com.roblox.client' },
    { name: 'Minecraft', query: 'com.mojang.minecraftpe' },
    { name: 'Subway Surfers', query: 'com.kiloo.subwaysurf' },
    { name: 'WhatsApp', query: 'com.whatsapp' },
    { name: 'Telegram', query: 'org.telegram.messenger' },
    { name: 'VLC Media Player', query: 'org.videolan.vlc' },
    { name: 'TikTok', query: 'com.zhiliaoapp.musically' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-amber-400 font-semibold px-2 py-1">
          <Flame className="w-3.5 h-3.5" />
          <span>{t.trendingTitle}</span>
        </div>
        {trendingList.map((tag) => (
          <button
            key={tag.query}
            onClick={() => onSelectTag(tag.query)}
            className="px-3 py-1 rounded-full border border-cyan-500/25 bg-[#09152b]/80 text-cyan-200/90 hover:border-cyan-400 hover:text-white hover:bg-cyan-950/60 transition-all font-medium"
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};
