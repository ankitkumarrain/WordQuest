export const setAudioModeAsync = jest.fn().mockResolvedValue(undefined);
export const createAudioPlayer = jest.fn().mockReturnValue({
  play: jest.fn(),
  pause: jest.fn(),
  seekTo: jest.fn(),
  loop: false,
  volume: 1,
  playbackRate: 1,
  shouldCorrectPitch: false,
});
