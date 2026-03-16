"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  soundEnabled: boolean;
  onToggleSound: () => void;
};

export function Header({ soundEnabled, onToggleSound }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3 md:px-6">
      <div className="flex items-center gap-2">
        <span className="text-xl">🍽️</span>
        <span className="font-bold">What Should I Eat?</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSound}
        title={soundEnabled ? "Mute sounds" : "Enable sounds"}
      >
        {soundEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </Button>
    </header>
  );
}
