import type { ExceededFrist } from '@/components/behandlinger/use-frist-color';

export interface Serie {
  type: string;
  stack: string;
  label: {
    show: boolean;
  };
  emphasis: {
    focus: string;
  };
  name: ExceededFrist;
  color: string;
  data: (number | null)[];
}

export interface State {
  series: Serie[];
  labels: string[];
}
