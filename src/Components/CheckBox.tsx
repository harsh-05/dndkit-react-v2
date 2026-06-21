export function CheckBox({
  size,
  onChange,
  checked,
}: {
  size: number;
  onChange: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
  checked: boolean;
}) {
  const sizeMap: Record<number, string> = {
    4: "size-4",
    5: "size-5",
    6: "size-6",
    8: "size-8",
    10: "size-10",
    12: "size-12",
  };

  const checkSizeMap: Record<number, string> = {
    4: "size-3",
    5: "size-4",
    6: "size-5",
    8: "size-7",
    10: "size-9",
    12: "size-11",
  };

  const checkedmarker = { 1: "flex", 0: "hidden group-hover:block" };

  return (
    <label className="group inline-flex cursor-pointer items-center">
      {/* The actual hidden input */}
      <input
        onChange={onChange}
        checked={checked}
        type="checkbox"
        className="peer sr-only"
      />

      {/* The visual checkbox circle */}
      <span
        className={`${sizeMap[size]} rounded-full border border-gray-500 bg-transparent peer-checked:bg-green-500 ${checkedmarker[checked === true ? 1 : 0]} peer-checked:border-green-500  items-center justify-center transition-all duration-200`}
      >
        {/* The White Checkmark SVG */}
        <svg
          className={`${checkSizeMap[size]} text-white`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
        </svg>
      </span>
    </label>
  );
}
