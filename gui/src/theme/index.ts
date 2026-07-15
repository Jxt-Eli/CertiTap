export const palette = {
  // Backgrounds
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF2FB',

  // Blues
  primary: '#4A7FD4',
  primaryLight: '#6B9BE8',
  primaryDim: '#D6E4F7',
  primaryDeep: '#2C5FAD',

  // Text
  text: '#1A2340',
  textSecondary: '#4A5568',
  muted: '#8A97B0',

  // States
  success: '#34A97B',
  successBg: '#D4F4E8',
  error: '#E05C5C',
  errorBg: '#FCE8E8',
  warning: '#F0A84A',

  // Borders
  border: '#E2EAF4',
  borderStrong: '#C5D5EB',

  // NFC
  nfcRing: '#4A7FD4',
  nfcRingFaint: '#B8D0F0',
};

export const spacing = {
  xs: 4,
  small: 8,
  base: 16,
  medium: 20,
  large: 28,
  xl: 40,
};

export const radius = {
  small: 8,
  base: 12,
  large: 18,
  round: 999,
};

export const shadow = {
  card: {
    shadowColor: '#2C5FAD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  strong: {
    shadowColor: '#2C5FAD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const typography = {
  heading1: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.5 },
  heading2: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3 },
  heading3: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.6 },
};
