import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

function hsvToHsl(h: number, s: number, v: number): [number, number, number] {
  s /= 100;
  v /= 100;
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return [h, Math.round(sl * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (n: number) => Math.round(f(n) * 255).toString(16).padStart(2, '0');
  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}

interface ColorPickerProps {
  onConfirm: (color: string) => void;
}

export function ColorPicker({ onConfirm }: ColorPickerProps) {
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(100); // HSV saturation
  const [val, setVal] = useState(100); // HSV value/brightness
  const fieldRef = useRef<HTMLDivElement>(null);

  const [hslH, hslS, hslL] = hsvToHsl(hue, sat, val);
  const currentColor = hslToHex(hslH, hslS, hslL);

  function handleFieldPointer(e: React.PointerEvent) {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    setSat(Math.round((x / rect.width) * 100));
    setVal(Math.round(100 - (y / rect.height) * 100));
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={fieldRef}
        className="relative h-24 w-full cursor-crosshair rounded"
        style={{
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
          backgroundImage:
            'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)',
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handleFieldPointer(e);
        }}
        onPointerMove={(e) => e.buttons === 1 && handleFieldPointer(e)}
      >
        <div
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${sat}%`, top: `${100 - val}%` }}
        />
      </div>

      <input
        type="range"
        min={0}
        max={360}
        value={hue}
        onChange={(e) => setHue(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)',
        }}
      />

      <div className="flex items-center gap-2">
        <div
          className="h-6 w-6 flex-none rounded border border-border"
          style={{ backgroundColor: currentColor }}
        />
        <span className="flex-1 text-xs text-muted-foreground">{currentColor}</span>
        <Button size="sm" className="h-6 px-2 text-xs" onClick={() => onConfirm(currentColor)}>
          Add
        </Button>
      </div>
    </div>
  );
}
