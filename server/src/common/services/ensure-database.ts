import { Client } from 'pg';

export async function ensureDatabase() {
  const dbName = process.env.DATABASE_NAME || 'cms_db';

  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'postgres',
  });

  await client.connect();
  const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

  if (res.rowCount === 0) {
    console.log(`BD "${dbName}" does not exist. Creating...`);
    await client.query(`CREATE DATABASE "${dbName}"`);
  }
  
  await client.end();
}