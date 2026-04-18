"use client";

import { FONTS } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface FontPickerProps {
  value: string;
  onChange: (fontId: string) => void;
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {FONTS.map((font) => (
        <button
          key={font.id}
          type="button"
          onClick={() => onChange(font.id)}
          className={cn(
            "flex flex-col items-start gap-0.5 p-3 rounded-xl border text-left transition-all",
            value === font.id
              ? "border-[var(--color-zen-accent)] bg-[var(--color-zen-accent)]/5"
              : "border-[var(--color-zen-border)] hover:border-[var(--color-zen-stone)]"
          )}
        >
          <span className="text-xs text-[var(--color-zen-muted)]">{font.preview}</span>
          <span
            className="text-base leading-tight"
            style={{ fontFamily: font.family }}
          >
            {font.name}
          </span>
        </button>
      ))}
    </div>
  );
}
