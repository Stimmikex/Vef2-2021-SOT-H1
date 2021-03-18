import { query } from './utils.js';

export async function addRating(rating, series, user) {
    const q = 
        `INSERT INTO 
            seriesUser (status, rating, series_id, user_id)
            VALUES ($1, $2, $3, $4)
        `;
    try {
        result = await query(q, ['', rating, series, user]);
    } catch (e) {
        console.info('Error occured :>> ', e);
    }
    return true;
}

export async function updateRating() {

}

export async function deleteRating() {

}

export async function addState() {

}

export async function updateState() {

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

export async function getRatingBySeriesIdAndUserId(id, userId) {
  const q = 'SELECT status, rating FROM seriesUser WHERE series_id = $1 AND user_id = $2';
  let result = '';
  try {
    result = await query(q, [id, userId]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}

export async function getAVGRatingBySeriesId(id) {
  const q = 'SELECT AVG(rating)::numeric(10,2) FROM seriesUser WHERE series_id = $1';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}
