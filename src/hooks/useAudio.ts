import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

// --- AUDIO_ENGINE_SINGLETON ---
// We manage sound instances outside the hook to prevent driver re-initialization crashes.
const TERMINAL_POOL_SIZE = 3;
let terminalPool: Audio.Sound[] = [];
let poolIndex = 0;
let isSubsystemInitialized = false;

export const initAudioSubsystem = async () => {
  if (isSubsystemInitialized) return;
  
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });

    const pool: Audio.Sound[] = [];
    for (let i = 0; i < TERMINAL_POOL_SIZE; i++) {
      const sound = new Audio.Sound();
      await sound.loadAsync(require('../../assets/audio/terminal.mp3'), { shouldPlay: false, volume: 0.3 });
      pool.push(sound);
    }
    terminalPool = pool;
    isSubsystemInitialized = true;
    console.log('--- [AUDIO_ENGINE]: Subsystem Online (Pool Ready) ---');
  } catch (error) {
    console.warn('--- [AUDIO_ENGINE]: Global Initialization Failed ---', error);
  }
};

export const useAudio = () => {
  const playEffect = async (name?: string) => {
    if (name !== 'terminal' || !isSubsystemInitialized) return;

    try {
      const soundInstance = terminalPool[poolIndex];
      const status = await soundInstance.getStatusAsync();
      
      if (status.isLoaded) {
        await soundInstance.replayAsync();
        poolIndex = (poolIndex + 1) % TERMINAL_POOL_SIZE;
      }
    } catch (e) {
      // Silence trigger errors to prevent UI lag
    }
  };

  const stopEffect = async (name?: string) => {
    if (name !== 'terminal' || !isSubsystemInitialized) return;
    
    try {
      for (const sound of terminalPool) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
        }
      }
    } catch (e) {}
  };

  const toggleBackground = async (active: boolean) => {
    // Background tracks purged for pure terminal aesthetic
  };

  return { playEffect, stopEffect, toggleBackground };
};
