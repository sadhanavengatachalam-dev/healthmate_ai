import React from 'react';

interface ToyAvatarProps {
  isTalking: boolean;
  emotion?: 'happy' | 'concern' | 'neutral';
}

export const ToyAvatar: React.FC<ToyAvatarProps> = ({ isTalking, emotion = 'happy' }) => {
  // Simple color mapping for emotions
  const faceColor = emotion === 'concern' ? '#EBCfb2' : '#F4D35E';
  
  return (
    <div className={`relative w-40 h-40 mx-auto ${isTalking ? 'animate-talk' : 'animate-float'}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
        {/* Ears */}
        <circle cx="50" cy="50" r="25" fill="#264653" />
        <circle cx="150" cy="50" r="25" fill="#264653" />
        
        {/* Head */}
        <circle cx="100" cy="100" r="80" fill="#2A9D8F" />
        
        {/* Face Patch */}
        <ellipse cx="100" cy="110" rx="60" ry="50" fill="#F4F1DE" />
        
        {/* Eyes */}
        <circle cx="75" cy="90" r="8" fill="#264653" />
        <circle cx="125" cy="90" r="8" fill="#264653" />
        
        {/* Nose */}
        <ellipse cx="100" cy="110" rx="12" ry="8" fill="#264653" />
        
        {/* Mouth - Changes based on talking state */}
        {isTalking ? (
           <ellipse cx="100" cy="135" rx="15" ry="10" fill="#E76F51" className="animate-pulse" />
        ) : (
           <path d="M 85 130 Q 100 140 115 130" stroke="#264653" strokeWidth="3" fill="none" />
        )}

        {/* Doctor Head Mirror */}
        <circle cx="100" cy="40" r="15" fill="#C0C0C0" stroke="#555" strokeWidth="2" />
        <path d="M 100 55 L 100 70" stroke="#555" strokeWidth="4" />
        
        {/* Stethoscope */}
        <path d="M 40 150 Q 40 200 100 200 Q 160 200 160 150" stroke="#264653" strokeWidth="8" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};