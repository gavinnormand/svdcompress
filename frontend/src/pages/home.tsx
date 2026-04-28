import { useState } from "react";
import FileUpload from "../components/fileUpload";
import type { SVDSession, State } from "../types";
import Compress from "../components/compress";
import Processing from "../components/processing";

function Home() {
  const [state, setState] = useState<State>("BEGIN");
  const [originalFile, setOriginalFile] = useState<File>();
  const [session, setSession] = useState<SVDSession | null>(null);

  const handleReset = () => {
    setState("BEGIN");
    setSession(null);
  };

  return (
    <div className="m-8 flex flex-col items-center gap-4">
      <p className="text-center text-4xl font-medium text-[#304674]">
        Compress your images with ease using{" "}
        <span className="font-bold">Singular Value Decomposition</span>!
      </p>
      {state == "BEGIN" && (
        <FileUpload
          setState={setState}
          setSession={setSession}
          setOriginalFile={setOriginalFile}
        />
      )}
      {state == "PROCESSING" && <Processing />}
      {state === "COMPRESS" &&
        (session && originalFile ? (
          <Compress
            session={session}
            handleReset={handleReset}
            originalFile={originalFile}
          />
        ) : null)}
    </div>
  );
}

export default Home;
