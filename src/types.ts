export type CheckinStatus = "safe" | "help" | "unreachable";

export type CheckinPayload = {
  regionCode: string;
  name: string;
  phone?: string;
  status: CheckinStatus;
  needs?: string[];
  notes?: string;
  reporter: "self" | "other";
};

export type CheckinRow = CheckinPayload & {
  id: string;
  _time: number;
  _timeText: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};
