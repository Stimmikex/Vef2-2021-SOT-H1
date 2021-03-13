import csv from 'csv-parser';
import fs from 'fs';
import { makeSeries } from '../dataOut/tvShows.js';

function insertSeries() {
    fs.createReadStream('../../data/series.csv')
    .pipe(csv())
    .on('data', async (row) => {
        await makeSeries(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
}

function insertSeasons() {
    fs.createReadStream('../../data/series.csv')
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);
        const q = `
            INSERT INTO
            series (name, airDate, words, tagline, image, description, language, network, homepage)
            VALUES ($1, $2, $3, $4)
        `;
        try {
            query(q, [row.name, row.airDate, row.inProduction, row.tagline, row.image, row.description, row.language, row.network, row.homepage]);
            console.log("date logged");
        } catch (e) {
            console.info('Error occured :>> ', e);
        }
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
}

function insertEpisodes() {
    fs.createReadStream('../../data/series.csv')
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);
        const q = `
            INSERT INTO
            series (name, airDate, words, tagline, image, description, language, network, homepage)
            VALUES ($1, $2, $3, $4)
        `;
        try {
            query(q, [row.name, row.airDate, row.genres, row.inProduction, row.tagline, row.description, row.language, row.network, row.homepage]);
            console.log("date logged");
        } catch (e) {
            console.info('Error occured :>> ', e);
        }
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
}

insertSeries();