import { useEffect, useMemo } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

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
  const entrance = useMemo(() => new Animated.Value(0), []);
  const burst = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    entrance.setValue(0);
    burst.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(entrance, {
          friction: 8,
          tension: 58,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(burst, {
          duration: 520,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(burst, {
        duration: 260,
        toValue: 0.78,
        useNativeDriver: true,
      }),
    ]).start();
  }, [burst, entrance]);

  const cardTransform = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
      {
        scale: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [0.97, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.screen}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.burst,
          {
            opacity: burst,
            transform: [
              {
                scale: burst.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.spark, styles.sparkOne]} />
        <View style={[styles.spark, styles.sparkTwo]} />
        <View style={[styles.spark, styles.sparkThree]} />
        <View style={[styles.spark, styles.sparkFour]} />
        <View style={[styles.spark, styles.sparkFive]} />
      </Animated.View>

      <Animated.View style={[styles.card, cardTransform]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Queue complete</Text>
        </View>
        <Text style={styles.title}>Nice. You're done.</Text>
        <Text style={styles.copy}>
          You checked {doneCount} of {totalCount} creators
          {skippedCount > 0 ? ` and skipped ${skippedCount}` : ""}.
        </Text>
        <View style={styles.tally}>
          <View style={styles.tallyItem}>
            <Text style={styles.tallyValue}>{doneCount}</Text>
            <Text style={styles.tallyLabel}>Done</Text>
          </View>
          <View style={styles.tallyItem}>
            <Text style={styles.tallyValue}>{skippedCount}</Text>
            <Text style={styles.tallyLabel}>Skipped</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.leave}>Nothing left to scroll here.</Text>
        <Text style={styles.exitLine}>Go do literally anything else.</Text>
      </Animated.View>

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
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#e7f0ec",
    borderColor: "#cddbd4",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: {
    color: "#263b32",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  burst: {
    alignSelf: "center",
    height: 170,
    marginBottom: -118,
    position: "relative",
    width: 230,
  },
  card: {
    backgroundColor: "#fffefa",
    borderColor: "#ddd6ca",
    borderRadius: 8,
    borderWidth: 1,
    gap: 15,
    padding: 24,
  },
  exitLine: {
    color: "#5f584e",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 23,
  },
  kicker: {
    color: "#6b6357",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    color: "#111111",
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 44,
  },
  copy: {
    color: "#4f4a43",
    fontSize: 17,
    lineHeight: 25,
  },
  leave: {
    color: "#111111",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 27,
  },
  divider: {
    backgroundColor: "#e8e0d5",
    height: 1,
  },
  spark: {
    borderRadius: 999,
    position: "absolute",
  },
  sparkFive: {
    backgroundColor: "#b8cabf",
    height: 10,
    left: 106,
    top: 8,
    width: 44,
  },
  sparkFour: {
    backgroundColor: "#e1bd75",
    height: 12,
    right: 22,
    top: 72,
    transform: [{ rotate: "-18deg" }],
    width: 62,
  },
  sparkOne: {
    backgroundColor: "#101413",
    height: 12,
    left: 18,
    top: 74,
    transform: [{ rotate: "16deg" }],
    width: 62,
  },
  sparkThree: {
    backgroundColor: "#d6467f",
    height: 14,
    left: 76,
    top: 32,
    transform: [{ rotate: "-28deg" }],
    width: 54,
  },
  sparkTwo: {
    backgroundColor: "#4e655a",
    height: 12,
    right: 54,
    top: 36,
    transform: [{ rotate: "26deg" }],
    width: 50,
  },
  tally: {
    flexDirection: "row",
    gap: 10,
  },
  tallyItem: {
    backgroundColor: "#f7faf8",
    borderColor: "#d7e0da",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  tallyLabel: {
    color: "#4e655a",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  tallyValue: {
    color: "#101413",
    fontSize: 28,
    fontWeight: "900",
  },
});
