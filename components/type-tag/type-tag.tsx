import { Tag, type TagProps } from '@navikt/ds-react';
import { Sakstype } from '@/lib/types';

const SAKSTYPE_TO_TAG_VARIANT: Record<Sakstype, TagProps['variant']> = {
  [Sakstype.KLAGE]: 'alt1-filled',
  [Sakstype.ANKE]: 'success-filled',
  [Sakstype.ANKE_I_TRYGDERETTEN]: 'error-filled',
  [Sakstype.OMGJØRINGSKRAV]: 'info-filled',
  [Sakstype.BEHANDLING_ETTER_TR_OPPHEVET]: 'alt2-filled',
  [Sakstype.BEGJÆRING_OM_GJENOPPTAK]: 'warning-filled',
  [Sakstype.BEGJÆRING_OM_GJENOPPTAK_I_TRYGDERETTEN]: 'alt3-filled',
};

const SAKSTYPE_TO_LABEL: Record<Sakstype, string> = {
  [Sakstype.KLAGE]: 'Klage',
  [Sakstype.ANKE]: 'Anke',
  [Sakstype.ANKE_I_TRYGDERETTEN]: 'Anke i Trygderetten',
  [Sakstype.OMGJØRINGSKRAV]: 'Omgjøringskrav',
  [Sakstype.BEHANDLING_ETTER_TR_OPPHEVET]: 'Behandling etter Trygderetten opphevet',
  [Sakstype.BEGJÆRING_OM_GJENOPPTAK]: 'Begjæring om gjenopptak',
  [Sakstype.BEGJÆRING_OM_GJENOPPTAK_I_TRYGDERETTEN]: 'Begjæring om gjenopptak i Trygderetten',
};

interface Props extends Omit<TagProps, 'variant' | 'children'> {
  type: Sakstype;
}

export const TypeTag = ({ type, size = 'small' }: Props) => (
  <Tag variant={SAKSTYPE_TO_TAG_VARIANT[type]} size={size}>
    {SAKSTYPE_TO_LABEL[type]}
  </Tag>
);
