import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChangeBebridge from "@/components/modal/ChangeBebridge";
import HeaderDashboardEdit from "@/components/gnb/HeaderDashboard";
import MemberList from "@/components/table/member/MemberList";
import SideMenu from "@/components/sideMenu/SideMenu";
import InviteRecords from "@/components/table/InviteRecords";
import Image from "next/image";
import { getDashboards } from "@/api/dashboards";
import DeleteDashboardModal from "@/components/modal/DeleteDashboardModal";
import { DashboardType } from "@/types/task";
import { TEAM_ID } from "@/constants/team";

export default function EditDashboard() {
  const router = useRouter();
  const [dashboardList, setDashboardList] = useState<DashboardType[]>([]);
  const { dashboardId } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dashboardIdString = Array.isArray(dashboardId)
    ? dashboardId[0]
    : dashboardId;

  /* 돌아가기 버튼 */
  const goToDashboard = () => {
    router.push(`/dashboard/${dashboardId}`);
  };

  /* 대시보드 삭제 모달 */
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  /* SideMenu 값 불러오기 */
  const fetchDashboards = async () => {
    try {
      const res = await getDashboards({});
      setDashboardList(res.dashboards);
    } catch (error) {
      console.error("대시보드 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu teamId={TEAM_ID} dashboardList={dashboardList} />

      <div className="flex flex-col flex-1">
        <div className="flex flex-col">
          <HeaderDashboardEdit variant="edit" dashboardId={dashboardId} />
        </div>
        <div
          className="overflow-auto flex-1 px-[50px] pt-[10px] pb-10"
          style={{ backgroundColor: "var(--color-gray5)" }}
        >
          <div className="mt-6">
            <button
              onClick={goToDashboard}
              className="cursor-pointer flex items-center gap-2"
            >
              <Image
                src="/svgs/arrow-backward-black.svg"
                alt="돌아가기"
                width={20}
                height={20}
              />
              돌아가기
            </button>
          </div>

          <div className="mt-5">
            <ChangeBebridge />
          </div>

          {/* MemberList는 아래쪽에 배치 */}
          <div className="">
            <MemberList dashboardId={dashboardId} />
          </div>

          <div className="mt-15">
            <InviteRecords dashboardId={dashboardIdString || ""} />{" "}
            {/* undefined일 경우 빈 문자열로 전달*/}
          </div>
          <div className="flex mt-15 sm:mt-0">
            <button
              onClick={openModal}
              className="text-base sm:text-lg cursor-pointer w-[320px] h-[62px] text-black3 rounded-[8px] border-[1px] border-[var(--color-gray3)] hover:scale-105 transition-transform duration-200 ml-0 lg:ml-2"
            >
              대시보드 삭제하기
            </button>

            {isModalOpen && (
              <DeleteDashboardModal
                isOpen={isModalOpen}
                onClose={closeModal}
                dashboardid={String(dashboardId)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
