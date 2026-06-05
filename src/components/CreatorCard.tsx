import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  Creator,
  getCheckFrequencyLabel,
  Platform,
} from "../domain/creator";
import { formatRelativeCheckDate } from "../utils/dates";
import {
  cleanProfileUrlForDisplay,
  formatHandle,
} from "../utils/profileLinks";
import { BigButton } from "./BigButton";
import { PlatformBadge } from "./PlatformBadge";

type CreatorCardProps = {
  compact?: boolean;
  creator: Creator;
  onDelete?: () => void;
  onEdit?: () => void;
  onToggleActive?: () => void;
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

export function CreatorCard({
  compact = false,
  creator,
  onDelete,
  onEdit,
  onToggleActive,
}: CreatorCardProps) {
  return (
    <View
      style={[
        styles.card,
        compact && styles.compactCard,
        !creator.isActive && styles.inactiveCard,
      ]}
    >
      <View
        style={[
          styles.accent,
          { backgroundColor: PLATFORM_COLORS[creator.platform] },
        ]}
      />
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text
            numberOfLines={compact ? 1 : 2}
            style={[styles.name, compact && styles.compactName]}
          >
            {creator.displayName}
          </Text>
          {creator.handle ? (
            <Text numberOfLines={1} style={styles.handle}>
              {formatHandle(creator.platform, creator.handle)}
            </Text>
          ) : null}
        </View>
        <PlatformBadge platform={creator.platform} />
      </View>

      {!compact ? (
        <Text numberOfLines={2} style={styles.url}>
          {cleanProfileUrlForDisplay(creator.profileUrl)}
        </Text>
      ) : null}
      <Text style={styles.meta}>
        {getCheckFrequencyLabel(creator.checkFrequency)} -{" "}
        {creator.isActive ? "Active" : "Paused"}
      </Text>
      <Text style={styles.meta}>
        Last checked: {formatRelativeCheckDate(creator.lastCheckedAt)}
      </Text>

      {onEdit || onToggleActive || onDelete ? (
        <View style={[styles.actions, compact && styles.compactActions]}>
          {onEdit ? (
            compact ? (
              <SmallAction label="Edit" onPress={onEdit} />
            ) : (
              <BigButton label="Edit" onPress={onEdit} variant="secondary" />
            )
          ) : null}
          {onToggleActive ? (
            compact ? (
              <SmallAction
                label={creator.isActive ? "Pause" : "Resume"}
                onPress={onToggleActive}
              />
            ) : (
              <BigButton
                label={creator.isActive ? "Pause" : "Resume"}
                onPress={onToggleActive}
                variant="secondary"
              />
            )
          ) : null}
          {onDelete ? (
            compact ? (
              <SmallAction danger label="Delete" onPress={onDelete} />
            ) : (
              <BigButton label="Delete" onPress={onDelete} variant="danger" />
            )
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function SmallAction({
  danger = false,
  label,
  onPress,
}: {
  danger?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.smallAction,
        danger && styles.smallActionDanger,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.smallActionText,
          danger && styles.smallActionDangerText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fffefa",
    borderColor: "#ded8cc",
    borderRadius: 8,
    borderWidth: 1,
    gap: 13,
    overflow: "hidden",
    padding: 17,
  },
  accent: {
    bottom: 0,
    left: 0,
    position: "absolute",
    top: 0,
    width: 4,
  },
  compactCard: {
    gap: 9,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  inactiveCard: {
    opacity: 0.72,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  titleGroup: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: "#101413",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 25,
  },
  compactName: {
    fontSize: 18,
    lineHeight: 23,
  },
  handle: {
    color: "#6c675e",
    fontSize: 15,
  },
  url: {
    color: "#3f3a33",
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    color: "#777168",
    fontSize: 13,
  },
  actions: {
    gap: 10,
  },
  compactActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  smallAction: {
    backgroundColor: "#eef4f0",
    borderColor: "#cfddd6",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallActionDanger: {
    backgroundColor: "#f8e0dc",
    borderColor: "#e9b7ae",
  },
  smallActionDangerText: {
    color: "#7d2b22",
  },
  smallActionText: {
    color: "#101413",
    fontSize: 13,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.78,
  },
});
