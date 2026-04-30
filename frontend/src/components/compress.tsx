import { useState } from "react";
import type { SVDSession, TabType } from "../types";
import Tab from "./tab";
import ResetTab from "./resetTab";
import LogSlider from "./logSlider";
import ImageCompare from "./imageCompare";

function Compress({
  session,
  handleReset,
}: {
  session: SVDSession;
  handleReset: () => void;
}) {
  const { frames, rank, width, height, previewUrl } = session;
  const [tab, setTab] = useState<TabType>("COMPRESSED");
  const [k, setK] = useState(frames[frames.length - 1].k);

  const currentFrame = frames.reduce((best, f) =>
    Math.abs(f.k - k) < Math.abs(best.k - k) ? f : best,
  );

  const rawPixels = width * height;
  const svdValues = currentFrame.k * (height + 1 + width);

  const controls = (
    <>
      <LogSlider
        min={1}
        max={rank}
        value={k}
        onChange={setK}
        className="w-2/3"
      />
      <p className="text-sm text-white/70">
        SVD: {height}x{currentFrame.k} + {currentFrame.k} + {currentFrame.k}x
        {width} = {svdValues.toLocaleString()} values/channel · pixels: {width}x
        {height} = {rawPixels.toLocaleString()} ·{" "}
        {(rawPixels / svdValues).toFixed(1)}x ratio
      </p>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        <div className="flex flex-row">
          <ResetTab handleClick={handleReset} />
          <Tab
            handleClick={() => setTab("COMPRESSED")}
            text="Compress"
            active={tab === "COMPRESSED"}
          />
          <Tab
            handleClick={() => setTab("ORIGINAL")}
            text="Original"
            active={tab === "ORIGINAL"}
          />
          <Tab
            handleClick={() => setTab("COMPARE")}
            text="Compare"
            active={tab === "COMPARE"}
          />
        </div>
        <div className="w-200 rounded-lg rounded-tl-none border-3 border-solid border-[#304674] bg-[#304674] p-6 text-center">
          {tab === "COMPRESSED" && (
            <div className="flex w-full flex-col items-center gap-4">
              <p className="text-2xl font-medium text-white">
                Compressed, k = {currentFrame.k}
              </p>
              <img src={currentFrame.data} />
              {controls}
            </div>
          )}
          {tab === "ORIGINAL" && (
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-2xl font-medium text-white">Original Image</p>
              <img src={previewUrl} />
            </div>
          )}
          {tab === "COMPARE" && (
            <div className="flex w-full flex-col items-center gap-4">
              <p className="text-2xl font-medium text-white">
                Original vs k = {currentFrame.k}
              </p>
              <ImageCompare
                before={previewUrl}
                after={currentFrame.data}
                k={currentFrame.k}
              />
              {controls}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleReset}
        className="flex w-fit flex-row gap-2 rounded-md bg-[#304674] px-6 py-2 font-medium text-white transition-all hover:cursor-pointer hover:bg-[#27395a]"
      >
        Compress New Image
      </button>
    </div>
  );
}

export default Compress;
