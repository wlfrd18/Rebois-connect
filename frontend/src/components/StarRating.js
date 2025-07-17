import React, { useState } from "react";

export default function StarRating({ rating, onChange, precision = 0.1, size = 16 }) {
  const [hoverValue, setHoverValue] = useState(null);
  const starCount = 5;

  const getFill = (index) => {
    const value = hoverValue !== null ? hoverValue : rating;
    const diff = value - index;
    if (diff >= 1) return 1;
    if (diff <= 0) return 0;
    return Math.round(diff / precision) * precision;
  };

  const handleClick = (index, event) => {
    if (!onChange) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;
    const newRating = Math.min(starCount, index + percent);
    const roundedRating = Math.round(newRating / precision) * precision;
    onChange(roundedRating);
  };

  return (
    <div style={{ 
      display: "flex", 
      gap: 2,
      cursor: onChange ? "pointer" : "default",
      pointerEvents: onChange ? "auto" : "none"
    }}>
      {[...Array(starCount)].map((_, i) => {
        const fill = getFill(i);
        return (
          <svg
            key={i}
            onClick={onChange ? (e) => handleClick(i, e) : undefined}
            onMouseMove={onChange ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percent = x / rect.width;
              setHoverValue(Math.min(starCount, i + percent));
            } : undefined}
            onMouseLeave={onChange ? () => setHoverValue(null) : undefined}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="goldenrod"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset={`${fill * 100}%`} stopColor="goldenrod" />
                <stop offset={`${fill * 100}%`} stopColor="lightgray" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#grad-${i})`}
              d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22
                 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
            />
          </svg>
        );
      })}
    </div>
  );
}