'use client';

import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { PageStatus } from './types';

export interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'studio';
  status?: PageStatus;
  statusMessage?: string;
  onRetry?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: 'public' | 'studio' | 'auth';
  className?: string;
  id?: string;
}

export function PageContainer({
  children,
  maxWidth = 'xl',
  status = 'idle',
  statusMessage,
  onRetry,
  title,
  description,
  headerAction,
  variant = 'public',
  className = '',
  id,
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-xl mx-auto',
    md: 'max-w-3xl mx-auto',
    lg: 'max-w-5xl mx-auto',
    xl: 'max-w-7xl mx-auto',
    full: 'w-full',
    studio: 'w-full h-full flex flex-col',
  };

  // Safe padding rules to prevent any layout jumping with fixed headers/bottom nav:
  // Public/Auth header is h-16/h-20; Studio header is h-14/h-16
  // Mobile bottom nav is fixed 4.25rem + safe area
  const paddingClasses = {
    public:
      'pt-[calc(var(--shell-header-height,4rem)+1.25rem)] pb-[calc(var(--shell-bottom-nav-height,4.25rem)+env(safe-area-inset-bottom,0px)+1.5rem)] md:pb-12 px-4 sm:px-6 lg:px-8',
    studio:
      'pt-[calc(var(--shell-header-height,3.5rem)+0.5rem)] pb-[calc(var(--shell-bottom-nav-height,4.25rem)+env(safe-area-inset-bottom,0px))] md:pb-0 px-2 sm:px-4 h-full flex-1 overflow-hidden',
    auth:
      'pt-[calc(var(--shell-header-height,4rem)+1rem)] pb-[calc(var(--shell-bottom-nav-height,4.25rem)+env(safe-area-inset-bottom,0px)+1rem)] md:pb-8 px-4 flex items-center justify-center min-h-[100dvh]',
  };

  if (status === 'loading') {
    return (
      <div
        id={id}
        className={`w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 ${paddingClasses[variant]} ${className}`}
      >
        <div className="p-6 rounded-[28px] bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-2xl flex flex-col items-center gap-3 max-w-sm">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
          <p className="text-sm font-medium text-white">
            {statusMessage || 'Loading content...'}
          </p>
          <span className="text-xs text-zinc-400 font-mono">Connecting to AUTOFLOW engine</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        id={id}
        className={`w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 ${paddingClasses[variant]} ${className}`}
      >
        <div className="p-6 sm:p-8 rounded-[28px] bg-zinc-900/80 backdrop-blur-xl border border-red-500/20 shadow-2xl flex flex-col items-center gap-3.5 max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Error Encountered</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {statusMessage || 'An unexpected error occurred while loading this page.'}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div
        id={id}
        className={`w-full min-h-[50vh] flex flex-col items-center justify-center text-center px-4 ${paddingClasses[variant]} ${className}`}
      >
        <div className="p-6 sm:p-8 rounded-[28px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-xl flex flex-col items-center gap-3 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">No Items Found</h3>
          <p className="text-xs text-zinc-400">
            {statusMessage || 'There are no active records in this section yet.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className={`w-full min-h-full ${paddingClasses[variant]} ${className}`}>
      <div className={`${maxWidthClasses[maxWidth]} w-full`}>
        {(title || description || headerAction) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-zinc-800/60">
            <div>
              {title && (
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
