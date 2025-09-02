'use client';

import { BoxNew, Heading, VStack } from '@navikt/ds-react';
import Image from 'next/image';
import { EChart } from '@/lib/echarts/echarts';
import logo from './logo.png';

export default function KapteinPage() {
  return (
    <BoxNew padding="4" width="100%" height="100vh">
      <VStack align="center" justify="center" padding="8" gap="8" height="100%">
        <Heading level="1" size="xlarge" className="mb-4">
          Velkommen til Kaptein
        </Heading>
        <Image src={logo} alt="Kaptein-logo" width={200} height={200} />

        <EChart
          option={{
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
              },
            ],
          }}
        />

        <EChart
          option={{
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
              },
            },
            legend: {},
            xAxis: {
              type: 'value',
            },
            yAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            series: [
              {
                name: 'Direct',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true,
                },
                emphasis: {
                  focus: 'series',
                },
                data: [320, 302, 301, 334, 390, 330, 320],
              },
              {
                name: 'Mail Ad',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true,
                },
                emphasis: {
                  focus: 'series',
                },
                data: [120, 132, 101, 134, 90, 230, 210],
              },
              {
                name: 'Affiliate Ad',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true,
                },
                emphasis: {
                  focus: 'series',
                },
                data: [220, 182, 191, 234, 290, 330, 310],
              },
              {
                name: 'Video Ad',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true,
                },
                emphasis: {
                  focus: 'series',
                },
                data: [150, 212, 201, 154, 190, 330, 410],
              },
              {
                name: 'Search Engine',
                type: 'bar',
                stack: 'total',
                label: {
                  show: true,
                },
                emphasis: {
                  focus: 'series',
                },
                data: [820, 832, 901, 934, 1290, 1330, 1320],
              },
            ],
          }}
        />

        <EChart
          option={{
            title: {
              text: 'Stacked Line',
            },
            tooltip: {
              trigger: 'axis',
            },
            legend: {
              data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                name: 'Email',
                type: 'line',
                stack: 'Total',
                data: [120, 132, 101, 134, 90, 230, 210],
              },
              {
                name: 'Union Ads',
                type: 'line',
                stack: 'Total',
                data: [220, 182, 191, 234, 290, 330, 310],
              },
              {
                name: 'Video Ads',
                type: 'line',
                stack: 'Total',
                data: [150, 232, 201, 154, 190, 330, 410],
              },
              {
                name: 'Direct',
                type: 'line',
                stack: 'Total',
                data: [320, 332, 301, 334, 390, 330, 320],
              },
              {
                name: 'Search Engine',
                type: 'line',
                stack: 'Total',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
              },
            ],
          }}
        />

        <EChart
          option={{
            title: {
              text: 'Referer of a Website',
              subtext: 'Fake Data',
              left: 'center',
            },
            tooltip: {
              trigger: 'item',
            },
            legend: {
              orient: 'vertical',
              left: 'left',
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: 1048, name: 'Search Engine' },
                  { value: 735, name: 'Direct' },
                  { value: 580, name: 'Email' },
                  { value: 484, name: 'Union Ads' },
                  { value: 300, name: 'Video Ads' },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
              },
            ],
          }}
        />
      </VStack>
    </BoxNew>
  );
}
