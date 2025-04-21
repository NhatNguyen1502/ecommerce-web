import { useState, useEffect } from "react";

interface LoadingOverlayProps {
  isLoading?: boolean;
}

export function LoadingOverlay({ isLoading = false }: LoadingOverlayProps) {
  const [visible, setVisible] = useState(isLoading);

  useEffect(() => {
    setVisible(isLoading);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16">
            <div className="absolute h-16 w-16 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-white border-l-transparent animate-spin"></div>
            <div className="absolute h-16 w-16 rounded-full border-4 border-r-blue-600 border-t-transparent border-l-white border-b-transparent animate-spin animation-delay-500"></div>
          </div>
          <style>
            {`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
              .animate-spin {
                animation: spin 1.5s linear infinite;
              }
              .animation-delay-500 {
                animation-delay: 0.5s;
                animation-direction: reverse;
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
}
