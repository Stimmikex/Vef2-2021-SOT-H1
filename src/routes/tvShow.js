import express from 'express';
import {
  getSeries,
  getSeriesByID,
  getSeasonByID,
  getGenres,
  getSeasons,
  getEpisodeById,
  getSeasonBySeriesId,
  getSeasonBySeriesIdAndNumber,
  getEpisodeBySeasonId,
  getEpisodeBySeasonIdAndNumber,
} from '../dataOut/tvshows.js';
export const routerTV = express.Router();

/**
 * /tv
 */
routerTV.get('/tv', async (req, res) => {
  const data = await getSeries();
  res.json(data);
});

routerTV.post('/tv', (req, res) => {

});

/**
 * /tv/:data?
 */
routerTV.get('/tv/:data?', async (req, res) => {
  const id = req.params.data;
  const data = await getSeriesByID(id);
  res.json(data);
});

routerTV.post('/tv/:data?', (req, res) => {
  
});

routerTV.delete('/tv/:data?', (req, res) => {
  
});

/**
 * /tv/:data?/season/
 */
routerTV.get('/tv/:data?/season', async (req, res) => {
  const id = req.params.data;
  const data = await getSeasonBySeriesId(id);
  res.json(data);
});

routerTV.post('/tv/:data?/season', (req, res) => {
  
});

/**
 * /tv/:data?/season/:id?
 */
routerTV.get('/tv/:data?/season/:season?', async (req, res) => {
  const { data, season } = req.params;
  const dataman = await getSeasonBySeriesIdAndNumber(data, season);
  res.json(dataman);
});

routerTV.delete('/tv/:data?/season/:season?', (req, res) => {
  
});

/**
 * /tv/:data?/season/:id?/episode/
 */
routerTV.post('/tv/:data?/season/:season?/episode/', (req, res) => {
  
});

/**
 * /tv/:id/season/:id/episode/:id
 */
 routerTV.get('/genres', (req, res) => {
  
});

routerTV.delete('/genres', (req, res) => {
  
});

/**
 * /genres
 */
routerTV.get('/tv/:data?/season/:season?/episode/:ep?', async (req, res) => {
  const { data, season, ep } = req.params;
  const dataman = await getSeasonBySeriesIdAndNumber(data, season);
  const datason = await getEpisodeBySeasonIdAndNumber(dataman[0].id, ep);
  res.json(datason);
});

routerTV.delete('/tv/:data?/season/:season?/episode/:ep?', (req, res) => {
  
});
