import { CheckIn } from "./checkin";
import { Creator } from "./creator";
import { getTodayQueue } from "./queue";

export type FiniteStats = {
  activeCreatorCount: number;
  dueCreatorCount: number;
  pausedCreatorCount: number;
  checkInsThisWeek: number;
  completedThisWeek: number;
  skippedThisWeek: number;
  recentSessionCount: number;
};

export function getFiniteStats(
  creators: Creator[],
  checkIns: CheckIn[],
): FiniteStats {
  const weekStart = getStartOfWeek();
  const checkInsThisWeek = checkIns.filter(
    (checkIn) => new Date(checkIn.checkedAt) >= weekStart,
  );

  return {
    activeCreatorCount: creators.filter((creator) => creator.isActive).length,
    dueCreatorCount: getTodayQueue(creators).length,
    pausedCreatorCount: creators.filter((creator) => !creator.isActive).length,
    checkInsThisWeek: checkInsThisWeek.length,
    completedThisWeek: checkInsThisWeek.filter(
      (checkIn) => checkIn.status === "done",
    ).length,
    skippedThisWeek: checkInsThisWeek.filter(
      (checkIn) => checkIn.status === "skipped",
    ).length,
    recentSessionCount: countSessionLikeGroups(checkInsThisWeek),
  };
}

function getStartOfWeek(): Date {
  const date = new Date();
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function countSessionLikeGroups(checkIns: CheckIn[]): number {
  const dayKeys = new Set(
    checkIns.map((checkIn) => checkIn.checkedAt.slice(0, 10)),
  );
  return dayKeys.size;
}
