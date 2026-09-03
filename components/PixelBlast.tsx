'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Effect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import './PixelBlast.css';

export type PixelBlastVariant = 'square' | 'circle' | 'triangle' | 'diamond';

export interface PixelBlastProps {
  variant?: PixelBlastVariant;
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleSpeed?: number;
  rippleThickness?: number;
  rippleIntensityScale?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  liquidWobbleSpeed?: number;
  speed?: number;
  edgeFade?: number;
  transparent?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const SHAPE_MAP: Record<PixelBlastVariant, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
};

// Touch texture generator for ripple interaction
const createTouchTexture = () => {
  const size = 64;
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) return null;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const points: { x: number; y: number; age: number; maxAge: number; force: number }[] = [];

  const addPoint = (x: number, y: number, force = 1) => {
    points.push({ x, y, age: 0, maxAge: 60, force });
  };

  const update = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, size, size);

    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      p.age++;
      if (p.age > p.maxAge) {
        points.splice(i, 1);
        continue;
      }
      const radius = (size * 0.25 * (p.age / p.maxAge)) * p.force;
      const alpha = (1 - p.age / p.maxAge) * 0.35 * p.force;

      const grad = ctx.createRadialGradient(
        p.x * size,
        p.y * size,
        0,
        p.x * size,
        p.y * size,
        Math.max(1, radius)
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x * size, p.y * size, Math.max(1, radius), 0, Math.PI * 2);
      ctx.fill();
    }
    texture.needsUpdate = true;
  };

  return { texture, addPoint, update };
};

// Custom Bayer Dithering & Shape Pixel Blast Shader Effect
const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uShapeType;
uniform float uPixelSize;
uniform float uPatternScale;
uniform float uPatternDensity;
uniform float uPixelSizeJitter;
uniform bool uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensityScale;
uniform bool uLiquid;
uniform float uLiquidStrength;
uniform float uLiquidRadius;
uniform float uLiquidWobbleSpeed;
uniform float uEdgeFade;
uniform bool uTransparent;
uniform sampler2D uTouchTexture;

// 4x4 Bayer Matrix
float bayer4(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  int idx = x + y * 4;
  if (idx == 0) return 0.0 / 16.0;
  if (idx == 1) return 8.0 / 16.0;
  if (idx == 2) return 2.0 / 16.0;
  if (idx == 3) return 10.0 / 16.0;
  if (idx == 4) return 12.0 / 16.0;
  if (idx == 5) return 4.0 / 16.0;
  if (idx == 6) return 14.0 / 16.0;
  if (idx == 7) return 6.0 / 16.0;
  if (idx == 8) return 3.0 / 16.0;
  if (idx == 9) return 11.0 / 16.0;
  if (idx == 10) return 1.0 / 16.0;
  if (idx == 11) return 9.0 / 16.0;
  if (idx == 12) return 15.0 / 16.0;
  if (idx == 13) return 7.0 / 16.0;
  if (idx == 14) return 13.0 / 16.0;
  return 5.0 / 16.0;
}

