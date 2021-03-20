import csv from 'csv-parser';
import fs from 'fs';

import { query } from '../dataOut/utils.js';

import { getSeasonBySeriesIdAndNumber } from '../dataOut/tvshows.js';

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
    // console.log("date logged");
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
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
    const dataman = await getSeasonBySeriesIdAndNumber(data.serieId, data.season);
    await query(q, [data.name, data.number, date, data.overview, dataman.id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
}

export async function insertSeries() {
  fs.createReadStream('./data/series.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await makeSeries(row);
    })
    .on('end', () => {
      console.log('series.csv successfully processed');
    });
}

export async function insertSeasons() {
  fs.createReadStream('./data/seasons.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await makeSeason(row);
    })
    .on('end', () => {
      console.log('seasons.cvs successfully processed');
    });
}

export async function insertEpisodes() {
  fs.createReadStream('./data/episodes.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await makeEpisode(row);
    })
    .on('end', () => {
      console.log('episodes.cvs successfully processed');
    });
}
