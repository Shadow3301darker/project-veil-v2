import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useThemeStore, PanelId } from '../store/theme/themeStore';
import { tierCapabilities } from '../store/theme/tokens';

interface PanelSurfaceProps {
  panelId: PanelId;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * The single building block every screen surface renders through.
 * Reads this panel's config from the theme store and layers:
 * base color -> optional image -> optional gif/video (gated by graphics tier)
 * -> content on top.
 */
export function PanelSurface({ panelId, children, style }: PanelSurfaceProps) {
  const panel = useThemeStore((s) => s.panels[panelId]);
  const tier = useThemeStore((s) => s.graphicsTier);
  const caps = tierCapabilities[tier];

  const showImage = caps.image && !!panel.imageUri;
  const showGif = caps.gif && panel.media?.type === 'gif';
  const showVideo = caps.video && panel.media?.type === 'video';

  const videoUri = showVideo ? panel.media!.uri : null;
  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
    p.muted = true;
    if (videoUri) p.play();
  });

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: panel.color, borderRadius: panel.radius },
        style,
      ]}
    >
      {showImage && (
        <Image
          source={{ uri: panel.imageUri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      )}
      {showGif && panel.media && (
        <Image
          source={{ uri: panel.media.uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      )}
      {showVideo && videoUri && (
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
        />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});

