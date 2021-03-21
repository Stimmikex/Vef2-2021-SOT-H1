import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { promises as fs } from 'fs';
// eslint-disable-next-line import/named
import {
  insertSeries,
  insertSeasons,
  insertEpisodes,
  insertGenres,
  insertSeriesImages,
  insertSeasonImages,
} from './csvReader/reader.js';

async function readFileAsync(sql) {
  try {
    const file = await fs.readFile(sql);
    return file;
  } catch (e) {
    throw new Error(e);
  }
}

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

if (!connectionString) {
  console.error('Vantar DATABASE_URL');
  process.exit(1);
}

const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query(q, v = []) {
  const client = await pool.connect();

  try {
    const result = await client.query(q, v);
    return result.rows;
  } catch (e) {//eslint-disable-line
    throw e;
  } finally {
    client.release();
  }
}

async function main() {
  // eslint-disable-next-line no-template-curly-in-string
  console.info(`Set upp gagnagrunn á ${connectionString}`);

  // búa til töflu út frá skema
  try {
    const createTable = await readFileAsync('./sql/schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Tafla búin til');
  } catch (e) {
    console.error('Villa við að búa til töflu:', e.message);
    return;
  }

  try {
    await insertGenres();
    console.info('added genres');
    await insertSeries();
    console.info('added series');
    await insertSeasons();
    console.info('added seasons');
    await insertEpisodes();
    console.info('added episodes');
  } catch (error) {
    console.error(`Villa kom upp við að setja gögn í gagnagrunnin; ${error}`);
  }

  try {
    const q = 'INSERT INTO users(name, email, password, role) VALUES ($1, $2, $3, $4)';
    const Password = await bcrypt.hash('123', 10);
    await query(q, ['admin', 'admin@admin.is', Password, true]);
  } catch (error) {
    console.error('Villa við að búa til notenda');
  }

  try {
    await insertSeriesImages();
  } catch (error) {
    console.error('Villa við að hlaða upp series myndum');
  }

  try {
    await insertSeasonImages();
  } catch (error) {
    console.error('Villa við að hlaða upp season myndum')
  }
}

main().catch((err) => {
  console.error(err);
});
