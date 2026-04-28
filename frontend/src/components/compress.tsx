import { useState } from "react";
import type { SVDSession, TabType } from "../types";
import Tab from "./tab";
import ResetTab from "./resetTab";

const API_BASE = "http://localhost:8000";

function Compress({
  session,
  handleReset,
  originalFile,
}: {
  session: SVDSession;
  handleReset: () => void;
  originalFile: File;
}) {
  const [tab, setTab] = useState<TabType>("COMPRESSED");
  const [numSingularValues, setNumSingularValues] = useState<number>(session.rank);

  const imgSrc = `${API_BASE}/reconstruct?session_id=${session.sessionId}&k=${numSingularValues}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        <div className="flex flex-row">
          <ResetTab handleClick={handleReset} />
          <Tab
            handleClick={() => setTab("COMPRESSED")}
            text={"Compress"}
            active={tab === "COMPRESSED"}
          />
          <Tab
            handleClick={() => setTab("ORIGINAL")}
            text={"Original"}
            active={tab === "ORIGINAL"}
          />
          <Tab
            handleClick={() => setTab("COMPARE")}
            text={"Compare"}
            active={tab === "COMPARE"}
          />
        </div>
        <div className="w-200 rounded-lg rounded-tl-none border-3 border-solid border-[#304674] bg-[#304674] p-6 text-center">
          {tab === "COMPRESSED" && (
            <div className="flex w-full flex-col items-center gap-4">
              <p className="text-2xl font-medium text-white">
                compressed, # of singular values = {numSingularValues}
              </p>
              <img src={imgSrc} />
              <input
                type="range"
                min={1}
                max={session.rank}
                value={numSingularValues}
                step={1}
                onChange={(e) => setNumSingularValues(Number(e.target.value))}
                className="w-1/3"
              />
            </div>
          )}
          {tab === "ORIGINAL" && (
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-2xl font-medium text-white">Original Image</p>
              <img src={URL.createObjectURL(originalFile)} />
            </div>
          )}
          {tab === "COMPARE" && (
            <p className="text-2xl font-medium text-white">compare</p>
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
