'use client';

import React from 'react';

export interface SectionCardProps {
  children: React.ReactNode;
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  headerIcon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  variant?: 'glass' | 'solid' | 'subtle' | 'ghost';
  radius?: 'default' | 'lg' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
}

export function SectionCard({
  children,
  id,
  title,
  description,
  action,
  headerIcon: HeaderIcon,
  badge,
  variant = 'glass',
  radius = 'default',
  padding = 'md',
  className = '',
}: SectionCardProps) {
  const variantStyles = {
    glass: 'bg-zinc-900/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/10 dark:border-white/10 shadow-2xl',
    solid: 'bg-zinc-900 border border-zinc-800 shadow-xl',
    subtle: 'bg-zinc-900/30 border border-zinc-800/60',
    ghost: 'bg-transparent border border-zinc-800/40',
  };

  const radiusStyles = {
    default: 'rounded-[28px]',
    lg: 'rounded-[32px]',
    full: 'rounded-[36px]',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-7',
    lg: 'p-8 sm:p-10',
  };

  const hasHeader = Boolean(title || description || action || HeaderIcon || badge);

  return (
    <div
      id={id}
      className={`relative overflow-hidden transition-all text-zinc-100 ${variantStyles[variant]} ${radiusStyles[radius]} ${paddingStyles[padding]} ${className}`}
    >
      {hasHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-zinc-800/60">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            {HeaderIcon && (
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white/10 border border-white/10 text-white shrink-0">
                <HeaderIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {title && (
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                    {title}
                  </h3>
                )}
                {badge && (
                  <div className="shrink-0">{badge}</div>
                )}
              </div>
              {description && (
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
}
