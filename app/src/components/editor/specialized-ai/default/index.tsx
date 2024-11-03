import Magic from "@/components/ui/icons/magic";

export const AIThinking = () => {
  return (
    <div className="w-full items-center justify-center text-xl flex flex-col font-medium text-muted-foreground text-white">
      <div className="flex items-center justify-center">
        <Magic className="mr-2 h-8 w-8 shrink-0" />
        AI is thinking
      </div>
      <div className="mt-1">
        <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white"></div>
      </div>
    </div>
  );
};
