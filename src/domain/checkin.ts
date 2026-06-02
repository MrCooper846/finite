export type CheckInStatus = "done" | "skipped";

export type CheckIn = {
  id: string;
  creatorId: string;
  status: CheckInStatus;
  checkedAt: string;
};

export type CreateCheckInInput = {
  creatorId: string;
  status: CheckInStatus;
};
