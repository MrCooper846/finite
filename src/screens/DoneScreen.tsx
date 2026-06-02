import { StyleSheet, Text, View } from "react-native";

import { BigButton } from "../components/BigButton";

type DoneScreenProps = {
  doneCount: number;
  onBackHome: () => void;
  skippedCount: number;
  totalCount: number;
};

export function DoneScreen({
  doneCount,
  onBackHome,
  skippedCount,
  totalCount,
}: DoneScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.kicker}>Queue complete</Text>
        <Text style={styles.title}>You're caught up.</Text>
        <Text style={styles.copy}>
          You checked {doneCount} of {totalCount} creators
          {skippedCount > 0 ? ` and skipped ${skippedCount}` : ""}.
        </Text>
        <Text style={styles.leave}>Now leave before the algorithm finds you.</Text>
      </View>

      <BigButton label="Back home" onPress={onBackHome} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 22,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#dfd8cc",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 22,
  },
  kicker: {
    color: "#6b6357",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    color: "#111111",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 43,
  },
  copy: {
    color: "#4f4a43",
    fontSize: 17,
    lineHeight: 25,
  },
  leave: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 26,
  },
});
