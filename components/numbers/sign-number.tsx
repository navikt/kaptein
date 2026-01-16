import type { ReactNode } from 'react';

const sign = (n: number): string => {
  if (n > 0) {
    return '+';
  }
  if (n < 0) {
    return '-';
  }
  return '';
};

export const numberWithSign = (n: number): string => `${sign(n)}${Math.abs(n)}`;

interface SignedNumberProps {
  children: number;
  className?: string;
}

export const SignedNumber = ({ children, className }: SignedNumberProps): ReactNode => (
  <span className={className}>{numberWithSign(children)}</span>
);
