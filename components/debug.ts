import type { Behandling } from '@/lib/server/types';

export const debugBehandlinger = (behandlinger: Behandling[]) => {
  console.log('Behandlinger');

  console.log('Antall behandlinger:', behandlinger.length);
  console.log('isAvsluttetAvSaksbehandler: true', behandlinger.filter((b) => b.isAvsluttetAvSaksbehandler).length);
  console.log('isAvsluttetAvSaksbehandler: false', behandlinger.filter((b) => !b.isAvsluttetAvSaksbehandler).length);
  console.log(
    'b.avsluttetAvSaksbehandlerDate === null',
    behandlinger.filter((b) => b.avsluttetAvSaksbehandlerDate === null).length,
  );
  console.log(
    'b.avsluttetAvSaksbehandlerDate !== null',
    behandlinger.filter((b) => b.avsluttetAvSaksbehandlerDate !== null).length,
  );
  console.log('b.typeId === "3"', behandlinger.filter((b) => b.typeId === '3').length);
  console.log('b.typeId !== "3"', behandlinger.filter((b) => b.typeId !== '3').length);
};
