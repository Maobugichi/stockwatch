import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { PortfolioData } from "@/types";
import { useDeletePortfolioHolding, useUpdatePortfolioHolding } from "@/hooks/usePortfolio";

const HoldingsTable = ({ data }: { data: PortfolioData }) => {
  const navigate = useNavigate();
  const deleteHolding = useDeletePortfolioHolding();
  const updateHolding = useUpdatePortfolioHolding();
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    holdingId: number | null;
    symbol: string | null;
  }>({
    open: false,
    holdingId: null,
    symbol: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    holdingId: number | null;
    ticker: string;
    shares: string;
    buyPrice: string;
  }>({
    open: false,
    holdingId: null,
    ticker: "",
    shares: "",
    buyPrice: "",
  });

  const handleDeleteClick = (e: React.MouseEvent, holdingId: number, symbol: string) => {
    e.stopPropagation();
    setDeleteDialog({
      open: true,
      holdingId,
      symbol,
    });
  };

  const handleEditClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setEditDialog({
      open: true,
      holdingId: item.id,
      ticker: item.symbol,
      shares: String(item.shares),
      buyPrice: String(item.buyPrice),
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.holdingId !== null) {
      deleteHolding.mutate(deleteDialog.holdingId, {
        onSuccess: () => {
          setDeleteDialog({ open: false, holdingId: null, symbol: null });
        },
      });
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editDialog.holdingId === null) return;

    const updates: any = {};
    
    
    if (editDialog.ticker) updates.ticker = editDialog.ticker.toUpperCase();
    if (editDialog.shares) updates.shares = editDialog.shares;
    if (editDialog.buyPrice) updates.buyPrice = editDialog.buyPrice;

    updateHolding.mutate(
      {
        holdingId: editDialog.holdingId,
        data: updates,
      },
      {
        onSuccess: () => {
          setEditDialog({
            open: false,
            holdingId: null,
            ticker: "",
            shares: "",
            buyPrice: "",
          });
        },
      }
    );
  };

  return (
    <>
      <Card className="flex-1 bg-transparent text-[rgb(252,252,252)] flex flex-col rounded-sm border-none shadow-none w-full md:w-[68%] pb-0">
        <CardHeader className="text-2xl p-0 shrink-0">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            Holdings Breakdown
          </CardTitle>
        </CardHeader>

        <CardContent className="bg-[#14151C]/40 text-[rgb(252,252,252)] border border-[#14151C] rounded-2xl p-0 sm:p-2 flex-1 pb-0   overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[600px] text-[rgb(252,252,252)]  text-xs sm:text-sm">
              <TableHeader className="sticky  top-0  z-10">
                <TableRow>
                  <TableHead className="px-2 py-1 sm:px-4 text-white font-bold">Symbol</TableHead>
                  <TableHead className="px-2 py-1 sm:px-4 text-[rgb(252,252,252)]">Shares</TableHead>
                  <TableHead className="px-2 py-1 sm:px-4 text-[rgb(252,252,252)]">Buy Price</TableHead>
                  <TableHead className="px-2 py-1 sm:px-4 text-[rgb(252,252,252)]">Current</TableHead>
                  <TableHead className="px-2 py-1 sm:px-4 text-[rgb(252,252,252)]">Prev Close</TableHead>
                  <TableHead className="px-2 py-1 sm:px-4 text-[rgb(252,252,252)]">P/L</TableHead>
                  <TableHead className="px-2 py-1 sm:px-4 w-20 text-[rgb(252,252,252)]">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="">
                {data.breakdown.map((item: any, idx: number) => {
                  const pl =
                    (item.currentPrice - Number(item.buyPrice)) *
                    Number(item.shares);
                  return (
                    <TableRow
                      key={item.id || idx}
                      className="h-10 cursor-pointer sm:h-14 text-xs sm:text-sm hover:"
                      onClick={() => navigate(`/watchlist/${item.symbol}`)}
                    >
                      <TableCell className="font-medium px-2 py-1 sm:px-4">
                        {item.symbol}
                      </TableCell>
                      <TableCell className="px-2 py-1 sm:px-4 font-jet">
                        {item.shares}
                      </TableCell>
                      <TableCell className="px-2 py-1 sm:px-4 font-jet">
                        ${item.buyPrice}
                      </TableCell>
                      <TableCell className="px-2 py-1 sm:px-4 font-jet">
                        ${item.currentPrice}
                      </TableCell>
                      <TableCell className="px-2 py-1 sm:px-4 font-jet">
                        ${item.prevClose}
                      </TableCell>
                      <TableCell className="px-2 py-1 sm:px-4 font-jet">
                        <Badge
                          className={`${
                            pl >= 0 ? "bg-green-500/20 border-green-500 text-green-500" : "bg-red-500/20 border-red-500 text-red-500"
                          } rounded-full text-[10px] border sm:text-xs px-2 py-0.5 sm:px-2 sm:py-1`}
                        >
                          ${pl.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-2 py-1 sm:px-4">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                            onClick={(e) => handleEditClick(e, item)}
                            disabled={updateHolding.isPending || deleteHolding.isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                            onClick={(e) => handleDeleteClick(e, item.id, item.symbol)}
                            disabled={deleteHolding.isPending || updateHolding.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

   
      <AlertDialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Holding</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteDialog.symbol} from your portfolio? 
              This action cannot be undone.
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

    
      <Dialog 
        open={editDialog.open} 
        onOpenChange={(open) => setEditDialog({ ...editDialog, open })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleUpdateSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Holding</DialogTitle>
              <DialogDescription>
                Update the details of your holding. Leave fields unchanged to keep current values.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ticker">Ticker Symbol</Label>
                <Input
                  id="ticker"
                  value={editDialog.ticker}
                  onChange={(e) => setEditDialog({ ...editDialog, ticker: e.target.value.toUpperCase() })}
                  placeholder="AAPL"
                  className="uppercase"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="shares">Number of Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editDialog.shares}
                  onChange={(e) => setEditDialog({ ...editDialog, shares: e.target.value })}
                  placeholder="10"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="buyPrice">Buy Price ($)</Label>
                <Input
                  id="buyPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editDialog.buyPrice}
                  onChange={(e) => setEditDialog({ ...editDialog, buyPrice: e.target.value })}
                  placeholder="150.00"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialog({ ...editDialog, open: false })}
                disabled={updateHolding.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateHolding.isPending || (!editDialog.ticker && !editDialog.shares && !editDialog.buyPrice)}
              >
                {updateHolding.isPending ? "Updating..." : "Update Holding"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HoldingsTable;