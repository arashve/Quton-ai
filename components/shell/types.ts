import React from 'react';

export type ShellVariant = 'public' | 'studio' | 'auth';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  badge?: string;
  isStudio?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
}

export interface ButtonGroupItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
}

export type PageStatus = 'idle' | 'loading' | 'error' | 'empty';

export interface StudioSession {
  id: string;
  title: string;
  timestamp?: number;
  isPinned?: boolean;
}

export interface AppShellProps {
  children: React.ReactNode;
  variant?: ShellVariant;
  activeStudioTab?: 'chat' | 'arena' | 'voice' | 'workspace';
  onStudioTabChange?: (tab: string) => void;
  showStudioSidebar?: boolean;
  studioSidebarContent?: React.ReactNode;
  hideMobileNav?: boolean;
  hideHeader?: boolean;
  headerActions?: React.ReactNode;
  className?: string;
}
