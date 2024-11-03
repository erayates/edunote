import React from "react";

const colors: string[] = [
  "bg-red-500", // Light Red
  "bg-amber-500", // Light Amber
  "bg-yellow-500", // Light Yellow
  "bg-green-500", // Light Green
  "bg-teal-500", // Light Teal
  "bg-blue-500", // Light Blue
  "bg-indigo-500", // Light Indigo
  "bg-purple-500", // Light Purple
  "bg-pink-500", // Light Pink
  "bg-fuchsia-500", // Light Fuchsia
  "bg-orange-500", // Light Orange
  "bg-lime-500", // Light Lime Green
  "bg-cyan-500", // Light Cyan
  "bg-emerald-500", // Light Emerald
  "bg-sky-500", // Light Sky Blue
  "bg-violet-500", // Light Violet
  "bg-coral-500", // Light Coral
  "bg-slate-500", // Light Slate
  "bg-gray-500", // Light Gray
  "bg-rose-500", // Light Rose
  "bg-amber-500", // Very Light Amber
  "bg-green-500", // Very Light Green
  "bg-blue-500", // Very Light Blue
  "bg-purple-500", // Very Light Purple
  "bg-pink-500", // Very Light Pink
  "bg-orange-500", // Very Light Orange
  "bg-teal-500", // Very Light Teal
  "bg-lime-500", // Very Light Lime Green
  "bg-cyan-500", // Very Light Cyan
  "bg-red-500", // Very Light Red
  "bg-purple-500", // Pastel Purple
];

export const colorPicker = (tag: string): string => {
  let sum = 0;

  const maxLength = Math.min(tag.length, 10);

  for (let i = 0; i < maxLength; i++) {
    sum += tag.charCodeAt(i);
  }

  const colorIndex = sum % colors.length;

  return colors[colorIndex];
};

// Example component
const Tag = ({ tag }: { tag: string }) => {
  const tagColor = colorPicker(tag);

  return (
    <div
      className={`text-[9px] text-white/70 font-semibold  px-2 py-1 rounded-full ${tagColor}`}
    >
      {tag.length > 20 ? tag.slice(0, 20) + "..." : tag}
    </div>
  );
};

export default Tag;
