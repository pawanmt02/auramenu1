import React from 'react';
import { motion } from 'framer-motion';

export const FloatingSpiceParticles: React.FC = () => {
  // Pre-configured glowing motes
  const particles = [
    { id: 1, size: 6, x: '10%', y: '20%', color: '#f59e0b', duration: 14, delay: 0 },
    { id: 2, size: 4, x: '85%', y: '15%', color: '#ea580c', duration: 18, delay: 2 },
    { id: 3, size: 8, x: '70%', y: '75%', color: '#fbbf24', duration: 16, delay: 1 },
    { id: 4, size: 5, x: '25%', y: '80%', color: '#f97316', duration: 20, delay: 3 },
    { id: 5, size: 7, x: '50%', y: '40%', color: '#eab308', duration: 22, delay: 0.5 },
    { id: 6, size: 4, x: '90%', y: '50%', color: '#f59e0b', duration: 15, delay: 4 },
    { id: 7, size: 5, x: '15%', y: '60%', color: '#fbbf24', duration: 19, delay: 2.5 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full blur-[1px]"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            boxShadow: `0 0 12px ${p.color}`
          }}
          animate={{
            y: ['0px', '-45px', '25px', '0px'],
            x: ['0px', '30px', '-20px', '0px'],
            opacity: [0.2, 0.7, 0.4, 0.2],
            scale: [1, 1.4, 0.9, 1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay
          }}
        />
      ))}
    </div>
  );
};
