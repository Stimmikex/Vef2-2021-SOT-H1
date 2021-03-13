import { query } from './utils.js';

/**
 * getShows()
 * @returns shows from database
 */
export async function getSeries() {
  const q = 'SELECT * FROM series';
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
    series (
      name,
      airdate,
      works, 
      tagline, 
      image, 
      description, 
      language, 
      network, 
      homepage)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;
  try {
    await query(q, [
      data.name,
      data.airDate,
      data.inProduction,
      data.tagline,
      data.image,
      data.description,
      data.language,
      data.network,
      data.homepage]);
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
export async function getSeriesByID(id) {
  const q = 'SELECT * FROM series WHERE id = $1';
  let result = '';
  try {
    result = await query(q, [id]);
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
  // need work
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

export async function makeSeason(data) {
  const q = `
    INSERT INTO
      seasons (name, number, airdate, overview, poster, series_id)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  let date = data.airDate;
  if (date === '') {
    date = null;
  }
  try {
    await query(q, [
      data.name,
      data.number,
      date,
      data.overview,
      data.poster,
      data.serieId,
    ]);
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

export async function getSeasonBySeriesIdAndNumber(id, season) {
  const q = 'SELECT * FROM seasons WHERE series_id = $1 AND number = $2';
  let result = '';
  try {
    result = await query(q, [id, season]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getSeasonBySeriesId(id) {
  const q = 'SELECT * FROM seasons WHERE series_id = $1';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function makeEpisode(data) {
  const q = `
    INSERT INTO
      episodes (name, number, airdate, overview, season_id)
    VALUES ($1, $2, $3, $4, $5)
  `;
  let date = data.airDate;
  if (date === '') {
    date = null;
  }
  try {
    const dataman = await getSeasonBySeriesIdAndNumber(data.season, data.serieId);
    await query(q, [data.name, data.number, date, data.overview, dataman[0].id]);
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
  const q = 'SELECT * FROM category';
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
