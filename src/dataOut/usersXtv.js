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