import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { User, LogOut } from "lucide-react";

interface UserMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserMenu: React.FC<UserMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /*바깥 클릭 시 닫힘*/
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`absolute top-full right-0 w-full bg-white border border-[#D9D9D9]
        z-50 transition-all duration-200 ease-out
        ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
    >
      {/*마이페이지 버튼*/}
      <button
        onClick={() => router.push("/mypage")}
        className="flex justify-center items-center w-full pt-3 pb-2 font-16r text-black3 hover:bg-[var(--color-gray5)]"
      >
        <User size={20} className="md:hidden" />
        <span className="hidden md:block">마이페이지</span>
      </button>

      {/*로그아웃 버튼*/}
      <button
        onClick={() => {
          localStorage.removeItem("accessToken");
          router.push("/");
        }}
        className="flex justify-center items-center w-full pt-2 pb-3 font-16r text-black3 hover:bg-[var(--color-gray5)]"
      >
        <LogOut size={20} className="md:hidden" />
        <span className="hidden md:block">로그아웃</span>
      </button>
    </div>
  );
};

export default UserMenu;
