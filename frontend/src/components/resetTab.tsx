function ResetTab({ handleClick }: { handleClick: () => void }) {
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-t-lg bg-[#27395a] px-4 py-2 text-white transition-all hover:text-red-500"
    >
      <div className="text-center font-bold">X</div>
    </div>
  );
}

export default ResetTab;
