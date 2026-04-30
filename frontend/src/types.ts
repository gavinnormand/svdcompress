export type State = "BEGIN" | "PROCESSING" | "COMPRESS";

export type TabType = "COMPRESSED" | "ORIGINAL" | "COMPARE";

export type SVDFrame = {
  k: number;
  data: string;
};

export type SVDSession = {
  rank: number;
  width: number;
  height: number;
  previewUrl: string;
  frames: SVDFrame[];
};
