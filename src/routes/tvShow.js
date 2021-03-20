import express from 'express';
import {
  getSeries,
  getSeriesByID,
  getSeriesCount,
  getSeasonByID,
  getGenres,
  getSeasons,
  getSeasonsCount,
  getEpisodeById,
  getSeasonBySeriesId,
  getSeasonBySeriesIdAndNumber,
  getEpisodesBySeasonId,
  getEpisodeBySeasonIdAndNumber,
  makeSeries,
  updateSeriesByID,
  deleteSeriesByID,
  makeSeason,
  deleteSeasonBySeriesIdAndNumber,
  makeEpisode,
  deleteGenres,
  deleteEpisodeByID,
  getGenresBySeriesId,
} from '../dataOut/tvshows.js';

import { requireAdminAuthentication } from '../dataOut/login.js';

import { imgUpload } from '../dataOut/utils.js';

export const routerTV = express.Router();

/**
 * /tv
 */
routerTV.get('/tv', async (req, res) => {
  let { offset = 0, limit } = req.query;

  offset = Number(offset);

  const count = await getSeriesCount();

  const data = await getSeries(offset, limit);

  let links = {
    self: {
      href: `http://localhost:4000/tv?offset=${offset}&limit=10`
    },
    next: null,
    prev: null
  };
  if(offset + 10 < count.count) {
    links.next = {
      href: `http://localhost:4000/tv?offset=${offset+10}&limit=10`
    };
  }
  if(offset - 10 >= 0) {
    links.prev = {
      href: `http://localhost:4000/tv?offset=${offset-10}&limit=10`
    };
  }
  
  const info = {
    limit: 10,
    offset: offset,
    series: data,
    links: links
  }
  res.json(info);
});

// eslint-disable-next-line no-unused-vars
routerTV.post('/tv', requireAdminAuthentication, async(req, res) => {
  let dataman = req.body;
  let cloudinaryURL = await imgUpload('./data/img/provo.png');
  dataman.image = cloudinaryURL;
  await makeSeries(dataman);
  console.info('Data added');

  res.json(dataman);
});

/**
 * /tv/:data?
 */
routerTV.get('/tv/:seriesId?', async (req, res) => {
  const { seriesId } = req.params;
  const data = await getSeriesByID(seriesId);
  const genres = await getGenresBySeriesId(seriesId);
  const seasons = await getSeasonBySeriesId(seriesId);
  res.json({
    series: data,
    genres,
    seasons,
  });
});

routerTV.patch('/tv/:seriesId?', requireAdminAuthentication, async (req, res) => {
  const { seriesId } = req.params;
  const data = req.body;
  console.log(data);
  await updateSeriesByID(data, seriesId);
  console.info('Data added');
  const info = await getSeriesByID(seriesId);
  //breyta þessu res seinna
  res.json(info);
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
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const { seriesId } = req.params;

  const count = await getSeasonsCount(seriesId);

  let links = {
    self: {
      href: `http://localhost:4000/tv?offset=${offset}&limit=10`
    }
  };
  if(offset + 10 < count.count) {
    links.next = {
      href: `http://localhost:4000/tv?offset=${offset+10}&limit=10`
    };
  }
  if(offset - 10 >= 0) {
    links.prev = {
      href: `http://localhost:4000/tv?offset=${offset-10}&limit=10`
    };
  }

  const data = await getSeasonBySeriesId(seriesId, offset, limit);

  res.json({
    limit,
    offset,
    data,
    links
  });
});

routerTV.post('/tv/:seriesId?/season', requireAdminAuthentication, async (req, res) => {
  const { seriesId } = req.params;
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
  const info = {
    id: dataman.id,
    name: dataman.name,
    number: dataman.number,
    airdate: dataman.airdate,
    overview: dataman.overview,
    poster: dataman.poster,
    episode: await getEpisodesBySeasonId(dataman.id)
  }
  res.json(info);
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
  console.log(datason);
  const info = {
    id: datason.id,
    name: datason.name,
    number: datason.number,
    airdate: datason.airdate,
    overview: datason.overview,
    seriesId: seriesId,
    seasonnumber: dataman.id,
    seasonId: seasonId
  }
  res.json(info);
});

routerTV.delete('/tv/:seriesId?/season/:seasonId?/episode/:episodeId?', requireAdminAuthentication, async (req, res) => {
  const { seriesId, seasonId, episodeId } = req.params;
  await deleteEpisodeByID(seriesId, seasonId, episodeId);
  console.info('Data has been deleted');
  //breyta þessu res seinna
  res.json( {seriesId, seasonId, episodeId });
});
