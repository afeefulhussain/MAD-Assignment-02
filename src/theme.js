export const COLORS = {
  // Deep Rich Slate background hierarchy
  bgDark: '#0B0F17',
  bgSurface: '#111827',
  bgCard: '#151E2E',
  bgCardElevated: '#1A2436',
  bgCardGlass: 'rgba(26, 36, 54, 0.85)',
  bgCardHover: '#233047',
  border: '#223048',
  borderLight: '#30415D',
  borderGlow: 'rgba(99, 102, 241, 0.35)',

  // Text hierarchy (Ultra crisp high contrast)
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Status & Brand accents
  primary: '#6366F1',       // Electric Indigo
  primaryLight: '#818CF8',
  primaryGlow: 'rgba(99, 102, 241, 0.22)',
  primaryGradient: ['#6366F1', '#4F46E5'],

  present: '#10B981',       // Emerald Green
  presentGlow: 'rgba(16, 185, 129, 0.22)',
  presentText: '#34D399',
  presentBorder: '#059669',

  absent: '#F43F5E',        // Rose / Coral Red
  absentGlow: 'rgba(244, 63, 94, 0.22)',
  absentText: '#FB7185',
  absentBorder: '#E11D48',

  warning: '#F59E0B',       // Amber Gold
  warningGlow: 'rgba(245, 158, 11, 0.22)',

  whatsapp: '#25D366',      // Official WhatsApp
  whatsappDark: '#128C7E',
  whatsappGlow: 'rgba(37, 211, 102, 0.25)',

  cyan: '#06B6D4',
  purple: '#A855F7',
};

export const SHADOWS = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  cardGlowPresent: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  cardGlowAbsent: {
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  btn: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
};
