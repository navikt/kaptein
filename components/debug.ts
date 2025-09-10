import { browserLog } from '@/lib/browser-log';
import type { Behandling } from '@/lib/server/types';

export const debugBehandlinger = (behandlinger: Behandling[]) => {
  browserLog.debug('Behandlinger');

  browserLog.debug('Antall behandlinger:', behandlinger.length);
  browserLog.debug('isAvsluttetAvSaksbehandler: true', behandlinger.filter((b) => b.isAvsluttetAvSaksbehandler).length);
  browserLog.debug(
    'isAvsluttetAvSaksbehandler: false',
    behandlinger.filter((b) => !b.isAvsluttetAvSaksbehandler).length,
  );
  browserLog.debug(
    'b.avsluttetAvSaksbehandlerDate === null',
    behandlinger.filter((b) => b.avsluttetAvSaksbehandlerDate === null).length,
  );
  browserLog.debug(
    'b.avsluttetAvSaksbehandlerDate !== null',
    behandlinger.filter((b) => b.avsluttetAvSaksbehandlerDate !== null).length,
  );
  browserLog.debug('b.typeId === "3"', behandlinger.filter((b) => b.typeId === '3').length);
  browserLog.debug('b.typeId !== "3"', behandlinger.filter((b) => b.typeId !== '3').length);
};
