function ResumeSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>

      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-gray-300 rounded"></div>
        <div className="h-24 bg-gray-300 rounded"></div>
      </div>

      <div className="h-40 bg-gray-300 rounded"></div>
      <div className="h-40 bg-gray-300 rounded"></div>
    </div>
  );
}

export default ResumeSkeleton;