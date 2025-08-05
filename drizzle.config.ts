import type { Config } from 'drizzle-kit';

// Read the .env file if it exists, or a file specified by the

// dotenv_config_path parameter that's passed to Node.js

let connectionString = process.env.DATABASE_URL;

if (!connectionString)
  throw new Error(
    '`DATABASE_URL` or `DATABASE_TEST_URL` not found in environment'
  );

export default {
  dbCredentials: {
    url: connectionString,
  },
  dialect: 'postgresql',
  out: './src/database/migrations',

  schema: './src/database/zephyrDB/schemas',
  strict: true,
} satisfies Config;
