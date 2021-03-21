import pg from 'pg';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query(q, values = []) {
  const client = await pool.connect();

  let result;

  try {
    result = await client.query(q, values);
  } catch (err) {
    console.error('Villa í query', err);
    throw err;
  } finally {
    client.release();
  }
  return result;
}

export async function imgUpload(image, name) {
  let path = `h1/${name}`;
  path = path.slice(0, -4);
  const result = await cloudinary.uploader.upload(image, { public_id: path, overwrite: true },
    (error) => {
      if (error) { console.error(error); } else {
        console.info('Image uploaded');
      }
    });

  return result.secure_url;
}
