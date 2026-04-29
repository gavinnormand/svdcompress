import { useMemo, useState } from "react";
import type { SVDSession, TabType } from "../types";
import Tab from "./tab";
import ResetTab from "./resetTab";
import LogSlider from "./logSlider";
import ImageCompare from "./imageCompare";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function Compress({
  session,
  handleReset,
  originalFile,
}: {
  session: SVDSession;
  handleReset: () => void;
  originalFile: File;
}) {
  const { frames, rank } = session;
  const [tab, setTab] = useState<TabType>("COMPRESSED");
  const [k, setK] = useState(frames[frames.length - 1].k);

  const currentFrame = frames.reduce((best, f) =>
    Math.abs(f.k - k) < Math.abs(best.k - k) ? f : best,
  );

  const originalUrl = useMemo(
    () => URL.createObjectURL(originalFile),
    [originalFile],
  );

  const compressedBytes = Math.round(
    ((currentFrame.data.length - "data:image/jpeg;base64,".length) * 3) / 4,
  );
  const ratio = (originalFile.size / compressedBytes).toFixed(1);

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
              <p className="text-2xl font-medium text-white">Compressed</p>
              <img src={currentFrame.data} />
            </div>
          )}
          {tab === "ORIGINAL" && (
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-2xl font-medium text-white">Original Image</p>
              <img src={originalUrl} />
            </div>
          )}
          {tab === "COMPARE" && (
            <div className="flex w-full flex-col items-center gap-4">
              <p className="text-2xl font-medium text-white">Compare</p>
              <ImageCompare
                before={originalUrl}
                after={currentFrame.data}
                k={currentFrame.k}
              />
            </div>
          )}
          {(tab === "COMPRESSED" || tab === "COMPARE") && (
            <div className="flex flex-col items-center gap-4 pt-4">
              <LogSlider
                min={1}
                max={rank}
                value={k}
                onChange={setK}
                className="w-2/3"
              />
              <div className="flex flex-col gap-2 text-sm text-white/70">
                <p>Number of singular values = {currentFrame.k}</p>
                <p>
                  ~{formatBytes(compressedBytes)} compressed ·{" "}
                  {formatBytes(originalFile.size)} original · {ratio}x smaller
                </p>
              </div>
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
