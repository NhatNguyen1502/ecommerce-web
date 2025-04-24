import type React from "react";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  maxWidth?: number;
  maxHeight?: number;
}

const Tooltip = ({
  content,
  children,
  maxWidth = 300,
  maxHeight = 200,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + window.scrollY + 5, // 5px below the element
      left: rect.left + window.scrollX,
    });

    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Adjust position if tooltip goes off screen
  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust horizontal position if needed
      if (tooltipRect.right > viewportWidth) {
        setPosition((prev) => ({
          ...prev,
          left: viewportWidth - tooltipRect.width - 10, // 10px from right edge
        }));
      }

      // Adjust vertical position if needed
      if (tooltipRect.bottom > viewportHeight) {
        const triggerRect = triggerRef.current?.getBoundingClientRect();
        if (triggerRect) {
          // Show above the element if there's not enough space below
          setPosition((prev) => ({
            ...prev,
            top: triggerRect.top + window.scrollY - tooltipRect.height - 5, // 5px above the element
          }));
        }
      }
    }
  }, [isVisible]);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block cursor-help"
    >
      {children}

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              maxWidth: `${maxWidth}px`,
              maxHeight: `${maxHeight}px`,
            }}
            className="fixed z-50 p-3 text-sm bg-gray-900 text-white rounded shadow-lg animate-in fade-in duration-200 overflow-y-auto"
          >
            <div className="whitespace-normal break-words">{content}</div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;