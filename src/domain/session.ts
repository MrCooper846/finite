export type CatchUpSession = {
  id: string;
  startedAt: string;
  completedAt?: string;
  creatorIds: string[];
  completedCreatorIds: string[];
  skippedCreatorIds: string[];
};
