import express from 'express';
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
routerUserXtv.post('/tv/:seriesId?/rate', requireAuthentication, async (req, res) => {
  const data = req.body;
  const { seriesId } = req.params;
  await addRating(data.rating, seriesId, req.user.id);
  console.info('Rating has benn added');
});

routerUserXtv.patch('/tv/:data?/rate', requireAuthentication, async (req, res) => {
  const data = req.body;
  const { seriesId } = req.params;
  await updateRating(data.rating, seriesId, req.user.id);
  console.info('update Rating');
});

routerUserXtv.delete('/tv/:data?/rate', requireAuthentication, async (req, res) => {
  const { seriesId } = req.params;
  deleteRating(seriesId, req.user.id);
  console.info('delete Rating');
});

/**
 * /tv/:data?/state
 */
routerUserXtv.post('/tv/:data?/state', requireAuthentication, async (req, res) => {
  const data = req.body;
  const { seriesId } = req.params;
  addState(data.rating, seriesId, req.user.id);
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
