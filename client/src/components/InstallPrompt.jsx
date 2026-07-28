import { useState, useEffect } from "react";

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(
    localStorage.getItem("pwa_install_dismissed") === "true"
  );

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) {
        // Show prompt after 30 seconds
        setTimeout(() => setShowPrompt(true), 30000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem("pwa_install_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-orange-200 rounded-lg shadow-lg p-4">
      <div className="flex items-start gap-3">
        <div className="text-3xl">📱</div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm">
            Install VidyaMarg App
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Add to your home screen for easy access and offline use
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="bg-orange-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-orange-700 transition"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-400 text-sm px-3 py-1.5"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;