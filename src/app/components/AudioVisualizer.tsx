import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  color?: string;
}

export function AudioVisualizer({ isPlaying, color = '#a855f7' }: AudioVisualizerProps) {
  const bars = Array.from({ length: 50 });

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {bars.map((_, index) => (
        <motion.div
          key={index}
          className="w-1 rounded-full"
          style={{
            background: `linear-gradient(to top, ${color}, #06b6d4)`,
          }}
          animate={
            isPlaying
              ? {
                  height: [
                    Math.random() * 60 + 4,
                    Math.random() * 60 + 4,
                    Math.random() * 60 + 4,
                  ],
                }
              : { height: 4 }
          }
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.02,
          }}
        />
      ))}
    </div>
  );
}

interface WaveformVisualizerProps {
  isPlaying: boolean;
}

export function WaveformVisualizer({ isPlaying }: WaveformVisualizerProps) {
  return (
    <div className="flex items-center gap-0.5 h-8">
      {Array.from({ length: 100 }).map((_, index) => (
        <motion.div
          key={index}
          className="w-0.5 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full"
          animate={
            isPlaying
              ? {
                  height: [
                    Math.sin(index * 0.2) * 20 + 4,
                    Math.sin(index * 0.2 + 1) * 20 + 4,
                    Math.sin(index * 0.2 + 2) * 20 + 4,
                  ],
                }
              : { height: 2 }
          }
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.01,
          }}
        />
      ))}
    </div>
  );
}

interface CircularVisualizerProps {
  isPlaying: boolean;
}

export function CircularVisualizer({ isPlaying }: CircularVisualizerProps) {
  const bars = Array.from({ length: 36 });
  
  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500"
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      
      {bars.map((_, index) => {
        const angle = (index * 360) / bars.length;
        const radius = 40;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        
        return (
          <motion.div
            key={index}
            className="absolute w-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transformOrigin: 'center',
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(${radius}px)`,
            }}
            animate={
              isPlaying
                ? {
                    height: [
                      Math.random() * 20 + 4,
                      Math.random() * 20 + 4,
                      Math.random() * 20 + 4,
                    ],
                  }
                : { height: 4 }
            }
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.02,
            }}
          />
        );
      })}
    </div>
  );
}
