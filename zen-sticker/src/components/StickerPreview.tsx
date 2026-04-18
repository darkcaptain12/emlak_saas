"use client";

import { useEffect, useRef } from "react";
import type { CustomizationOptions } from "@/types";
import { getFontById } from "@/lib/fonts";

const CANVAS_SIZE = 300;

interface StickerPreviewProps {
  options: CustomizationOptions;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  const spikes = 5;
  const innerR = r * 0.45;
  let angle = -Math.PI / 2;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? r : innerR;
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    angle += Math.PI / spikes;
  }
  ctx.closePath();
}

export function StickerPreview({ options }: StickerPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = CANVAS_SIZE;
    const pad = 20;
    const innerSize = size - pad * 2;
    const font = getFontById(options.fontId);

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = options.bgColor;

    if (options.shape === "circle") {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, innerSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (options.shape === "rounded") {
      const r = 32;
      ctx.beginPath();
      ctx.roundRect(pad, pad, innerSize, innerSize, r);
      ctx.fill();
    } else if (options.shape === "star") {
      drawStar(ctx, size / 2, size / 2, innerSize / 2);
      ctx.fill();
    } else {
      ctx.fillRect(pad, pad, innerSize, innerSize);
    }

    ctx.restore();

    if (!options.text) return;

    const maxFontSize = Math.min(options.fontSize, 52);
    ctx.font = `bold ${maxFontSize}px ${font.family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = options.textColor;

    const words = options.text.split(" ");
    const lineH = maxFontSize * 1.25;
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > innerSize - 24) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);

    const totalH = lines.length * lineH;
    const startY = size / 2 - totalH / 2 + lineH / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, size / 2, startY + i * lineH);
    });
  }, [options]);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="rounded-2xl border border-[var(--color-zen-border)]"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <p className="text-xs text-[var(--color-zen-muted)]">Canlı önizleme</p>
    </div>
  );
}
