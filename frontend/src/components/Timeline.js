import React from "react";
import TimelineCard from "./TimelineCard";

export default function Timeline({ items = [], currentUser }) {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto max-h-screen px-4 py-6">
      {items.map((item) => (
        <TimelineCard
          key={`item-${item.id}-${item.status}`}
          item={item}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}
