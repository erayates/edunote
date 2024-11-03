export default function Spinner() {
  return (
    <div className="flex items-center -mt-[120px] justify-center min-h-screen">
      <div className="relative" role="status">
        {/* Large outer circle */}
        <div className="w-24 h-24 relative rounded-full border-8 border-sky-200 border-t-sky-500 animate-spin">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-300 rounded-full animate-pulse"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
