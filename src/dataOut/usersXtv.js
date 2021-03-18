import { query } from './utils.js';

export async function addRating() {

}

export async function updateRating() {

}

export async function deleteRating() {

}

export async function addState() {

}

export async function changeState() {

}

export async function deleteState() {

}

export async function getStateAndRating() {
  
}

export async function checkRatingBySeriesId(id) {
  const q = 'SELECT * FROM users WHERE series = $1';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  if (result.rowCount >= 1) {
    return true;
  }
  return false;
}

export async function getRatingBySeriesId(id) {
  const q = 'SELECT * FROM users WHERE series = $1';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}
