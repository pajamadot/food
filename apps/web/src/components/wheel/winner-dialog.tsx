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
import { Star, MapPin, RotateCcw, Globe, Phone, UtensilsCrossed, ShoppingBag, Truck } from "lucide-react";

const PRICE_LABELS = ["Free", "$", "$$", "$$$", "$$$$"];
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
            {/* Rating + Price + Open */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {winner.rating != null && (
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {winner.rating}
                  {winner.userRatingCount != null && (
                    <span className="text-muted-foreground">
                      ({winner.userRatingCount.toLocaleString()})
                    </span>
                  )}
                </span>
              )}
              {winner.priceLevel != null && winner.priceLevel > 0 && (
                <span className="font-medium text-emerald-600">
                  {PRICE_LABELS[winner.priceLevel]}
                </span>
              )}
              {winner.isOpenNow != null && (
                <span className={winner.isOpenNow ? "font-medium text-emerald-600" : "font-medium text-red-500"}>
                  {winner.isOpenNow ? "Open Now" : "Closed"}
                </span>
              )}
            </div>

            {/* Summary */}
            {winner.summary && (
              <p className="text-sm text-muted-foreground">{winner.summary}</p>
            )}

            {/* Cuisine tags */}
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

            {/* Address */}
            {winner.address && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                {winner.address}
              </div>
            )}

            {/* Service options */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {winner.dineIn && (
                <span className="flex items-center gap-1">
                  <UtensilsCrossed className="h-3.5 w-3.5" /> Dine-in
                </span>
              )}
              {winner.takeout && (
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3.5 w-3.5" /> Takeout
                </span>
              )}
              {winner.delivery && (
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" /> Delivery
                </span>
              )}
            </div>

            {/* Website + Phone */}
            <div className="flex flex-wrap gap-3 text-sm">
              {winner.websiteUri && (
                <a
                  href={winner.websiteUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" /> Website
                </a>
              )}
              {winner.phoneNumber && (
                <a
                  href={`tel:${winner.phoneNumber}`}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" /> {winner.phoneNumber}
                </a>
              )}
            </div>
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
