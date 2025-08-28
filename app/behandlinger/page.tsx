import { EChart } from '@/lib/echarts/echarts';
import { getBehandlinger, getSakstyper } from '@/lib/server/api';
import { Sakstype } from '@/lib/server/types';

export default async function Page() {
  const behandlinger = await getBehandlinger();
  const sakstyper = await getSakstyper();

  const data = Object.values(
    Object.fromEntries(
      behandlinger.anonymizedBehandlingList
        .filter(
          (b) =>
            b.typeId !== Sakstype.ANKE_I_TRYGDERETTEN && !b.isAvsluttetAvSaksbehandler && b.feilregistrering === null,
        )
        .reduce<Map<Sakstype, { value: number; name: string }>>((acc, curr) => {
          const existing = acc.get(curr.typeId);

          if (existing) {
            existing.value += 1;
          } else {
            acc.set(curr.typeId, {
              name: sakstyper.find((s) => s.id === curr.typeId)?.navn ?? (curr.typeId || curr.typeId),
              value: 1,
            });
          }
          return acc;
        }, new Map()),
    ),
  );

  return (
    <div className="grow">
      <EChart
        option={{
          title: {
            text: 'Aktive saker',
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
              type: 'pie',
              radius: '50%',
              data,
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
    </div>
  );
}
