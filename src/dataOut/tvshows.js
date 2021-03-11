import { query } from './utils.js';

/**
 * getShows()
 * @returns shows from database
 */
export async function getShows() {
  const q = 'SELECT * FROM Shows';
  let result = '';
  try {
    result = await query(q);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

/**
 * makeshow(data)
 * @param {JSON.Object} data
 */
export async function makeShow(data) {
  const q = `
    INSERT INTO
      events (name, aired, works, tagline, poster, des, leng, network, url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  try {
    await query(q, [data]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

/**
 *
 * @param {INTEGER} id
 * @returns json.Objects
 */
export async function getShowByID(id) {
  const q = 'SELECT * FROM Shows WHERE id = $1';
  let result = '';
  try {
    result = await query(q, id);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

/**
 *
 * @param {INTEGER} id
 * @param {JSON.Object} data
 */
export async function updateShowByID(id, data) {
  const q = `
    UPDATE events
      SET name = $1, 
        aird = $2, 
        work = $3, 
        tagline = $4, 
        poster = $5, 
        des = $6, 
        leng = $7, 
        network = $8, 
        url = $9
    WHERE
        id = $10  
  `;
  try {
    await query(q, [data, id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

/**
 *
 * @param {INTEGER} id
 * @param {JSON.Object} data
 */
export async function deleteShowByID(id, data) {
  const q = `
    DELETE FROM signup WHERE user_id = $1 AND event_id = $2;
  `;
  try {
    await query(q, [id, data]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

export async function getSeasons() {
  const q = 'SELECT * FROM seasons';
  let result = '';
  try {
    result = await query(q);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function makeSeasonByID(id, data) {
  const q = `
    INSERT INTO
      events (name, aired, description, poster)
    VALUES ($1, $2, $3, $4)
    WHERE id = $5
  `;
  try {
    await query(q, [data, id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

export async function getSeasonByID(id) {
  const q = 'SELECT * FROM seasons WHERE id = $1';
  let result = '';
  try {
    result = await query(q, id);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function deleteSeasonByID(id) {
  const q = `
    DELETE FROM signup WHERE user_id = $1 AND event_id = $2;
  `;
  try {
    await query(q, id);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

export async function makeEpisodeBySeasonID(id, data) {
  const q = `
    INSERT INTO
      events (number, aired, description, season_id)
    VALUES ($1, $2, $3, $4)
  `;
  try {
    await query(q, [data, id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

export async function getEpisodeByID(id) {
  const q = 'SELECT * FROM Episodes WHERE id = $1';
  let result = '';
  try {
    result = await query(q, id);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function deleteEpisodeByID(show, season, id) {
  const q = `
    DELETE FROM signup WHERE user_id = $1 AND event_id = $2;
  `;
  try {
    await query(q, [show, season, id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

export async function getGenres() {
  const q = 'SELECT * FROM show_category';
  let result = '';
  try {
    result = await query(q);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function makeGenre(data) {
  const q = `
    INSERT INTO
      category (name)
    VALUES ($1)
  `;
  try {
    await query(q, [data]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}
