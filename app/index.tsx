import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanelSurface } from '../components/PanelSurface';
import { colors, type, space } from '../store/theme/tokens';

export default function Home() {
  return (
    <PanelSurface panelId="background" style={styles.root}>
      <SafeAreaView style={styles.safe}>
        {/* The signal spine — a functional accent, not decoration.
            Will pulse when the AI is generating; static color = idle. */}
        <View style={styles.spine} />

        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>PROJECT VEIL</Text>
          <Text style={styles.h1}>Signal</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.bodyText}>
            Foundation is wired: theme tokens, panel store, fonts, router.
          </Text>
        </View>
      </SafeAreaView>
    </PanelSurface>
  );
}

const SPINE_WIDTH = 3;

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingLeft: space.lg + SPINE_WIDTH + space.sm },
  spine: {
    position: 'absolute',
    left: space.md,
    top: space.xl,
    bottom: space.xl,
    width: SPINE_WIDTH,
    backgroundColor: colors.signal,
    borderRadius: SPINE_WIDTH / 2,
  },
  headerBlock: { paddingTop: space.xl, paddingRight: space.lg },
  eyebrow: { ...type.eyebrow, color: colors.ash, marginBottom: space.xs },
  h1: { ...type.h1, color: colors.bone },
  body: { paddingTop: space.lg, paddingRight: space.lg },
  bodyText: { ...type.body, color: colors.ash },
});
