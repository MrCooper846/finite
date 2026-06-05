import { StyleSheet, Text, View } from "react-native";

import { BigButton } from "../components/BigButton";

type OnboardingScreenProps = {
  onAddCreator: () => void;
  onSkip: () => void;
};

export function OnboardingScreen({
  onAddCreator,
  onSkip,
}: OnboardingScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Finite</Text>
        <Text style={styles.title}>Social media, with an exit.</Text>
        <Text style={styles.copy}>
          Pick the creators you actually came to check. Finite routes you to
          them, one by one, then ends the queue.
        </Text>
      </View>

      <View style={styles.steps}>
        <Step label="1" text="Add creators manually." />
        <Step label="2" text="Start a finite catch-up queue." />
        <Step label="3" text="Open profiles, swipe up, then leave." />
      </View>

      <View style={styles.actions}>
        <BigButton label="Add first creator" onPress={onAddCreator} />
        <BigButton label="Skip for now" onPress={onSkip} variant="secondary" />
      </View>
    </View>
  );
}

function Step({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{label}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 24,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  hero: {
    gap: 12,
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
    lineHeight: 47,
  },
  copy: {
    color: "#46514c",
    fontSize: 17,
    lineHeight: 26,
  },
  steps: {
    gap: 10,
  },
  step: {
    alignItems: "center",
    backgroundColor: "#fffefa",
    borderColor: "#d7e0da",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  stepBadge: {
    alignItems: "center",
    backgroundColor: "#dcefe6",
    borderRadius: 999,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  stepBadgeText: {
    color: "#163428",
    fontSize: 14,
    fontWeight: "900",
  },
  stepText: {
    color: "#222927",
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
  },
  actions: {
    gap: 12,
  },
});
