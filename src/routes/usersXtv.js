import express from 'express';
import {
  addRating,
  addState,
  updateState,
  updateRating,
  deleteRating,
  deleteState,
  getStateAndRating,
} from '../dataOut/usersXtv.js';

import { requireAuthentication } from '../dataOut/login.js';

export const routerUserXtv = express.Router();

/**
 * /tv/:seriesId?/rate
 */
routerUserXtv.post('/tv/:seriesId?/rate', requireAuthentication, async (req, res) => {
  const data = req.body;
  const { seriesId } = req.params;
  let rowExists = await getStateAndRating(seriesId, req.user.id);
  if(rowExists) {
    await updateRating(data.rating, seriesId, req.user.id);
  } else {
    await addRating(data.rating, seriesId, req.user.id);
  }
  console.info('Rating has benn added');
  res.json({
    rating: data.rating,
    series: seriesId,
    user: req.user.id
  })
});

routerUserXtv.patch('/tv/:seriesId?/rate', requireAuthentication, async (req, res) => {
  const data = req.body;
  const { seriesId } = req.params;
  await updateRating(data.rating, seriesId, req.user.id);
  console.info('update Rating');
  res.json({
    rating: data.rating,
    series: seriesId,
    user: req.user.id
  })
});

routerUserXtv.delete('/tv/:seriesId?/rate', requireAuthentication, async (req, res) => {
  const { seriesId } = req.params;
  await deleteRating(seriesId, req.user.id);
  console.info('delete Rating');
  res.json({
    series: seriesId,
    user: req.user.id
  })
});

/**
 * /tv/:seriesId?/state
 */
routerUserXtv.post('/tv/:seriesId?/state', requireAuthentication, async (req, res) => {
  const data = req.body;
  const { seriesId } = req.params;
  let rowExists = await getStateAndRating(seriesId, req.user.id);
  if(rowExists) {
    await updateState(data.status, seriesId, req.user.id);
  } else {
    await addState(data.status, seriesId, req.user.id);
  }
  console.info('state added');
  res.json({
    status: data.status,
    series: seriesId,
    user: req.user.id
  })
});

routerUserXtv.patch('/tv/:seriesId?/state', requireAuthentication, async (req, res) => {
  const data = req.body;
  const { seriesId } = req.params;
  await updateState(data.status, seriesId, req.user.id);
  console.info('update state');
  res.json({
    status: data.status,
    series: seriesId,
    user: req.user.id
  })
});

routerUserXtv.delete('/tv/:seriesId?/state', requireAuthentication, async (req, res) => {
  const { seriesId } = req.params;
  await deleteState(seriesId, req.user.id);
  console.info('delete state');
  res.json({
    series: seriesId,
    user: req.user.id
  })
});
