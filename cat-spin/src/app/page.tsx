"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import EditModal from "@/components/EditModal";

const RouletteWheel = dynamic(() => import("@/components/RouletteWheel"), {
  ssr: false,
});

const DEFAULT_ITEMS = [
  "행운",
  "도전",
  "휴식",
  "노래",
  "춤추기",
  "선물",
  "모험",
  "소원",
];

const STORAGE_KEY = "roulette-items";

const DECORATIONS = [
  { emoji: "⭐", top: "8%", left: "5%" },
  { emoji: "🌸", top: "15%", left: "88%" },
  { emoji: "🦋", top: "75%", left: "6%" },
  { emoji: "🌈", top: "80%", left: "85%" },
  { emoji: "✨", top: "5%", left: "50%" },
  { emoji: "🍀", top: "60%", left: "92%" },
];

export default function Home() {
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [showEdit, setShowEdit] = useState(false);
  const [result, setResult] = useState<{ label: string; index: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 8) {
          setItems(parsed);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSave = (newItems: string[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const handleResult = (label: string, index: number) => {
    setResult({ label, index });
  };

  const closeResult = () => setResult(null);

  if (!mounted) return null;

  return (
    <main
      className="fairy-bg min-h-screen flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* 배경 장식 */}
      {DECORATIONS.map((d, i) => (
        <div
          key={i}
          className="animate-float absolute text-2xl pointer-events-none select-none"
          style={{
            top: d.top,
            left: d.left,
            animationDelay: `${i * 0.5}s`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        >
          {d.emoji}
        </div>
      ))}

      {/* 타이틀 */}
      <div className="text-center mb-8">
        <h1
          className="text-4xl md:text-5xl font-black mb-2"
          style={{
            color: "#7B2D8B",
            textShadow: "0 2px 8px rgba(150, 80, 200, 0.25)",
            letterSpacing: "-0.5px",
          }}
        >
          ✨ 마법의 룰렛 ✨
        </h1>
        <p className="text-base" style={{ color: "#B06DD0" }}>
          어떤 마법이 기다리고 있을까요? 🌟
        </p>
      </div>

      {/* 룰렛 */}
      <RouletteWheel items={items} onResult={handleResult} />

      {/* 편집 버튼 */}
      <button
        onClick={() => setShowEdit(true)}
        className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm
          transition-all duration-200 hover:scale-105 hover:shadow-lg"
        style={{
          background: "rgba(255,255,255,0.85)",
          color: "#7B2D8B",
          border: "2px solid #C77DFF",
          boxShadow: "0 4px 12px rgba(150, 80, 200, 0.2)",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        ✏️ 칸 편집하기
      </button>

      {/* 편집 모달 */}
      {showEdit && (
        <EditModal
          items={items}
          onSave={handleSave}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* 결과 팝업 */}
      {result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(100, 60, 140, 0.5)", backdropFilter: "blur(8px)" }}
          onClick={closeResult}
        >
          <div
            className="animate-bounce-in animate-winner-glow text-center rounded-3xl px-10 py-8"
            style={{
              background: "linear-gradient(135deg, #fff9fb, #fff0ff)",
              border: "4px solid #FFD700",
              boxShadow: "0 20px 60px rgba(200, 100, 255, 0.4)",
              minWidth: 280,
              fontFamily: "Nunito, sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4 animate-sparkle">🎉</div>
            <p className="text-lg font-bold mb-2" style={{ color: "#B06DD0" }}>
              당첨!
            </p>
            <p
              className="text-3xl font-black mb-6"
              style={{ color: "#7B2D8B" }}
            >
              {result.label}
            </p>
            <button
              onClick={closeResult}
              className="px-8 py-3 rounded-full text-white font-black text-base
                transition-all duration-150 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #C77DFF, #7B2D8B)",
                boxShadow: "0 4px 14px rgba(150, 80, 200, 0.5)",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              다시 돌리기 🌟
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
