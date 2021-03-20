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
} from '../dataOut/tvshows.js';

import {
  checkRatingBySeriesId,
  getAVGRatingBySeriesId,
// eslint-disable-next-line import/named
} from '../dataOut/usersXtv.js';

import { requireAdminAuthentication } from '../dataOut/login.js';

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
    next: null,
    prev: null,
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
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  body('name')
    .isLength({ min: 1, max: 128 })
    .withMessage('name is required, max 128 characters'),
  body('airDate')
    .isDate()
    .withMessage('airDate must be a date'),
  body('inProduction')
    .isBoolean()
    .withMessage('inProduction must be a boolean'),
  body('image'),
  body('description')
    .isString()
    .withMessage('description must be a string'),
  body('language')
    .isString()
    .isLength(2),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const dataman = req.body;
    const cloudinaryURL = await imgUpload('./data/img/provo.png');
    dataman.image = cloudinaryURL;
    await makeSeries(dataman);
    return res.json({
      data: dataman,
      msg: 'Has been added',
    });
  });

/**
 * /tv/:data?
 */
routerTV.get('/tv/:seriesId?',
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
    const ratings = '';
    // need to add check if user is the right user.
    if (checkRatingBySeriesId) {
      // ratings = await getRatingBySeriesIdAndUserId(seriesId, req.user.id);
    }
    const ratingAVG = getAVGRatingBySeriesId(xssSeriesId);
    return res.json({
      series: data,
      genres,
      seasons,
      ratings,
      ratingAVG,
    });
  });

routerTV.patch('/tv/:seriesId?', requireAdminAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  body('name')
    .isLength({ min: 1, max: 128 })
    .withMessage('name is required, max 128 characters'),
  body('airDate')
    .isDate()
    .withMessage('airDate must be a date'),
  body('inProduction')
    .isBoolean()
    .withMessage('inProduction must be a boolean'),
  body('image'),
  body('description')
    .isString()
    .withMessage('description must be a string'),
  body('language')
    .isString()
    .isLength(2),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    const data = req.body;
    await updateSeriesByID(data, xssSeriesId);
    const info = await getSeriesByID(xssSeriesId);
    return res.json({
      info,
      msg: 'Has been updated',
    });
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
    await deleteSeriesByID(xssSeriesId);
    console.info('Data has been deleted');
    return res.json({
      seriesId: xssSeriesId,
      msg: 'Data has been deleted',
    });
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
    .isLength({ min: 1 })
    .isLength({ max: 128 })
    .withMessage('name is required, max 255 characters'),
  body('number')
    .isInt()
    .custom((value) => Number.parseInt(value, 10) >= 0),
  body('image'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    const data = req.body;
    const xssData = xss(data);
    await makeSeason(xssData, xssSeriesId);
    return res.json({
      data,
      msg: 'season has been added',
    });
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
    await deleteSeasonBySeriesIdAndNumber(xssSeriesId, xssSeasonId);
    return res.json({
      seriesId,
      seasonId,
      msg: 'Data has been deleted',
    });
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
    const xssSeasonId = xss(seasonId);
    const data = req.body;
    const xssData = xss(data);
    await makeEpisode(xssData, xssSeriesId, xssSeasonId);
    return res.json({
      data,
      msg: 'Episode has been added',
    });
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
    const xssEpisodeId = xss(episodeId);
    await deleteEpisodeByID(xssSeriesId, xssSeasonId, xssEpisodeId);
    console.info('Data has been deleted');
    res.json({
      seriesId,
      seasonId,
      episodeId,
    });
  });
