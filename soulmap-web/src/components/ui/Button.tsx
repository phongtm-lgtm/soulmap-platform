import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional accent color that overrides the primary background (used by per-journey CTAs). */
  accentColor?: string;
  fullWidth?: boolean;
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-bold ' +
  'transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24533E]/25';

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'text-white bg-[#24533E] shadow-[0_12px_26px_-12px_rgba(33,77,59,0.55)] ' +
    'hover:bg-[#214D3B] hover:-translate-y-0.5',
  secondary:
    'text-[#214D3B] bg-[#FFFDF8] border border-[#E8DFCF] shadow-sm ' +
    'hover:border-[#B68A2F] hover:-translate-y-0.5',
  ghost:
    'text-[#24533E] bg-transparent hover:bg-[#24533E]/5',
};

/**
 * Shared primary/secondary/ghost button. Single source of truth for CTA styling
 * so color / radius / shadow stop drifting across screens.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  accentColor,
  fullWidth = false,
  className = '',
  style,
  children,
  ...rest
}: ButtonProps) {
  const accentStyle =
    accentColor && variant === 'primary' ? { backgroundColor: accentColor, ...style } : style;

  return (
    <button
      className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={accentStyle}
      {...rest}
    >
      {children}
    </button>
  );
}
