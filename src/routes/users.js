import express from 'express';
import xss from 'xss';
import {
  body,
  validationResult,
} from 'express-validator';
import {
  getUserByID,
  getUsers,
  updateUser,
  upgradeUser,
  makeUser,
  getUserByName,
  comparePasswords,
} from '../dataOut/users.js';
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

routerUsers.post('/users/register',
  body('username')
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('username need to be 10 to 256'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('email is needed')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 10, max: 256 })
    .withMessage('password need to be 10 to 256'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    const xssUsername = xss(username);
    const xssEmail = xss(email);
    const xssPassword = xss(password);

    const createdUser = await makeUser(xssUsername, xssEmail, xssPassword);

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

routerUsers.post('/users/login',
  body('username')
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('username need to be 10 to 256'),
  body('password')
    .trim()
    .isLength({ min: 10, max: 256 })
    .withMessage('password need to be 10 to 256'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const xssUsername = xss(username);
    const xssPassword = xss(password);

    const user = await getUserByName(xssUsername);

    if (!user) {
      return res.status(401).json({ error: 'username or password incorrect' });
    }

    const passwordCheck = await comparePasswords(xssPassword, user.password);

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
  body('password')
    .if(body('password').exists())
    .isLength({ min: 10, max: 256 })
    .withMessage('password need to be 10 to 256'),
  body('email')
    .if(body('email').exists())
    .isEmail()
    .withMessage('email must exist')
    .normalizeEmail(),
  // eslint-disable-next-line consistent-return
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const xssEmail = xss(email);
    const xssPassword = xss(password);

    if (!xssEmail && !xssPassword) {
      return res.status(400).json({
        errors: [{
          value: req.body,
          msg: 'require at least one of: email, password',
          param: '',
          location: 'body',
        }],
      });
    }

    const data = {
      id: req.user.id,
      email: '',
      password: '',
    };

    data.email = xssEmail || req.user.email;
    data.password = xssPassword || req.user.password;

    const user = await updateUser(data, req.user.password);

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

routerUsers.patch('/users/:id', requireAdminAuthentication, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.id;
  const xssId = xss(id);
  const data = await upgradeUser(xssId);
  if (data) return res.json(data);
  return res.status(404).json({ msg: 'User not found' });
});

routerUsers.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
