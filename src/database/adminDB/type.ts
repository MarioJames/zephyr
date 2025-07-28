import type { NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schemas';

export type AdminDatabaseSchema = typeof schema;

export type AdminDatabase = NeonDatabase<AdminDatabaseSchema>;
