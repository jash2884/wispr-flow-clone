import React from "react";
import { RecordingState } from "../types";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";

interface StatusIndicatorProps {
  recordingState: RecordingState;
  isConnected: boolean;
  error: string | null;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  recordingState,
  isConnected,
  error,
}) => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-gray-400" />
        )}
        <span className="text-sm text-gray-600">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            recordingState === RecordingState.RECORDING
              ? "bg-red-500 animate-pulse"
              : recordingState === RecordingState.PROCESSING
              ? "bg-yellow-500 animate-pulse"
              : "bg-gray-300"
          }`}
        />
        <span className="text-sm text-gray-600 capitalize">
          {recordingState}
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};
