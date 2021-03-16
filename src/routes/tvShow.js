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
  deleteSeasonByID,
  makeEpisode,
  deleteGenres,
  deleteEpisodeByID,
} from '../dataOut/tvshows.js';

export const routerTV = express.Router();

/**
 * /tv
 */
routerTV.get('/tv', async (req, res) => {
  const data = await getSeries();
  res.json(data);
});

// eslint-disable-next-line no-unused-vars
routerTV.post('/tv', (req, _res) => {
  // eslint-disable-next-line prefer-destructuring
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.admin) {
      const data = req.body;
      makeSeries(data);
      console.info('Data added');
    }
  } else {
    console.info('User needs to be admin');
  }
});

/**
 * /tv/:data?
 */
routerTV.get('/tv/:seriesId?', async (req, res) => {
  const { seriesId } = req.params;
  const data = await getSeriesByID(seriesId);
  res.json(data);
});

routerTV.patch('/tv/:seriesId?', async (req, _res) => {
  // eslint-disable-next-line prefer-destructuring
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.admin) {
      const { seriesId } = req.params;
      const data = req.body;
      await updateSeriesByID(data, seriesId);
      console.info('Data added');
    }
  } else {
    console.info('User needs to be admin');
  }
});

routerTV.delete('/tv/:seriesId?', (req, _res) => {
  // eslint-disable-next-line prefer-destructuring
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.admin) {
      const { seriesId } = req.params;
      deleteSeriesByID(seriesId);
      console.info('Data has been deleted');
    }
  } else {
    console.info('User needs to be admin');
  }
});

/**
 * /tv/:data?/season/
 */
routerTV.get('/tv/:seriesId?/season', async (req, res) => {
  const { seriesId } = req.params;
  const data = await getSeasonBySeriesId(seriesId);
  res.json(data);
});

routerTV.post('/tv/:seriesId?/season', async (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.admin) {
      const { seriesId } = req.params;
      const data = req.body;
      await makeSeason(data, seriesId);
      console.info('Data added');
    }
  } else {
    console.info('User needs to be admin');
  }
});

/**
 * /tv/:data?/season/:id?
 */
routerTV.get('/tv/:seriesId?/season/:seasonId?', async (req, res) => {
  const { seriesId, seasonId } = req.params;
  const dataman = await getSeasonBySeriesIdAndNumber(seriesId, seasonId);
  res.json(dataman);
});

routerTV.delete('/tv/:seriesId?/season/:seasonId?', async (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.admin) {
      const { seriesId, seasonId } = req.params;
      await deleteSeasonByID(seasonId, seriesId);
      console.info('Data has been deleted');
    }
  } else {
    console.info('User needs to be admin');
  }
});

/**
 * /tv/:data?/season/:id?/episode/
 */
routerTV.post('/tv/:seriesId?/season/:seasonId?/episode/', async (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.admin) {
      const { seriesId, seasonId } = req.params;
      const data = req.body;
      await makeEpisode(data, seriesId, seasonId);
      console.info('Data added');
    }
  } else {
    console.info('User needs to be admin');
  }
});

/**
 * /genres
 */
routerTV.get('/genres', (_req, res) => {
  const data = getGenres();
  res.json(data);
});

routerTV.delete('/genres', async (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.admin) {
      await deleteGenres();
      console.info('Data has been deleted');
    }
  } else {
    console.info('User needs to be admin');
  }
});

/**
 * /tv/:id/season/:id/episode/:id
 */
routerTV.get('/tv/:seriesId?/season/:seasonId?/episode/:episodeId?', async (req, res) => {
  const { seriesId, seasonId, episodeId } = req.params;
  const dataman = await getSeasonBySeriesIdAndNumber(seriesId, seasonId);
  const datason = await getEpisodeBySeasonIdAndNumber(dataman[0].id, episodeId);
  res.json(datason);
});

routerTV.delete('/tv/:seriesId?/season/:seasonId?/episode/:episodeId?', async (req, _res) => {
  // eslint-disable-next-line prefer-destructuring
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.admin) {
      const { seriesId, seasonId, episodeId } = req.params;
      await deleteEpisodeByID(seriesId, seasonId, episodeId);
      console.info('Data has been deleted');
    }
  } else {
    console.info('User needs to be admin');
  }
});
