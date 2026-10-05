export const Audio = {
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
  Sound: {
    createAsync: jest.fn().mockResolvedValue({
      sound: {
        playAsync: jest.fn().mockResolvedValue(undefined),
        pauseAsync: jest.fn().mockResolvedValue(undefined),
        stopAsync: jest.fn().mockResolvedValue(undefined),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
        setOnPlaybackStatusUpdate: jest.fn(),
        getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true, isPlaying: true }),
      },
    }),
  },
};
