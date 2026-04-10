/**
 * EMERGENCY_AUDIO_BYPASS
 * expo-av has been removed due to Android native bridge crashes.
 */

export const useAudio = () => {
  return {
    playEffect: async (name?: string) => {},
    stopEffect: async (name?: string) => {},
    toggleBackground: async (active: boolean) => {},
  };
};
