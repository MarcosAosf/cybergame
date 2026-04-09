import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

interface AudioContextType {
  playEffect: (effectName: 'terminal') => Promise<void>;
  stopEffect: (effectName: 'terminal') => Promise<void>;
  toggleBackground: (active: boolean) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Triple-Instance Pool for terminal (Mechanical Keyboard Concurrency)
  const terminalPool = useRef<Audio.Sound[]>([]);
  const poolIndex = useRef(0);
  
  useEffect(() => {
    async function initAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: false,
        });

        // 🛡️ THE ONLY ALLOWED ASSET: terminal.mp3
        try {
          const pool: Audio.Sound[] = [];
          for (let i = 0; i < 3; i++) {
            const s = new Audio.Sound();
            await s.loadAsync(require('../../assets/audio/terminal.mp3'), { shouldPlay: false, volume: 0.8 });
            pool.push(s);
          }
          terminalPool.current = pool;
          console.log('--- [AUDIO_SYSTEM]: Terminal Sync [3/3] ---');
        } catch (e) {
          console.warn('--- [AUDIO_SYSTEM]: Initialization Warning ---');
        }
      } catch (error) {}
    }

    initAudio();

    return () => {
      terminalPool.current.forEach(s => s.unloadAsync());
    };
  }, []);

  const playEffect = async (effectName: 'terminal') => {
    if (effectName !== 'terminal') return;
    try {
      const pool = terminalPool.current;
      if (pool.length > 0) {
        const instance = pool[poolIndex.current];
        const status = await instance.getStatusAsync();
        if (status.isLoaded) {
          await instance.replayAsync();
          poolIndex.current = (poolIndex.current + 1) % pool.length;
        }
      }
    } catch (e) {}
  };

  const stopEffect = async (effectName: 'terminal') => {
    if (effectName !== 'terminal') return;
    try {
      for (const s of terminalPool.current) {
        const status = await s.getStatusAsync();
        if (status.isLoaded) {
          await s.stopAsync();
        }
      }
    } catch (e) {}
  };

  const toggleBackground = async (active: boolean) => {
    // Purged: No background drone allowed
  };

  return (
    <AudioContext.Provider value={{ playEffect, stopEffect, toggleBackground }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};
