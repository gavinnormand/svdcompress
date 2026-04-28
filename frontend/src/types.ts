export type State = "BEGIN" | "PROCESSING" | "COMPRESS";

export type TabType = "COMPRESSED" | "ORIGINAL" | "COMPARE";

export type SVDSession = {
  sessionId: string;
  rank: number;
  width: number;
  height: number;
};
