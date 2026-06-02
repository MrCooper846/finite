import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BigButton } from "../components/BigButton";
import { EmptyState } from "../components/EmptyState";
import { FiniteStats } from "../domain/stats";

type HomeScreenProps = {
  activeCreatorCount: number;
  totalCreatorCount: number;
  onAddCreator: () => void;
  onManageCreators: () => void;
  onOpenSettings: () => void;
  onStartCatchUp: () => void;
  stats: FiniteStats;
};

export function HomeScreen({
  activeCreatorCount,
  totalCreatorCount,
  onAddCreator,
  onManageCreators,
  onOpenSettings,
  onStartCatchUp,
  stats,
}: HomeScreenProps) {
  const hasDueCreators = activeCreatorCount > 0;
  const hasAnyCreators = totalCreatorCount > 0;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Finite</Text>
        <Text style={styles.title}>Scroll like you mean it.</Text>
        <Text style={styles.subtitle}>Keep up. Then leave.</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelLabel}>Today's queue</Text>
        <Text style={styles.count}>{activeCreatorCount}</Text>
        <Text style={styles.panelCopy}>
          {hasDueCreators
            ? "Open each creator, mark them checked, then leave."
            : hasAnyCreators
              ? `${totalCreatorCount} active creators. None are due right now.`
              : "Add a creator to start."}
        </Text>
      </View>

      <View style={styles.stats}>
        <MiniStat label="Checked" value={stats.completedThisWeek} />
        <MiniStat label="Skipped" value={stats.skippedThisWeek} />
        <MiniStat label="Paused" value={stats.pausedCreatorCount} />
      </View>

      {!hasAnyCreators ? (
        <EmptyState
          title="Your queue is empty."
          message="Choose what you came for. Add one creator and Finite becomes useful."
        />
      ) : null}
      {hasAnyCreators && !hasDueCreators ? (
        <EmptyState
          title="Nothing due today."
          message="You are caught up for now. Manual creators stay out of the queue until you change their frequency."
        />
      ) : null}

      <View style={styles.actions}>
        <BigButton
          label={hasDueCreators ? "Start catch-up" : "Add creator"}
          onPress={hasDueCreators ? onStartCatchUp : onAddCreator}
        />
        <BigButton label="Add creator" onPress={onAddCreator} variant="secondary" />
        <BigButton
          label="Manage creators"
          onPress={onManageCreators}
          variant="secondary"
        />
        <BigButton
          label="Settings"
          onPress={onOpenSettings}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 22,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 22,
  },
  hero: {
    gap: 10,
  },
  kicker: {
    color: "#4e655a",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  title: {
    color: "#101413",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
  },
  subtitle: {
    color: "#46514c",
    fontSize: 18,
    lineHeight: 26,
  },
  panel: {
    backgroundColor: "#ffffff",
    borderColor: "#d7e0da",
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  panelLabel: {
    color: "#4e655a",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  count: {
    color: "#101413",
    fontSize: 58,
    fontWeight: "900",
    lineHeight: 68,
  },
  panelCopy: {
    color: "#46514c",
    fontSize: 16,
    lineHeight: 23,
  },
  actions: {
    gap: 12,
  },
  stats: {
    flexDirection: "row",
    gap: 10,
  },
  stat: {
    backgroundColor: "#ffffff",
    borderColor: "#d7e0da",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  statValue: {
    color: "#101413",
    fontSize: 24,
    fontWeight: "900",
  },
  statLabel: {
    color: "#4e655a",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
