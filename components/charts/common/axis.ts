export interface YAxis {
  axisDimension: 'y';
  axisIndex: 1;
  value: number;
}

export interface XAxis {
  axisDimension: 'x';
  axisIndex: 0;
  value: string;
}

export type Axis = YAxis | XAxis;
