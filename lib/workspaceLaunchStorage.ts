'use client';

export type WorkspacePlan = 'Free' | 'Pro';

export type AuroraPreset =
  | 'nebula-purple'
  | 'cyber-cyan'
  | 'quantum-emerald'
  | 'sunset-amber'
  | 'obsidian-apple';

export type GlassStyle = 'frosted' | 'acrylic' | 'minimal';
export type UiDensity = 'spacious' | 'compact';
export type AccentColor = 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose';
export type AgentEngine = 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'claude-3.7-sonnet' | 'gpt-4o';

export interface WorkspaceLaunchConfig {
  // Plan
  plan: WorkspacePlan;

  // Profile details (from image)
  fullName: string;
  jobTitle: string;
  timezone: string;
  avatarUrl: string;
  avatarPreset: string;
  receiveUpdates: boolean;

  // Workspace metadata
  workspaceName: string;
  workspaceDomain: string;

  // Pro customization toggle ('default' | 'custom')
  uiCustomizationMode: 'default' | 'custom';

  // Pro UI customization tokens
  auroraPreset: AuroraPreset;
  glassStyle: GlassStyle;
  uiDensity: UiDensity;
  accentColor: AccentColor;
  agentEngine: AgentEngine;
  telemetryStream: boolean;

  // Status
  isConfigured: boolean;
  lastUpdated: string;
}

export const TIMEZONE_OPTIONS = [
  { id: 'Europe/Berlin', label: 'Berlin (GMT+1)', offsetHours: 1 },
  { id: 'America/Los_Angeles', label: 'San Francisco (GMT-7)', offsetHours: -7 },
  { id: 'America/New_York', label: 'New York (GMT-4)', offsetHours: -4 },
  { id: 'Europe/London', label: 'London (GMT+0)', offsetHours: 0 },
  { id: 'Asia/Tehran', label: 'Tehran (GMT+3:30)', offsetHours: 3.5 },
  { id: 'Asia/Dubai', label: 'Dubai (GMT+4)', offsetHours: 4 },
  { id: 'Asia/Tokyo', label: 'Tokyo (GMT+9)', offsetHours: 9 },
  { id: 'Asia/Singapore', label: 'Singapore (GMT+8)', offsetHours: 8 },
  { id: 'Australia/Sydney', label: 'Sydney (GMT+10)', offsetHours: 10 },
];

export const AVATAR_PRESETS = [
  {
    id: 'memoji-tech',
    label: 'Tech Lead',
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    iconText: '⚡',
  },
  {
    id: 'memoji-ai',
    label: 'AI Researcher',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    iconText: '🧠',
  },
  {
    id: 'memoji-design',
    label: 'Interaction Architect',
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
    iconText: '✦',
  },
  {
    id: 'memoji-quant',
    label: 'Data Systems',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    iconText: '⌘',
  },
  {
    id: 'memoji-solar',
    label: 'Growth Founder',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    iconText: '✹',
  },
  {
    id: 'memoji-minimal',
    label: 'Obsidian Minimalist',
    gradient: 'from-zinc-700 via-zinc-800 to-zinc-950',
    iconText: '◈',
  },
];

export const AURORA_PRESETS_META: Record<
  AuroraPreset,
  {
    name: string;
    description: string;
    previewGlow: string;
    blob1: string;
    blob2: string;
    blob3: string;
    borderGlow: string;
  }
> = {
  'nebula-purple': {
    name: 'Nebula Violet',
    description: 'Deep cosmic violet with soft peach aura',
    previewGlow: 'from-violet-600 to-fuchsia-500',
    blob1: 'bg-purple-600/20',
    blob2: 'bg-fuchsia-600/15',
    blob3: 'bg-indigo-600/15',
    borderGlow: 'rgba(168, 85, 247, 0.25)',
  },
  'cyber-cyan': {
    name: 'Cyber Cobalt',
    description: 'Electric cyan with deep ocean cobalt aura',
    previewGlow: 'from-cyan-400 to-blue-600',
    blob1: 'bg-cyan-500/20',
    blob2: 'bg-blue-600/15',
    blob3: 'bg-teal-500/15',
    borderGlow: 'rgba(6, 182, 212, 0.25)',
  },
  'quantum-emerald': {
    name: 'Quantum Mint',
    description: 'High-frequency emerald with soft jade aura',
    previewGlow: 'from-emerald-400 to-teal-600',
    blob1: 'bg-emerald-500/20',
    blob2: 'bg-teal-600/15',
    blob3: 'bg-cyan-600/15',
    borderGlow: 'rgba(16, 185, 129, 0.25)',
  },
  'sunset-amber': {
    name: 'Solar Amber',
    description: 'Warm dusk amber with rose gold aura',
    previewGlow: 'from-amber-400 to-rose-600',
    blob1: 'bg-amber-500/20',
    blob2: 'bg-rose-600/15',
    blob3: 'bg-orange-600/15',
    borderGlow: 'rgba(245, 158, 11, 0.25)',
  },
  'obsidian-apple': {
    name: 'Obsidian Pure',
    description: 'Cupertino monochrome stealth with pure black depth',
    previewGlow: 'from-zinc-500 to-zinc-800',
    blob1: 'bg-zinc-700/20',
    blob2: 'bg-zinc-800/15',
    blob3: 'bg-zinc-900/15',
    borderGlow: 'rgba(255, 255, 255, 0.1)',
  },
};

export const DEFAULT_WORKSPACE_CONFIG: WorkspaceLaunchConfig = {
  plan: 'Pro',
  fullName: 'Sam Rivera',
  jobTitle: 'Product Engineer',
  timezone: 'Europe/Berlin',
  avatarUrl: '',
  avatarPreset: 'memoji-tech',
  receiveUpdates: true,
  workspaceName: 'Autonomous Cloud Engineering Lab',
  workspaceDomain: 'engineering',
  uiCustomizationMode: 'custom',
  auroraPreset: 'nebula-purple',
  glassStyle: 'frosted',
  uiDensity: 'spacious',
  accentColor: 'purple',
  agentEngine: 'gemini-2.5-pro',
  telemetryStream: true,
  isConfigured: true,
  lastUpdated: new Date().toISOString(),
};

const STORAGE_KEY = 'quton_workspace_launch_config';

export function getWorkspaceLaunchConfig(): WorkspaceLaunchConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_WORKSPACE_CONFIG;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_WORKSPACE_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_WORKSPACE_CONFIG, ...parsed };
  } catch {
    return DEFAULT_WORKSPACE_CONFIG;
  }
}

export function saveWorkspaceLaunchConfig(config: WorkspaceLaunchConfig): void {
  if (typeof window === 'undefined') return;
  try {
    const updated = {
      ...config,
      isConfigured: true,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('workspace-config-updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to save workspace config:', err);
  }
}

export function resetWorkspaceLaunchConfig(): WorkspaceLaunchConfig {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('workspace-config-updated', { detail: DEFAULT_WORKSPACE_CONFIG }));
  }
  return DEFAULT_WORKSPACE_CONFIG;
}
