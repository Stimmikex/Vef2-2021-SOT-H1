import { query } from './utils.js';

export async function getUsers() {
  const q = 'SELECT * FROM users';
  let result = '';
  try {
    result = await query(q);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result;
}