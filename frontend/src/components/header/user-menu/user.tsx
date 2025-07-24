import { Dropdown } from '@navikt/ds-react';
import { UserDropdown } from './dropdown';

export const User = () => {
  // const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();
  // const { user } = useContext(StaticDataContext);

  return (
    <Dropdown>
      {/* <InternalHeader.UserButton
        as={StyledToggle}
        data-testid="user-menu-button"
        name={name}
        description={`Enhet: ${user.ansattEnhet.navn}`}
      /> */}
      <UserDropdown />
    </Dropdown>
  );
};
