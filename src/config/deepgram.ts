export const DEEPGRAM_CONFIG = {
  apiKey: import.meta.env.VITE_DEEPGRAM_API_KEY,
  model: "nova-2",
  language: "en-US",
  punctuate: true,
  interim_results: true,
  smart_format: true,
};

export const AUDIO_CONFIG = {
  sampleRate: 16000,
  channels: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};
