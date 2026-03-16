"use client";

import { DELIVERY_PLATFORMS } from "@/lib/delivery-links";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type DeliveryButtonsProps = {
  restaurantName: string;
  googleMapsUri?: string;
};

export function DeliveryButtons({
  restaurantName,
  googleMapsUri,
}: DeliveryButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">
        Order delivery or get directions:
      </p>
      <div className="flex flex-wrap gap-2">
        {DELIVERY_PLATFORMS.map((platform) => (
          <Button
            key={platform.name}
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={platform.getUrl(restaurantName)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{platform.icon}</span>
              {platform.name}
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        ))}
        {googleMapsUri && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 Google Maps
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
