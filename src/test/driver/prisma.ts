import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export async function runMigrations(connectionString: string) {
  await execAsync('npx prisma db push', {
    env: { ...process.env, DATABASE_URL: connectionString },
  });
}
