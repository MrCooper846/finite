import { Creator } from "./creator";
import { startOfToday } from "../utils/dates";

export function getActiveCreators(creators: Creator[]): Creator[] {
  return creators.filter((creator) => creator.isActive);
}

export function getTodayQueue(creators: Creator[]): Creator[] {
  return getActiveCreators(creators).filter(isCreatorDue);
}

export function getManualCreators(creators: Creator[]): Creator[] {
  return getActiveCreators(creators).filter(
    (creator) => creator.checkFrequency === "manual",
  );
}

export function isCreatorDue(creator: Creator): boolean {
  if (!creator.isActive || creator.checkFrequency === "manual") {
    return false;
  }

  if (!creator.lastCheckedAt) {
    return true;
  }

  const lastCheckedAt = new Date(creator.lastCheckedAt);
  const today = startOfToday();
  const daysSinceCheck = Math.floor(
    (today.getTime() - startOfDay(lastCheckedAt).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (creator.checkFrequency === "daily") {
    return daysSinceCheck >= 1;
  }

  if (creator.checkFrequency === "twice_weekly") {
    return daysSinceCheck >= 3;
  }

  return daysSinceCheck >= 7;
}

function startOfDay(value: Date): Date {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}
