"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/prebuilt-components/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
};

const DeleteListingDialog = ({
  open,
  onOpenChange,
  onConfirm,
  loading,
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-mitti-cream border-mitti-khaki">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-mitti-dark-brown">
            Delete this listing?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-mitti-dark-brown">
            This will permanently remove your homestay from Mitti.
            <br />
            <span className="font-medium text-mitti-dark-brown">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="border-mitti-khaki text-mitti-dark-brown cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Deleting…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash2 size={16} />
                Delete listing
              </span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteListingDialog;