// Pseudo-random noise
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 st = uv;
  vec2 screenCoords = uv * uResolution;

  // Touch texture ripple sampling
  vec4 touch = texture2D(uTouchTexture, uv);
  float ripple = touch.r;

  // Liquid wobble distortion
  vec2 distUV = st;
  if (uLiquid) {
    float wobble = sin(uTime * uLiquidWobbleSpeed + st.y * 10.0) * uLiquidStrength * 0.05;
    distUV += vec2(wobble, cos(uTime * uLiquidWobbleSpeed + st.x * 10.0) * wobble);
  }

  // Base animated pattern coordinate
  float pSize = max(2.0, uPixelSize);
  if (uPixelSizeJitter > 0.0) {
    vec2 cell = floor(screenCoords / pSize);
    pSize += (hash21(cell) - 0.5) * uPixelSizeJitter * 4.0;
  }

  vec2 pixelatedUV = floor(screenCoords / pSize) * pSize;
  vec2 normPixel = pixelatedUV / uResolution;

  // Wave calculation
  float wave = sin(normPixel.x * uPatternScale * 6.28 + uTime * 0.8) *
               cos(normPixel.y * uPatternScale * 6.28 + uTime * 0.7);
  wave = wave * 0.5 + 0.5;

  if (uEnableRipples) {
    wave += ripple * uRippleIntensityScale;
  }

  // Threshold via Bayer matrix
  float dither = bayer4(pixelatedUV / pSize);
  float threshold = wave * uPatternDensity;
  float shapeMask = 0.0;

  // Relative coord within pixel cell [-0.5, 0.5]
  vec2 cellUV = fract(screenCoords / pSize) - 0.5;

  if (threshold > dither) {
    if (uShapeType < 0.5) {
      // Square
      shapeMask = (max(abs(cellUV.x), abs(cellUV.y)) < 0.44) ? 1.0 : 0.0;
    } else if (uShapeType < 1.5) {
      // Circle
      shapeMask = (length(cellUV) < 0.42) ? 1.0 : 0.0;
    } else if (uShapeType < 2.5) {
      // Triangle
      float d = max(abs(cellUV.x) * 0.866025 + cellUV.y * 0.5, -cellUV.y);
      shapeMask = (d < 0.35) ? 1.0 : 0.0;
    } else {
      // Diamond
      shapeMask = ((abs(cellUV.x) + abs(cellUV.y)) < 0.48) ? 1.0 : 0.0;
    }
  }

  // Edge fade
  if (uEdgeFade > 0.0) {
    float distEdge = min(min(st.x, 1.0 - st.x), min(st.y, 1.0 - st.y));
    float edgeFactor = smoothstep(0.0, uEdgeFade, distEdge);
    shapeMask *= edgeFactor;
  }

  if (uTransparent) {
    outputColor = vec4(uColor, shapeMask * 0.85);
  } else {
    vec3 col = mix(vec3(0.0), uColor, shapeMask * 0.85);
    outputColor = vec4(col, 1.0);
  }
}
`;

class PixelBlastEffect extends Effect {
  constructor(uniforms: Map<string, THREE.Uniform>) {
    super('PixelBlastEffect', fragmentShader, {
      uniforms,
    });
  }
}

export const PixelBlast: React.FC<PixelBlastProps> = ({
  variant = 'square',
  pixelSize = 4,
  color = '#d4d4d8',
  patternScale = 1.75,
  patternDensity = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleSpeed = 0.4,
  rippleThickness = 0.12,
  rippleIntensityScale = 1.5,
  liquid = false,
  liquidStrength = 0.12,
  liquidRadius = 1.2,
  liquidWobbleSpeed = 5,
  speed = 0.7,
  edgeFade = 0.25,
  transparent = true,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchTextureRef = useRef<ReturnType<typeof createTouchTexture> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      alpha: transparent,
      antialias: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (transparent) {
      renderer.setClearColor(0x000000, 0);
    }

    container.appendChild(renderer.domElement);

    const touch = createTouchTexture();
    touchTextureRef.current = touch;

    // Uniforms
    const uniforms = new Map<string, THREE.Uniform>([
      ['uTime', new THREE.Uniform(0)],
      ['uResolution', new THREE.Uniform(new THREE.Vector2(width, height))],
      ['uColor', new THREE.Uniform(new THREE.Color(color))],
      ['uShapeType', new THREE.Uniform(SHAPE_MAP[variant] ?? 0)],
      ['uPixelSize', new THREE.Uniform(pixelSize)],
      ['uPatternScale', new THREE.Uniform(patternScale)],
      ['uPatternDensity', new THREE.Uniform(patternDensity)],
      ['uPixelSizeJitter', new THREE.Uniform(pixelSizeJitter)],
      ['uEnableRipples', new THREE.Uniform(enableRipples)],
      ['uRippleSpeed', new THREE.Uniform(rippleSpeed)],
      ['uRippleThickness', new THREE.Uniform(rippleThickness)],
      ['uRippleIntensityScale', new THREE.Uniform(rippleIntensityScale)],
      ['uLiquid', new THREE.Uniform(liquid)],
      ['uLiquidStrength', new THREE.Uniform(liquidStrength)],
      ['uLiquidRadius', new THREE.Uniform(liquidRadius)],
      ['uLiquidWobbleSpeed', new THREE.Uniform(liquidWobbleSpeed)],
      ['uEdgeFade', new THREE.Uniform(edgeFade)],
      ['uTransparent', new THREE.Uniform(transparent)],
      ['uTouchTexture', new THREE.Uniform(touch ? touch.texture : null)],
    ]);

    // Composer & Effects
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const effect = new PixelBlastEffect(uniforms);
    composer.addPass(new EffectPass(camera, effect));

    let animationId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animationId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime() * speed;

      const timeUniform = uniforms.get('uTime');
      if (timeUniform) {
        timeUniform.value = elapsedTime;
      }

      if (touch) {
        touch.update();
      }

      composer.render(delta);
    };

    render();

    // Pointer event handlers for ripples
    const handlePointerMove = (e: PointerEvent) => {
      if (!touch || !enableRipples) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        touch.addPoint(x, y, 0.7);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!touch || !enableRipples) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        touch.addPoint(x, y, 1.8);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      renderer.setSize(w, h);
      composer.setSize(w, h);
      const resUniform = uniforms.get('uResolution');
      if (resUniform) {
        resUniform.value.set(w, h);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      resizeObserver.disconnect();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    variant,
    pixelSize,
    color,
    patternScale,
    patternDensity,
    pixelSizeJitter,
    enableRipples,
    rippleSpeed,
    rippleThickness,
    rippleIntensityScale,
    liquid,
    liquidStrength,
    liquidRadius,
    liquidWobbleSpeed,
    speed,
    edgeFade,
    transparent,
  ]);

  return (
    <div
      ref={containerRef}
      className={`pixel-blast-container ${className}`}
      style={style}
    />
  );
};

export default PixelBlast;
