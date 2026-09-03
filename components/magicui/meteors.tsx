"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors: React.FC<MeteorsProps> = ({ number = 20, className }) => {
  const [meteorStyles] = useState<Array<React.CSSProperties>>(() => {
    return [...new Array(number)].map(() => ({
      top: -5,
      left: Math.floor(Math.random() * 100) + "%",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 4) + "s",
    }));
  });

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          style={style}
          className={cn(
            "pointer-events-none absolute size-0.5 rotate-[215deg] animate-meteor rounded-full bg-slate-400 shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:transform before:-translate-y-1/2 before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
        />
      ))}
    </>
  );
};
