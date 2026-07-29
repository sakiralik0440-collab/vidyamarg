import { useState } from "react";
import { useVoiceInput } from "../hooks/useVoiceInput";

function VoiceInputButton({ onResult, language = "hi-IN", placeholder = "Speak now..." }) {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput(language);

  const [showPanel, setShowPanel] = useState(false);

  const handleStart = () => {
    setShowPanel(true);
    resetTranscript();
    startListening();
  };

  const handleStop = () => {
    stopListening();
  };

  const handleUse = () => {
    if (transcript) {
      onResult(transcript);
      resetTranscript();
      setShowPanel(false);
    }
  };

  const handleClose = () => {
    stopListening();
    resetTranscript();
    setShowPanel(false);
  };

  if (!isSupported) {
    return (
      <span className="text-xs text-gray-300 ml-2">
        (Voice not supported in this browser)
      </span>
    );
  }

  return (
    <div className="relative inline-block">
      {/* Mic Button */}
      <button
        type="button"
        onClick={isListening ? handleStop : handleStart}
        className={`ml-2 p-1.5 rounded-full transition ${
          isListening
            ? "bg-red-100 text-red-600 animate-pulse"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }`}
        title="Click to use voice input"
      >
        {isListening ? "🔴" : "🎙️"}
      </button>

      {/* Voice Input Panel */}
      {showPanel && (
        <div className="absolute left-0 top-10 z-50 bg-white border border-green-200 rounded-lg shadow-lg p-4 w-72">

          {/* Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isListening ? "bg-red-500 animate-pulse" : "bg-gray-300"
                }`}
              />
              <span className="text-sm font-medium text-gray-700">
                {isListening ? "Listening..." : "Stopped"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ×
            </button>
          </div>

          {/* Language indicator */}
          <p className="text-xs text-gray-400 mb-2">
            Language: {language === "hi-IN" ? "हिंदी" : "English"}
          </p>

          {/* Transcript Display */}
          <div className="bg-gray-50 rounded p-3 min-h-16 mb-3 text-sm text-gray-700">
            {transcript || (
              <span className="text-gray-400 italic">{placeholder}</span>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs mb-3">{error}</p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isListening ? (
              <button
                type="button"
                onClick={startListening}
                className="flex-1 bg-green-700 text-white py-2 rounded text-sm hover:bg-green-800 transition"
              >
                🎙️ Speak Again
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStop}
                className="flex-1 bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700 transition"
              >
                ⏹️ Stop
              </button>
            )}

            {transcript && !isListening && (
              <button
                type="button"
                onClick={handleUse}
                className="flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700 transition"
              >
                ✅ Use This
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceInputButton;