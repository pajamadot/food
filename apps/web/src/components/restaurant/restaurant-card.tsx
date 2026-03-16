"use client";

import type { Restaurant } from "@food/shared";
import { Card, CardContent } from "@/components/ui/card";
import { getPhotoUrl } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { MapPin, Star, Check } from "lucide-react";

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
              className="h-16 w-16 rounded-lg object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-2xl">
              🍽️
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate font-semibold text-sm">
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
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              {restaurant.rating && (
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {restaurant.rating}
                  {restaurant.userRatingCount && (
                    <span>({restaurant.userRatingCount})</span>
                  )}
                </span>
              )}
              {restaurant.cuisineTypes.length > 0 && (
                <span>{restaurant.cuisineTypes.slice(0, 2).join(", ")}</span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              {restaurant.address}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
