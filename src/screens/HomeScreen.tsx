import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BigButton } from "../components/BigButton";
import { EmptyState } from "../components/EmptyState";
import { PlatformBadge } from "../components/PlatformBadge";
import { Creator } from "../domain/creator";
import { FiniteStats } from "../domain/stats";
import { formatHandle } from "../utils/profileLinks";

type HomeScreenProps = {
  activeCreatorCount: number;
  queuePreview: Creator[];
  totalCreatorCount: number;
  onAddCreator: () => void;
  onManageCreators: () => void;
  onOpenSettings: () => void;
  onStartCatchUp: () => void;
  stats: FiniteStats;
};

export function HomeScreen({
  activeCreatorCount,
  queuePreview,
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
        <Text style={styles.subtitle}>A short route in. A clean exit out.</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelLabel}>Today's queue</Text>
        <Text style={styles.count}>{activeCreatorCount}</Text>
        <Text style={styles.panelCopy}>
          {hasDueCreators
            ? "Open what you came for. Swipe through the rest."
            : hasAnyCreators
              ? `${totalCreatorCount} active creators. None are due right now.`
              : "Add one creator. Keep the queue honest."}
        </Text>
        {queuePreview.length > 0 ? (
          <View style={styles.previewList}>
            {queuePreview.map((creator) => (
              <View style={styles.previewRow} key={creator.id}>
                <View style={styles.previewTextGroup}>
                  <Text numberOfLines={1} style={styles.previewName}>
                    {creator.displayName}
                  </Text>
                  {creator.handle ? (
                    <Text numberOfLines={1} style={styles.previewHandle}>
                      {formatHandle(creator.platform, creator.handle)}
                    </Text>
                  ) : null}
                </View>
                <PlatformBadge platform={creator.platform} />
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.stats}>
        <MiniStat label="Checked" value={stats.completedThisWeek} />
        <MiniStat label="Skipped" value={stats.skippedThisWeek} />
        <MiniStat label="Paused" value={stats.pausedCreatorCount} />
      </View>

      {!hasAnyCreators ? (
        <EmptyState
          title="Your queue is empty."
          message="No feed. No recommendations. Just the people you choose."
        />
      ) : null}
      {hasAnyCreators && !hasDueCreators ? (
        <EmptyState
          title="Nothing due today."
          message="You are caught up for now. Suspiciously peaceful."
        />
      ) : null}

      <View style={styles.actions}>
        <BigButton
          label={hasDueCreators ? "Start catch-up" : "Add creator"}
          onPress={hasDueCreators ? onStartCatchUp : onAddCreator}
        />
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
    gap: 20,
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 26,
  },
  hero: {
    gap: 11,
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
    fontSize: 43,
    fontWeight: "900",
    lineHeight: 47,
  },
  subtitle: {
    color: "#46514c",
    fontSize: 18,
    lineHeight: 26,
  },
  panel: {
    backgroundColor: "#fffefa",
    borderColor: "#d6ded8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 22,
  },
  panelLabel: {
    color: "#4e655a",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  count: {
    color: "#101413",
    fontSize: 64,
    fontWeight: "900",
    lineHeight: 72,
  },
  panelCopy: {
    color: "#46514c",
    fontSize: 16,
    lineHeight: 23,
  },
  previewHandle: {
    color: "#6c675e",
    fontSize: 13,
  },
  previewList: {
    borderTopColor: "#e6ded2",
    borderTopWidth: 1,
    gap: 9,
    marginTop: 8,
    paddingTop: 12,
  },
  previewName: {
    color: "#101413",
    fontSize: 15,
    fontWeight: "900",
  },
  previewRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  previewTextGroup: {
    flex: 1,
    gap: 2,
  },
  actions: {
    gap: 12,
  },
  stats: {
    flexDirection: "row",
    gap: 10,
  },
  stat: {
    backgroundColor: "#fbfcfa",
    borderColor: "#d7e0da",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 13,
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
