import express from 'express';
import {
  addRating,
  addState,
  updateState,
  updateRating,
  deleteRating,
  deleteState
} from '../dataOut/usersXtv.js';

export const routerUserXtv = express.Router();

/**
 * /tv/:data?/rate
 */
routerUserXtv.get('/tv/:seriesId?/rate', (req, res) => {
  const { user } = req;
  if (typeof user !== 'undefined') {
    const data = req.body;
    const { seriesId } = req.params;
    addRating(data.rating, seriesId, user.id);
    console.info('Rating has benn added');
  } else {
    console.info('no logged in user');
  }
});

routerUserXtv.patch('/tv/:data?/rate', (req, res) => {
  const { user } = req;
  if (typeof user !== 'undefined') {
    const data = req.body;
    const { seriesId } = req.params;
    updateRating(data.rating, seriesId, user.id);
    console.info('update Rating');
  } else {
    console.info('no logged in user');
  }
});

routerUserXtv.delete('/tv/:data?/rate', (req, res) => {
  const { user } = req;
  if (typeof user !== 'undefined') {
    const { seriesId } = req.params;
    deleteRating(seriesId, user.id);
    console.info('delete Rating');
  } else {
    console.info('no logged in user');
  }
});

/**
 * /tv/:data?/state
 */
routerUserXtv.get('/tv/:data?/state', (req, res) => {
  const { user } = req;
  if (typeof user !== 'undefined') {
    const data = req.body;
    const { seriesId } = req.params;
    addState(data.rating, seriesId, user.id);
    console.info('state added');
  } else {
    console.info('no logged in user');
  }
});

routerUserXtv.patch('/tv/:data?/state', (req, res) => {
  const { user } = req;
  if (typeof user !== 'undefined') {
    const data = req.body;
    const { seriesId } = req.params;
    updateState(data.rating, seriesId, user.id);
    console.info('update state');
  } else {
    console.info('no logged in user');
  }
});

routerUserXtv.delete('/tv/:data?/state', (req, res) => {
  const { user } = req;
  if (typeof user !== 'undefined') {
    const data = req.body;
    const { seriesId } = req.params;
    deleteState(data.rating, seriesId, user.id);
    console.info('delete state');
  } else {
    console.info('no logged in user');
  }
});
