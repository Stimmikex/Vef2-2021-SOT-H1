import bcrypt from 'bcrypt';
import { query } from './utils.js';

export async function getUsers() {
  const q = 'SELECT name, email, role FROM users';
  let result = '';
  try {
    result = await query(q);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getUserByID(id) {
  const q = 'SELECT name, email, role FROM users WHERE id = $1';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getUserByName(name) {
  const q = 'SELECT id, name, email, password, role FROM users WHERE name = $1';
  let result = '';
  try {
    result = await query(q, [name]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}

export async function updateUser(data) {
  const q = `
    UPDATE users
      SET role = $2, 
    WHERE
        id = $1  
  `;
  let result = '';
  try {
    result = await query(q, [data.id, data.admin]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function makeUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const q = `
    INSERT INTO
      users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
  `;
  let result = '';
  try {
    result = await query(q, [username, email, hashedPassword, false]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}
