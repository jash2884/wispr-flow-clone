import { useState, useEffect, useRef, useCallback } from "react";
import { RecordButton } from "./components/RecordButton";
import { TranscriptDisplay } from "./components/TranscriptDisplay";
import { StatusIndicator } from "./components/StatusIndicator";
import { AudioService } from "./services/audioService";
import { DeepgramService } from "./services/deepgramService";
import { TranscriptSegment, RecordingState } from "./types";
import { Settings } from "lucide-react";

function App() {
  const [recordingState, setRecordingState] = useState<RecordingState>(
    RecordingState.IDLE
  );
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [interimText, setInterimText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);

  const audioServiceRef = useRef<AudioService | null>(null);
  const deepgramServiceRef = useRef<DeepgramService | null>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem("deepgram_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowSettings(true);
    }

    audioServiceRef.current = new AudioService();
    requestMicrophoneAccess();

    return () => {
      audioServiceRef.current?.cleanup();
      deepgramServiceRef.current?.disconnect();
    };
  }, []);

  const requestMicrophoneAccess = async (): Promise<boolean> => {
    if (!audioServiceRef.current) return false;

    const granted = await audioServiceRef.current.requestMicrophonePermission();
    setMicPermissionGranted(granted);

    if (!granted) {
      setError("Microphone permission denied.");
    }

    return granted;
  };

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      setSegments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text,
          timestamp: Date.now(),
          isFinal: true,
        },
      ]);
      setInterimText("");
    } else {
      setInterimText(text);
    }
  }, []);

  const handleError = useCallback((err: Error) => {
    setError(err.message);
    setRecordingState(RecordingState.ERROR);
    setIsConnected(false);
  }, []);

  const startRecording = async () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    if (!micPermissionGranted) {
      const granted = await requestMicrophoneAccess();
      if (!granted) return;
    }

    setError(null);
    setRecordingState(RecordingState.RECORDING);

    deepgramServiceRef.current?.disconnect();
    deepgramServiceRef.current = new DeepgramService(apiKey);

    const deepgram = deepgramServiceRef.current;
    const connected = deepgram.connect(handleTranscript, handleError);

    if (!connected) {
      setRecordingState(RecordingState.ERROR);
      return;
    }

    const waitForSocket = setInterval(() => {
      if (deepgram.isConnected()) {
        clearInterval(waitForSocket);
        setIsConnected(true);

        audioServiceRef.current?.startRecording((pcm) => {
          deepgram.sendAudio(pcm);
        });
      }
    }, 50);
  };

  const stopRecording = () => {
    setRecordingState(RecordingState.PROCESSING);
    audioServiceRef.current?.stopRecording();

    setTimeout(() => {
      deepgramServiceRef.current?.disconnect();
      setIsConnected(false);
      setRecordingState(RecordingState.IDLE);
    }, 3000);
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem("deepgram_api_key", apiKey.trim());
    setShowSettings(false);
  };

  const handleClearTranscript = () => {
    setSegments([]);
    setInterimText("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium tracking-tight text-gray-900">
            Voice to Text
          </h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Settings */}
        {showSettings && (
          <div className="mb-6 border rounded-lg p-4">
            <label className="block text-sm mb-2 text-gray-700">
              Deepgram API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            <button
              onClick={handleSaveApiKey}
              className="mt-3 w-full bg-black text-white py-2 rounded-md text-sm"
            >
              Save
            </button>
          </div>
        )}

        <StatusIndicator
          recordingState={recordingState}
          isConnected={isConnected}
          error={error}
        />

        {/* Transcript */}
        <div className="my-6 h-[280px] border rounded-lg p-4 overflow-y-auto">
          <TranscriptDisplay segments={segments} interimText={interimText} />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-3">
          <RecordButton
            recordingState={recordingState}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
          />

          {segments.length > 0 && (
            <button
              onClick={handleClearTranscript}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear transcript
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
