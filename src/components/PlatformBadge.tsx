import { StyleSheet, Text, View } from "react-native";

import { getPlatformLabel, Platform } from "../domain/creator";

type PlatformBadgeProps = {
  platform: Platform;
};

const PLATFORM_ICONS: Record<Platform, string> = {
  instagram: "IG",
  tiktok: "TT",
  youtube: "YT",
  x: "X",
  reddit: "u/",
  reddit_community: "r/",
  other: "*",
};

const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "#d6467f",
  tiktok: "#111111",
  youtube: "#d82121",
  x: "#111111",
  reddit: "#ff5a1f",
  reddit_community: "#ff7a1a",
  other: "#4e655a",
};

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const color = PLATFORM_COLORS[platform];

  return (
    <View style={styles.badge}>
      <View style={[styles.icon, { backgroundColor: color }]}>
        <Text style={styles.iconText}>{PLATFORM_ICONS[platform]}</Text>
      </View>
      <Text style={styles.text}>{getPlatformLabel(platform)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#f7faf8",
    borderColor: "#c6dad1",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  icon: {
    alignItems: "center",
    borderRadius: 999,
    height: 22,
    justifyContent: "center",
    minWidth: 22,
    paddingHorizontal: 5,
  },
  iconText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "900",
  },
  text: {
    color: "#263b32",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
