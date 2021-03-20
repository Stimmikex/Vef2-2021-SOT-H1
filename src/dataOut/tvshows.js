import { query } from './utils.js';

export async function getSeriesCount() {
  const q = `SELECT COUNT(*) AS count FROM series`;
  let result = '';
  try {
    result = await query(q);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}

/**
 * getShows()
 * @returns shows from database
 */
export async function getSeries(offset, limit) {
  const q = `SELECT * FROM series ORDER BY id ASC OFFSET $1 LIMIT $2`;
  let result = '';
  try {
    result = await query(q, [offset, limit]);
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
      data.airdate,
      data.works,
      data.tagline,
      data.image,
      data.description,
      data.language,
      data.network,
      data.homepage]);
    // console.log("date logged");
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
  return result.rows[0];
}

/**
 *
 * @param {INTEGER} id
 * @param {JSON.Object} data
 */
export async function updateSeriesByID(data, id) {
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
  const currentData = await getSeriesByID(id);

  let newData = {
    name: data.name || currentData.name,
    airdate: data.airdate || currentData.airdate,
    works: currentData.works,
    tagline: data.tagline || currentData.tagline,
    image: data.image || currentData.image,
    description: data.description || currentData.description,
    language: data.language || currentData.language,
    network: data.network || currentData.network,
    homepage: data.homepage || currentData.homepage,
  }

  if(data.works != null) {
    newData.works = data.works;
  }

  try {
    await query(q, [
      newData.name,
      newData.airdate,
      newData.works,
      newData.tagline,
      newData.image,
      newData.description,
      newData.language,
      newData.network,
      newData.homepage,
      id
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

export async function getSeasonsCount(seriesId) {
  const q = `SELECT COUNT(*) AS count 
             FROM seasons WHERE series_id = $1`;
  let result = '';
  try {
    result = await query(q, [seriesId]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
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

export async function makeSeason(data, seriesId) {
  const q = `
    INSERT INTO
      seasons (name, number, airdate, overview, poster, series_id)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  let date = data.airdate;
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
      seriesId,
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

export async function deleteSeasonBySeriesIdAndNumber(seriesId, number) {
  const q = `
    DELETE FROM seasons WHERE series_id = $1 AND number = $2;
  `;
  try {
    await query(q, [seriesId, number]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

export async function getSeasonBySeriesIdAndNumber(seriesId, season) {
  const q = 'SELECT id, name, number, airdate, overview, poster FROM seasons WHERE series_id = $1 AND number = $2';
  let result = '';
  try {
    result = await query(q, [seriesId, season]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}

export async function getSeasonBySeriesId(id, offset, limit) {
  const q = `SELECT id, name, number, airdate, overview, poster 
             FROM seasons WHERE series_id = $1 ORDER BY number ASC
             OFFSET $2 LIMIT $3`;
  let result = '';
  try {
    result = await query(q, [id, offset, limit]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function makeEpisode(data, seriesId, seasonId) {
  const q = `
    INSERT INTO
      episodes (name, number, airdate, overview, season_id)
    VALUES ($1, $2, $3, $4, $5)
  `;
  let date = data.airdate;
  if (date === '') {
    date = null;
  }
  try {
    const dataman = await getSeasonBySeriesIdAndNumber(seriesId, seasonId);
    await query(q, [data.name, data.number, date, data.overview, dataman.id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

export async function getEpisodesBySeasonId(id) {
  const q = 'SELECT name, number, airdate, overview FROM episodes WHERE season_id = $1 ORDER BY number ASC';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getEpisodeBySeasonIdAndNumber(id, ep) {
  const q = 'SELECT * FROM episodes WHERE season_id = $1 AND number = $2';
  let result = '';
  try {
    result = await query(q, [id, ep]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  console.log(result.rows);
  return result.rows[0];
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

export async function deleteEpisodeByID(series, season, episode) {
  const q = `
    DELETE FROM episodes WHERE number = $1 AND season_id = $2;
  `;
  const dataman = await getSeasonBySeriesIdAndNumber(series, season);
  console.log(dataman);
  try {
    await query(q, [episode, dataman.id]);
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

export async function getGenresBySeriesId(id) {
  const q = 'SELECT name, category_id FROM seriesCategory INNER JOIN category ON (category_id = category.id) WHERE series_id = $1';
  let result = '';
  try {
    result = await query(q, [id]);
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
