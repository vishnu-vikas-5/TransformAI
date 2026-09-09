/**
 * TransformAI Centralized Design Tokens
 * 
 * Strict Reference Visual Design System:
 * - OBSIDIAN BLACK:   #000000 (Page background, main surfaces, card interiors)
 * - ONYX SURFACE:     #121212 (Panels, modals, card containers, dropdowns)
 * - WARM SAND GOLD:   #DFD0B8 (Primary accents, borders, icons, primary buttons, pill fills)
 * - WARM CREAM:       #E1DCC9 (Secondary text, subtitles, table text, metadata)
 * - PURE WHITE:       #FFFFFF (Headlines, primary metric values, high-contrast labels)
 * - INVERSE TEXT:     #000000 (Text on warm sand gold buttons/badges)
 */

export const PALETTE = {
  // Official Reference System: Color Names & Hex Codes
  darkEspresso: '#000000', // Pure Obsidian Black: Main Page Background, Modal Backdrops & Deep Surfaces
  chocBrown: '#121212',    // Dark Onyx Surface: Panel backgrounds, Cards, Code Blocks & Dropdowns
  sandGold: '#DFD0B8',     // Warm Sand Gold: Primary Accents, Active Indicators, Card Borders, Primary Buttons, & Icons
  warmCream: '#E1DCC9',    // Warm Cream Sand: Secondary Text, Sub-accents, Button Hover States & Badge Borders
  creamIvory: '#FFFFFF',   // Pure Crisp White: Primary Headings (h1 - h6), Main Body Text & High Contrast Elements
  textMuted: '#A0A0A0',    // Muted Grey: Subtitles, Muted Metadata & Placeholder text

  // Aliases for compatibility
  black: '#000000',
  darkOnyx: '#121212',
  white: '#FFFFFF',
  
  // Opacity variations for depth & borders
  sandGoldMuted: 'rgba(223, 208, 184, 0.75)',
  sandGoldSubtle: 'rgba(223, 208, 184, 0.40)',
  sandGoldFaint: 'rgba(223, 208, 184, 0.15)',
  borderSubtle: 'rgba(223, 208, 184, 0.25)',
  borderMedium: 'rgba(223, 208, 184, 0.45)',
  borderProminent: '#DFD0B8',
  
  // Surfaces
  surfacePrimary: '#000000',
  surfaceSecondary: '#121212',
  surfaceCard: '#121212',
  surfaceHover: '#1A1A1A',
  surfaceAccent: '#DFD0B8',
  
  // Backgrounds
  bgPrimary: '#000000',
  bgSecondary: '#121212',
  bgTertiary: '#181818',
  
  // Typography
  textPrimary: '#FFFFFF',
  textSecondary: '#E1DCC9',
  textInverse: '#000000',
  textAccent: '#DFD0B8',
  
  // Semantic status colors (harmonious with black & sand gold)
  semanticRed: '#8B1E1E',
  semanticRedBg: 'rgba(139, 30, 30, 0.15)',
  semanticAmber: '#DFD0B8',
  semanticAmberBg: 'rgba(223, 208, 184, 0.15)',
  semanticGreen: '#235E35',
  semanticGreenBg: 'rgba(35, 94, 53, 0.15)',
};

export const GRADIENTS = {
  brandAccent: 'linear-gradient(135deg, #DFD0B8 0%, #E1DCC9 100%)',
  surfaceCard: 'linear-gradient(135deg, #000000 0%, #121212 100%)',
};

export const EFFECTS = {
  glow: '0 0 20px rgba(223, 208, 184, 0.3)',
  modalBackdrop: 'rgba(0, 0, 0, 0.94)',
  modalBackdropFilter: 'blur(8px)',
};

export const TYPOGRAPHY = {
  fontSans: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  }
};

export const RADII = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px'
};

export const SHADOWS = {
  subtle: '0 2px 8px rgba(0, 0, 0, 0.6)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.8)',
  card: '0 8px 24px rgba(0, 0, 0, 0.9)',
  glow: '0 0 20px rgba(223, 208, 184, 0.30)'
};

export default {
  PALETTE,
  GRADIENTS,
  EFFECTS,
  TYPOGRAPHY,
  RADII,
  SHADOWS
};
