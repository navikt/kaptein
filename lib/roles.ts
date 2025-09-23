import { isDeployedToProd } from '@/lib/environment';

export enum UserRoles {
  KABAL_OPPGAVESTYRING_ALLE_ENHETER = 'KABAL_OPPGAVESTYRING_ALLE_ENHETER',
  KABAL_MALTEKSTREDIGERING = 'KABAL_MALTEKSTREDIGERING',
  KABAL_SAKSBEHANDLING = 'KABAL_SAKSBEHANDLING',
  KABAL_FAGTEKSTREDIGERING = 'KABAL_FAGTEKSTREDIGERING',
  KABAL_INNSYN_EGEN_ENHET = 'KABAL_INNSYN_EGEN_ENHET',
  FORTROLIG = 'FORTROLIG',
  STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
  EGEN_ANSATT = 'EGEN_ANSATT',
  KABAL_ADMIN = 'KABAL_ADMIN',
  ROLE_ROL = 'ROLE_ROL',
}

const PROD_ROLES: Record<string, UserRoles> = {
  '1c006e8b-c667-4622-9df7-43ed2fd494d6': UserRoles.KABAL_OPPGAVESTYRING_ALLE_ENHETER,
  '95c25ca2-e3e9-423e-a55f-9bc327c29f96': UserRoles.KABAL_MALTEKSTREDIGERING,
  '2b671b60-9650-4839-9139-40999bbb0f71': UserRoles.KABAL_SAKSBEHANDLING,
  '1edfbdf1-c1bc-4dc6-9cab-4fff1cb7e2a8': UserRoles.KABAL_FAGTEKSTREDIGERING,
  'e9de217a-7244-45ac-8a06-1994905d7964': UserRoles.KABAL_INNSYN_EGEN_ENHET,
  '9ec6487d-f37a-4aad-a027-cd221c1ac32b': UserRoles.FORTROLIG,
  'ad7b87a6-9180-467c-affc-20a566b0fec0': UserRoles.STRENGT_FORTROLIG,
  'e750ceb5-b70b-4d94-b4fa-9d22467b786b': UserRoles.EGEN_ANSATT,
  '90805436-8a2b-430a-a699-73b29205f25d': UserRoles.KABAL_ADMIN,
  'b16d62b3-ef23-4f4b-b881-8329c13b4e15': UserRoles.ROLE_ROL,
};

const DEV_ROLES: Record<string, UserRoles> = {
  '7ad08bfe-68d4-4c84-bddd-82d8894fb36e': UserRoles.KABAL_OPPGAVESTYRING_ALLE_ENHETER,
  '0097d4ff-787d-4180-953a-8d60b7927f32': UserRoles.KABAL_MALTEKSTREDIGERING,
  '07add1e7-7195-4c37-828d-fdf23ec6bef1': UserRoles.KABAL_SAKSBEHANDLING,
  '94d34f17-e325-4ed6-9667-d23041a3f40c': UserRoles.KABAL_FAGTEKSTREDIGERING,
  '016fb83f-4e7c-47ec-ae8a-e3efa72a43e7': UserRoles.KABAL_INNSYN_EGEN_ENHET,
  'ea930b6b-9397-44d9-b9e6-f4cf527a632a': UserRoles.FORTROLIG,
  '5ef775f2-61f8-4283-bf3d-8d03f428aa14': UserRoles.STRENGT_FORTROLIG,
  'dbe4ad45-320b-4e9a-aaa1-73cca4ee124d': UserRoles.EGEN_ANSATT,
  '14d756b4-d014-419a-a5bc-b8f9e31ce248': UserRoles.KABAL_ADMIN,
  '615a97fc-f49c-48d1-8265-28bd9f435ce4': UserRoles.ROLE_ROL,
};

const ROLE_MAP = isDeployedToProd ? PROD_ROLES : DEV_ROLES;

export const getRoles = async (groups: string[] | undefined): Promise<UserRoles[]> => {
  const roles: UserRoles[] = [];

  if (groups === undefined) {
    return roles;
  }

  for (const group of groups) {
    const role = ROLE_MAP[group];

    if (role !== undefined) {
      roles.push(role);
    }
  }

  return roles;
};
