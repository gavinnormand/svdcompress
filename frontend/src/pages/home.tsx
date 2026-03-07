import { FilePlus, FileUp } from "lucide-react";
import { useRef, useState } from "react";

function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState<boolean>(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    console.log(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(false);
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;
    console.log(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex w-full flex-col items-center px-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        className={`m-8 flex aspect-2/1 w-full max-w-200 flex-col items-center justify-center gap-2 rounded-lg border-3 border-[#304674] p-4 text-center ${dragging ? `border-solid bg-[#304674]` : `border-dashed bg-[#c6d3e3]`}`}
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
              className="flex flex-row gap-2 rounded-md bg-[#304674] px-4 py-2 font-medium text-white hover:cursor-pointer hover:bg-[#27395a]"
            >
              <FilePlus />
              <p>Upload a file!</p>
            </button>
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
    </div>
  );
}

export default Home;
