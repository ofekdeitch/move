import { DatabaseConfig } from '../common/config/database.config';

export function makeConnectionString(config: DatabaseConfig) {
  return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?schema=${config.schema}`;
}
