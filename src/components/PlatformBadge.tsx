import { StyleSheet, Text, View } from "react-native";

import { getPlatformLabel, Platform } from "../domain/creator";

type PlatformBadgeProps = {
  platform: Platform;
};

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{getPlatformLabel(platform)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#e7f0ec",
    borderColor: "#c6dad1",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    color: "#1b3a2d",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
