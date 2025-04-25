import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface DeleteButtonProps {
  itemName?: string;
  onConfirm: () => void;
  variant?: "outline" | "destructive" | "default";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function DeleteButton({
  itemName = "this item",
  onConfirm,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-900"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-bold text-red-500">{itemName} </span>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirm}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
