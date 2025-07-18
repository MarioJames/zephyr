import type { NeonDatabase } from 'drizzle-orm/neon-serverless';

import * as schema from './schemas';

export type ZephyrDatabaseSchema = typeof schema;

export type ZephyrDatabase = NeonDatabase<ZephyrDatabaseSchema>;
