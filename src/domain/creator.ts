export const PLATFORMS = [
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "reddit",
  "other",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const CHECK_FREQUENCIES = [
  "daily",
  "twice_weekly",
  "weekly",
  "manual",
] as const;

export type CheckFrequency = (typeof CHECK_FREQUENCIES)[number];

export type Creator = {
  id: string;
  displayName: string;
  platform: Platform;
  profileUrl: string;
  handle?: string;
  isActive: boolean;
  checkFrequency: CheckFrequency;
  createdAt: string;
  updatedAt: string;
  lastCheckedAt?: string;
};

export type NewCreatorInput = {
  displayName: string;
  platform: Platform;
  profileUrl: string;
  handle?: string;
  checkFrequency?: CheckFrequency;
};

export type UpdateCreatorInput = Partial<{
  displayName: string;
  platform: Platform;
  profileUrl: string;
  handle: string;
  isActive: boolean;
  lastCheckedAt: string;
  checkFrequency: CheckFrequency;
}>;

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    x: "X",
    reddit: "Reddit",
    other: "Other",
  };

  return labels[platform];
}

export function getCheckFrequencyLabel(frequency: CheckFrequency): string {
  const labels: Record<CheckFrequency, string> = {
    daily: "Daily",
    twice_weekly: "Twice weekly",
    weekly: "Weekly",
    manual: "Manual",
  };

  return labels[frequency];
}
