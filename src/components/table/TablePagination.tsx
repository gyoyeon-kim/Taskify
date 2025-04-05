import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex items-center">
      <p className="relative -translate-y-[10px] sm:text-xs text-sm text-gray-700 mt-4 text-center mr-3">
        {totalPages} 페이지 중 {currentPage}
      </p>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className={`w-9 sm:w-10 h-9 sm:h-10 flex justify-center items-center border-r border-gray-300
            ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}`}
        >
          <img
            src="/svgs/arrow_backward_white.svg"
            alt="왼쪽"
            className="w-5 h-5"
          />
        </button>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`w-9 sm:w-10 h-9 sm:h-10 flex justify-center items-center hover:bg-gray-100 
              ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <img
            src="/svgs/arrow_forward_white.svg"
            alt="오른쪽"
            className="w-5 h-5"
          />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
