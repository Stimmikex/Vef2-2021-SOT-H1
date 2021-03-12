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

export async function getUserByID(id) {
  const q = 'SELECT * FROM users WHERE id = $1';
  let result = '';
  try {
    result = await query(q, id);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getUserByName(name) {
  const q = 'SELECT * FROM users WHERE username = $1';
  let result = '';
  try {
    result = await query(q, name);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function updateUserByID(id, bool) {
  const q = `
    UPDATE users
      SET role = $2, 
    WHERE
        id = $1  
  `;
  let result = '';
  try {
    result = await query(q, [id, bool]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function makeUser(data) {
  const q = `
    INSERT INTO
      user (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    WHERE id = $5
  `;
  let result = '';
  try {
    result = await query(q, [data.name, data.email, data.password, data.role]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function loginUser(data) {

}

export async function getUserWithToken() {
  
}

export async function updateUserWithToken(data) {
  
}

