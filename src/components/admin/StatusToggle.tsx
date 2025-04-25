import { useState } from "react";
import ToggleSwitch from "../ui/ToggleSwitch";
import { MutationFunction, useMutation } from "@tanstack/react-query";

interface StatusToggleProps {
  id: string;
  isActive: boolean;
  entityName: string;
  updateFunction: MutationFunction<
    void,
    { id: string; isActive: boolean }
  >;
  size?: "sm" | "md" | "lg";
}

const StatusToggle = ({
  id,
  isActive,
  entityName,
  updateFunction,
  size = "sm",
}: StatusToggleProps) => {
  const [status, setStatus] = useState(isActive);

  const mutation = useMutation({
    mutationFn: updateFunction,
  });

  const handleToggle = (newStatus: boolean) => {
    setStatus(newStatus);
    mutation.mutate({ id, isActive: !status});
  };

  return (
    <ToggleSwitch
      isActive={status}
      onToggle={handleToggle}
      size={size}
      disabled={mutation.isPending}
      confirmationRequired={true}
      confirmationTitle={`${status ? "Deactivate" : "Activate"} ${entityName}`}
      confirmationMessage={(newState) =>
        `Are you sure you want to ${
          newState ? "activate" : "deactivate"
        } this ${entityName.toLowerCase()}?`
      }
    />
  );
};

export default StatusToggle;
