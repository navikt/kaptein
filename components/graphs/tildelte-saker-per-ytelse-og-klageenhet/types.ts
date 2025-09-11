export interface Serie {
  type: string;
  stack: string;
  label: {
    show: boolean;
  };
  emphasis: {
    focus: string;
  };
  name: string;
  data: (number | null)[];
}

export interface State {
  series: Serie[];
  labels: string[];
}
