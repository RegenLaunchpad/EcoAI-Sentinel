
import React from 'react';

interface LogoProps {
  className?: string;
  isOff?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", isOff = false }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} transition-all duration-700 ${isOff ? 'grayscale opacity-30 brightness-50' : ''}`}
    >
      <defs>
        {/* Precise Gradient matching the reference: Mint Green to Cyan */}
        <linearGradient id="peacockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#58E89F" />
          <stop offset="100%" stopColor="#32CFE0" />
        </linearGradient>
        
        {/* Multi-layered filter to achieve the specific "carved-out" look from the image */}
        <filter id="carvedDepth" x="-20%" y="-20%" width="140%" height="140%">
          {/* Subtle inner shadow for depth */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="blur" />
          <feOffset dx="0" dy="0.8" result="offsetBlur" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
          <feFlood floodColor="#000000" floodOpacity="0.7" result="shadowColor" />
          <feComposite in="shadowColor" in2="innerShadow" operator="in" result="darkEdge" />
          
          {/* The "lip" glow at the bottom edge of the hole */}
          <feFlood floodColor="#ffffff" floodOpacity="0.3" result="glowColor" />
          <feOffset dx="0" dy="-0.5" in="SourceAlpha" />
          <feGaussianBlur stdDeviation="0.4" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="glowShadow" />
          <feComposite in="glowColor" in2="glowShadow" operator="in" result="brightEdge" />
          
          <feMerge>
            <feMergeNode in="darkEdge" />
            <feMergeNode in="brightEdge" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Refined Teardrop Path: Point at 0,0, bulbous bottom */}
        <path 
          id="finalTeardrop" 
          d="M0 0 C 4.5 0 7 3.5 7 8 C 7 12 4 15 0 15 C -4 15 -7 12 -7 8 C -7 3.5 -4.5 0 0 0 Z" 
        />
      </defs>
      
      {/* Background Squircle */}
      <rect x="0" y="0" width="100" height="100" rx="28" fill="url(#peacockGradient)" />
      
      {/* The Central Fan Structure */}
      <g transform="translate(50, 52) scale(0.96)" filter="url(#carvedDepth)">
        {/* 1. Large Base Teardrop (Point facing UP) */}
        <use href="#finalTeardrop" transform="translate(0, 10) scale(1.5)" fill="#0d1413" />

        {/* 2. Tiny teardrop directly above the point of the base */}
        <use href="#finalTeardrop" transform="translate(0, -10) scale(0.4)" fill="#0d1413" />

        {/* 3. Middle Tier Arc (7 drops including the top center peak) */}
        {/* Top peak */}
        <use href="#finalTeardrop" transform="translate(0, -42) scale(0.85)" fill="#0d1413" />
        {/* Left inner */}
        <use href="#finalTeardrop" transform="translate(-13, -29) rotate(-32) scale(0.7)" fill="#0d1413" />
        <use href="#finalTeardrop" transform="translate(-21, -15) rotate(-65) scale(0.7)" fill="#0d1413" />
        {/* Right inner */}
        <use href="#finalTeardrop" transform="translate(13, -29) rotate(32) scale(0.7)" fill="#0d1413" />
        <use href="#finalTeardrop" transform="translate(21, -15) rotate(65) scale(0.7)" fill="#0d1413" />

        {/* 4. Outer Tier Arc (Wide wings - 6 drops total) */}
        {/* Left wing */}
        <use href="#finalTeardrop" transform="translate(-28, -35) rotate(-45) scale(0.85)" fill="#0d1413" />
        <use href="#finalTeardrop" transform="translate(-35, -17) rotate(-78) scale(0.85)" fill="#0d1413" />
        <use href="#finalTeardrop" transform="translate(-32, 4) rotate(-98) scale(0.85)" fill="#0d1413" />
        {/* Right wing */}
        <use href="#finalTeardrop" transform="translate(28, -35) rotate(45) scale(0.85)" fill="#0d1413" />
        <use href="#finalTeardrop" transform="translate(35, -17) rotate(78) scale(0.85)" fill="#0d1413" />
        <use href="#finalTeardrop" transform="translate(32, 4) rotate(98) scale(0.85)" fill="#0d1413" />

        {/* 5. Flanking drops directly next to the tiny center drop */}
        <use href="#finalTeardrop" transform="translate(-11, -3) rotate(-35) scale(0.55)" fill="#0d1413" />
        <use href="#finalTeardrop" transform="translate(11, -3) rotate(35) scale(0.55)" fill="#0d1413" />
      </g>
      
      {/* System Dormant / Inactive state overlay */}
      {isOff && (
        <rect width="100" height="100" rx="28" fill="black" fillOpacity="0.45" />
      )}
    </svg>
  );
};
