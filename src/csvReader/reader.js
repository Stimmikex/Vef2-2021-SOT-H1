import csv from 'csv-parser';
import fs from 'fs';
import { makeSeason, makeSeries, makeEpisode } from '../dataOut/tvshows.js';

export async function insertSeries() {
  fs.createReadStream('./data/series.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await makeSeries(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

export async function insertSeasons() {
  fs.createReadStream('./data/seasons.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await makeSeason(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
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
      console.log('CSV file successfully processed');
    });
}

insertEpisodes();
