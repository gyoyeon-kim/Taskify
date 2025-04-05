// Column.tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import { CardType } from "@/types/task";
import TodoModal from "@/components/modalInput/ToDoModal";
import TodoButton from "@/components/button/TodoButton";
import ColumnManageModal from "@/components/columnCard/ColumnManageModal";
import ColumnDeleteModal from "@/components/columnCard/ColumnDeleteModal";
import { updateColumn, deleteColumn } from "@/api/columns";
import { getDashboardMembers, getCardDetail } from "@/api/card";
import { MemberType } from "@/types/users";
import { TEAM_ID } from "@/constants/team";
import CardList from "./CardList";
import CardDetailModal from "@/components/modalDashboard/CardDetailModal";
import { CardDetailType } from "@/types/cards";
import { toast } from "react-toastify";

type ColumnProps = {
  columnId: number;
  title?: string;
  tasks?: CardType[];
  dashboardId: number;
};

export default function Column({
  columnId,
  title = "new Task",
  tasks = [],
  dashboardId,
}: ColumnProps) {
  const [columnTitle, setColumnTitle] = useState(title);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isCardDetailModalOpen, setIsCardDetailModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardDetailType | null>(null);
  const [members, setMembers] = useState<
    { id: number; userId: number; nickname: string }[]
  >([]);

  // ✅ 멤버 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const result = await getDashboardMembers({ dashboardId });

        const parsed = result.map((m: MemberType) => ({
          id: m.id,
          userId: m.userId,
          nickname: m.nickname || m.email,
        }));

        setMembers(parsed);
      } catch (error) {
        console.error("멤버 불러오기 실패:", error);
      }
    };

    fetchMembers();
  }, [dashboardId]);

  const handleEditColumn = async (newTitle: string) => {
    if (!newTitle.trim()) {
      toast.error("칼럼 이름을 입력해주세요.");
      return;
    }

    try {
      const updated = await updateColumn({ columnId, title: newTitle });
      setColumnTitle(updated.title);
      setIsColumnModalOpen(false);
      toast.success("칼럼이 변경되었습니다.");
    } catch (error) {
      console.error("칼럼 이름 수정 실패:", error);
      toast.error("칼럼 변경에 실패했습니다.");
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await deleteColumn({ columnId });
      setIsDeleteModalOpen(false);
      toast.success("칼럼이 삭제되었습니다.");
    } catch (error) {
      console.error("칼럼 삭제 실패:", error);
      toast.error("칼럼 삭제에 실패했습니다.");
    }
  };

  const handleCardClick = async (cardId: number) => {
    try {
      const detail = await getCardDetail(cardId);
      setSelectedCard(detail);
      setIsCardDetailModalOpen(true);
    } catch (e) {
      console.error("카드 상세 불러오기 실패:", e);
    }
  };

  return (
    <div
      className={`
      flex flex-col border-r border-[#EEEEEE] bg-gray-50 rounded-md p-4
      h-auto sm:m-h-screen
      max-h-[401px] sm:max-h-none w-full lg:w-[360px]
    `}
    >
      {/* 칼럼 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">
            <span className="text-[var(--primary)]">•</span> {columnTitle}
          </h2>
          <span className="w-5 h-5 text-sm bg-gray-200 text-gray-700 rounded-[4px] flex items-center justify-center ">
            {tasks.length}
          </span>
        </div>
        <Image
          src="/svgs/settings.svg"
          alt="setting icon"
          width={24}
          height={24}
          priority
          className="cursor-pointer"
          onClick={() => setIsColumnModalOpen(true)}
        />
      </div>

      {/* 카드 영역 */}
      <div className="flex-1 pb-4 flex flex-col items-center gap-3">
        <div onClick={() => setIsTodoModalOpen(true)} className="mb-2">
          <TodoButton />
        </div>

        {/* 무한스크롤 카드 리스트로 대체 */}
        <div className="w-full max-h-[800px] overflow-y-auto">
          <CardList
            columnId={columnId}
            teamId={TEAM_ID}
            initialTasks={tasks}
            onCardClick={(card) => handleCardClick(card.id)}
          />
        </div>
      </div>

      {/* Todo 모달 */}
      {isTodoModalOpen && (
        <TodoModal
          isOpen={isTodoModalOpen}
          onClose={() => setIsTodoModalOpen(false)}
          teamId={TEAM_ID}
          dashboardId={dashboardId}
          columnId={columnId}
          members={members}
        />
      )}

      {/* 칼럼 관리 모달 */}
      <ColumnManageModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onDeleteClick={() => {
          setIsColumnModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
        columnTitle={columnTitle}
        onEditSubmit={handleEditColumn}
      />

      {/* 칼럼 삭제 확인 모달 */}
      <ColumnDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteColumn}
      />

      {/* 카드 상세 모달 */}
      {isCardDetailModalOpen && selectedCard && (
        <CardDetailModal
          card={selectedCard}
          currentUserId={selectedCard.assignee.id}
          dashboardId={dashboardId}
          onClose={() => {
            setIsCardDetailModalOpen(false);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}
