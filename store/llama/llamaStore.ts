import { create } from 'zustand';
import * as DocumentPicker from 'expo-document-picker';
import { initLlama, loadLlamaModelInfo, type LlamaContext } from 'llama.rn';

export type ModelStatus = 'idle' | 'picking' | 'loading' | 'ready' | 'error';

interface LlamaState {
  status: ModelStatus;
  modelPath: string | null;
  modelName: string | null;
  errorMessage: string | null;
  gpuInfo: string | null;
  // The live native context isn't serializable — kept out of the store's
  // tracked state, but exposed via getContext() for the completion call.
  pickModel: () => Promise<void>;
  loadModel: (uri: string, displayName: string) => Promise<void>;
  unloadModel: () => Promise<void>;
  complete: (
    prompt: string,
    onToken: (partial: string) => void
  ) => Promise<string>;
}

let contextRef: LlamaContext | null = null;

export const useLlamaStore = create<LlamaState>((set, get) => ({
  status: 'idle',
  modelPath: null,
  modelName: null,
  errorMessage: null,
  gpuInfo: null,

  pickModel: async () => {
    set({ status: 'picking', errorMessage: null });
    try {
      const result = await DocumentPicker.getDocumentAsync({
        // GGUF files don't have a registered MIME type, so filter broadly
        // and let the load step validate the actual format.
        type: ['*/*'],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) {
        set({ status: 'idle' });
        return;
      }
      const asset = result.assets[0];
      await get().loadModel(asset.uri, asset.name);
    } catch (e: any) {
      set({ status: 'error', errorMessage: e?.message ?? String(e) });
    }
  },

  loadModel: async (uri, displayName) => {
    set({ status: 'loading', errorMessage: null });
    try {
      // Release any previously loaded context before swapping models —
      // llama.rn keeps native memory allocated per-context.
      if (contextRef) {
        await contextRef.release();
        contextRef = null;
      }

      const info = await loadLlamaModelInfo(uri);
      const context = await initLlama({
        model: uri,
        use_mlock: true,
        n_ctx: 2048,
        n_gpu_layers: 0, // start CPU-only; GPU offload is an opt-in tune, not a default
      });

      contextRef = context;
      set({
        status: 'ready',
        modelPath: uri,
        modelName: displayName,
        gpuInfo: info?.gpu ? 'GPU available' : 'CPU only',
      });
    } catch (e: any) {
      set({ status: 'error', errorMessage: e?.message ?? String(e) });
    }
  },

  unloadModel: async () => {
    if (contextRef) {
      await contextRef.release();
      contextRef = null;
    }
    set({ status: 'idle', modelPath: null, modelName: null, gpuInfo: null });
  },

  complete: async (prompt, onToken) => {
    if (!contextRef) {
      throw new Error('No model loaded');
    }
    let full = '';
    const result = await contextRef.completion(
      {
        prompt,
        n_predict: 512,
        temperature: 0.7,
      },
      (data) => {
        full += data.token;
        onToken(full);
      }
    );
    return result.text ?? full;
  },
}));
