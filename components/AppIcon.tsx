/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { Bot } from 'lucide-react';

interface AppIconProps {
  src?: string;
  alt: string;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  // If error or no src provided, render an aesthetic cyber logo fallback
  if (hasError || !src) {
    const initial = alt ? alt.trim().charAt(0).toUpperCase() : 'A';
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1c3d] via-[#09152b] to-[#040c1a] border border-cyan-400/40 text-cyan-300 font-black shadow-inner select-none ${className}`}
      >
        <span className="text-xl leading-none drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
          {initial}
        </span>
        <Bot className="w-3.5 h-3.5 text-cyan-400/80 -mt-0.5" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`w-full h-full object-cover transition-opacity duration-300 ${className}`}
    />
  );
};
