'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

interface CircuitNode {
  x: number;
  y: number;
  radius: number;
  label?: string;
  type: 'core' | 'synapse' | 'memory' | 'gateway';
  pulse: number;
  pulseSpeed: number;
  color: string;
}

interface CircuitPath {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  active: boolean;
  pulseOffset: number;
}

interface DataPacket {
  pathIndex: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
}

interface AiCircuitMatrixProps {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}

export const AiCircuitMatrix: React.FC<AiCircuitMatrixProps> = ({
  className = '',
  intensity = 1,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [activeTelemetry, setActiveTelemetry] = useState({
    activeSynapses: 1048576,
    throughput: '4.8 TB/s',
    tensorEfficiency: '99.4%',
    cycleLatency: '0.14 ms',
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    let nodes: CircuitNode[] = [];
    let paths: CircuitPath[] = [];
    let packets: DataPacket[] = [];

    const initNetwork = (w: number, h: number) => {
      nodes = [];
      paths = [];
      packets = [];

      if (w <= 10 || h <= 10) return;

      const centerX = w / 2;
      const centerY = h / 2;

      // Central Quantum Core Node
      nodes.push({
        x: centerX,
        y: centerY,
        radius: Math.max(12, Math.min(w, h) * 0.055),
        type: 'core',
        label: 'TENSOR-CORE-01',
        pulse: 0,
        pulseSpeed: 0.025,
        color: '#06B6D4',
      });

      // Layer 1 - Inner Ring Nodes (8 directions)
      const innerRadius = Math.min(w, h) * 0.16;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const nx = centerX + Math.cos(angle) * innerRadius;
        const ny = centerY + Math.sin(angle) * innerRadius;
        nodes.push({
          x: nx,
          y: ny,
          radius: 5,
          type: 'synapse',
          label: `SYN_0${i + 1}`,
          pulse: Math.random() * Math.PI,
          pulseSpeed: 0.02 + Math.random() * 0.02,
          color: i % 2 === 0 ? '#38BDF8' : '#818CF8',
        });

        // Path from core to inner node (with 45 deg or direct bend)
        const midX = (centerX + nx) / 2;
        const midY = (centerY + ny) / 2;
        paths.push({
          points: [
            { x: centerX, y: centerY },
            { x: (i % 2 === 0) ? midX : centerX, y: (i % 2 === 0) ? centerY : midY },
            { x: nx, y: ny },
          ],
          color: i % 2 === 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(139, 92, 246, 0.4)',
          width: 1.8,
          active: true,
          pulseOffset: Math.random(),
        });
      }

      // Layer 2 - Outer Distributed PCB Circuit Network
      const outerRadius = Math.min(w, h) * 0.35;
      const numOuterNodes = 16;
      for (let i = 0; i < numOuterNodes; i++) {
        const angle = (i * 2 * Math.PI) / numOuterNodes;
        const distanceJitter = outerRadius * (0.85 + (i % 3) * 0.15);
        const nx = centerX + Math.cos(angle) * distanceJitter;
        const ny = centerY + Math.sin(angle) * distanceJitter;

        const nodeType: CircuitNode['type'] = i % 4 === 0 ? 'memory' : 'gateway';
        nodes.push({
          x: nx,
          y: ny,
          radius: nodeType === 'memory' ? 6 : 4,
          type: nodeType,
          label: `NODE_${i.toString(16).toUpperCase()}`,
          pulse: Math.random() * Math.PI,
          pulseSpeed: 0.015 + Math.random() * 0.02,
          color: nodeType === 'memory' ? '#A855F7' : '#06B6D4',
        });

        // Connect to nearest inner node using orthogonal PCB traces (manhattan / 45-deg routing)
        const innerNodeIndex = 1 + (i % 8);
        const innerNode = nodes[innerNodeIndex];
        if (innerNode) {
          const bendX = (i % 2 === 0) ? nx : innerNode.x;
          const bendY = (i % 2 === 0) ? innerNode.y : ny;

          paths.push({
            points: [
              { x: innerNode.x, y: innerNode.y },
              { x: bendX, y: bendY },
              { x: nx, y: ny },
            ],
            color: (i % 3 === 0) ? 'rgba(168, 85, 247, 0.35)' : 'rgba(56, 189, 248, 0.35)',
            width: 1.4,
            active: true,
            pulseOffset: Math.random(),
          });
        }

        // Add cross-bus circuit tracks across adjacent outer nodes
        if (i > 0 && i % 2 === 0) {
          const prevOuter = nodes[nodes.length - 2];
          paths.push({
            points: [
              { x: prevOuter.x, y: prevOuter.y },
              { x: nx, y: prevOuter.y },
              { x: nx, y: ny },
            ],
            color: 'rgba(255, 255, 255, 0.15)',
            width: 1.0,
            active: false,
            pulseOffset: Math.random(),
          });
        }
      }

      // Generate Data Packets moving along circuit tracks
      const totalPackets = Math.floor(paths.length * 2.5);
      for (let i = 0; i < totalPackets; i++) {
        packets.push({
          pathIndex: Math.floor(Math.random() * paths.length),
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.006,
          size: 2.2 + Math.random() * 2.2,
          color: Math.random() > 0.4 ? '#38BDF8' : '#C084FC',
        });
      }
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = Math.max(0, rect.width);
      height = Math.max(0, rect.height);

      if (width <= 10 || height <= 10) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNetwork(width, height);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Mouse tracking for interactivity
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Helper to get point on multi-segment path
    const getPointOnPath = (path: CircuitPath, progress: number) => {
      const pts = path.points;
      if (pts.length < 2) return pts[0] || { x: 0, y: 0 };

      // Calculate segment lengths
      let totalDist = 0;
      const segmentDists: number[] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const dx = pts[i + 1].x - pts[i].x;
        const dy = pts[i + 1].y - pts[i].y;
        const dist = Math.hypot(dx, dy);
        segmentDists.push(dist);
        totalDist += dist;
      }

      if (totalDist === 0) return pts[0];

      const targetDist = progress * totalDist;
      let accumulated = 0;
      for (let i = 0; i < segmentDists.length; i++) {
        const dist = segmentDists[i];
        if (accumulated + dist >= targetDist || i === segmentDists.length - 1) {
          const segProgress = dist > 0 ? (targetDist - accumulated) / dist : 0;
          return {
            x: pts[i].x + (pts[i + 1].x - pts[i].x) * segProgress,
            y: pts[i].y + (pts[i + 1].y - pts[i].y) * segProgress,
          };
        }
        accumulated += dist;
      }
      return pts[pts.length - 1];
    };

    let tick = 0;

    // Main 60FPS render loop
    const render = () => {
      tick++;

      if (width <= 10 || height <= 10) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Cybernetic Hex / Orthogonal Grid Background
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Concentric Radar Rings & Core Field
      ctx.save();
      const ringCount = 4;
      for (let r = 1; r <= ringCount; r++) {
        const radius = Math.max(1, (Math.min(width, height) * 0.12 * r) + Math.sin(tick * 0.02 + r) * 2);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0.01, 0.08 - r * 0.015)})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
      }
      ctx.restore();

      // Mouse influence position
      const mouse = mouseRef.current;

      // 3. Render Circuit Paths & Traces
      paths.forEach((path) => {
        if (path.points.length < 2) return;

        // Trace glow check
        let isNearMouse = false;
        if (mouse.active) {
          const midPt = path.points[Math.floor(path.points.length / 2)];
          if (midPt) {
            const mDist = Math.hypot(mouse.x - midPt.x, mouse.y - midPt.y);
            if (mDist < 120) isNearMouse = true;
          }
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }

        ctx.strokeStyle = isNearMouse
          ? 'rgba(6, 182, 212, 0.75)'
          : path.color;
        ctx.lineWidth = isNearMouse ? path.width * 1.8 : path.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer glow
        if (isNearMouse || path.active) {
          ctx.shadowColor = isNearMouse ? '#38BDF8' : 'rgba(56, 189, 248, 0.4)';
          ctx.shadowBlur = isNearMouse ? 14 : 6;
        }

        ctx.stroke();
        ctx.restore();
      });

      // 4. Render Data Packets traveling along traces
      packets.forEach((packet) => {
        packet.progress += packet.speed;
        if (packet.progress >= 1) {
          packet.progress = 0;
          packet.pathIndex = Math.floor(Math.random() * paths.length);
        }

        const currentPath = paths[packet.pathIndex];
        if (!currentPath) return;

        const pos = getPointOnPath(currentPath, packet.progress);

        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, Math.max(0.5, packet.size), 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.shadowColor = packet.color;
        ctx.shadowBlur = 12;
        ctx.fill();

        // Trail effect
        const prevPos = getPointOnPath(currentPath, Math.max(0, packet.progress - 0.04));
        ctx.beginPath();
        ctx.moveTo(prevPos.x, prevPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = packet.color;
        ctx.lineWidth = packet.size * 0.8;
        ctx.globalAlpha = 0.5;
        ctx.stroke();

        ctx.restore();
      });

      // 5. Render Circuit Nodes & Silicon Microchips
      nodes.forEach((node) => {
        node.pulse += node.pulseSpeed;
        const currentPulse = (Math.sin(node.pulse) + 1) / 2;

        let isNearMouse = false;
        if (mouse.active) {
          const dist = Math.hypot(mouse.x - node.x, mouse.y - node.y);
          if (dist < 80) isNearMouse = true;
        }

        ctx.save();

        if (node.type === 'core') {
          // Central Microprocessor Die (High-Tech Square Chip with Chamfered Corners)
          const chipSize = node.radius * 2;
          const halfSize = chipSize / 2;

          // Outer Silicon Ground Ring
          ctx.shadowColor = '#06B6D4';
          ctx.shadowBlur = isNearMouse ? 32 : 18;
          ctx.fillStyle = 'rgba(8, 15, 30, 0.92)';
          ctx.strokeStyle = isNearMouse ? '#38BDF8' : '#06B6D4';
          ctx.lineWidth = 2.5;

          ctx.beginPath();
          ctx.roundRect(node.x - halfSize, node.y - halfSize, chipSize, chipSize, 14);
          ctx.fill();
          ctx.stroke();

          // Silicon Die Pins (Gold / Cyan contacts around edges)
          ctx.fillStyle = '#38BDF8';
          const pinCount = 6;
          const pinSpacing = chipSize / (pinCount + 1);
          for (let p = 1; p <= pinCount; p++) {
            const offset = -halfSize + p * pinSpacing;
            // Top and bottom pins
            ctx.fillRect(node.x + offset - 1.5, node.y - halfSize - 5, 3, 5);
            ctx.fillRect(node.x + offset - 1.5, node.y + halfSize, 3, 5);
            // Left and right pins
            ctx.fillRect(node.x - halfSize - 5, node.y + offset - 1.5, 5, 3);
            ctx.fillRect(node.x + halfSize, node.y + offset - 1.5, 5, 3);
          }

          // Inner Heatspreader Circuit pattern
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(node.x - halfSize + 8, node.y - halfSize + 8, chipSize - 16, chipSize - 16);

          // Central Pulsing Core Hologram
          const coreGlow = (Math.sin(tick * 0.05) + 1) / 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, Math.max(2, 14 + coreGlow * 4), 0, Math.PI * 2);
          ctx.fillStyle = isNearMouse ? '#38BDF8' : '#06B6D4';
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 20;
          ctx.fill();

          // Core Crosshair Lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(node.x - 18, node.y);
          ctx.lineTo(node.x + 18, node.y);
          ctx.moveTo(node.x, node.y - 18);
          ctx.lineTo(node.x, node.y + 18);
          ctx.stroke();

        } else {
          // Peripheral Synaptic Nodes & Memory Blocks
          const nodeRadius = Math.max(1, isNearMouse ? node.radius * 1.6 : node.radius);

          // Pulse Halo
          ctx.beginPath();
          ctx.arc(node.x, node.y, Math.max(1, nodeRadius + currentPulse * 6), 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = 0.15 + currentPulse * 0.2;
          ctx.fill();

          // Solid Core Node
          ctx.globalAlpha = 1.0;
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = isNearMouse ? '#FFFFFF' : node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = isNearMouse ? 16 : 8;
          ctx.fill();

          // Small Technical Label for Memory & Gateway nodes
          if (node.label && (node.type === 'memory' || isNearMouse)) {
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.fillText(node.label, node.x + 10, node.y + 3);
          }
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Occasional subtle jitter in telemetry for lively realism
    const interval = setInterval(() => {
      setActiveTelemetry((prev) => ({
        ...prev,
        throughput: `${(4.6 + Math.random() * 0.5).toFixed(1)} TB/s`,
        cycleLatency: `${(0.12 + Math.random() * 0.04).toFixed(2)} ms`,
      }));
    }, 2400);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(interval);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [intensity, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#030712] select-none ${className}`}
    >
      {/* 2D Circuit Engine Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />

      {/* Cyberpunk Radial Vignette & Aurora Lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(3,7,18,0.75)_75%,#030712_100%)]" />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Realtime Cybernetic HUD Telemetry Overlays */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none flex flex-col gap-1.5 font-mono text-[11px] text-cyan-400/80">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/20 w-fit">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="tracking-wider uppercase font-semibold">NEURAL SYNAPSE MATRIX ACTIVE</span>
        </div>
        <div className="text-white/40 text-[10px] pl-2">
          LATENCY: {activeTelemetry.cycleLatency} {'//'} IO: {activeTelemetry.throughput}
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10 pointer-events-none hidden sm:flex flex-col items-end gap-1 font-mono text-[11px] text-purple-400/80">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-purple-500/20">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>TENSOR EFFICIENCY: {activeTelemetry.tensorEfficiency}</span>
        </div>
        <div className="text-white/40 text-[10px] pr-2">
          SYNAPSE NODES: {activeTelemetry.activeSynapses.toLocaleString()}
        </div>
      </div>

      {/* Bottom Floating Architecture Badges */}
      <div className="absolute bottom-6 inset-x-6 z-10 pointer-events-none flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-white/40 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/5">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span>AUTOFLOW//NPU-MATRIX-v4.9</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            ZERO-LOSS INTERCONNECT
          </span>
        </div>
      </div>
    </div>
  );
};

export default AiCircuitMatrix;
