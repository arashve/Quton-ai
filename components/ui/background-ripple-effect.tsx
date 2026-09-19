"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  rows = 8,
  cols = 27,
  cellSize = 56,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const [responsiveCols, setResponsiveCols] = useState(cols);
  const [responsiveRows, setResponsiveRows] = useState(rows);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateGridSize = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      // On mobile (e.g. 390px), neededCols will be ~7-8 instead of 34, saving 85% memory & preventing horizontal overflow
      const neededCols = Math.min(cols, Math.max(5, Math.ceil(w / cellSize)));
      const neededRows = Math.min(rows, Math.max(6, Math.ceil(h / cellSize)));
      setResponsiveCols(neededCols);
      setResponsiveRows(neededRows);
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize, { passive: true });
    return () => window.removeEventListener("resize", updateGridSize);
  }, [cols, rows, cellSize]);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 h-full w-full max-w-full overflow-hidden pointer-events-none",
        "[--cell-border-color:rgba(255,255,255,0.06)] [--cell-fill-color:transparent]",
      )}
    >
      <div className="relative h-full w-full max-w-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_25%,transparent_92%)]">
        <DivGrid
          key={`base-${rippleKey}-${responsiveCols}`}
          className="opacity-50 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_25%,black_30%,transparent_90%)]"
          rows={responsiveRows}
          cols={responsiveCols}
          cellSize={cellSize}
          borderColor="var(--cell-border-color)"
          fillColor="var(--cell-fill-color)"
          clickedCell={clickedCell}
          onCellClick={(row, col) => {
            setClickedCell({ row, col });
            setRippleKey((k) => k + 1);
          }}
          interactive={false}
        />
      </div>
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number; // in pixels
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
};

const DivGrid = ({
  className,
  rows = 7,
  cols = 30,
  cellSize = 56,
  borderColor = "rgba(255,255,255,0.06)",
  fillColor = "transparent",
  clickedCell = null,
  onCellClick = () => {},
  interactive = false,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols],
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    maxWidth: "100vw",
    height: rows * cellSize,
    marginInline: "auto",
    overflow: "hidden",
  };

  return (
    <div className={cn("relative z-[3] overflow-hidden max-w-full", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const isTarget = clickedCell?.row === rowIdx && clickedCell?.col === colIdx;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 55) : 0; // ms
        const duration = 200 + distance * 80; // ms

        const style: CellStyle = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.5px] border-white/[0.05] opacity-35 transition-opacity duration-150",
              isTarget && "will-change-transform animate-cell-ripple [animation-fill-mode:none]",
              !interactive && "pointer-events-none",
            )}
            style={{
              backgroundColor: fillColor,
              borderColor: borderColor,
              ...style,
            }}
            onClick={
              interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
            }
          />
        );
      })}
    </div>
  );
};
