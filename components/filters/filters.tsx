import { Select } from '@navikt/ds-react';
import { getYtelser } from '@/lib/server/api';

export const Filters = async () => {
  const ytelser = await getYtelser();

  const options = ytelser.map((ytelse) => (
    <option key={ytelse.id} value={ytelse.id}>
      {ytelse.navn}
    </option>
  ));

  return <Select label="Ytelse">{options}</Select>;
};
