import { query } from './utils.js';

export async function getUserByName(name) {
  const q = 'SELECT * FROM Users WHERE name = $1';
  let result = '';
  try {
    result = await query(q, name);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result;
}

export async function getUserByID(id) {
  const q = 'SELECT * FROM Users WHERE id = $1';
  let result = '';
  try {
    result = await query(q, id);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}