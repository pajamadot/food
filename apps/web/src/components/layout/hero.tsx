"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

type HeroProps = {
  onGetStarted: () => void;
  loading: boolean;
};

export function Hero({ onGetStarted, loading }: HeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-6 py-12 text-center md:py-20"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-6xl"
      >
        🍽️
      </motion.div>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        Can&apos;t Decide{" "}
        <span className="text-primary">What to Eat?</span>
      </h1>
      <p className="max-w-lg text-lg text-muted-foreground">
        Pick a spot on the map, find nearby restaurants, and spin the wheel to
        let fate decide your next meal.
      </p>
      <Button size="lg" onClick={onGetStarted} disabled={loading} className="gap-2">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MapPin className="h-5 w-5" />
        )}
        {loading ? "Finding your location..." : "Use My Location"}
      </Button>
    </motion.section>
  );
}
