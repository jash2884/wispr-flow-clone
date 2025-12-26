export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export interface DeepgramConfig {
  apiKey: string;
  model: string;
  language: string;
}

export enum RecordingState {
  IDLE = "idle",
  RECORDING = "recording",
  PROCESSING = "processing",
  ERROR = "error",
}
