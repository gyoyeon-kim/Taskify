import clsx from "clsx";

const tagColorSet = [
  {
    textColor: "text-[var(--sortTextGreen)]",
    bgColor: "bg-[var(--sortTextBgGreen)]",
  },
  {
    textColor: "text-[var(--sortTextPink)]",
    bgColor: "bg-[var(--sortTextBgPink)]",
  },
  {
    textColor: "text-[var(--sortTextBlue)]",
    bgColor: "bg-[var(--sortTextBgBlue)]",
  },
  {
    textColor: "text-[var(--sortTextOrange)]",
    bgColor: "bg-[var(--sortTextBgOrange)]",
  },
];

export function getTagColor(index: number) {
  return tagColorSet[index % tagColorSet.length];
}

export default function ColorTagChip({
  children,
  onTagClick,
  className,
}: {
  children: string;
  onTagClick?: (children: string) => void;
  className?: string;
}): React.JSX.Element {
  const handleClick = () => {
    onTagClick?.(children);
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "px-3 py-2 rounded-lg font-14r whitespace-nowrap",
        className
      )}
    >
      {children}
    </button>
  );
}
