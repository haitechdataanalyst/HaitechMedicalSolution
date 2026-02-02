"use client";

import { useState } from "react";
import Image from "next/image";
import { Frame } from "@/types";

// Color swatch component for displaying frame colors
function ColorSwatch({ hex, name, isSelected, onClick }: { hex: string | string[]; name: string; isSelected: boolean; onClick: () => void }) {
  const isGradient = Array.isArray(hex);

  const style = isGradient
    ? {
        background: `linear-gradient(135deg, ${hex[0]} 50%, ${hex[1]} 50%)`,
      }
    : { backgroundColor: hex };

  return (
    <button onClick={onClick} className="flex cursor-pointer flex-col items-center gap-1" title={name}>
      <div className={`h-8 w-8 rounded-full border-2 shadow-sm transition-all hover:scale-110 ${isSelected ? "border-primary-600 ring-primary-200 ring-2" : "border-gray-200"}`} style={style} />
      <span className={`text-xs transition-colors ${isSelected ? "text-primary-600 font-medium" : "text-gray-500"}`}>{name}</span>
    </button>
  );
}

export function FrameCard({ frame }: { frame: Frame }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const selectedColor = frame.colors[selectedColorIndex];

  // Use the color-specific image if available, otherwise use the default frame image
  const displayImage = selectedColor?.image || frame.image;

  const handleColorClick = (index: number) => {
    setSelectedColorIndex(index);
  };

  return (
    <div className="group h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
      {/* Frame Image */}
      <div className="relative mb-6 aspect-4/3 w-full overflow-hidden rounded-xl">
        <Image
          src={displayImage}
          alt={`${frame.name} frame in ${selectedColor?.name || "default"}`}
          fill
          className="object-contain p-4 transition-all duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Frame Name */}
      <h3 className="mb-4 text-center text-2xl font-semibold text-gray-900">{frame.name}</h3>

      {/* Color Swatches */}
      <div className="mb-4">
        {/* <p className="mb-3 text-center text-sm font-medium text-gray-600">Available Colors</p> */}
        <div className="flex flex-wrap justify-center gap-3">
          {frame.colors.map((color, index) => (
            <ColorSwatch key={color.id} hex={color.hex} name={color.name} isSelected={index === selectedColorIndex} onClick={() => handleColorClick(index)} />
          ))}
        </div>
      </div>

      {/* Price modifier if any */}
      {/* {frame.priceModifier > 0 && (
        <p className="text-center text-sm text-gray-500">
          +₹{frame.priceModifier.toLocaleString()} upgrade
        </p>
      )} */}
    </div>
  );
}
