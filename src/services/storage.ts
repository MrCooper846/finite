import AsyncStorage from "@react-native-async-storage/async-storage";

import { CheckIn, CreateCheckInInput } from "../domain/checkin";
import {
  CheckFrequency,
  PLATFORMS,
  Creator,
  NewCreatorInput,
  UpdateCreatorInput,
} from "../domain/creator";
import { createLocalId } from "../utils/ids";
import { nowIso } from "../utils/dates";

const STORAGE_KEYS = {
  creators: "finite.creators",
  checkIns: "finite.checkIns",
  hasSeenOnboarding: "finite.hasSeenOnboarding",
};

export type FiniteBackup = {
  version: 1;
  exportedAt: string;
  creators: Creator[];
  checkIns: CheckIn[];
};

export type DataHealth = {
  issueCount: number;
  missingCreatorReferences: number;
  inactiveCreators: number;
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const value = await AsyncStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getCreators(): Promise<Creator[]> {
  const creators = await readJson<Creator[]>(STORAGE_KEYS.creators, []);
  return creators.map(normaliseStoredCreator).filter(Boolean);
}

export async function saveCreators(creators: Creator[]): Promise<void> {
  await writeJson(STORAGE_KEYS.creators, creators);
}

export async function addCreator(input: NewCreatorInput): Promise<Creator> {
  const creators = await getCreators();
  const timestamp = nowIso();
  const creator: Creator = {
    id: createLocalId("creator"),
    displayName: input.displayName.trim(),
    platform: input.platform,
    profileUrl: input.profileUrl.trim(),
    handle: input.handle?.trim() || undefined,
    isActive: true,
    checkFrequency: input.checkFrequency ?? "daily",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await saveCreators([creator, ...creators]);
  return creator;
}

export async function updateCreator(
  id: string,
  updates: UpdateCreatorInput,
): Promise<Creator> {
  const creators = await getCreators();
  const existingCreator = creators.find((creator) => creator.id === id);

  if (!existingCreator) {
    throw new Error("Creator not found");
  }

  const updatedCreator: Creator = {
    ...existingCreator,
    ...updates,
    handle:
      updates.handle === undefined
        ? existingCreator.handle
        : updates.handle.trim() || undefined,
    updatedAt: nowIso(),
  };

  await saveCreators(
    creators.map((creator) =>
      creator.id === updatedCreator.id ? updatedCreator : creator,
    ),
  );

  return updatedCreator;
}

export async function deleteCreator(id: string): Promise<void> {
  const creators = await getCreators();
  await saveCreators(creators.filter((creator) => creator.id !== id));
}

export async function getCheckIns(): Promise<CheckIn[]> {
  return readJson<CheckIn[]>(STORAGE_KEYS.checkIns, []);
}

export async function saveCheckIns(checkIns: CheckIn[]): Promise<void> {
  await writeJson(STORAGE_KEYS.checkIns, checkIns);
}

export async function addCheckIn(input: CreateCheckInInput): Promise<CheckIn> {
  const checkIns = await getCheckIns();
  const checkIn: CheckIn = {
    id: createLocalId("checkin"),
    creatorId: input.creatorId,
    status: input.status,
    checkedAt: nowIso(),
  };

  await saveCheckIns([checkIn, ...checkIns]);
  return checkIn;
}

export async function getHasSeenOnboarding(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.hasSeenOnboarding);
  return value === "true";
}

export async function setHasSeenOnboarding(value: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.hasSeenOnboarding, String(value));
}

export async function exportFiniteData(): Promise<FiniteBackup> {
  const [creators, checkIns] = await Promise.all([
    getCreators(),
    getCheckIns(),
  ]);

  return {
    version: 1,
    exportedAt: nowIso(),
    creators,
    checkIns,
  };
}

export async function importFiniteData(backup: FiniteBackup): Promise<void> {
  if (!isFiniteBackup(backup)) {
    throw new Error("Unsupported backup version");
  }

  const creators = backup.creators.map(normaliseStoredCreator).filter(Boolean);
  const creatorIds = new Set(creators.map((creator) => creator.id));
  const checkIns = backup.checkIns.filter((checkIn) =>
    creatorIds.has(checkIn.creatorId),
  );

  await Promise.all([
    saveCreators(creators),
    saveCheckIns(checkIns),
  ]);
}

export async function clearFiniteData(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(STORAGE_KEYS.creators),
    AsyncStorage.removeItem(STORAGE_KEYS.checkIns),
  ]);
}

export function getDataHealth(
  creators: Creator[],
  checkIns: CheckIn[],
): DataHealth {
  const creatorIds = new Set(creators.map((creator) => creator.id));
  const missingCreatorReferences = checkIns.filter(
    (checkIn) => !creatorIds.has(checkIn.creatorId),
  ).length;
  const inactiveCreators = creators.filter((creator) => !creator.isActive).length;

  return {
    issueCount: missingCreatorReferences,
    missingCreatorReferences,
    inactiveCreators,
  };
}

function normaliseStoredCreator(creator: Creator): Creator {
  const storedFrequency = creator.checkFrequency as CheckFrequency | undefined;
  const platform = PLATFORMS.includes(creator.platform)
    ? creator.platform
    : "other";

  return {
    ...creator,
    displayName: creator.displayName?.trim() || "Unnamed creator",
    platform,
    profileUrl: creator.profileUrl?.trim() || "https://example.com",
    handle: creator.handle?.trim() || undefined,
    isActive: creator.isActive ?? true,
    checkFrequency: storedFrequency ?? "daily",
  };
}

function isFiniteBackup(value: FiniteBackup): value is FiniteBackup {
  return (
    value?.version === 1 &&
    Array.isArray(value.creators) &&
    Array.isArray(value.checkIns)
  );
}
