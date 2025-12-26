import React from "react";
import { Mic, Square } from "lucide-react";
import { RecordingState } from "../types";

interface RecordButtonProps {
  recordingState: RecordingState;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const RecordButton: React.FC<RecordButtonProps> = ({
  recordingState,
  onStartRecording,
  onStopRecording,
}) => {
  const isRecording = recordingState === RecordingState.RECORDING;
  const isProcessing = recordingState === RecordingState.PROCESSING;

  return (
    <button
      onMouseDown={onStartRecording}
      onMouseUp={onStopRecording}
      onMouseLeave={isRecording ? onStopRecording : undefined}
      disabled={isProcessing}
      className={`
        relative w-24 h-24 rounded-full transition-all duration-200
        flex items-center justify-center
        ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 scale-110"
            : "bg-blue-500 hover:bg-blue-600"
        }
        ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        shadow-lg hover:shadow-xl
        active:scale-95
      `}
    >
      {isRecording ? (
        <Square className="w-10 h-10 text-white" fill="white" />
      ) : (
        <Mic className="w-10 h-10 text-white" />
      )}

      {isRecording && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      )}
    </button>
  );
};
