export type State = "BEGIN" | "PROCESSING" | "COMPRESS";

export type TabType = "COMPRESSED" | "ORIGINAL" | "COMPARE"

type SingleSVD = {
  U: number[][];
  S: number[];
  Vt: number[][];
};

export type ColorSVD = {
  red: SingleSVD;
  green: SingleSVD;
  blue: SingleSVD;
};
