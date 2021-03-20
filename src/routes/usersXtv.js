import express from 'express';
import xss from 'xss';
import {
  body,
  params,
  validationResult,
} from 'express-validator';
import {
  addRating,
  addState,
  updateState,
  updateRating,
  deleteRating,
  deleteState,
} from '../dataOut/usersXtv.js';

import { requireAuthentication } from '../dataOut/login.js';

export const routerUserXtv = express.Router();

/**
 * /tv/:data?/rate
 */
routerUserXtv.post('/tv/:seriesId?/rate',
  body('rating')
    .isNumeric({ min: 0, max: 5 }),
  requireAuthentication, async (req, res) => {
    const { rating } = req.body;
    const xssRating = xss(rating);
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    await addRating(xssRating, xssSeriesId, req.user.id);
    res.json({
      msg: 'Rating has been added',
      rating: xssRating,
      seriesId: xssSeriesId,
    });
  });

routerUserXtv.patch('/tv/:data?/rate',
  body('rating')
    .isNumeric({ min: 0, max: 5 }),
  requireAuthentication, async (req, res) => {
    const { rating } = req.body;
    const xssRating = xss(rating);
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    await updateRating(xssRating, xssSeriesId, req.user.id);
    res.json({
      msg: 'update Rating',
      rating: xssRating,
      seriesId: xssSeriesId,
    });
  });

routerUserXtv.delete('/tv/:data?/rate',
  params('seriesId')
    .isInt(),
  requireAuthentication, async (req, res) => {
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    deleteRating(xssSeriesId, req.user.id);
    res.json({
      msg: 'delete Rating',
      seriesId: xssSeriesId,
    });
  });

/**
 * /tv/:data?/state
 */
routerUserXtv.post('/tv/:data?/state', requireAuthentication, async (req, res) => {
  const { rating } = req.body;
  const { seriesId } = req.params;
  addState(rating, seriesId, req.user.id);
  console.info('state added');
});

routerUserXtv.patch('/tv/:data?/state', requireAuthentication, async (req, res) => {
  const data = req.body;
  const { seriesId } = req.params;
  updateState(data.rating, seriesId, req.user.id);
  console.info('update state');
});

routerUserXtv.delete('/tv/:data?/state', requireAuthentication, async (req, res) => {
  const data = req.body;
  const { seriesId } = req.params;
  deleteState(data.rating, seriesId, req.user.id);
  console.info('delete state');
});
