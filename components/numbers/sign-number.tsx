import type { ReactNode } from 'react';

export const numberWithSign = (n: number): string => `${sign(n)}${Math.abs(n)}`;

export const sign = (n: number): string => {
  if (n > 0) {
    return '+';
  }
  if (n < 0) {
    return '-';
  }
  return '';
};

interface SignedNumberProps {
  children: number;
  className?: string;
}

export const SignedNumber = ({ children, className }: SignedNumberProps): ReactNode => (
  <span className={className}>{numberWithSign(children)}</span>
);
