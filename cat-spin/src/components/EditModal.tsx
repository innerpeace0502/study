"use client";

import { useState } from "react";

const COLORS = [
  "#FF9AA2",
  "#FFB7B2",
  "#FFDAC1",
  "#E2F0CB",
  "#B5EAD7",
  "#C7CEEA",
  "#F8D7DA",
  "#FFF3CD",
];

interface EditModalProps {
  items: string[];
  onSave: (items: string[]) => void;
  onClose: () => void;
}

export default function EditModal({ items, onSave, onClose }: EditModalProps) {
  const [draft, setDraft] = useState<string[]>([...items]);

  const handleChange = (index: number, value: string) => {
    const next = [...draft];
    next[index] = value;
    setDraft(next);
  };

  const handleSave = () => {
    const filled = draft.map((v, i) => v.trim() || `칸 ${i + 1}`);
    onSave(filled);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(100, 60, 140, 0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="animate-bounce-in relative rounded-3xl p-8 w-full max-w-md"
        style={{
          background: "linear-gradient(135deg, #fff9fb, #f0f4ff)",
          boxShadow: "0 20px 60px rgba(150, 80, 200, 0.35), 0 4px 16px rgba(0,0,0,0.15)",
          border: "3px solid #FFD700",
          fontFamily: "Nunito, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">✏️</div>
          <h2
            className="text-2xl font-black"
            style={{ color: "#7B2D8B" }}
          >
            룰렛 칸 편집하기
          </h2>
          <p className="text-sm mt-1" style={{ color: "#999" }}>
            각 칸의 이름을 바꿔보세요! (최대 6자)
          </p>
        </div>

        {/* 편집 리스트 */}
        <div className="flex flex-col gap-3 mb-6">
          {draft.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* 색상 원 */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold"
                style={{
                  background: COLORS[i],
                  color: "#555",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                {i + 1}
              </div>
              <input
                type="text"
                value={item}
                maxLength={6}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder={`칸 ${i + 1}`}
                className="flex-1 px-4 py-2 rounded-2xl text-sm font-bold outline-none
                  transition-all duration-150"
                style={{
                  border: `2px solid ${COLORS[i]}`,
                  background: `${COLORS[i]}33`,
                  color: "#444",
                  fontFamily: "Nunito, sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS[i]}88`;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-150 hover:opacity-80"
            style={{
              background: "#f0f0f0",
              color: "#888",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-2 py-3 px-6 rounded-2xl font-black text-white text-sm
              transition-all duration-150 hover:opacity-90 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #C77DFF, #7B2D8B)",
              boxShadow: "0 4px 14px rgba(150, 80, 200, 0.5)",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            🌟 저장하기
          </button>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
            text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
