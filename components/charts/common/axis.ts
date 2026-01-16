interface YAxis {
  axisDimension: 'y';
  axisIndex: 1;
  value: number;
}

interface XAxis {
  axisDimension: 'x';
  axisIndex: 0;
  value: string;
}

export type Axis = YAxis | XAxis;
