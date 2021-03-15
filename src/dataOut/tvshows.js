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
export async function updateSeriesByID(id, data) {
  // need work
  const q = `
    UPDATE series
      SET name = $1, 
        airdate = $2, 
        works = $3, 
        tagline = $4, 
        image = $5, 
        description = $6, 
        language = $7, 
        network = $8, 
        homepage = $9
    WHERE
        id = $10  
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
      data.homepage,
      id,
    ]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

/**
 *
 * @param {INTEGER} id
 * @param {JSON.Object} data
 */
export async function deleteSeriesByID(id) {
  const q = `
    DELETE FROM series WHERE id = $1;
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

export async function getEpisodeBySeasonId(id) {
  const q = 'SELECT * FROM Episodes WHERE season_id = $1';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getEpisodeBySeasonIdAndNumber(id, ep) {
  const q = 'SELECT * FROM Episodes WHERE season_id = $1 AND number = $2';
  let result = '';
  try {
    result = await query(q, [id, ep]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getEpisodeById(id) {
  const q = 'SELECT * FROM Episodes WHERE id = $1';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function deleteEpisodeByID(show, season, id) {
  const q = `
    DELETE FROM episodes WHERE user_id = $1 AND event_id = $2;
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

export async function deleteGenres(id) {
  const q = `
    DELETE FROM category WHERE id = $1;
  `;
  try {
    await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
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
