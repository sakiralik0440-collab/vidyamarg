import { useState, useEffect } from "react";
import { useOfflineDetection } from "../hooks/useOfflineDetection";

function OfflineBanner() {
  const { isOnline, wasOffline } = useOfflineDetection();
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowBackOnline(true);
      const timer = setTimeout(() => setShowBackOnline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showBackOnline) return null;

  return (
    <>
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 text-sm font-medium">
          📵 You are offline — showing cached data
        </div>
      )}

      {/* Back Online Toast */}
      {showBackOnline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
          ✅ Back online!
        </div>
      )}
    </>
  );
}

export default OfflineBanner;