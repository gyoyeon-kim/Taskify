import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

const TodoButton: React.FC<ButtonProps> = ({
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center gap-[10px] bg-white transition-all",
        "rounded-lg px-4 py-3 font-semibold",
        "border border-gray-200 hover:border-purple-500",
        fullWidth ? "w-full" : "w-[284px] md:w-[544px] lg:w-[314px]",
        "h-[32px] md:h-[40px] lg:h-[40px]",
        "mt-[10px] md:mt-[16px] lg:mt-[20px]",
        "text-lg md:text-2lg lg:text-2lg",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <span className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 flex items-center justify-center rounded-md bg-[#F1EFFD] text-[#5534DA] text-[16px] md:text-[18px] lg:text-[20px] font-light">
        +
      </span>
    </button>
  );
};

export default TodoButton;
