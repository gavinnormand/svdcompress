import { useEffect, useRef, useState } from "react";
import type { ColorSVD, TabType } from "../types";
import Tab from "./tab";
import ResetTab from "./resetTab";

function Compress({
  svd,
  handleReset,
  originalFile,
}: {
  svd: ColorSVD;
  handleReset: () => void;
  originalFile: File;
}) {
  const [tab, setTab] = useState<TabType>("COMPRESSED");
  const maxNumSingularValues = svd.blue.S.length;
  const [numSingularValues, setNumSingularValues] =
    useState<number>(maxNumSingularValues);

  const k = numSingularValues;
  const constructCompressedChannel = (
    U: number[][],
    S: number[],
    Vt: number[][],
  ): number[][] => {
    const rows = U.length;
    const cols = Vt[0].length;
    const result = Array.from({ length: rows }, () => new Array(cols).fill(0));

    for (let i = 0; i < k; i++) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          result[r][c] += U[r][i] * S[i] * Vt[i][c];
        }
      }
    }
    return result;
  };

  const constructCompressedImage = (): ImageData => {
    const R = constructCompressedChannel(svd.red.U, svd.red.S, svd.red.Vt);
    const G = constructCompressedChannel(
      svd.green.U,
      svd.green.S,
      svd.green.Vt,
    );
    const B = constructCompressedChannel(svd.blue.U, svd.blue.S, svd.blue.Vt);

    const height = R.length;
    const width = R[0].length;
    const data = new Uint8ClampedArray(height * width * 4);

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const idx = (r * width + c) * 4;
        data[idx] = Math.max(0, Math.min(255, Math.round(R[r][c])));
        data[idx + 1] = Math.max(0, Math.min(255, Math.round(G[r][c])));
        data[idx + 2] = Math.max(0, Math.min(255, Math.round(B[r][c])));
        data[idx + 3] = 255;
      }
    }

    return new ImageData(data, width, height);
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const imageData = constructCompressedImage();
    const context = canvasRef.current?.getContext("2d");
    context?.putImageData(imageData, 0, 0);
  }, [numSingularValues]);

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
            <div className="flex w-full flex-col items-center">
              <p className="text-2xl font-medium text-white">
                compressed, # of singular values = {numSingularValues}
              </p>
              <canvas
                ref={canvasRef}
                width={svd.red.U.length}
                height={svd.red.Vt[0].length}
              />
              {/* <input
                type="range"
                min={0}
                max={maxNumSingularValues}
                value={numSingularValues}
                step={1}
                onChange={(e) => setNumSingularValues(Number(e.target.value))}
                className="w-1/3"
              /> */}
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
