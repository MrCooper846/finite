import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { BigButton } from "../components/BigButton";
import { FiniteStats } from "../domain/stats";
import { DataHealth } from "../services/storage";

type SettingsScreenProps = {
  backupText: string;
  dataHealth: DataHealth;
  onBack: () => void;
  onClearData: () => Promise<void>;
  onExportData: () => Promise<void>;
  onImportData: (backupText: string) => Promise<void>;
  stats: FiniteStats;
};

export function SettingsScreen({
  backupText,
  dataHealth,
  onBack,
  onClearData,
  onExportData,
  onImportData,
  stats,
}: SettingsScreenProps) {
  const [importText, setImportText] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  async function handleImport() {
    setIsWorking(true);

    try {
      await onImportData(importText);
      setImportText("");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleClear() {
    Alert.alert("Clear Finite data?", "This removes creators and check-ins.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          setIsWorking(true);
          try {
            await onClearData();
          } finally {
            setIsWorking(false);
          }
        },
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <BigButton label="Back home" onPress={onBack} variant="secondary" />

      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Keep the app boring and reliable.</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>This week</Text>
        <View style={styles.statsGrid}>
          <Stat label="Due today" value={stats.dueCreatorCount} />
          <Stat label="Checked" value={stats.completedThisWeek} />
          <Stat label="Skipped" value={stats.skippedThisWeek} />
          <Stat label="Sessions" value={stats.recentSessionCount} />
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Android beta prep</Text>
        <Text style={styles.copy}>
          Expo SDK 56 is active. Local data, backup, and the core queue are in
          place for device testing.
        </Text>
        <View style={styles.checklist}>
          <Text style={styles.checkItem}>Ready: local-first core flow</Text>
          <Text style={styles.checkItem}>Ready: creator backup JSON</Text>
          <Text style={styles.checkItem}>Ready: privacy and store drafts</Text>
          <Text style={styles.checkItem}>Next: physical Android QA pass</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Data health</Text>
        <Text style={styles.copy}>
          {dataHealth.issueCount === 0
            ? "Local data looks consistent."
            : "Some check-ins refer to creators that no longer exist."}
        </Text>
        <View style={styles.checklist}>
          <Text style={styles.checkItem}>
            Missing creator references: {dataHealth.missingCreatorReferences}
          </Text>
          <Text style={styles.checkItem}>
            Paused creators: {dataHealth.inactiveCreators}
          </Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.copy}>
          Finite stores creators and check-ins on this device. It does not use
          accounts, analytics, cloud sync, ads, scraping, or platform APIs.
        </Text>
        <Text style={styles.copy}>
          Exported backups are plain JSON. Anyone with the backup can read the
          creator URLs inside it.
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Backup</Text>
        <Text style={styles.copy}>
          Export creates a JSON backup below. Import accepts the same format.
        </Text>
        <BigButton
          disabled={isWorking}
          label="Generate backup"
          onPress={onExportData}
        />
        <TextInput
          editable={false}
          multiline
          placeholder="Your exported backup appears here."
          placeholderTextColor="#7d8781"
          style={styles.textArea}
          value={backupText}
        />
        <TextInput
          multiline
          onChangeText={setImportText}
          placeholder="Paste backup JSON to import."
          placeholderTextColor="#7d8781"
          style={styles.textArea}
          value={importText}
        />
        <BigButton
          disabled={isWorking || !importText.trim()}
          label="Import backup"
          onPress={handleImport}
          variant="secondary"
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Reset</Text>
        <Text style={styles.copy}>
          Clear creators and check-ins when you want a fresh local prototype.
        </Text>
        <BigButton
          disabled={isWorking}
          label="Clear local data"
          onPress={handleClear}
          variant="danger"
        />
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
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
    padding: 22,
    paddingTop: 28,
  },
  header: {
    gap: 8,
  },
  title: {
    color: "#101413",
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    color: "#46514c",
    fontSize: 17,
    lineHeight: 24,
  },
  panel: {
    backgroundColor: "#ffffff",
    borderColor: "#d7e0da",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  sectionTitle: {
    color: "#101413",
    fontSize: 20,
    fontWeight: "900",
  },
  copy: {
    color: "#46514c",
    fontSize: 15,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  stat: {
    backgroundColor: "#eef4f0",
    borderRadius: 8,
    minWidth: "47%",
    padding: 12,
  },
  statValue: {
    color: "#101413",
    fontSize: 28,
    fontWeight: "900",
  },
  statLabel: {
    color: "#4e655a",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  textArea: {
    backgroundColor: "#f7faf8",
    borderColor: "#d7e0da",
    borderRadius: 8,
    borderWidth: 1,
    color: "#101413",
    fontSize: 13,
    minHeight: 118,
    padding: 12,
    textAlignVertical: "top",
  },
  checklist: {
    gap: 6,
  },
  checkItem: {
    color: "#22302b",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
  },
});
