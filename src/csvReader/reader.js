import csv from 'csv-parser';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

import { query, imgUpload } from '../dataOut/utils.js';

import { getSeasonBySeriesIdAndNumber } from '../dataOut/tvshows.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function initGenres(data) {
  const q = `INSERT INTO category (name)
             VALUES ($1)
             ON CONFLICT (name) DO NOTHING`;
  const genres = data.split(',');
  let i;
  for (i = 0; i < genres.length; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await query(q, [genres[i]]);
    } catch (e) {
      console.info('Error occured :>> ', e);
    }
  }
}

export async function initSeries(data) {
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

  const path = `./data/img/${data.image}`;
  console.info(path);
  console.info(data.image);
  // const cloudinaryURL = await imgUpload(path, data.image);
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

  const q2 = 'SELECT id from series WHERE name = $1';

  let seriesId;
  try {
    seriesId = await query(q2, [data.name]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }

  seriesId = seriesId.rows[0].id;

  const genres = (data.genres).split(',');

  genres.forEach(async (genre) => {
    const q3 = 'SELECT id from category WHERE name = $1';
    let categoryId;
    try {
      categoryId = await query(q3, [genre]);
    } catch (e) {
      console.info('Error occured :>> ', e);
    }

    categoryId = categoryId.rows[0].id;

    const q4 = `
      INSERT INTO
      seriescategory (category_id, series_id)
      VALUES ($1, $2)
      `;
    try {
      await query(q4, [categoryId, seriesId]);
    } catch (e) {
      console.info('Error occured :>> ', e);
    }
  });
}

export async function initSeason(data) {
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

export async function initEpisode(data) {
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

export async function insertGenres() {
  fs.createReadStream('./data/series.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await initGenres(row.genres);
      console.info(row.genres);
    })
    .on('end', () => {
      console.info('genres inserted');
    });
}
export async function insertSeries() {
  fs.createReadStream('./data/series.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await initSeries(row);
    })
    .on('end', () => {
      console.info('series.csv successfully processed');
    });
}

export async function insertSeasons() {
  fs.createReadStream('./data/seasons.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await initSeason(row);
    })
    .on('end', () => {
      console.info('seasons.cvs successfully processed');
    });
}

export async function insertEpisodes() {
  fs.createReadStream('./data/episodes.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await initEpisode(row);
    })
    .on('end', () => {
      console.info('episodes.cvs successfully processed');
    });
}
