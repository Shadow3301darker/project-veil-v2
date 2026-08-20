import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanelSurface } from '../components/PanelSurface';
import { colors, type, space, radius } from '../store/theme/tokens';
import { useLlamaStore } from '../store/llama/llamaStore';

export default function Home() {
  const {
    status,
    modelName,
    errorMessage,
    gpuInfo,
    pickModel,
    unloadModel,
    complete,
  } = useLlamaStore();

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [generating, setGenerating] = useState(false);

  const busy = status === 'picking' || status === 'loading' || generating;
  const spineActive = status === 'loading' || generating;

  async function handleSend() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setResponse('');
    try {
      await complete(prompt, (partial) => setResponse(partial));
    } catch (e: any) {
      setResponse(`Error: ${e?.message ?? e}`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <PanelSurface panelId="background" style={styles.root}>
      <SafeAreaView style={styles.safe}>
        {/* The signal spine — functional, not decorative.
            Pulses (brighter) while the model is loading or generating. */}
        <View style={[styles.spine, spineActive && styles.spineActive]} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>PROJECT VEIL</Text>
            <Text style={styles.h1}>Signal</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>LOCAL MODEL</Text>
            <Text style={styles.statusLine}>
              {status === 'idle' && 'No model loaded'}
              {status === 'picking' && 'Choosing file…'}
              {status === 'loading' && 'Loading model…'}
              {status === 'ready' && `${modelName} · ${gpuInfo}`}
              {status === 'error' && `Error: ${errorMessage}`}
            </Text>

            <View style={styles.row}>
              <Pressable
                onPress={pickModel}
                disabled={busy}
                style={[styles.button, busy && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>Load GGUF model</Text>
              </Pressable>
              {status === 'ready' && (
                <Pressable
                  onPress={unloadModel}
                  style={[styles.button, styles.buttonGhost]}
                >
                  <Text style={styles.buttonTextGhost}>Unload</Text>
                </Pressable>
              )}
            </View>
          </View>

          {status === 'ready' && (
            <View style={styles.section}>
              <Text style={styles.label}>TEST PROMPT</Text>
              <TextInput
                value={prompt}
                onChangeText={setPrompt}
                placeholder="Ask something…"
                placeholderTextColor={colors.ash}
                style={styles.input}
                multiline
              />
              <Pressable
                onPress={handleSend}
                disabled={generating}
                style={[styles.button, generating && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>
                  {generating ? 'Generating…' : 'Send'}
                </Text>
              </Pressable>

              {response !== '' && (
                <View style={styles.responseBox}>
                  <Text style={styles.responseText}>{response}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </PanelSurface>
  );
}

const SPINE_WIDTH = 3;

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingLeft: space.lg + SPINE_WIDTH + space.sm },
  scrollContent: { paddingBottom: space.xxl, paddingRight: space.lg },
  spine: {
    position: 'absolute',
    left: space.md,
    top: space.xl,
    bottom: space.xl,
    width: SPINE_WIDTH,
    backgroundColor: colors.signalDim,
    borderRadius: SPINE_WIDTH / 2,
  },
  spineActive: { backgroundColor: colors.signal },
  headerBlock: { paddingTop: space.xl },
  eyebrow: { ...type.eyebrow, color: colors.ash, marginBottom: space.xs },
  h1: { ...type.h1, color: colors.bone },
  section: { marginTop: space.xl },
  label: { ...type.label, color: colors.ash, marginBottom: space.sm },
  statusLine: { ...type.body, color: colors.bone, marginBottom: space.md },
  row: { flexDirection: 'row', gap: space.sm },
  button: {
    backgroundColor: colors.signal,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: { ...type.label, color: colors.void, fontSize: 14 },
  buttonTextGhost: { ...type.label, color: colors.ash, fontSize: 14 },
  input: {
    ...type.body,
    color: colors.bone,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.md,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  responseBox: {
    marginTop: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.md,
  },
  responseText: { ...type.body, color: colors.bone },
});
