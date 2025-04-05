// CardDetail.tsx
import Image from "next/image";
import { CardDetailType } from "@/types/cards";
import { ProfileIcon } from "./profelicon";
import ColorTagChip, {
  getTagColor,
} from "@/components/modalInput/chips/ColorTagChip";

interface CardDetailProps {
  card: CardDetailType;
  columnName: string;
}

export default function CardDetail({ card, columnName }: CardDetailProps) {
  return (
    <div className="p-4 ">
      <h2 className="text-3xl font-semibold mb-5">{card.title}</h2>
      {/* 작성자 정보 추가 */}
      <div className="absolute w-[181px] h-[155px] lg:[200px] top-20 right-10 rounded-lg p-3.5 bg-white border border-[#D9D9D9]">
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-800 mb-1">담당자</p>
          <div className="flex items-center  gap-2">
            <ProfileIcon
              userId={card.assignee.id}
              nickname={card.assignee.nickname}
              profileImageUrl={card.assignee.profileImageUrl ?? ""}
              id={card.assignee.id}
              imgClassName="w-6 h-6"
              fontClassName="text-sm"
            />

            <span className="text-sm text-gray-700">
              {card.assignee.nickname}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1 mt-3">
              마감일
            </p>
            <p className="text-sm text-gray-700">
              {new Date(card.dueDate).toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span
          className="rounded-full bg-violet-200 px-3 py-1 text-sm text-violet-800"
          title={`상태: ${columnName}`}
        >
          {columnName}
        </span>
        <span className="text-2xl font-extralight text-[#D9D9D9]">|</span>
        {card.tags.map((tag, idx) => {
          const { textColor, bgColor } = getTagColor(idx);
          return (
            <ColorTagChip key={idx} className={`${textColor} ${bgColor}`}>
              {tag}
            </ColorTagChip>
          );
        })}
      </div>
      <p
        className="text-gray-700 p-2 break-words overflow-auto"
        style={{
          width: "470px",
          height: "70px",
          whiteSpace: "pre-wrap", // 줄바꿈 유지 + 자동 줄바꿈
          wordBreak: "break-word", // 긴 단어도 줄바꿈
        }}
      >
        {card.description}
      </p>
      {card.imageUrl && (
        <div className="md:w-420px lg:w-445px">
          <Image
            src={card.imageUrl}
            alt="카드 이미지"
            width={420}
            height={226}
            className="rounded-lg object-cover lg:w-[445px] lg:h-[260px] w-[420px] h-[246px] "
          />
        </div>
      )}
    </div>
  );
}
