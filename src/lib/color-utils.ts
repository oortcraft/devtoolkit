export interface ColorResult {
  hex: string;
  rgb: string;
  hsl: string;
  error?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  let full: string;
  if (clean.length === 3) {
    full = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  } else if (clean.length === 6) {
    full = clean;
  } else if (clean.length === 8) {
    full = clean.slice(0, 6);
  } else {
    return null;
  }
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0'))
      .join('')
  );
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

const CSS_NAMED_COLORS: Record<string, string> = {
  red: '#ff0000', green: '#008000', blue: '#0000ff', white: '#ffffff',
  black: '#000000', yellow: '#ffff00', orange: '#ffa500', purple: '#800080',
  pink: '#ffc0cb', cyan: '#00ffff', magenta: '#ff00ff', gray: '#808080',
  grey: '#808080', lime: '#00ff00', maroon: '#800000', navy: '#000080',
  olive: '#808000', teal: '#008080', silver: '#c0c0c0', aqua: '#00ffff',
  fuchsia: '#ff00ff', coral: '#ff7f50', salmon: '#fa8072', khaki: '#f0e68c',
  indigo: '#4b0082', violet: '#ee82ee', gold: '#ffd700', brown: '#a52a2a',
  crimson: '#dc143c', darkblue: '#00008b', darkgreen: '#006400', darkred: '#8b0000',
  deeppink: '#ff1493', deepskyblue: '#00bfff', dodgerblue: '#1e90ff',
  firebrick: '#b22222', forestgreen: '#228b22', hotpink: '#ff69b4',
  limegreen: '#32cd32', midnightblue: '#191970', orangered: '#ff4500',
  royalblue: '#4169e1', skyblue: '#87ceeb', slateblue: '#6a5acd',
  springgreen: '#00ff7f', steelblue: '#4682b4', tomato: '#ff6347',
  turquoise: '#40e0d0', yellowgreen: '#9acd32', transparent: '#00000000',
};

export function parseColor(input: string): ColorResult {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed) {
    return { hex: '', rgb: '', hsl: '', error: 'Please enter a color value.' };
  }

  // HEX
  if (trimmed.startsWith('#') || /^[0-9a-f]{3,8}$/.test(trimmed)) {
    const hexInput = trimmed.startsWith('#') ? trimmed : '#' + trimmed;
    const rgb = hexToRgb(hexInput);
    if (rgb) {
      const { r, g, b } = rgb;
      const { h, s, l } = rgbToHsl(r, g, b);
      return {
        hex: rgbToHex(r, g, b).toUpperCase(),
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${h}, ${s}%, ${l}%)`,
      };
    }
  }

  // RGB: rgb(r, g, b) or r, g, b
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    const r = clamp(parseInt(rgbMatch[1], 10), 0, 255);
    const g = clamp(parseInt(rgbMatch[2], 10), 0, 255);
    const b = clamp(parseInt(rgbMatch[3], 10), 0, 255);
    const { h, s, l } = rgbToHsl(r, g, b);
    return {
      hex: rgbToHex(r, g, b).toUpperCase(),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
    };
  }

  // HSL: hsl(h, s%, l%)
  const hslMatch = trimmed.match(/^hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%?\s*,\s*(\d+(?:\.\d+)?)%?/);
  if (hslMatch) {
    const h = clamp(Math.round(parseFloat(hslMatch[1])), 0, 360);
    const s = clamp(Math.round(parseFloat(hslMatch[2])), 0, 100);
    const l = clamp(Math.round(parseFloat(hslMatch[3])), 0, 100);
    const { r, g, b } = hslToRgb(h, s, l);
    return {
      hex: rgbToHex(r, g, b).toUpperCase(),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
    };
  }

  // CSS named colors
  if (CSS_NAMED_COLORS[trimmed]) {
    const rgb = hexToRgb(CSS_NAMED_COLORS[trimmed]);
    if (rgb) {
      const { r, g, b } = rgb;
      const { h, s, l } = rgbToHsl(r, g, b);
      return {
        hex: rgbToHex(r, g, b).toUpperCase(),
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${h}, ${s}%, ${l}%)`,
      };
    }
  }

  return { hex: '', rgb: '', hsl: '', error: 'Invalid color format. Try #3b82f6, rgb(59, 130, 246), or hsl(217, 91%, 60%).' };
}
