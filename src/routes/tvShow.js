import express from 'express';
import xss from 'xss';
import {
  body,
  validationResult,
  param,
} from 'express-validator';
import {
  getSeries,
  getSeriesByID,
  getSeriesCount,
  getGenres,
  getSeasonsCount,
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
  getSeriesByName,
} from '../dataOut/tvshows.js';

import {
  getAVGRatingBySeriesId,
  getRatingCountBySeriesId,
  getStateAndRating,
// eslint-disable-next-line import/named
} from '../dataOut/usersXtv.js';

import { requireAdminAuthentication, optionalAuthentication } from '../dataOut/login.js';

// eslint-disable-next-line import/named
import { imgUpload } from '../dataOut/utils.js';

export const routerTV = express.Router();

/**
 * /tv
 */
routerTV.get('/tv', async (req, res) => {
  // eslint-disable-next-line prefer-const
  let { offset = 0, limit } = req.query;

  offset = Number(offset);

  const count = await getSeriesCount();

  const data = await getSeries(offset, limit);

  const links = {
    self: {
      href: `http://localhost:4000/tv?offset=${offset}&limit=10`,
    },
  };
  if (offset + 10 < count.count) {
    links.next = {
      href: `http://localhost:4000/tv?offset=${offset + 10}&limit=10`,
    };
  }
  if (offset - 10 >= 0) {
    links.prev = {
      href: `http://localhost:4000/tv?offset=${offset - 10}&limit=10`,
    };
  }
  const info = {
    limit: 10,
    offset,
    series: data,
    links,
  };
  res.json(info);
});

// eslint-disable-next-line no-unused-vars
routerTV.post('/tv', requireAdminAuthentication,
  body('name')
    .isLength({ min: 1, max: 128 })
    .withMessage('name is required, max 128 characters'),
  body('airdate')
    .isDate()
    .withMessage('airdate must be a date'),
  body('works')
    .isBoolean()
    .withMessage('inProduction must be a boolean'),
  body('image'),
  body('description')
    .isString()
    .withMessage('description must be a string'),
  body('language')
    .isString()
    .isLength({ min: 2, max: 2 })
    .withMessage('language must be string with length 2'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const dataman = req.body;
    const cloudinaryURL = await imgUpload('./data/img/provo.png');
    dataman.image = cloudinaryURL;
    await makeSeries(dataman);
    const info = await getSeriesByName(dataman.name);
    return res.json(info);
  });

/**
 * /tv/:data?
 */
routerTV.get('/tv/:seriesId?', optionalAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    const data = await getSeriesByID(xssSeriesId);
    const genres = await getGenresBySeriesId(xssSeriesId);
    const seasons = await getSeasonBySeriesId(xssSeriesId);
    const ratingAVG = await getAVGRatingBySeriesId(xssSeriesId);
    const ratings = await getRatingCountBySeriesId(xssSeriesId);

    const info = {};
    if (req.user) {
      const userInfo = await getStateAndRating(xssSeriesId, req.user.id);
      info.serie = data;
      info.averagerating = ratingAVG.avg;
      info.ratings = ratings;
      info.userRating = userInfo.rating;
      info.userStatus = userInfo.status;
      info.genres = genres;
      info.seasons = seasons;
    } else {
      info.series = data;
      info.averagerating = ratingAVG.avg;
      info.ratings = ratings;
      info.genres = genres;
      info.seasons = seasons;
    }

    return res.json(info);
  });

routerTV.patch('/tv/:seriesId?', requireAdminAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  body('name')
    .isLength({ min: 1, max: 128 })
    .withMessage('name is required, max 128 characters'),
  body('airdate')
    .isDate()
    .withMessage('airdate must be a date'),
  body('works')
    .isBoolean()
    .withMessage('works must be a boolean'),
  body('image'),
  body('description')
    .isString()
    .withMessage('description must be a string'),
  body('language')
    .isString()
    .isLength({ min: 2, max: 2 })
    .withMessage('language must be a string of length 2'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    const seriesExists = await getSeriesByID(xssSeriesId);
    const data = req.body;
    if (seriesExists) {
      await updateSeriesByID(data, xssSeriesId);
      const info = await getSeriesByID(xssSeriesId);
      return res.json({
        info,
        msg: 'Has been updated',
      });
    }
    return res.status(400).json({ err: 'Cannot update series, seriesId not found' });
  });

routerTV.delete('/tv/:seriesId?', requireAdminAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    const seriesExists = await getSeriesByID(xssSeriesId);
    if (seriesExists) {
      await deleteSeriesByID(xssSeriesId);
      return res.json({
        seriesId: xssSeriesId,
        msg: 'Data has been deleted',
      });
    }
    return res.status(400).json({ err: 'Cannot delete series, seriesId not found' });
  });

/**
 * /tv/:data?/season/
 */
routerTV.get('/tv/:seriesId?/season', async (req, res) => {
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const { seriesId } = req.params;
  const xssSeriesId = xss(seriesId);

  const count = await getSeasonsCount(xssSeriesId);

  const links = {
    self: {
      href: `http://localhost:4000/tv?offset=${offset}&limit=10`,
    },
  };
  if (offset + 10 < count.count) {
    links.next = {
      href: `http://localhost:4000/tv?offset=${offset + 10}&limit=10`,
    };
  }
  if (offset - 10 >= 0) {
    links.prev = {
      href: `http://localhost:4000/tv?offset=${offset - 10}&limit=10`,
    };
  }

  const data = await getSeasonBySeriesId(xssSeriesId, offset, limit);

  res.json({
    limit,
    offset,
    data,
    links,
  });
});

