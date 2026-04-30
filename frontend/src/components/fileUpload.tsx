import { FilePlus, FileUp } from "lucide-react";
import { useRef, useState } from "react";
import type { SVDSession, State } from "../types";

function FileUpload({
  setState,
  setSession,
}: {
  setState: (state: State) => void;
  setSession: (session: SVDSession | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const uploadFiles = async (files: FileList) => {
    const file = files[0];
    const bitmap = await createImageBitmap(file);
    const pixels = bitmap.width * bitmap.height;
    bitmap.close();
    if (pixels > 4_000_000) {
      alert(
        `Image is too large (${bitmap.width}x${bitmap.height} = ${(pixels / 1_000_000).toFixed(1)}M pixels). Please use an image under 4 megapixels (e.g. 2000x2000).`,
      );
      return;
    }
    setState("PROCESSING");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/svd", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setSession({
        rank: data.rank,
        width: data.width,
        height: data.height,
        previewUrl: data.preview,
        frames: data.frames,
      });
      setState("COMPRESS");
    } catch (e) {
      console.error(e);
      alert("Something went wrong processing your image! Please try again!");
      setState("BEGIN");
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    uploadFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(false);
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    uploadFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      className={`flex aspect-2/1 w-full max-w-200 flex-col items-center justify-center gap-1 rounded-lg border-3 border-[#304674] p-4 text-center ${dragging ? "border-solid bg-[#304674]" : "border-dashed bg-[#c6d3e3]"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFiles}
      />
      {!dragging ? (
        <>
          <button
            onClick={() => inputRef.current?.click()}
            className="flex flex-row gap-2 rounded-md bg-[#304674] px-4 py-2 font-medium text-white transition-all hover:cursor-pointer hover:bg-[#27395a]"
          >
            <FilePlus />
            <p>Upload a file!</p>
          </button>
          <p className="text-xl text-[#304674]"> or </p>
          <p className="text-xl font-medium text-[#304674]">
            Drag and drop your images here!
          </p>
        </>
      ) : (
        <>
          <FileUp className="pointer-events-none h-12 w-12 text-white" />
          <p className="pointer-events-none text-2xl font-medium text-white">
            Drop the file to upload!
          </p>
        </>
      )}
    </div>
  );
}

export default FileUpload;
