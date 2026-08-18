// Core design tokens — the "signal" identity.
// Warm-dark, not cold-dark. One hot accent used with intent, not decoration.

export const colors = {
  void: '#0B0A0F',          // background — near-black, violet undertone
  surface: '#16141C',       // panels
  surfaceRaised: '#201D28', // elevated cards / sheets
  signal: '#FF6B4A',        // the one accent — warm coral-red, "live transmission"
  signalDim: '#5A3229',     // signal at rest / inactive state
  ash: '#8B8794',           // muted text, labels, timestamps
  bone: '#EDEAE4',          // primary text — warm off-white
  border: '#2A2732',        // hairline borders
  danger: '#E5484D',
} as const;

export const fonts = {
  displayRegular: 'SpaceMono_400Regular',
  displayBold: 'SpaceMono_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
} as const;

export const type = {
  eyebrow: { fontFamily: fonts.displayRegular, fontSize: 11, letterSpacing: 1.5 },
  h1: { fontFamily: fonts.bodySemibold, fontSize: 28, letterSpacing: -0.5 },
  h2: { fontFamily: fonts.bodySemibold, fontSize: 20, letterSpacing: -0.3 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.displayRegular, fontSize: 13 },
  caption: { fontFamily: fonts.displayRegular, fontSize: 11 },
} as const;

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = { sm: 8, md: 14, lg: 20, pill: 999 } as const;

// Graphics tiers gate what customization controls are exposed.
// Cumulative: each tier includes everything the tier below it has.
export type GraphicsTier = 'low' | 'medium' | 'high';

export const tierCapabilities: Record<
  GraphicsTier,
  { color: boolean; image: boolean; gif: boolean; video: boolean }
> = {
  low: { color: true, image: false, gif: false, video: false },
  medium: { color: true, image: true, gif: true, video: false },
  high: { color: true, image: true, gif: true, video: true },
};
