import express from 'express';
import {
  body,
  param,
  validationResult,
} from 'express-validator';
import {
  getUserByID,
  getUsers,
  updateUser,
  makeUser,
  getUserByName,
  comparePasswords,
} from '../dataOut/users.js';
import * as db from '../dataOut/utils.js';
import { createTokenForUser, requireAuthentication, requireAdminAuthentication } from '../dataOut/login.js';

export const routerUsers = express.Router();

/**
 * /users/
 * skilar síðu af notendum, aðeins ef notandi sem framkvæmir er stjórnandi
 */
routerUsers.get('/users', requireAdminAuthentication, async (req, res) => {
  const data = await getUsers();
  res.json(data);
});


routerUsers.post('/users/register', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  const createdUser = await makeUser(username, email, password);

  if (createdUser) {
    return res.json({
      id: createdUser.id,
      username: createdUser.name,
      email: createdUser.email,
      admin: createdUser.admin,
      token: createTokenForUser(createdUser.id),
    });
  }

  return res.json({ error: 'Error registering' });
});

routerUsers.post('/users/login', async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  const user = await getUserByName(username);

  if (!user) {
    return res.status(401).json({
      errors: [{
        value: username,
        msg: 'username or password incorrect',
        param: 'username',
        location: 'body',
      }],
    });
  }

  const passwordCheck = await comparePasswords(password, user.password);

  if (passwordCheck) {
    const token = createTokenForUser(user.id);
    return res.json({
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
        admin: user.admin,
      },
      token,
      expiresIn: 'not implemented',
    });
  }

  return res.status(401).json({
    errors: [{
      value: username,
      msg: 'username or password incorrect',
      param: 'username',
      location: 'body',
    }],
  });
});

routerUsers.get('/users/me',
  requireAuthentication,
  (req, res) => {
    res.json(req.user);
  });

routerUsers.patch('/users/me', requireAuthentication,
  body('password'),
  body('email'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (!email && !password) {
      return res.status(400).json({
        errors: [{
          value: req.body,
          msg: 'require at least one of: email, password',
          param: '',
          location: 'body',
        }],
      });
    }

    req.user.email = email || req.user.email;
    req.user.password = password || req.user.password;

    const user = await updateUser(req.user);

    res.json({
      id: user.id,
      username: user.name,
      email: user.email,
      admin: user.admin,
    });
  });

routerUsers.get('/users/:id', requireAdminAuthentication, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const data = await getUserByID(req.params.id);
  if (data) return res.json(data);
  return res.status(404).json({ msg: 'User not found' });
});

routerUsers.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
