import csv from 'csv-parser';
import fs from 'fs';
import { query } from '../dataOut/utils.js';

async function insertSeries() {
    fs.createReadStream('../../data/series.csv')
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);
        const q = `
            INSERT INTO
            series (name, airDate, words, tagline, image, description, language, network, homepage)
            VALUES ($1, $2, $3, $4)
            WHERE id = $5
        `;
        let result = '';
        try {
            result = query(q, [row.name, row.airDate, row.genres, row.inProduction, row.tagline, row.description, row.language, row.network, row.homepage])
        } catch (e) {
            console.info('Error occured :>> ', e);
        }
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
} 

insertSeries();