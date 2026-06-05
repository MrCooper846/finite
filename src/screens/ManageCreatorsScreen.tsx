import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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

type CreatorFilter = "active" | "paused" | "all";

const FILTERS: Array<{ label: string; value: CreatorFilter }> = [
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "All", value: "all" },
];

export function ManageCreatorsScreen({
  checkIns,
  creators,
  onAddCreator,
  onBack,
  onDeleteCreator,
  onEditCreator,
  onToggleCreatorActive,
}: ManageCreatorsScreenProps) {
  const [filter, setFilter] = useState<CreatorFilter>("active");
  const recentCheckIns = checkIns.slice(0, 5);
  const creatorById = new Map(
    creators.map((creator) => [creator.id, creator.displayName]),
  );
  const filteredCreators = creators.filter((creator) => {
    if (filter === "active") {
      return creator.isActive;
    }

    if (filter === "paused") {
      return !creator.isActive;
    }

    return true;
  });
  const emptyCopy =
    creators.length === 0
      ? "Add the accounts you actually came for. Leave the rest outside."
      : filter === "paused"
        ? "No paused creators. Everyone here is still in play."
        : "Nothing in this view. Try All if you are looking for someone.";

  return (
    <View style={styles.container}>
      <View style={styles.stickyActions}>
        <Pressable
          accessibilityLabel="Back home"
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </Pressable>
        <BigButton
          label="Add creator"
          onPress={onAddCreator}
          style={styles.addButton}
        />
      </View>

      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage creators</Text>
          <Text style={styles.subtitle}>
            Keep the list small enough to mean it.
          </Text>
        </View>

        <View style={styles.tabs}>
          {FILTERS.map((item) => (
            <Pressable
              accessibilityRole="button"
              key={item.value}
              onPress={() => setFilter(item.value)}
              style={({ pressed }) => [
                styles.tab,
                item.value === filter && styles.tabSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  item.value === filter && styles.tabTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {filteredCreators.length === 0 ? (
          <View style={styles.emptyGroup}>
            <EmptyState
              title={
                creators.length === 0 ? "No creators yet." : "Nothing here."
              }
              message={emptyCopy}
            />
          </View>
        ) : (
          <View style={styles.list}>
            {filteredCreators.map((creator) => (
              <CreatorCard
                compact
                creator={creator}
                key={creator.id}
                onDelete={() => onDeleteCreator(creator.id)}
                onEdit={() => onEditCreator(creator)}
                onToggleActive={() => onToggleCreatorActive(creator)}
              />
            ))}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyActions: {
    alignItems: "center",
    backgroundColor: "#f4f7f5",
    borderBottomColor: "#dce6df",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingBottom: 12,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  screen: {
    gap: 22,
    paddingHorizontal: 22,
    paddingBottom: 22,
    paddingTop: 18,
  },
  header: {
    gap: 12,
  },
  addButton: {
    flex: 1,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#eef4f0",
    borderColor: "#cfddd6",
    borderRadius: 8,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  backButtonText: {
    color: "#101413",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 30,
  },
  pressed: {
    opacity: 0.82,
  },
  title: {
    color: "#111111",
    fontSize: 35,
    fontWeight: "900",
    lineHeight: 40,
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
  tabs: {
    backgroundColor: "#eaf1ed",
    borderColor: "#cfddd6",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    padding: 4,
  },
  tab: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    paddingVertical: 10,
  },
  tabSelected: {
    backgroundColor: "#101413",
  },
  tabText: {
    color: "#40534a",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  tabTextSelected: {
    color: "#ffffff",
  },
  history: {
    backgroundColor: "#fffefa",
    borderColor: "#ddd6ca",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 17,
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
