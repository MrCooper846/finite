import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BigButton } from "../components/BigButton";
import { PlatformBadge } from "../components/PlatformBadge";
import { Creator, getCheckFrequencyLabel, Platform } from "../domain/creator";
import { openExternalUrl } from "../services/links";
import { formatShortDate } from "../utils/dates";
import {
  cleanProfileUrlForDisplay,
  formatHandle,
} from "../utils/profileLinks";

type CatchUpScreenProps = {
  creator?: Creator;
  currentIndex: number;
  onBack: () => void;
  onDone: () => Promise<void>;
  onSkip: () => Promise<void>;
  totalCount: number;
};

const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "#d6467f",
  tiktok: "#111111",
  youtube: "#d82121",
  x: "#111111",
  reddit: "#ff5a1f",
  reddit_community: "#ff7a1a",
  other: "#4e655a",
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
  const [openedCreatorId, setOpenedCreatorId] = useState<string | undefined>();
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [exitLabel, setExitLabel] = useState<"Done" | "Skipped" | undefined>();
  const cardOffset = useMemo(() => new Animated.Value(0), []);
  const cardOpacity = useMemo(() => new Animated.Value(1), []);
  const hasOpenedProfile = openedCreatorId === creator?.id;
  const accentColor = creator ? PLATFORM_COLORS[creator.platform] : "#4e655a";

  useEffect(() => {
    setOpenedCreatorId(undefined);
    setIsAdvancing(false);
    setExitLabel(undefined);
    cardOffset.setValue(18);
    cardOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(cardOffset, {
        friction: 8,
        tension: 65,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        duration: 180,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardOffset, cardOpacity, creator?.id]);

  async function handleOpenProfile() {
    if (!creator) {
      return;
    }

    try {
      await openExternalUrl(creator.profileUrl);
      setOpenedCreatorId(creator.id);
    } catch {
      Alert.alert("Could not open this profile", "Check the URL and try again.");
    }
  }

  async function handleSwipeUp() {
    if (isWorking || isAdvancing) {
      return;
    }

    setIsAdvancing(true);
    setExitLabel(hasOpenedProfile ? "Done" : "Skipped");
    Animated.parallel([
      Animated.timing(cardOffset, {
        duration: 170,
        toValue: -260,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        duration: 150,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        void handleAction(hasOpenedProfile ? onDone : onSkip);
      }
    });
  }

  async function handleAction(action: () => Promise<void>) {
    setIsWorking(true);

    try {
      await action();
    } finally {
      setIsWorking(false);
    }
  }

  const swipeResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          gestureState.dy < -12,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy < 0) {
            cardOffset.setValue(Math.max(gestureState.dy, -140));
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy < -72) {
            void handleSwipeUp();
            return;
          }
          Animated.spring(cardOffset, {
            friction: 7,
            tension: 80,
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [cardOffset, hasOpenedProfile, isAdvancing, isWorking],
  );

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

      <View style={styles.deck}>
        <View style={styles.nextCardBack} />
        <View style={styles.nextCardFront} />
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [
                { translateY: cardOffset },
                {
                  scale: cardOffset.interpolate({
                    inputRange: [-140, 0],
                    outputRange: [0.96, 1],
                    extrapolate: "clamp",
                  }),
                },
                {
                  rotate: cardOffset.interpolate({
                    inputRange: [-140, 0],
                    outputRange: ["-2deg", "0deg"],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
          {...swipeResponder.panHandlers}
        >
          <View style={[styles.accent, { backgroundColor: accentColor }]} />
          {exitLabel ? (
            <View style={styles.exitBadge}>
              <Text style={styles.exitBadgeText}>{exitLabel}</Text>
            </View>
          ) : null}
          <PlatformBadge platform={creator.platform} />
          <Text style={styles.title}>{creator.displayName}</Text>
          {creator.handle ? (
            <Text style={styles.handle}>
              {formatHandle(creator.platform, creator.handle)}
            </Text>
          ) : null}
          <Text style={styles.url}>
            {cleanProfileUrlForDisplay(creator.profileUrl)}
          </Text>
          <Text style={styles.meta}>
            Last checked: {formatShortDate(creator.lastCheckedAt)}
          </Text>
          <Text style={styles.meta}>
            Frequency: {getCheckFrequencyLabel(creator.checkFrequency)}
          </Text>
          <Text style={styles.swipeHint}>
            {hasOpenedProfile ? "Swipe up when done." : "Swipe up to skip."}
          </Text>
          <View style={styles.swipeCue}>
            <Text style={styles.swipeCueText}>^</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <BigButton
          disabled={isWorking || isAdvancing}
          label={hasOpenedProfile ? "Open again" : "Open profile"}
          onPress={handleOpenProfile}
        />
        <BigButton
          disabled={isWorking || isAdvancing}
          label={hasOpenedProfile ? "Done" : "Skip"}
          onPress={() => void handleSwipeUp()}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 22,
    paddingTop: 30,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  progress: {
    backgroundColor: "#e7f0ec",
    borderColor: "#cddbd4",
    borderRadius: 999,
    borderWidth: 1,
    color: "#263b32",
    fontSize: 15,
    fontWeight: "800",
    paddingHorizontal: 12,
    paddingVertical: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fffefa",
    borderColor: "#ddd6ca",
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    overflow: "hidden",
    padding: 22,
  },
  accent: {
    bottom: 0,
    left: 0,
    position: "absolute",
    top: 0,
    width: 5,
  },
  deck: {
    paddingBottom: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  exitBadge: {
    alignSelf: "flex-end",
    backgroundColor: "#101413",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  exitBadgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  nextCardBack: {
    backgroundColor: "#e5ece8",
    borderRadius: 8,
    bottom: 0,
    left: 18,
    position: "absolute",
    right: 18,
    top: 24,
  },
  nextCardFront: {
    backgroundColor: "#f1f5f2",
    borderColor: "#d7e0da",
    borderRadius: 8,
    borderWidth: 1,
    bottom: 7,
    left: 10,
    position: "absolute",
    right: 10,
    top: 14,
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
  swipeHint: {
    color: "#302c27",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 23,
  },
  swipeCue: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#f6f0e8",
    borderColor: "#d8d0c3",
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  swipeCueText: {
    color: "#5f584e",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 20,
  },
  copy: {
    color: "#4f4a43",
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: 10,
  },
});
