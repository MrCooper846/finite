import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CheckIn, CheckInStatus } from "./src/domain/checkin";
import { Creator, NewCreatorInput } from "./src/domain/creator";
import { CatchUpSession } from "./src/domain/session";
import { getTodayQueue } from "./src/domain/queue";
import { getFiniteStats } from "./src/domain/stats";
import { AddCreatorScreen } from "./src/screens/AddCreatorScreen";
import { CatchUpScreen } from "./src/screens/CatchUpScreen";
import { DoneScreen } from "./src/screens/DoneScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ManageCreatorsScreen } from "./src/screens/ManageCreatorsScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import {
  addCheckIn,
  addCreator,
  clearFiniteData,
  deleteCreator,
  exportFiniteData,
  FiniteBackup,
  getDataHealth,
  getCheckIns,
  getCreators,
  getHasSeenOnboarding,
  importFiniteData,
  setHasSeenOnboarding,
  updateCreator,
} from "./src/services/storage";
import { createLocalId } from "./src/utils/ids";
import { nowIso } from "./src/utils/dates";

type Screen =
  | "onboarding"
  | "home"
  | "addCreator"
  | "manageCreators"
  | "catchUp"
  | "done"
  | "settings";

type DoneSummary = {
  doneCount: number;
  skippedCount: number;
  totalCount: number;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [session, setSession] = useState<CatchUpSession | null>(null);
  const [editingCreator, setEditingCreator] = useState<Creator | undefined>();
  const [backupText, setBackupText] = useState("");
  const [doneSummary, setDoneSummary] = useState<DoneSummary>({
    doneCount: 0,
    skippedCount: 0,
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadCreators = useCallback(async () => {
    const [storedCreators, storedCheckIns, hasSeenOnboarding] = await Promise.all([
      getCreators(),
      getCheckIns(),
      getHasSeenOnboarding(),
    ]);
    setCreators(storedCreators);
    setCheckIns(storedCheckIns);
    setScreen(hasSeenOnboarding ? "home" : "onboarding");
  }, []);

  useEffect(() => {
    async function load() {
      try {
        await loadCreators();
      } catch {
        Alert.alert("Could not load creators", "Please restart Finite.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [loadCreators]);

  async function handleAddCreator(input: NewCreatorInput) {
    try {
      const creator = await addCreator(input);
      setCreators((currentCreators) => [creator, ...currentCreators]);
      await setHasSeenOnboarding(true);
      setEditingCreator(undefined);
      setScreen("home");
    } catch {
      Alert.alert("Could not save creator", "Please try again.");
    }
  }

  async function handleSaveCreator(input: NewCreatorInput) {
    if (!editingCreator) {
      await handleAddCreator(input);
      return;
    }

    try {
      const updatedCreator = await updateCreator(editingCreator.id, input);
      setCreators((currentCreators) =>
        currentCreators.map((creator) =>
          creator.id === updatedCreator.id ? updatedCreator : creator,
        ),
      );
      setEditingCreator(undefined);
      setScreen("manageCreators");
    } catch {
      Alert.alert("Could not save changes", "Please try again.");
    }
  }

  async function handleDeleteCreator(id: string) {
    Alert.alert("Delete creator?", "This removes them from your finite queue.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCreator(id);
            setCreators((currentCreators) =>
              currentCreators.filter((creator) => creator.id !== id),
            );
            if (editingCreator?.id === id) {
              setEditingCreator(undefined);
            }
          } catch {
            Alert.alert("Could not delete creator", "Please try again.");
          }
        },
      },
    ]);
  }

  function handleStartCatchUp() {
    const queue = getTodayQueue(creators);

    if (queue.length === 0) {
      setScreen("addCreator");
      return;
    }

    setSession({
      id: createLocalId("session"),
      startedAt: nowIso(),
      creatorIds: queue.map((creator) => creator.id),
      completedCreatorIds: [],
      skippedCreatorIds: [],
    });
    setScreen("catchUp");
  }

  async function handleRecordCheckIn(status: CheckInStatus) {
    if (!session) {
      return;
    }

    const currentCreator = getCurrentSessionCreator(session, creators);

    if (!currentCreator) {
      finishSession(session);
      return;
    }

    try {
      const checkIn = await addCheckIn({
        creatorId: currentCreator.id,
        status,
      });
      setCheckIns((currentCheckIns) => [checkIn, ...currentCheckIns]);
      let nextCreators = creators;

      if (status === "done") {
        const updatedCreator = await updateCreator(currentCreator.id, {
          lastCheckedAt: checkIn.checkedAt,
        });
        nextCreators = creators.map((creator) =>
          creator.id === updatedCreator.id ? updatedCreator : creator,
        );
        setCreators(nextCreators);
      }

      const nextSession: CatchUpSession = {
        ...session,
        completedCreatorIds:
          status === "done"
            ? [...session.completedCreatorIds, currentCreator.id]
            : session.completedCreatorIds,
        skippedCreatorIds:
          status === "skipped"
            ? [...session.skippedCreatorIds, currentCreator.id]
            : session.skippedCreatorIds,
      };

      if (isSessionComplete(nextSession)) {
        finishSession(nextSession);
      } else {
        setSession(nextSession);
      }
    } catch {
      Alert.alert("Could not save check-in", "Please try again.");
    }
  }

  function finishSession(completedSession: CatchUpSession) {
    const finishedSession = {
      ...completedSession,
      completedAt: nowIso(),
    };

    setSession(finishedSession);
    setDoneSummary({
      doneCount: finishedSession.completedCreatorIds.length,
      skippedCount: finishedSession.skippedCreatorIds.length,
      totalCount: finishedSession.creatorIds.length,
    });
    setScreen("done");
  }

  function handleBackHome() {
    setSession(null);
    setEditingCreator(undefined);
    setScreen("home");
  }

  async function handleFinishOnboarding(nextScreen: Screen) {
    await setHasSeenOnboarding(true);
    setScreen(nextScreen);
  }

  function handleEditCreator(creator: Creator) {
    setEditingCreator(creator);
    setScreen("addCreator");
  }

  async function handleToggleCreatorActive(creator: Creator) {
    try {
      const updatedCreator = await updateCreator(creator.id, {
        isActive: !creator.isActive,
      });
      setCreators((currentCreators) =>
        currentCreators.map((currentCreator) =>
          currentCreator.id === updatedCreator.id
            ? updatedCreator
            : currentCreator,
        ),
      );
    } catch {
      Alert.alert("Could not update creator", "Please try again.");
    }
  }

  async function handleExportData() {
    try {
      const backup = await exportFiniteData();
      setBackupText(JSON.stringify(backup, null, 2));
    } catch {
      Alert.alert("Could not export data", "Please try again.");
    }
  }

  async function handleImportData(nextBackupText: string) {
    try {
      const backup = JSON.parse(nextBackupText) as FiniteBackup;
      await importFiniteData(backup);
      setBackupText("");
      await loadCreators();
      Alert.alert("Backup imported", "Your local data has been replaced.");
    } catch {
      Alert.alert("Could not import backup", "Check the JSON and try again.");
    }
  }

  async function handleClearData() {
    try {
      await clearFiniteData();
      setCreators([]);
      setCheckIns([]);
      setSession(null);
      setBackupText("");
      setScreen("home");
    } catch {
      Alert.alert("Could not clear data", "Please try again.");
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <ActivityIndicator color="#111111" />
          <Text style={styles.loadingText}>Loading Finite...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const queue = getTodayQueue(creators);
  const stats = getFiniteStats(creators, checkIns);
  const dataHealth = getDataHealth(creators, checkIns);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {screen === "onboarding" ? (
        <OnboardingScreen
          onAddCreator={() => handleFinishOnboarding("addCreator")}
          onSkip={() => handleFinishOnboarding("home")}
        />
      ) : null}
      {screen === "home" ? (
        <HomeScreen
          activeCreatorCount={queue.length}
          totalCreatorCount={creators.filter((creator) => creator.isActive).length}
          onAddCreator={() => {
            setEditingCreator(undefined);
            setScreen("addCreator");
          }}
          onManageCreators={() => setScreen("manageCreators")}
          onOpenSettings={() => setScreen("settings")}
          onStartCatchUp={handleStartCatchUp}
          stats={stats}
        />
      ) : null}
      {screen === "addCreator" ? (
        <AddCreatorScreen
          creator={editingCreator}
          onBack={() => {
            const nextScreen = editingCreator ? "manageCreators" : "home";
            setEditingCreator(undefined);
            setScreen(nextScreen);
          }}
          onSave={handleSaveCreator}
        />
      ) : null}
      {screen === "manageCreators" ? (
        <ManageCreatorsScreen
          checkIns={checkIns}
          creators={creators}
          onAddCreator={() => {
            setEditingCreator(undefined);
            setScreen("addCreator");
          }}
          onBack={() => setScreen("home")}
          onDeleteCreator={handleDeleteCreator}
          onEditCreator={handleEditCreator}
          onToggleCreatorActive={handleToggleCreatorActive}
        />
      ) : null}
      {screen === "catchUp" && session ? (
        <CatchUpScreen
          creator={getCurrentSessionCreator(session, creators)}
          currentIndex={getCurrentSessionIndex(session)}
          onBack={handleBackHome}
          onDone={() => handleRecordCheckIn("done")}
          onSkip={() => handleRecordCheckIn("skipped")}
          totalCount={session.creatorIds.length}
        />
      ) : null}
      {screen === "done" ? (
        <DoneScreen
          doneCount={doneSummary.doneCount}
          onBackHome={handleBackHome}
          skippedCount={doneSummary.skippedCount}
          totalCount={doneSummary.totalCount}
        />
      ) : null}
      {screen === "settings" ? (
        <SettingsScreen
          backupText={backupText}
          onBack={() => setScreen("home")}
          onClearData={handleClearData}
          onExportData={handleExportData}
          onImportData={handleImportData}
          dataHealth={dataHealth}
          stats={stats}
        />
      ) : null}
    </SafeAreaView>
  );
}

function getCurrentSessionIndex(session: CatchUpSession): number {
  return (
    session.completedCreatorIds.length + session.skippedCreatorIds.length
  );
}

function getCurrentSessionCreator(
  session: CatchUpSession,
  creators: Creator[],
): Creator | undefined {
  const currentCreatorId = session.creatorIds[getCurrentSessionIndex(session)];
  return creators.find((creator) => creator.id === currentCreatorId);
}

function isSessionComplete(session: CatchUpSession): boolean {
  return getCurrentSessionIndex(session) >= session.creatorIds.length;
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f4f7f5",
    flex: 1,
  },
  loading: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  loadingText: {
    color: "#46514c",
    fontSize: 15,
    fontWeight: "700",
  },
});
