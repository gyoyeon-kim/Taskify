import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { PaginationButton } from "@/components/button/PaginationButton";
import NewDashboard from "@/components/modal/NewDashboard";

interface Dashboard {
  id: number;
  title: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
}

interface SideMenuProps {
  teamId: string;
  dashboardList: Dashboard[];
  onCreateDashboard?: (dashboard: Dashboard) => void;
}

export default function SideMenu({
  teamId,
  dashboardList,
  onCreateDashboard,
}: SideMenuProps) {
  const router = useRouter();
  const boardId = router.query.dashboardId?.toString();

  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 15;
  const totalPages = Math.ceil(dashboardList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDashboards = dashboardList.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <aside
      className={clsx(
        "h-screen overflow-y-auto border-r border-[var(--color-gray3)] px-3 py-5 transition-all duration-200 flex flex-col",
        isCollapsed
          ? "w-[67px]"
          : "w-[67px] sm:w-[67px] md:w-[160px] lg:w-[300px]"
      )}
    >
      {/* 로고 영역 */}
      <div className="flex flex-col items-center md:items-start mb-8 px-1">
        <Link href="/mydashboard" className="mb-2">
          <Image
            src="/svgs/logo_taskify.svg"
            alt="Taskify Large Logo"
            width={109}
            height={34}
            className="hidden md:block"
            priority
            unoptimized
          />
          <Image
            src="/svgs/logo.svg"
            alt="Taskify Small Logo"
            width={24}
            height={28}
            className="md:hidden"
            priority
            unoptimized
          />
        </Link>

        {/* 접기/펼치기 버튼 (모바일에서는 숨김) */}
        <div
          className={clsx(
            "hidden sm:flex",
            isCollapsed ? "justify-center" : "justify-end",
            "w-full"
          )}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 hover:bg-gray-200 rounded flex items-center justify-center ml-0 border-none"
            title={isCollapsed ? "펼치기" : "접기"}
          >
            {isCollapsed ? (
              <svg
                className="w-2.5 h-2.5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-2.5 h-2.5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <nav className="flex flex-col flex-1 justify-between">
        <div>
          {/* 대시보드 타이틀 + 추가 버튼 */}
          {!isCollapsed && (
            <div className="mb-4 flex items-center justify-between px-3 md:px-2">
              <span className="hidden md:block font-12sb text-[var(--color-black)]">
                Dash Boards
              </span>
              <button
                className="ml-auto cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <Image
                  src="/svgs/icon-add-box.svg"
                  width={20}
                  height={20}
                  alt="추가 아이콘"
                  unoptimized
                />
              </button>
            </div>
          )}

          {isCollapsed && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer"
              >
                <Image
                  src="/svgs/icon-add-box.svg"
                  width={20}
                  height={20}
                  alt="추가 아이콘"
                  unoptimized
                />
              </button>
            </div>
          )}

          {/* 대시보드 목록 */}
          <ul
            className={clsx(
              "flex flex-col",
              isCollapsed
                ? "items-center"
                : "items-start md:items-start sm:items-center w-full"
            )}
          >
            {paginatedDashboards.map((dashboard) => (
              <li
                key={dashboard.id}
                className={clsx(
                  "w-full flex justify-center md:justify-start p-3 font-18r text-[var(--color-gray1)] transition-colors duration-200",
                  dashboard.id.toString() === boardId &&
                    "bg-[var(--color-violet8)] text-[var(--color-black)] font-semibold rounded-l-xl"
                )}
              >
                <Link
                  href={`/dashboard/${dashboard.id}`}
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill={dashboard.color}
                    className="shrink-0"
                  >
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  {!isCollapsed && (
                    <div className="hidden md:flex items-center gap-2">
                      <span className="truncate md:text-base">
                        {dashboard.title}
                      </span>
                      {dashboard.createdByMe && (
                        <Image
                          src="/svgs/crown.svg"
                          width={18}
                          height={14}
                          alt="크라운 아이콘"
                          unoptimized
                          priority
                        />
                      )}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 페이지네이션 */}
        {!isCollapsed && dashboardList.length > itemsPerPage && (
          <div className="flex justify-start mt-4 px-3">
            <PaginationButton
              direction="left"
              disabled={currentPage === 1}
              onClick={handlePrev}
            />
            <PaginationButton
              direction="right"
              disabled={currentPage === totalPages}
              onClick={handleNext}
            />
          </div>
        )}

        {/* 모달 */}
        {isModalOpen && (
          <NewDashboard
            teamId={teamId}
            onClose={() => setIsModalOpen(false)}
            onCreate={(newDashboard) => {
              onCreateDashboard?.(newDashboard);
              setIsModalOpen(false);
            }}
          />
        )}
      </nav>
    </aside>
  );
}
