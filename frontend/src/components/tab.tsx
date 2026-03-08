function Tab({
  handleClick,
  text,
  active,
}: {
  handleClick: () => void;
  text: string;
  active: boolean;
}) {
  return (
    <div
      onClick={handleClick}
      className={`w-32 rounded-t-lg py-2 text-white transition-all ${active ? `bg-[#304674]` : `cursor-pointer bg-[#27395a] hover:text-[#c6d3e3]`}`}
    >
      <div className="text-center font-medium">{text}</div>
    </div>
  );
}

export default Tab;
