"use client";

import { useRef, useState } from "react";

const COLORS = [
  "#FF9AA2", // 딸기 핑크
  "#FFB7B2", // 살몬
  "#FFDAC1", // 복숭아
  "#E2F0CB", // 민트 그린
  "#B5EAD7", // 연두
  "#C7CEEA", // 라벤더
  "#F8D7DA", // 연핑크
  "#FFF3CD", // 크림 노랑
];

const DARK_COLORS = [
  "#c0505a",
  "#c06060",
  "#c07840",
  "#5a7830",
  "#307858",
  "#4050a0",
  "#a04060",
  "#a07820",
];

const TOTAL = 8;
const ANGLE_PER_SLICE = 360 / TOTAL;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function slicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

interface RouletteWheelProps {
  items: string[];
  onResult: (item: string, index: number) => void;
}

export default function RouletteWheel({ items, onResult }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const rotationRef = useRef(0);
  const cx = 250;
  const cy = 250;
  const r = 220;
  const innerR = 40;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);

    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5~9회전
    const randomAngle = Math.floor(Math.random() * 360);
    const totalAngle = extraSpins * 360 + randomAngle;
    const newRotation = rotationRef.current + totalAngle;

    rotationRef.current = newRotation;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      // 화살표는 상단(0도)을 가리킴. 룰렛이 newRotation만큼 돌았으므로
      // 어떤 칸이 상단에 오는지 계산
      const normalizedAngle = ((newRotation % 360) + 360) % 360;
      // 0도 기준 상단: 화살표 위치 보정 (첫 번째 슬라이스가 -90도 기준)
      const pointerAngle = (360 - normalizedAngle + ANGLE_PER_SLICE / 2) % 360;
      const index = Math.floor(pointerAngle / ANGLE_PER_SLICE) % TOTAL;
      onResult(items[index] || `칸 ${index + 1}`, index);
    }, 4500);
  };

  const decorEmojis = ["⭐", "🌟", "✨", "💫", "🌈", "🦋", "🍀", "🌸"];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 룰렛 + 포인터 */}
      <div className="relative" style={{ width: 500, height: 500 }}>
        {/* 포인터 (상단 화살표) */}
        <div
          className="absolute left-1/2 z-10"
          style={{
            top: -16,
            transform: "translateX(-50%)",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        >
          <svg width="32" height="40" viewBox="0 0 32 40">
            <polygon
              points="16,36 2,4 30,4"
              fill="#FF4D6D"
              stroke="#fff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 룰렛 원판 */}
        <div
          className="roulette-shadow"
          style={{
            transition: spinning
              ? "transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 1.0)"
              : "none",
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
            width: 500,
            height: 500,
          }}
        >
          <svg
            width="500"
            height="500"
            viewBox="0 0 500 500"
            style={{ display: "block" }}
          >
            {/* 외곽 테두리 */}
            <circle cx={cx} cy={cy} r={r + 14} fill="#FFD700" />
            <circle cx={cx} cy={cy} r={r + 8} fill="#FFF9C4" />

            {/* 슬라이스 */}
            {items.map((label, i) => {
              const startAngle = i * ANGLE_PER_SLICE;
              const endAngle = (i + 1) * ANGLE_PER_SLICE;
              const midAngle = startAngle + ANGLE_PER_SLICE / 2;
              const textPos = polarToCartesian(cx, cy, r * 0.65, midAngle);
              const emojiPos = polarToCartesian(cx, cy, r * 0.88, midAngle);
              const rad = ((midAngle - 90) * Math.PI) / 180;

              return (
                <g key={i}>
                  <path
                    d={slicePath(cx, cy, r, startAngle, endAngle)}
                    fill={COLORS[i % COLORS.length]}
                    stroke="#fff"
                    strokeWidth="2.5"
                  />
                  {/* 텍스트 */}
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y})`}
                    fontSize="15"
                    fontWeight="800"
                    fontFamily="Nunito, sans-serif"
                    fill={DARK_COLORS[i % DARK_COLORS.length]}
                    style={{ userSelect: "none" }}
                  >
                    {label.length > 6 ? label.slice(0, 6) + "…" : label}
                  </text>
                  {/* 장식 이모지 */}
                  <text
                    x={emojiPos.x}
                    y={emojiPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle}, ${emojiPos.x}, ${emojiPos.y})`}
                    fontSize="13"
                    style={{ userSelect: "none" }}
                  >
                    {decorEmojis[i % decorEmojis.length]}
                  </text>
                </g>
              );
            })}

            {/* 중앙 원 */}
            <circle cx={cx} cy={cy} r={innerR} fill="#fff" stroke="#FFD700" strokeWidth="4" />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="22"
              style={{ userSelect: "none" }}
            >
              🌟
            </text>
          </svg>
        </div>
      </div>

      {/* 스핀 버튼 */}
      <button
        onClick={spin}
        disabled={spinning}
        className="relative px-10 py-4 text-white font-black text-xl rounded-full cursor-pointer
          transition-all duration-200 select-none
          disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: spinning
            ? "linear-gradient(135deg, #ccc, #aaa)"
            : "linear-gradient(135deg, #FF6B9D, #FF4D6D, #C9184A)",
          boxShadow: spinning
            ? "0 4px 12px rgba(0,0,0,0.2)"
            : "0 6px 20px rgba(255, 77, 109, 0.5), 0 2px 6px rgba(0,0,0,0.2)",
          transform: spinning ? "scale(0.97)" : "scale(1)",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        {spinning ? "🌀 돌아가는 중..." : "🎯 룰렛 돌리기!"}
      </button>
    </div>
  );
}
