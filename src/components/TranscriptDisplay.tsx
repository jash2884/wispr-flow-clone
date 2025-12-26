import React, { useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { TranscriptSegment } from "../types";

interface TranscriptDisplayProps {
  segments: TranscriptSegment[];
  interimText: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  segments,
  interimText,
}) => {
  const [copied, setCopied] = React.useState(false);
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [segments, interimText]);

  const fullText = segments.map((s) => s.text).join(" ");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <h2 className="text-sm font-semibold text-gray-700">Transcript</h2>
        {fullText && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      <div
        ref={displayRef}
        className="flex-1 p-4 overflow-y-auto text-gray-800 leading-relaxed"
      >
        {segments.length === 0 && !interimText ? (
          <p className="text-gray-400 italic text-center mt-8">
            Press and hold the microphone button to start recording...
          </p>
        ) : (
          <>
            {segments.map((segment) => (
              <span key={segment.id} className="mr-1">
                {segment.text}
              </span>
            ))}
            {interimText && (
              <span className="text-gray-400 italic ml-1">{interimText}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
