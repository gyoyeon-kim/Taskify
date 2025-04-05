import Image from "next/image";
import { ChangeEvent, useState, KeyboardEvent, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ColorTagChip, { getTagColor } from "./chips/ColorTagChip";
import { inputClassNames } from "./InputClassNames";
import clsx from "clsx";
import { format } from "date-fns";

type ModalInputType = "제목" | "마감일" | "태그";

interface ModalInputProps {
  label: ModalInputType;
  required?: boolean;
  onValueChange: (newValues: string[]) => void;
  defaultValue?: string;
  defaultValueArray?: string[];
}

interface Tag {
  text: string;
  textColor: string;
  bgColor: string;
}

export default function ModalInput({
  label,
  required,
  onValueChange,
  defaultValue = "",
  defaultValueArray = [],
}: ModalInputProps) {
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValue ? new Date(defaultValue) : null
  );

  useEffect(() => {
    if (label === "태그" && defaultValueArray.length > 0) {
      const initialTags = defaultValueArray.map((text, index) => ({
        text,
        ...getTagColor(index),
      }));
      setTags(initialTags);
    }
  }, [label, defaultValueArray]);

  const handleTitleValue = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange([event.target.value]);
  };

  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim() !== "") {
      if (tags.some((tag) => tag.text === tagInput.trim())) {
        setTagInput("");
        return;
      }

      const newTag: Tag = {
        text: tagInput.trim(),
        ...getTagColor(tags.length),
      };

      const newTags = [...tags, newTag];
      setTags(newTags);
      onValueChange(newTags.map((tag) => tag.text));
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagText: string) => {
    const updatedTags = tags.filter((tag) => tag.text !== tagText);
    setTags(updatedTags);
    onValueChange(updatedTags.map((tag) => tag.text));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formatted = format(date, "yyyy-MM-dd HH:mm");
      onValueChange([formatted]);
    }
  };

  let inputElement = null;

  switch (label) {
    case "제목":
      inputElement = (
        <input
          type="text"
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
          defaultValue={defaultValue}
          className="w-full max-w-[520px] h-[48px] rounded-md font-18r outline-none px-2 sm:px-4 border border-[var(--color-gray3)] focus:border-[var(--primary)]"
          onChange={handleTitleValue}
        />
      );
      break;

    case "마감일":
      inputElement = (
        <div className="relative w-full max-w-[520px]">
          <div className="flex items-center gap-2 w-full h-[48px] border border-[var(--color-gray3)] rounded-md px-2 sm:px-4 focus-within:border-[var(--primary)]">
            <Image
              src="/svgs/calendar.svg"
              width={20}
              height={20}
              alt="Deadline"
              priority
            />
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="날짜를 입력해주세요"
              className="w-full h-full font-18r outline-none bg-transparent"
              popperPlacement="bottom-start"
              popperContainer={({ children }) => <div>{children}</div>}
              popperClassName="custom-datepicker-popper"
            />
          </div>
        </div>
      );
      break;

    case "태그":
      inputElement = (
        <div className="flex flex-wrap items-center gap-2 w-full max-w-[520px] min-h-[48px] border border-[var(--color-gray3)] rounded-md px-2 sm:px-4 overflow-x-auto scrollbar-hide focus-within:border-[var(--primary)]">
          {tags.map((tag, index) => (
            <ColorTagChip
              key={index}
              onTagClick={() => handleDeleteTag(tag.text)}
              className={clsx(
                tag.textColor,
                tag.bgColor,
                "px-3 py-1 rounded-lg font-14r"
              )}
            >
              {tag.text}
            </ColorTagChip>
          ))}
          <input
            type="text"
            name="tag"
            id="tag"
            value={tagInput}
            placeholder="입력 후 Enter"
            onChange={handleTagInputChange}
            onKeyDown={handleAddTag}
            className="flex-grow min-w-[100px] h-full border-none font-18r outline-none"
          />
        </div>
      );
      break;
  }

  return (
    <div className="inline-flex flex-col items-start gap-2.5 w-full">
      <p className={inputClassNames.label}>
        {label}{" "}
        {required && <span className="text-[var(--color-purple)]">*</span>}
      </p>
      <div className="w-full">{inputElement}</div>
    </div>
  );
}
