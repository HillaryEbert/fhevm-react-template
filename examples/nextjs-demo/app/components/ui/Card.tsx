/**
 * Card Component
 * Reusable card component for content containers
 */

'use client';

import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'error' | 'info';
}

export default function Card({
  title,
  children,
  className = '',
  variant = 'default',
}: CardProps) {
  const variantClasses = {
    default: 'bg-white/10 border-white/20',
    success: 'bg-green-500/10 border-green-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    info: 'bg-blue-500/10 border-blue-500/30',
  };

  return (
    <div
      className={`backdrop-blur-sm rounded-2xl p-8 border ${variantClasses[variant]} ${className}`}
    >
      {title && (
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      )}
      {children}
    </div>
  );
}
