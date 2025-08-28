import { EChart } from '@/lib/echarts/echarts';
import { getBehandlinger, getKodeverk } from '@/lib/server/api';
import { Sakstype } from '@/lib/server/types';

type Data = { value: number; name: string; id: string };

export default async function Page() {
  const behandlinger = await getBehandlinger();
  const sakstyper = await getKodeverk('sakstyper');

  console.log(sakstyper);

  const data: Data[] = behandlinger.anonymizedBehandlingList
    .filter(
      (b) => b.typeId !== Sakstype.ANKE_I_TRYGDERETTEN && !b.isAvsluttetAvSaksbehandler && b.feilregistrering === null,
    )
    .reduce<Data[]>((acc, b) => {
      const existing = acc.find((item) => item.id === b.typeId);

      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: b.typeId, value: 1, id: b.id });
      }
      return acc;
    }, []);

  return (
    <div className="grow">
      <EChart
        option={{
          title: {
            text: 'Aktive saker',

            left: 'center',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              data,
              name: 'Access From',
              type: 'pie',
              radius: '50%',
            },
          ],
        }}
      />
    </div>
  );
}
