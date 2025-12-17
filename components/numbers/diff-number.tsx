import type { ReactNode } from 'react';
import { numberWithSign, SignedNumber } from '@/components/numbers/sign-number';

const getColorClass = (n: number): string => (n > 0 ? 'text-ax-text-danger' : 'text-ax-text-success');

interface DiffNumberProps {
  children: number;
}

export const DiffNumber = ({ children }: DiffNumberProps): ReactNode => (
  <SignedNumber className={getColorClass(children)}>{children}</SignedNumber>
);

const getColorCssVar = (n: number): string => (n > 0 ? 'var(--ax-text-danger)' : 'var(--ax-text-success)');

export const diffNumberHtml = (n: number): string =>
  `<span style="color: ${getColorCssVar(n)}">${numberWithSign(n)}</span>`;
