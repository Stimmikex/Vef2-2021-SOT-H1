import express from 'express';
import xss from 'xss';
import {
  body,
  param,
  validationResult,
} from 'express-validator';
import {
  addRating,
  addState,
  updateState,
  updateRating,
  deleteRating,
  deleteState,
  getStateAndRating,
// eslint-disable-next-line import/named
} from '../dataOut/usersXtv.js';

import { requireAuthentication } from '../dataOut/login.js';

export const routerUserXtv = express.Router();

/**
 * /tv/:seriesId?/rate
 */
routerUserXtv.post('/tv/:seriesId?/rate', requireAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  body('rating')
    .isNumeric({ min: 0, max: 5 })
    .withMessage('rating need to be 0 to 5'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { rating } = req.body;
    const xssRating = xss(rating);
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    const rowExists = await getStateAndRating(xssSeriesId, req.user.id);
    if (rowExists) {
      await updateRating(xssRating, xssSeriesId, req.user.id);
    } else {
      await addRating(xssRating, xssSeriesId, req.user.id);
    }
    return res.json({
      rating: xssRating,
      series: xssSeriesId,
      user: req.user.id,
    });
  });

routerUserXtv.patch('/tv/:seriesId?/rate', requireAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  body('rating')
    .if()
    .exists()
    .isNumeric({ min: 0, max: 5 })
    .withMessage('rating need to be 0 to 5'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { rating } = req.body;
    const xssRating = xss(rating);
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    await updateRating(xssRating, xssSeriesId, req.user.id);
    return res.json({
      rating: xssRating,
      series: xssSeriesId,
      user: req.user.id,
    });
  });

routerUserXtv.delete('/tv/:seriesId?/rate', requireAuthentication,
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
    await deleteRating(xssSeriesId, req.user.id);
    return res.json({
      series: xssSeriesId,
      user: req.user.id,
    });
  });

/**
 * /tv/:seriesId?/state
 */
routerUserXtv.post('/tv/:seriesId?/state', requireAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  body('status')
    .isLength({ min: 0, max: 256 })
    .withMessage('status need to be 0 to 256'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { status } = req.body;
    const xssStatus = xss(status);
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    const rowExists = await getStateAndRating(xssSeriesId, req.user.id);
    if (rowExists) {
      await updateState(xssStatus, xssSeriesId, req.user.id);
    } else {
      await addState(xssStatus, xssSeriesId, req.user.id);
    }
    return res.json({
      status: xssStatus,
      series: xssSeriesId,
      user: req.user.id,
    });
  });

routerUserXtv.patch('/tv/:seriesId?/state', requireAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  body('status')
    .if()
    .exists()
    .isNumeric({ min: 0, max: 256 })
    .withMessage('status need to be 0 to 256'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { status } = req.body;
    const xssStatus = xss(status);
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    await updateState(xssStatus, xssSeriesId, req.user.id);
    return res.json({
      status: xssStatus,
      series: xssSeriesId,
      user: req.user.id,
    });
  });

routerUserXtv.delete('/tv/:seriesId?/state', requireAuthentication,
  param('seriesId')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  async (req, res) => {
    const { seriesId } = req.params;
    const xssSeriesId = xss(seriesId);
    await deleteState(xssSeriesId, req.user.id);
    res.json({
      series: xssSeriesId,
      user: req.user.id,
    });
  });
