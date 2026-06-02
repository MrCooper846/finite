import { StyleSheet, Text, View } from "react-native";

import {
  Creator,
  getCheckFrequencyLabel,
} from "../domain/creator";
import { formatRelativeCheckDate } from "../utils/dates";
import { BigButton } from "./BigButton";
import { PlatformBadge } from "./PlatformBadge";

type CreatorCardProps = {
  creator: Creator;
  onDelete?: () => void;
  onEdit?: () => void;
  onToggleActive?: () => void;
};

export function CreatorCard({
  creator,
  onDelete,
  onEdit,
  onToggleActive,
}: CreatorCardProps) {
  return (
    <View style={[styles.card, !creator.isActive && styles.inactiveCard]}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.name}>{creator.displayName}</Text>
          {creator.handle ? <Text style={styles.handle}>{creator.handle}</Text> : null}
        </View>
        <PlatformBadge platform={creator.platform} />
      </View>

      <Text numberOfLines={2} style={styles.url}>
        {creator.profileUrl}
      </Text>
      <Text style={styles.meta}>
        {getCheckFrequencyLabel(creator.checkFrequency)} -{" "}
        {creator.isActive ? "Active" : "Paused"}
      </Text>
      <Text style={styles.meta}>
        Last checked: {formatRelativeCheckDate(creator.lastCheckedAt)}
      </Text>

      {onEdit || onToggleActive || onDelete ? (
        <View style={styles.actions}>
          {onEdit ? (
            <BigButton label="Edit" onPress={onEdit} variant="secondary" />
          ) : null}
          {onToggleActive ? (
            <BigButton
              label={creator.isActive ? "Pause" : "Resume"}
              onPress={onToggleActive}
              variant="secondary"
            />
          ) : null}
          {onDelete ? (
            <BigButton label="Delete" onPress={onDelete} variant="danger" />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e1ddd4",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
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
    color: "#111111",
    fontSize: 19,
    fontWeight: "800",
  },
  handle: {
    color: "#6c675e",
    fontSize: 14,
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
    gap: 8,
  },
});
