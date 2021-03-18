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
  makeSeries,
  updateSeriesByID,
  deleteSeriesByID,
  makeSeason,
  deleteSeasonBySeriesIdAndNumber,
  makeEpisode,
  deleteGenres,
  deleteEpisodeByID,
} from '../dataOut/tvshows.js';

import { requireAdminAuthentication } from '../dataOut/login.js';

export const routerTV = express.Router();

/**
 * /tv
 */
routerTV.get('/tv', async (req, res) => {
  let { offset = 0 } = req.query;

  const data = await getSeries();
  
  const info = {
    limit: 10,
    offset: offset,
    series: data,
  }
  res.json(data);
});

// eslint-disable-next-line no-unused-vars
routerTV.post('/tv', requireAdminAuthentication, async(req, res) => {
  const data = req.body;
  await makeSeries(data);
  console.info('Data added');
  //breyta þessu res seinna
  res.json(data);
});

/**
 * /tv/:data?
 */
routerTV.get('/tv/:seriesId?', async (req, res) => {
  const { seriesId } = req.params;
  const data = await getSeriesByID(seriesId);
  res.json(data);
});

routerTV.patch('/tv/:seriesId?', requireAdminAuthentication, async (req, res) => {
  const { seriesId } = req.params;
  const data = req.body;
  await updateSeriesByID(data, seriesId);
  console.info('Data added');
  //breyta þessu res seinna
  res.json(data);
});

routerTV.delete('/tv/:seriesId?', requireAdminAuthentication, async (req, res) => {
  const { seriesId } = req.params;
  await deleteSeriesByID(seriesId);
  console.info('Data has been deleted');
  //breyta þessu res seinna
  res.json({ seriesId });
});

/**
 * /tv/:data?/season/
 */
routerTV.get('/tv/:seriesId?/season', async (req, res) => {
  const { seriesId } = req.params;
  const data = await getSeasonBySeriesId(seriesId);
  res.json(data);
});

routerTV.post('/tv/:seriesId?/season', requireAdminAuthentication, async (req, res) => {
  const { seriesId } = req.params;
  console.log(req.params);
  const data = req.body;
  await makeSeason(data, seriesId);
  console.info('Data added');
  //breyta þessu res seinna
  res.json(data);
});

/**
 * /tv/:data?/season/:id?
 */
routerTV.get('/tv/:seriesId?/season/:seasonId?', async (req, res) => {
  const { seriesId, seasonId } = req.params;
  //skila fleiri upplýsingum
  const dataman = await getSeasonBySeriesIdAndNumber(seriesId, seasonId);
  res.json(dataman);
});

routerTV.delete('/tv/:seriesId?/season/:seasonId?', requireAdminAuthentication, async (req, res) => {
  const { seriesId, seasonId } = req.params;
  await deleteSeasonBySeriesIdAndNumber(seriesId, seasonId);
  console.info('Data has been deleted');
  //breyta þessu res seinna
  res.json( {seriesId, seasonId });
});

/**
 * /tv/:data?/season/:id?/episode/
 */
routerTV.post('/tv/:seriesId?/season/:seasonId?/episode/', requireAdminAuthentication, async (req, res) => {
  const { seriesId, seasonId } = req.params;
  const data = req.body;
  await makeEpisode(data, seriesId, seasonId);
  console.info('Data added');
  //breyta þessu res seinna
  res.json(data);
});

/**
 * /genres
 */
routerTV.get('/genres', (_req, res) => {
  const data = getGenres();
  res.json(data);
});

routerTV.delete('/genres', requireAdminAuthentication, async (req, res) => {
  await deleteGenres();
  console.info('Data has been deleted');
});

/**
 * /tv/:id/season/:id/episode/:id
 */
routerTV.get('/tv/:seriesId?/season/:seasonId?/episode/:episodeId?', async (req, res) => {
  const { seriesId, seasonId, episodeId } = req.params;
  const dataman = await getSeasonBySeriesIdAndNumber(seriesId, seasonId);
  const datason = await getEpisodeBySeasonIdAndNumber(dataman.id, episodeId);
  res.json(datason);
});

routerTV.delete('/tv/:seriesId?/season/:seasonId?/episode/:episodeId?', requireAdminAuthentication, async (req, res) => {
  const { seriesId, seasonId, episodeId } = req.params;
  await deleteEpisodeByID(seriesId, seasonId, episodeId);
  console.info('Data has been deleted');
  //breyta þessu res seinna
  res.json( {seriesId, seasonId, episodeId });
});
