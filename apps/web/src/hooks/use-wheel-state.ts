"use client";

import { useState, useCallback, useRef } from "react";
import type { Restaurant } from "@food/shared";

type WheelState = {
  isSpinning: boolean;
  winner: Restaurant | null;
  rotation: number;
};

export function useWheelState(selectedRestaurants: Restaurant[]) {
  const [state, setState] = useState<WheelState>({
    isSpinning: false,
    winner: null,
    rotation: 0,
  });
  const animationRef = useRef<number>(0);

  const spin = useCallback(() => {
    if (state.isSpinning || selectedRestaurants.length === 0) return;

    setState((prev) => ({ ...prev, isSpinning: true, winner: null }));

    const totalSegments = selectedRestaurants.length;
    const segmentAngle = 360 / totalSegments;

    // Random winner
    const winnerIndex = Math.floor(Math.random() * totalSegments);

    // Calculate target rotation: multiple full spins + landing position
    // The wheel is drawn starting from top (12 o'clock), going clockwise.
    // The pointer is at the top. We need the winner segment to land at the pointer.
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
    const targetSegmentCenter = winnerIndex * segmentAngle + segmentAngle / 2;
    // To land on winnerIndex at the top pointer, the wheel needs to rotate
    // so that the segment is at 0 degrees (top). Since the wheel rotates clockwise,
    // we subtract from 360.
    const targetAngle = fullSpins * 360 + (360 - targetSegmentCenter);

    const startTime = performance.now();
    const duration = 4000 + Math.random() * 1000; // 4-5 seconds
    const startRotation = state.rotation % 360;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for physics-like deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + targetAngle * eased;

      setState((prev) => ({ ...prev, rotation: currentRotation }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setState({
          isSpinning: false,
          winner: selectedRestaurants[winnerIndex],
          rotation: currentRotation,
        });
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [state.isSpinning, state.rotation, selectedRestaurants]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setState({ isSpinning: false, winner: null, rotation: 0 });
  }, []);

  const clearWinner = useCallback(() => {
    setState((prev) => ({ ...prev, winner: null }));
  }, []);

  return { ...state, spin, reset, clearWinner };
}
