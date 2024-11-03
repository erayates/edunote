import React from "react";

export const AIThinking = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
      </div>
      <span className="text-white/50 text-sm">AI is thinking...</span>
    </div>
  );
};
