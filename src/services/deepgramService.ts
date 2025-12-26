import { DEEPGRAM_CONFIG } from "../config/deepgram";

export class DeepgramService {
  private websocket: WebSocket | null = null;
  private apiKey: string;
  private isReady = false;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || DEEPGRAM_CONFIG.apiKey;
  }

  connect(
    onTranscript: (text: string, isFinal: boolean) => void,
    onError: (error: Error) => void
  ): boolean {
    if (!this.apiKey) {
      onError(new Error("Deepgram API key is not configured"));
      return false;
    }

    try {
      const url =
        `wss://api.deepgram.com/v1/listen` +
        `?model=${DEEPGRAM_CONFIG.model}` +
        `&language=${DEEPGRAM_CONFIG.language}` +
        `&punctuate=true` +
        `&interim_results=true` +
        `&smart_format=true` +
        `&endpointing=false` +
        `&utterance_end_ms=3000` +
        `&encoding=linear16` +
        `&sample_rate=48000`;

      // ✅ Correct browser auth
      this.websocket = new WebSocket(url, ["token", this.apiKey]);

      this.websocket.onopen = () => {
        console.log("✅ Deepgram WebSocket connected");
        this.isReady = true;
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const transcript = data.channel?.alternatives?.[0]?.transcript;

          if (transcript && transcript.trim()) {
            onTranscript(transcript, Boolean(data.is_final));
          }
        } catch (err) {
          console.error("Deepgram parse error:", err);
        }
      };

      this.websocket.onerror = () => {
        onError(new Error("Deepgram WebSocket connection failed"));
      };

      this.websocket.onclose = (event) => {
        console.warn("Deepgram WebSocket closed", event.code, event.reason);
        this.isReady = false;
      };

      return true;
    } catch (error) {
      onError(error as Error);
      return false;
    }
  }

  // ✅ ARRAYBUFFER — NOT BLOB
  sendAudio(buffer: ArrayBuffer): void {
    if (!this.websocket || !this.isReady) return;

    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(buffer);
    }
  }

  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      this.isReady = false;
    }
  }

  isConnected(): boolean {
    return this.isReady;
  }
}
