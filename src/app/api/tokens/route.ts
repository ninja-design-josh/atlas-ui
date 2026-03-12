import { NextResponse } from "next/server";

// Token values derived from src/app/globals.css @theme block.
// Update this file whenever globals.css tokens change.
const tokens = {
  version: "0.1.0",
  grey: {
    "grey-0":   "#FFFFFF",
    "grey-2":   "#F9FAFB",
    "grey-5":   "#F2F4F7",
    "grey-10":  "#E7EAEF",
    "grey-20":  "#D5DAE1",
    "grey-30":  "#BDC2CC",
    "grey-40":  "#A8AEBA",
    "grey-50":  "#939AA7",
    "grey-60":  "#7E8694",
    "grey-70":  "#697280",
    "grey-80":  "#545D6B",
    "grey-90":  "#424A58",
    "grey-100": "#2D3540",
    "grey-110": "#202832",
    "grey-120": "#151C25",
    "grey-130": "#000000",
  },
  blue: {
    "blue-dark": "#1855CD",
    "blue-100":  "#1E66F0",
    "blue-50":   "#6691FA",
    "blue-20":   "#99B5FA",
    "blue-10":   "#CCDBFC",
    "blue-5":    "#E5EDFF",
  },
  green: {
    "green-100": "#239B2A",
    "green-50":  "#8BCA8E",
    "green-5":   "#F4FAF4",
  },
  red: {
    "red-100": "#EB0057",
    "red-50":  "#F27DA8",
    "red-5":   "#F8EDF1",
  },
  purple: {
    "purple-dark": "#450082",
    "purple-100":  "#7C1EFA",
    "purple-50":   "#BA8CF9",
    "purple-5":    "#F3EEF9",
  },
  yellow: {
    "yellow-dark": "#D27412",
    "yellow-100":  "#F5A523",
    "yellow-50":   "#FAD08C",
    "yellow-10":   "#FEF6E9",
    "yellow-5":    "#FFFBF5",
  },
  brand: {
    "brand-lime":   "#96FD1A",
    "brand-aqua":   "#00EEF8",
    "brand-navy":   "#140F4C",
    "brand-indigo": "#36368F",
    "brand-mauve":  "#986CC1",
    "brand-teal":   "#179494",
  },
  semantic: {
    text: {
      "text-primary":   "#2D3540",
      "text-secondary": "#697280",
      "text-error":     "#EB0057",
      "text-link":      "#1E66F0",
      "text-white":     "#FFFFFF",
    },
    icon: {
      "icon-primary":   "#545D6B",
      "icon-secondary": "#697280",
      "icon-red":       "#EB0057",
      "icon-green":     "#239B2A",
      "icon-blue":      "#1E66F0",
      "icon-yellow":    "#D27412",
    },
    surface: {
      "surface":        "#FFFFFF",
      "surface-subtle": "#F9FAFB",
      "surface-raised": "#FFFFFF",
    },
    border: {
      "border":        "#E7EAEF",
      "border-strong": "#BDC2CC",
    },
  },
  radius: {
    sm:   "0.25rem",
    md:   "0.375rem",
    lg:   "0.5rem",
    xl:   "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
  shadow: {
    "elevation-0": "none",
    "elevation-1": "0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)",
    "elevation-2": "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    "elevation-4": "0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12)",
    "elevation-8": "0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)",
  },
  darkOverrides: {
    "text-primary":   "#E7EAEF",
    "text-secondary": "#A8AEBA",
    "surface":        "#202832",
    "surface-subtle": "#151C25",
    "surface-raised": "#2D3540",
    "border":         "#424A58",
    "border-strong":  "#545D6B",
    "icon-primary":   "#D5DAE1",
    "icon-secondary": "#A8AEBA",
  },
};

export function GET() {
  return NextResponse.json(tokens);
}
