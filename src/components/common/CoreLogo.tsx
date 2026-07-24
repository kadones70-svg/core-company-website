import React from 'react';

interface CoreLogoProps {
  className?: string;
  size?: number;
}

export default function CoreLogo({ className = "w-9 h-9", size = 36 }: CoreLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Left Orange to Purple Gradient */}
        <linearGradient id="coreGradOrangePurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8620A" />
          <stop offset="50%" stopColor="#C43A1A" />
          <stop offset="100%" stopColor="#8B3AC8" />
        </linearGradient>

        {/* Right Purple to Blue Gradient */}
        <linearGradient id="coreGradPurpleBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B3AC8" />
          <stop offset="60%" stopColor="#1E56C8" />
          <stop offset="100%" stopColor="#0F7A5A" />
        </linearGradient>
      </defs>

      {/* Isometric 3D Interlocking C-O Motif */}
      <g stroke="#FFFFFF" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {/* Outer Left Pillar Block (Orange -> Purple) */}
        <path
          d="M38 12 L10 28 L10 82 L38 98 L38 82 L22 72 L22 38 L38 28 Z"
          fill="url(#coreGradOrangePurple)"
        />
        <path
          d="M38 12 L50 20 L50 36 L38 28 Z"
          fill="url(#coreGradOrangePurple)"
        />
        <path
          d="M50 20 L50 88 L38 98 L38 82 Z"
          fill="url(#coreGradOrangePurple)"
        />

        {/* Interlocking Inner/Right Loop (Purple -> Blue) */}
        <path
          d="M62 18 L90 34 L90 88 L62 104 L62 88 L78 78 L78 44 L62 34 Z"
          fill="url(#coreGradPurpleBlue)"
        />
        <path
          d="M34 32 L62 48 L62 64 L34 48 Z"
          fill="url(#coreGradPurpleBlue)"
        />
        <path
          d="M34 48 L62 64 L62 80 L34 64 Z"
          fill="url(#coreGradPurpleBlue)"
        />
        <path
          d="M62 48 L90 34 L78 44 L62 34 Z"
          fill="url(#coreGradPurpleBlue)"
        />
      </g>
    </svg>
  );
}
