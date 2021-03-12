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
export async function makeSeries(data) {
  const q = `
    INSERT INTO
    series (name, airDate, works, tagline, image, description, language, network, homepage)
    VALUES ($1, $2, $3, $4)
  `;
  try {
    await query(q, [data.name, data.airDate, data.inProduction, data.tagline, data.image, data.description, data.language, data.network, data.homepage]);
    console.log("date logged");
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
  const q = 'SELECT * FROM shows WHERE id = $1';
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
    UPDATE tv_shows
      SET name = $1, 
        aired = $2, 
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
    await query(q, [data.name, data.aired, data.work, data.tagline, data.poster, data.des, data.leng, data.network, data.url, id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

/**
 *
 * @param {INTEGER} id
 * @param {JSON.Object} data
 */
export async function deleteShowByID(id) {
  const q = `
    DELETE FROM tv_shows WHERE id = $1;
  `;
  try {
    await query(q, [id]);
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
      seasons (name, aired, description, poster)
    VALUES ($1, $2, $3, $4)
    WHERE id = $5
  `;
  try {
    await query(q, [data.name, data.aired, data.description, data.poster, id]);
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
    DELETE FROM seasons WHERE id = $1;
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
      shows (number, aired, description, season_id)
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
