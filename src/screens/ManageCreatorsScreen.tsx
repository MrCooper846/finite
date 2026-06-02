import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BigButton } from "../components/BigButton";
import { CreatorCard } from "../components/CreatorCard";
import { EmptyState } from "../components/EmptyState";
import { CheckIn } from "../domain/checkin";
import { Creator } from "../domain/creator";
import { formatShortDate } from "../utils/dates";

type ManageCreatorsScreenProps = {
  checkIns: CheckIn[];
  creators: Creator[];
  onAddCreator: () => void;
  onBack: () => void;
  onDeleteCreator: (id: string) => Promise<void>;
  onEditCreator: (creator: Creator) => void;
  onToggleCreatorActive: (creator: Creator) => Promise<void>;
};

export function ManageCreatorsScreen({
  checkIns,
  creators,
  onAddCreator,
  onBack,
  onDeleteCreator,
  onEditCreator,
  onToggleCreatorActive,
}: ManageCreatorsScreenProps) {
  const recentCheckIns = checkIns.slice(0, 5);
  const creatorById = new Map(
    creators.map((creator) => [creator.id, creator.displayName]),
  );

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <BigButton label="Back home" onPress={onBack} variant="secondary" />
        <Text style={styles.title}>Manage creators</Text>
        <Text style={styles.subtitle}>Only the people you meant to check.</Text>
      </View>

      {creators.length === 0 ? (
        <View style={styles.emptyGroup}>
          <EmptyState
            title="No creators yet."
            message="Add a few accounts to make your queue finite."
          />
          <BigButton label="Add creator" onPress={onAddCreator} />
        </View>
      ) : (
        <View style={styles.list}>
          {creators.map((creator) => (
            <CreatorCard
              creator={creator}
              key={creator.id}
              onDelete={() => onDeleteCreator(creator.id)}
              onEdit={() => onEditCreator(creator)}
              onToggleActive={() => onToggleCreatorActive(creator)}
            />
          ))}
          <BigButton label="Add creator" onPress={onAddCreator} />
        </View>
      )}

      <View style={styles.history}>
        <Text style={styles.sectionTitle}>Recent check-ins</Text>
        {recentCheckIns.length === 0 ? (
          <Text style={styles.historyCopy}>No check-ins yet.</Text>
        ) : (
          recentCheckIns.map((checkIn) => (
            <View style={styles.historyRow} key={checkIn.id}>
              <Text style={styles.historyName}>
                {creatorById.get(checkIn.creatorId) ?? "Deleted creator"}
              </Text>
              <Text style={styles.historyMeta}>
                {checkIn.status === "done" ? "Done" : "Skipped"} -{" "}
                {formatShortDate(checkIn.checkedAt)}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 24,
    padding: 22,
    paddingTop: 28,
  },
  header: {
    gap: 12,
  },
  title: {
    color: "#111111",
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    color: "#5f584e",
    fontSize: 17,
    lineHeight: 24,
  },
  emptyGroup: {
    gap: 14,
  },
  list: {
    gap: 12,
  },
  history: {
    backgroundColor: "#ffffff",
    borderColor: "#dfd8cc",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  sectionTitle: {
    color: "#111111",
    fontSize: 19,
    fontWeight: "900",
  },
  historyCopy: {
    color: "#5f584e",
    fontSize: 15,
    lineHeight: 22,
  },
  historyRow: {
    borderTopColor: "#eee8dd",
    borderTopWidth: 1,
    gap: 3,
    paddingTop: 10,
  },
  historyName: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
  },
  historyMeta: {
    color: "#6c675e",
    fontSize: 13,
  },
});
