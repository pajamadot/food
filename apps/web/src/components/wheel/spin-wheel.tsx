"use client";

import { useRef, useEffect, useCallback } from "react";
import type { Restaurant } from "@food/shared";
import { getWheelColor } from "@/lib/colors";
import { Button } from "@/components/ui/button";

type SpinWheelProps = {
  restaurants: Restaurant[];
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
  soundEnabled: boolean;
};

const WHEEL_SIZE = 320;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 10;

export function SpinWheel({
  restaurants,
  rotation,
  isSpinning,
  onSpin,
  soundEnabled,
}: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastSegmentRef = useRef(-1);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 800 + Math.random() * 400;
      oscillator.type = "sine";
      gain.gain.value = 0.08;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio not available
    }
  }, [soundEnabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || restaurants.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = WHEEL_SIZE * dpr;
    canvas.height = WHEEL_SIZE * dpr;
    ctx.scale(dpr, dpr);

    const segmentCount = restaurants.length;
    const segmentAngle = (2 * Math.PI) / segmentCount;
    const rotationRad = (rotation * Math.PI) / 180;

    // Tick sound on segment change
    if (isSpinning) {
      const normalizedRotation = ((rotation % 360) + 360) % 360;
      const currentSegment = Math.floor(
        (normalizedRotation / 360) * segmentCount
      );
      if (currentSegment !== lastSegmentRef.current) {
        lastSegmentRef.current = currentSegment;
        playTick();
      }
    }

    // Clear
    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

    // Draw segments
    for (let i = 0; i < segmentCount; i++) {
      const startAngle = i * segmentAngle - Math.PI / 2 + rotationRad;
      const endAngle = startAngle + segmentAngle;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(CENTER, CENTER);
      ctx.arc(CENTER, CENTER, RADIUS, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = getWheelColor(i);
      ctx.fill();

      // Segment border
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.max(10, 14 - segmentCount * 0.3)}px system-ui, sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 2;

      const name = restaurants[i].name;
      const maxLen = Math.floor(RADIUS / 8);
      const displayName =
        name.length > maxLen ? name.slice(0, maxLen - 1) + "…" : name;
      ctx.fillText(displayName, RADIUS - 15, 4);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#e7e5e4";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Outer ring
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [restaurants, rotation, isSpinning, playTick]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Pointer triangle at top */}
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
          <div
            className="h-0 w-0"
            style={{
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "20px solid #1c1917",
            }}
          />
        </div>
        <canvas
          ref={canvasRef}
          style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
          className="drop-shadow-lg"
        />
      </div>
      <Button
        size="lg"
        onClick={onSpin}
        disabled={isSpinning || restaurants.length === 0}
        className="min-w-[160px] text-base font-bold"
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </Button>
    </div>
  );
}
