import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { BigButton } from "../components/BigButton";
import { PlatformBadge } from "../components/PlatformBadge";
import { Creator, getCheckFrequencyLabel } from "../domain/creator";
import { openExternalUrl } from "../services/links";
import { formatShortDate } from "../utils/dates";

type CatchUpScreenProps = {
  creator?: Creator;
  currentIndex: number;
  onBack: () => void;
  onDone: () => Promise<void>;
  onSkip: () => Promise<void>;
  totalCount: number;
};

export function CatchUpScreen({
  creator,
  currentIndex,
  onBack,
  onDone,
  onSkip,
  totalCount,
}: CatchUpScreenProps) {
  const [isWorking, setIsWorking] = useState(false);

  async function handleOpenProfile() {
    if (!creator) {
      return;
    }

    try {
      await openExternalUrl(creator.profileUrl);
    } catch {
      Alert.alert("Could not open this profile", "Check the URL and try again.");
    }
  }

  async function handleAction(action: () => Promise<void>) {
    setIsWorking(true);

    try {
      await action();
    } finally {
      setIsWorking(false);
    }
  }

  if (!creator) {
    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>This queue item is missing.</Text>
          <Text style={styles.copy}>
            Go home and start a fresh catch-up session.
          </Text>
          <BigButton label="Back home" onPress={onBack} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.progress}>
          {currentIndex + 1} of {totalCount}
        </Text>
        <BigButton label="Back home" onPress={onBack} variant="secondary" />
      </View>

      <View style={styles.card}>
        <PlatformBadge platform={creator.platform} />
        <Text style={styles.title}>{creator.displayName}</Text>
        {creator.handle ? <Text style={styles.handle}>{creator.handle}</Text> : null}
        <Text style={styles.url}>{creator.profileUrl}</Text>
        <Text style={styles.meta}>
          Last checked: {formatShortDate(creator.lastCheckedAt)}
        </Text>
        <Text style={styles.meta}>
          Frequency: {getCheckFrequencyLabel(creator.checkFrequency)}
        </Text>
      </View>

      <View style={styles.actions}>
        <BigButton label="Open profile" onPress={handleOpenProfile} />
        <BigButton
          disabled={isWorking}
          label="Mark done"
          onPress={() => handleAction(onDone)}
          variant="secondary"
        />
        <BigButton
          disabled={isWorking}
          label="Skip"
          onPress={() => handleAction(onSkip)}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 22,
    paddingHorizontal: 22,
    paddingTop: 28,
  },
  topBar: {
    gap: 12,
  },
  progress: {
    color: "#6b6357",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#dfd8cc",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  title: {
    color: "#111111",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 39,
  },
  handle: {
    color: "#6c675e",
    fontSize: 16,
  },
  url: {
    color: "#3f3a33",
    fontSize: 15,
    lineHeight: 22,
  },
  meta: {
    color: "#777168",
    fontSize: 14,
  },
  copy: {
    color: "#4f4a43",
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
  },
});
