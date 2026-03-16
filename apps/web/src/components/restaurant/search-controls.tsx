"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Loader2 } from "lucide-react";

const CUISINE_FILTERS = [
  "All",
  "Chinese",
  "Japanese",
  "Korean",
  "Indian",
  "Italian",
  "Mexican",
  "Thai",
  "Vietnamese",
  "American",
  "Fast Food",
  "Cafe",
  "Pizza",
  "Sushi",
  "BBQ",
];

type SearchControlsProps = {
  radius: number;
  onRadiusChange: (radius: number) => void;
  cuisineFilter: string;
  onCuisineFilterChange: (filter: string) => void;
  onSearch: () => void;
  loading: boolean;
  disabled: boolean;
};

export function SearchControls({
  radius,
  onRadiusChange,
  cuisineFilter,
  onCuisineFilterChange,
  onSearch,
  loading,
  disabled,
}: SearchControlsProps) {
  return (
    <div className="space-y-4">
      {/* Radius slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Search Radius</label>
          <span className="text-sm text-muted-foreground">
            {radius >= 1000 ? `${(radius / 1000).toFixed(1)}km` : `${radius}m`}
          </span>
        </div>
        <Slider
          value={[radius]}
          onValueChange={([val]) => onRadiusChange(val)}
          min={500}
          max={5000}
          step={100}
        />
      </div>

      {/* Cuisine filters */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Cuisine</label>
        <div className="flex flex-wrap gap-1.5">
          {CUISINE_FILTERS.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => onCuisineFilterChange(cuisine)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                cuisineFilter === cuisine
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Search button */}
      <Button
        onClick={onSearch}
        disabled={disabled || loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        {loading ? "Searching..." : "Find Restaurants"}
      </Button>
    </div>
  );
}
