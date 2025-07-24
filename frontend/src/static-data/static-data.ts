import { INNSTILLINGER_BASE_PATH } from '@app/redux-api/common';
import { loadStaticData } from '@app/static-data/loader';
import type { IUserData } from '@app/types/bruker';

export const user = loadStaticData<IUserData>(`${INNSTILLINGER_BASE_PATH}/me/brukerdata`, 'brukerdata');
