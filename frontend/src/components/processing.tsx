import { SpinnerCircularFixed } from "spinners-react";

function Processing() {
  return (
    <div className="flex aspect-2/1 w-full max-w-200 flex-col items-center justify-center gap-1 rounded-lg border-3 border-solid border-[#304674] bg-[#304674] p-4 text-center">
      <SpinnerCircularFixed
        size={50}
        thickness={100}
        speed={100}
        color="rgba(255, 255, 255, 1)"
        secondaryColor="rgba(48, 70, 116, 1)"
      />
      <p className="text-2xl font-medium text-white">
        Processing your image ...
      </p>
    </div>
  );
}

export default Processing;
