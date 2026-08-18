import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { useThemeStore } from '../store/theme/themeStore';
import { colors } from '../store/theme/tokens';

export default function RootLayout() {
  const hydrate = useThemeStore((s) => s.hydrate);
  const hydrated = useThemeStore((s) => s.hydrated);
  const [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
    SpaceMono_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    hydrate();
  }, []);

  if (!fontsLoaded || !hydrated) {
    // Bare void-colored splash — no flash of white, no layout jump once real UI mounts.
    return <View style={{ flex: 1, backgroundColor: colors.void }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.void } }} />
    </GestureHandlerRootView>
  );
}