routerTV.post('/tv/:seriesId?/season', requireAdminAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  body('name')
    .isLength({ min: 1, max: 128 })
    .withMessage('name is required, max 255 characters'),
  body('number')
    .isInt()
    .withMessage('season number required')
    .custom((value) => Number.parseInt(value, 10) >= 1)
    .withMessage('season number must be greater than 0'),
  body('overview')
    .isString()
    .withMessage('overview required')
    .isLength({ min: 1 })
    .withMessage('overview length must be greater than 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    const data = req.body;
    const seriesExists = await getSeriesByID(xssSeriesId);
    if (seriesExists) {
      await makeSeason(data, xssSeriesId);
      return res.json({
        data,
        msg: 'season has been added',
      });
    }
    return res.status(400).json({ err: 'Cannot create season, seriesId not found' });
  });

/**
 * /tv/:data?/season/:id?
 */
routerTV.get('/tv/:seriesId?/season/:seasonId?',
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { seriesId, seasonId } = req.params;
    const xssSeriesId = xss(seriesId);
    const xssSeasonId = xss(seasonId);
    const dataman = await getSeasonBySeriesIdAndNumber(xssSeriesId, xssSeasonId);
    const info = {
      id: dataman.id,
      name: dataman.name,
      number: dataman.number,
      airdate: dataman.airdate,
      overview: dataman.overview,
      poster: dataman.poster,
      episode: await getEpisodesBySeasonId(dataman.id),
    };
    return res.json(info);
  });

routerTV.delete('/tv/:seriesId?/season/:seasonId?', requireAdminAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  param('seasonId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { seriesId, seasonId } = req.params;
    const xssSeriesId = xss(seriesId);
    const seriesExists = await getSeriesByID(xssSeriesId);
    const xssSeasonId = xss(seasonId);
    const seasonsExists = await getSeasonBySeriesId(xssSeriesId);

    if (seriesExists && seasonsExists) {
      await deleteSeasonBySeriesIdAndNumber(xssSeriesId, xssSeasonId);
      return res.json({
        seriesId,
        seasonId,
        msg: 'Data has been deleted',
      });
    }
    return res.status(400).json({ err: 'Cannot delete season, seriesId or seasonId not found' });
  });

/**
 * /tv/:data?/season/:id?/episode/
 */
routerTV.post('/tv/:seriesId?/season/:seasonId?/episode/', requireAdminAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { seriesId, seasonId } = req.params;
    const xssSeriesId = xss(seriesId);
    const seriesExists = await getSeriesByID(xssSeriesId);
    const xssSeasonId = xss(seasonId);
    const seasonsExists = await getSeasonBySeriesId(xssSeriesId);
    const data = req.body;
    if (seriesExists && seasonsExists) {
      await makeEpisode(data, xssSeriesId, xssSeasonId);
      return res.json({
        data,
        msg: 'Episode has been added',
      });
    }
    return res.status(400).json({ err: 'Cannot delete season' });
  });

/**
 * /genres
 */
routerTV.get('/genres', async (_req, res) => {
  const data = await getGenres();
  res.json(data);
});

routerTV.delete('/genres', requireAdminAuthentication, async (req, res) => {
  await deleteGenres();
  res.json({
    msg: 'genres has been added',
  });
});

/**
 * /tv/:id/season/:id/episode/:id
 */
routerTV.get('/tv/:seriesId?/season/:seasonId?/episode/:episodeId?',
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  param('episodeId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { seriesId, seasonId, episodeId } = req.params;
    const xssSeriesId = xss(seriesId);
    const xssSeasonId = xss(seasonId);
    const xssEpisodeId = xss(episodeId);
    const dataman = await getSeasonBySeriesIdAndNumber(xssSeriesId, xssSeasonId);
    const datason = await getEpisodeBySeasonIdAndNumber(dataman.id, xssEpisodeId);
    const info = {
      id: datason.id,
      name: datason.name,
      number: datason.number,
      airdate: datason.airdate,
      overview: datason.overview,
      seriesId,
      seasonnumber: dataman.id,
      seasonId,
    };
    return res.json(info);
  });

routerTV.delete('/tv/:seriesId?/season/:seasonId?/episode/:episodeId?', requireAdminAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  param('episodeId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  async (req, res) => {
    const { seriesId, seasonId, episodeId } = req.params;
    const xssSeriesId = xss(seriesId);
    const xssSeasonId = xss(seasonId);
    const seriesExists = await getSeriesByID(xssSeriesId);
    const seasonsExists = await getSeasonBySeriesId(xssSeriesId);
    const xssEpisodeId = xss(episodeId);
    const episodeExists = await getEpisodeBySeasonIdAndNumber(xssSeasonId, xssEpisodeId);
    console.info('Data has been deleted');
    if (seriesExists && seasonsExists && episodeExists) {
      await deleteEpisodeByID(xssSeriesId, xssSeasonId, xssEpisodeId);
      return res.json({
        seriesId,
        seasonId,
        episodeId,
      });
    }
    return res.status(400).json({ err: 'Cannot delete season, seriesId, seasonId or episodeId doesnt exist' });
  });
