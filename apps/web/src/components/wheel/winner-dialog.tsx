"use client";

import { useEffect, useRef } from "react";
import type { Restaurant } from "@food/shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DeliveryButtons } from "@/components/delivery-links/delivery-buttons";
import { getPhotoUrl } from "@/lib/api-client";
import { Star, MapPin, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

type WinnerDialogProps = {
  winner: Restaurant | null;
  onClose: () => void;
  onSpinAgain: () => void;
  onNewSearch: () => void;
};

export function WinnerDialog({
  winner,
  onClose,
  onSpinAgain,
  onNewSearch,
}: WinnerDialogProps) {
  const confettiFired = useRef(false);

  useEffect(() => {
    if (winner && !confettiFired.current) {
      confettiFired.current = true;
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#f97316", "#06b6d4", "#8b5cf6", "#10b981"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#f97316", "#06b6d4", "#8b5cf6", "#10b981"],
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
    if (!winner) {
      confettiFired.current = false;
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <Dialog open={!!winner} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            You should eat at...
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-bold text-primary">
            {winner.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {winner.photoUri && (
            <img
              src={getPhotoUrl(winner.photoUri)}
              alt={winner.name}
              className="h-48 w-full rounded-lg object-cover"
            />
          )}

          <div className="space-y-2">
            {winner.rating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{winner.rating}</span>
                {winner.userRatingCount && (
                  <span className="text-muted-foreground">
                    ({winner.userRatingCount} reviews)
                  </span>
                )}
              </div>
            )}
            {winner.address && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                {winner.address}
              </div>
            )}
            {winner.cuisineTypes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {winner.cuisineTypes.map((cuisine) => (
                  <span
                    key={cuisine}
                    className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            )}
          </div>

          <DeliveryButtons
            restaurantName={winner.name}
            googleMapsUri={winner.googleMapsUri}
          />

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onSpinAgain}
            >
              <RotateCcw className="h-4 w-4" />
              Spin Again
            </Button>
            <Button variant="secondary" className="flex-1" onClick={onNewSearch}>
              New Search
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
