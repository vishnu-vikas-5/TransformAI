/**
 * SyntaxX Centralized Design Tokens
 * 
 * Strict 4-color palette:
 * BLACK:       #000000 (Page background, covers, headers)
 * DARK BROWN:  #1F150C (Main surfaces, cards, table headers, section blocks)
 * DEEP BROWN:  #412D15 (Secondary surfaces, accent blocks, hover states, centerpiece)
 * CREAM:       #E1DCC9 (Primary text, active navigation, badges, borders, icons, primary buttons)
 */

export const PALETTE = {
  black: '#000000',
  darkBrown: '#1F150C',
  brown: '#412D15',
  cream: '#E1DCC9',
  
  // Opacity variations of cream for restrained UI depth
  creamLight: '#F5F2E9',
  creamMuted: 'rgba(225, 220, 201, 0.72)',
  creamSubtle: 'rgba(225, 220, 201, 0.45)',
  borderSubtle: 'rgba(225, 220, 201, 0.18)',
  borderMedium: 'rgba(225, 220, 201, 0.35)',
  borderProminent: '#E1DCC9',
  
  // Surface tints
  surfacePrimary: '#1F150C',
  surfaceSecondary: '#412D15',
  surfaceCard: '#1F150C',
  surfaceHover: '#412D15',
  surfaceAccent: '#E1DCC9',
  
  // Backgrounds
  bgPrimary: '#000000',
  bgSecondary: '#1F150C',
  bgTertiary: '#412D15',
  
  // Typography
  textPrimary: '#E1DCC9',
  textSecondary: 'rgba(225, 220, 201, 0.75)',
  textMuted: 'rgba(225, 220, 201, 0.50)',
  textInverse: '#000000',
  textInverseDark: '#1F150C',
  
  // Semantic status colors (restrained, editorial)
  semanticRed: '#8B1E1E',
  semanticRedSubtle: 'rgba(139, 30, 30, 0.25)',
  semanticAmber: '#8A5314',
  semanticAmberSubtle: 'rgba(138, 83, 20, 0.25)',
  semanticGreen: '#235E35',
  semanticGreenSubtle: 'rgba(35, 94, 53, 0.25)',
};

export const TYPOGRAPHY = {
  fontSans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
  full: '9999px'
};

export const SHADOWS = {
  subtle: '0 2px 8px rgba(0, 0, 0, 0.4)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.6)',
  card: '0 8px 24px rgba(0, 0, 0, 0.5)'
};

export default {
  PALETTE,
  TYPOGRAPHY,
  RADII,
  SHADOWS
};
