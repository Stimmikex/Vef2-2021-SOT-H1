import { query } from './utils.js';

export async function addRating(rating, series, user) {
    const q = 
        `INSERT INTO 
            seriesuser (status, rating, series_id, user_id)
            VALUES (null, $1, $2, $3)
        `;
    let result;
    try {
        result = await query(q, [rating, series, user]);
    } catch (e) {
        console.info('Error occured :>> ', e);
    }
    return true;
}

export async function updateRating(rating, series, user) {
    const q = 
        `UPDATE seriesuser SET rating = $1 WHERE series_id = $2 AND user_id = $3`;
    let result;
    try {
        result = await query(q, [rating, series, user]);
    } catch (e) {
        console.info('Error occured :>> ', e);
    }
}

export async function deleteRating(series, user) {
    const q =
        `UPDATE seriesuser SET rating = null WHERE series_id = $1 AND user_id = $2`;
    let result;
    try {
        result = await query(q, [series, user]);
    } catch(e) {
        console.info('Error occured :>> ', e);
    }
    return true;
}

export async function addState(status, series, user) {
    const q =
        `INSERT INTO
            seriesuser (status, rating, series_id, user_id)
            VALUES ($1, null, $2, $3)
        `;
    let result;
    try {
        result = await query(q, [status, series, user]);
    } catch (e) {
        console.info('Error occured :>> ', e);
    }
    return true;
}

export async function updateState(status, series, user) {
    const q = 
        `UPDATE seriesuser SET status = $1 WHERE series_id = $2 AND user_id = $3`;
    let result;
    try {
        result = await query(q, [status, series, user]);
    } catch (e) {
        console.info('Error occured :>> ', e);
    }
    return true;
}

export async function deleteState(series, user) {
    const q =
        `UPDATE seriesuser SET status
         = null WHERE series_id = $1 AND user_id = $2`;
    let result;
    try {
        result = await query(q, [series, user]);
    } catch(e) {
        console.info('Error occured :>> ', e);
    }
    return true;
}

export async function getStateAndRating(series, user) {
    const q = `SELECT * FROM seriesuser
               WHERE series_id = $1 AND user_id = $2`;
    let result;
    try {
        result = await query(q, [series, user]);
    } catch (e) {
        console.info('Error occured :>> ', e);
    }

    return result.rows[0];
}