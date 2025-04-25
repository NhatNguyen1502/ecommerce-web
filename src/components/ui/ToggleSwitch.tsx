
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

interface ToggleSwitchProps {
  isActive: boolean;
  onToggle: (newState: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  confirmationRequired?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: (newState: boolean) => string;
  confirmText?: string;
  cancelText?: string;
}

const ToggleSwitch = ({
  isActive,
  onToggle,
  size = "md",
  disabled = false,
  label,
  confirmationRequired = false,
  confirmationTitle = "Confirm Action",
  confirmationMessage = (newState) =>
    `Are you sure you want to ${
      newState ? "activate" : "deactivate"
    } this item?`,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ToggleSwitchProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingState, setPendingState] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          switch: "w-8 h-4",
          dot: "h-3 w-3",
          translate: "translate-x-4",
        };
      case "lg":
        return {
          switch: "w-14 h-7",
          dot: "h-6 w-6",
          translate: "translate-x-7",
        };
      case "md":
      default:
        return {
          switch: "w-11 h-6",
          dot: "h-5 w-5",
          translate: "translate-x-5",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const handleClick = () => {
    if (disabled) return;

    if (confirmationRequired) {
      setPendingState(!isActive);
      setShowConfirmation(true);
    } else {
      onToggle(!isActive);
    }
  };

  const handleConfirm = () => {
    onToggle(pendingState);
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        type="button"
        className={`${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } relative inline-flex flex-shrink-0 items-center`}
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={isActive}
      >
        <span className="sr-only">{isActive ? "Deactivate" : "Activate"}</span>
        <div
          className={`${isActive ? "bg-green-600" : "bg-gray-200"} 
          relative inline-flex ${
            sizeClasses.switch
          } flex-shrink-0 rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${isActive ? sizeClasses.translate : "translate-x-0"}
            pointer-events-none inline-block ${
              sizeClasses.dot
            } transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </div>
        {label && <span className="ml-2 text-sm">{label}</span>}
      </button>

      <ConfirmationDialog
        isOpen={showConfirmation}
        title={confirmationTitle}
        message={confirmationMessage(pendingState)}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        variant={pendingState ? "info" : "warning"}
      />
    </>
  );
};

export default ToggleSwitch;
