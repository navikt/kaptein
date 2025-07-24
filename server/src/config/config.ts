import path from 'node:path';
import { isLocal } from '@app/config/env';
import { requiredEnvString } from '@app/config/env-var';

const KABAL_API = 'kabal-api';
export const KLAGE_KODEVERK_API = 'klage-kodeverk-api';

export const API_CLIENT_IDS = [KABAL_API, KLAGE_KODEVERK_API];

const cwd = process.cwd(); // This will be the server folder, as long as the paths in the NPM scripts are not changed.
const serverDirectoryPath = cwd;
export const frontendDirectoryPath = path.resolve(serverDirectoryPath, '../frontend');
export const frontendDistDirectoryPath = path.resolve(frontendDirectoryPath, './dist');

const defaultValue = isLocal ? 'local' : undefined;

export const PROXY_VERSION = requiredEnvString('VERSION', defaultValue);
export const PORT = requiredEnvString('PORT', '8080');
export const NAIS_CLUSTER_NAME = requiredEnvString('NAIS_CLUSTER_NAME', defaultValue);
export const START_TIME = Date.now();
