import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRemoveFromWatchlist } from "@/hooks/useWatchList";
import type { DeleteDialogType } from "../types/type";
import type { SetStateAction } from "react";



export const WatchlistDeleteDialog = ({deleteDialog, setDeleteDialog}:{deleteDialog:DeleteDialogType, setDeleteDialog:React.Dispatch<SetStateAction<DeleteDialogType>>}) => {
    const deleteHolding = useRemoveFromWatchlist();

    const confirmDelete = () => {
    if (deleteDialog.symbol !== null) {
        deleteHolding.mutate(deleteDialog.symbol, {
        onSuccess: () => {
            setDeleteDialog({ open: false, symbol: null });
        },
        });
    }
    };

    return(
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Holding</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deleteDialog.symbol} from your
                watchlist? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteHolding.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={deleteHolding.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteHolding.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    )
}