import React from 'react';
import { motion } from 'framer-motion';

interface AudioWaveVisualizerProps {
  isPlaying: boolean;
  color?: string;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  isPlaying,
  color = '#f59e0b'
}) => {
  const bars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5 h-4 px-1.5 py-0.5 rounded-full bg-black/40 border border-white/10">
      {bars.map((bar, i) => (
        <motion.div
          key={bar}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={
            isPlaying
              ? {
                  height: ['4px', `${12 + (i % 3) * 4}px`, '6px', '16px', '4px']
                }
              : { height: '3px' }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.6 + i * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
};
