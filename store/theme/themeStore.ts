import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, GraphicsTier } from './tokens';

export type PanelId =
  | 'background'
  | 'header'
  | 'chatBubbleAssistant'
  | 'chatBubbleUser'
  | 'composer'
  | 'navRail';

export type MediaType = 'gif' | 'video';

export interface PanelConfig {
  color: string;
  radius: number;
  imageUri?: string;
  media?: { type: MediaType; uri: string };
}

interface ThemeState {
  graphicsTier: GraphicsTier;
  panels: Record<PanelId, PanelConfig>;
  hydrated: boolean;
  setGraphicsTier: (tier: GraphicsTier) => void;
  updatePanel: (id: PanelId, patch: Partial<PanelConfig>) => void;
  clearPanelMedia: (id: PanelId) => void;
  resetPanel: (id: PanelId) => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'veil.theme.v1';

const defaultPanels: Record<PanelId, PanelConfig> = {
  background: { color: colors.void, radius: 0 },
  header: { color: colors.surface, radius: 0 },
  chatBubbleAssistant: { color: colors.surface, radius: radius.md },
  chatBubbleUser: { color: colors.surfaceRaised, radius: radius.md },
  composer: { color: colors.surfaceRaised, radius: radius.lg },
  navRail: { color: colors.surface, radius: 0 },
};

async function persist(state: Pick<ThemeState, 'graphicsTier' | 'panels'>) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // best-effort persistence — a failed write shouldn't crash the UI
  }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  graphicsTier: 'low',
  panels: defaultPanels,
  hydrated: false,

  setGraphicsTier: (tier) => {
    set({ graphicsTier: tier });
    persist({ graphicsTier: tier, panels: get().panels });
  },

  updatePanel: (id, patch) => {
    const panels = { ...get().panels, [id]: { ...get().panels[id], ...patch } };
    set({ panels });
    persist({ graphicsTier: get().graphicsTier, panels });
  },

  clearPanelMedia: (id) => {
    const current = get().panels[id];
    const panels = {
      ...get().panels,
      [id]: { ...current, imageUri: undefined, media: undefined },
    };
    set({ panels });
    persist({ graphicsTier: get().graphicsTier, panels });
  },

  resetPanel: (id) => {
    const panels = { ...get().panels, [id]: defaultPanels[id] };
    set({ panels });
    persist({ graphicsTier: get().graphicsTier, panels });
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({
          graphicsTier: parsed.graphicsTier ?? 'low',
          panels: { ...defaultPanels, ...parsed.panels },
          hydrated: true,
        });
        return;
      }
    } catch {
      // fall through to defaults on parse/read failure
    }
    set({ hydrated: true });
  },
}));
