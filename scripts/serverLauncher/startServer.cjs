const fs = require('node:fs').promises;
const { spawn } = require('node:child_process');

// Set file paths
const DB_MIGRATION_SCRIPT_PATH = '/app/docker.cjs';
const SERVER_SCRIPT_PATH = '/app/server.js';

// Function to execute a script with child process spawn
const runScript = (scriptPath) => {
  const command = ['/bin/node', scriptPath];
  return new Promise((resolve, reject) => {
    const process = spawn(command.shift(), command, { stdio: 'inherit' });
    process.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`🔴 Process exited with code ${code}`)),
    );
  });
};

// Main execution block
(async () => {
  if (process.env.DATABASE_DRIVER) {
    try {
      await fs.access(DB_MIGRATION_SCRIPT_PATH);

      await runScript(DB_MIGRATION_SCRIPT_PATH);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(
          `⚠️ DB Migration: Not found ${DB_MIGRATION_SCRIPT_PATH}. Skipping DB migration. Ensure to migrate database manually.`,
        );
        console.log('-------------------------------------');
      } else {
        console.error('❌ Error during DB migration:');
        console.error(err);
        throw err;
      }
    }
  }

  // Run the server in either database or non-database mode
  await runScript(SERVER_SCRIPT_PATH);
})();
