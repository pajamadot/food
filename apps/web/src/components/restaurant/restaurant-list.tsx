"use client";

import type { Restaurant } from "@food/shared";
import { RestaurantCard } from "./restaurant-card";

type RestaurantListProps = {
  restaurants: Restaurant[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
};

export function RestaurantList({
  restaurants,
  selectedIds,
  onToggle,
}: RestaurantListProps) {
  if (restaurants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">
          {restaurants.length} restaurants found
        </h2>
        <span className="text-xs text-muted-foreground">
          {selectedIds.size} selected for wheel
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            selected={selectedIds.has(restaurant.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
