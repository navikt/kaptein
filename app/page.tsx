'use client';

import { Heading, VStack } from '@navikt/ds-react';
import Image from 'next/image';
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts';
import logo from './logo.png';

export default function KapteinPage() {
  return (
    <VStack align="center" justify="center" padding="8" gap="8">
      <Heading level="1" size="xlarge" className="mb-4">
        Velkommen til Kaptein
      </Heading>
      <Image src={logo} alt="Kaptein-logo" width={200} height={200} />

      <Example />
    </VStack>
  );
}

const data = [
  {
    name: 'A',
    uv: 4000,
    pv: 2400,
  },
  {
    name: 'B',
    uv: 3000,
    pv: 1398,
  },
  {
    name: 'C',
    uv: 2000,
    pv: 9800,
  },
  {
    name: 'D',
    uv: 2780,
    pv: 3908,
  },
  {
    name: 'E',
    uv: 1890,
    pv: 4800,
  },
  {
    name: 'F',
    uv: 2390,
    pv: 3800,
  },
  {
    name: 'G',
    uv: 3490,
    pv: 4300,
  },
];

const Example = () => (
  <AreaChart width={730} height={250} data={data}>
    <defs>
      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
      </linearGradient>
    </defs>

    <XAxis
      dataKey="name"
      tick={({ x, y, payload }) => (
        <text fontSize={14} textAnchor="middle" x={x} y={y + 12}>
          {payload.value}
        </text>
      )}
    />
    <YAxis
      tick={({ x, y, payload }) => (
        <text fontSize={14} textAnchor="end" x={x} y={y + 3}>
          {payload.value}
        </text>
      )}
    />

    <Tooltip />
    <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
    <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
  </AreaChart>
);
