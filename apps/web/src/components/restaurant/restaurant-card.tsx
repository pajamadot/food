"use client";

import type { Restaurant } from "@food/shared";
import { Card, CardContent } from "@/components/ui/card";
import { getPhotoUrl } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Star,
  Check,
  Globe,
  Phone,
  UtensilsCrossed,
  ShoppingBag,
  Truck,
} from "lucide-react";

const PRICE_LABELS = ["Free", "$", "$$", "$$$", "$$$$"];

type RestaurantCardProps = {
  restaurant: Restaurant;
  selected: boolean;
  onToggle: (id: string) => void;
};

export function RestaurantCard({
  restaurant,
  selected,
  onToggle,
}: RestaurantCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        selected && "ring-2 ring-primary shadow-md"
      )}
      onClick={() => onToggle(restaurant.id)}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {restaurant.photoUri ? (
            <img
              src={getPhotoUrl(restaurant.photoUri)}
              alt={restaurant.name}
              className="h-20 w-20 rounded-lg object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted text-2xl">
              🍽️
            </div>
          )}
          <div className="min-w-0 flex-1">
            {/* Row 1: Name + checkbox */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm leading-tight">
                {restaurant.name}
              </h3>
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected
                    ? "border-primary bg-primary text-white"
                    : "border-muted-foreground/30"
                )}
              >
                {selected && <Check className="h-3 w-3" />}
              </div>
            </div>

            {/* Row 2: Rating + Price + Open status */}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
              {restaurant.rating != null && (
                <span className="flex items-center gap-0.5 font-medium">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {restaurant.rating}
                  {restaurant.userRatingCount != null && (
                    <span className="text-muted-foreground">
                      ({restaurant.userRatingCount.toLocaleString()})
                    </span>
                  )}
                </span>
              )}
              {restaurant.priceLevel != null && restaurant.priceLevel > 0 && (
                <span className="font-medium text-emerald-600">
                  {PRICE_LABELS[restaurant.priceLevel]}
                </span>
              )}
              {restaurant.isOpenNow != null && (
                <span
                  className={cn(
                    "font-medium",
                    restaurant.isOpenNow
                      ? "text-emerald-600"
                      : "text-red-500"
                  )}
                >
                  {restaurant.isOpenNow ? "Open" : "Closed"}
                </span>
              )}
            </div>

            {/* Row 3: Cuisine / primary type */}
            <div className="mt-1 flex flex-wrap gap-1">
              {restaurant.cuisineTypes.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Row 4: Summary */}
            {restaurant.summary && (
              <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                {restaurant.summary}
              </p>
            )}

            {/* Row 5: Address */}
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              {restaurant.address}
            </p>

            {/* Row 6: Service options + links */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
              {restaurant.dineIn && (
                <span className="flex items-center gap-0.5">
                  <UtensilsCrossed className="h-3 w-3" /> Dine-in
                </span>
              )}
              {restaurant.takeout && (
                <span className="flex items-center gap-0.5">
                  <ShoppingBag className="h-3 w-3" /> Takeout
                </span>
              )}
              {restaurant.delivery && (
                <span className="flex items-center gap-0.5">
                  <Truck className="h-3 w-3" /> Delivery
                </span>
              )}
              {restaurant.websiteUri && (
                <a
                  href={restaurant.websiteUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Globe className="h-3 w-3" /> Website
                </a>
              )}
              {restaurant.phoneNumber && (
                <a
                  href={`tel:${restaurant.phoneNumber}`}
                  className="flex items-center gap-0.5 text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="h-3 w-3" /> {restaurant.phoneNumber}
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
