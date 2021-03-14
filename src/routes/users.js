import express from 'express';
import {
  getUserByID,
  getUsers,
  updateUserByID,
  makeUser,
  getUserByName,
} from '../dataOut/users.js';

export const routerUsers = express.Router();

/**
 * /users/
 * skilar síðu af notendum, aðeins ef notandi sem framkvæmir er stjórnandi
 */
routerUsers.get('/users', async (req, res) => {
  const data = await getUsers();
  res.json(data);
});

/**
 * /users/:id
 * skilar notanda, aðeins ef notandi sem framkvæmir er stjórnandi
 */
routerUsers.get('/users/:data?', async (req, res) => {
  const id = req.params.data;
  const data = await getUserByID(id);
  res.json(data);
});

/**
 * breytir hvort notandi sé stjórnandi eða ekki, aðeins ef notandi sem framkvæmir er
 * stjórnandi og er ekki að breyta sér sjálfum
 */

routerUsers.patch('/users/:data?', async (req, res) => {
  const id = req.params.data;
  let bool = true;
  // updates users role
  if (req.user.boolean === false) {
    bool = false;
  }
  await updateUserByID(id, bool);
  // gets the user by id
  const data = await getUserByID(id);
  res.json(data);
});

/**
 * /users/register
 * staðfestir og býr til notanda. Skilar auðkenni og netfangi. 
 * Notandi sem búinn er til skal aldrei vera
 */
routerUsers.post('/users/register', async (req, res) => {
  // not complete
  await makeUser('data');
  res.json(req.user);
});

/**
 * /users/login
 * með netfangi og lykilorði skilar token ef gögn rétt
 */
// routerUsers.post('/users/login', async (req, res) => {
//   '/login',
//   passport.authenticate('local', {
//     failureMessage: 'Notandanafn eða lykilorð vitlaust.',
//     failureRedirect: '/login',
//   }),
//   (req, res) => {
//     res.redirect('/admin');
//   },
// });

/**
 * /users/me
 * skilar upplýsingum um notanda sem á token, auðkenni og netfangi, aðeins ef notandi innskráður
 */
routerUsers.get('/users/me', async (req, res) => {
  res.json(req.user);
});
/**
 * uppfærir netfang, lykilorð eða bæði ef gögn rétt, aðeins ef notandi innskráður
 */
routerUsers.patch('/users/me', async (req, res) => {
  const {
    email,
    password,
  } = req.user;
});

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

routerUsers.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  let message = '';

  // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau
  // og hreinsum skilaboð
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  return res.render('userPages/login', { message });
});

routerUsers.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
  }
  res.render('userPages/register', { user });
});

// hér væri hægt að bæta við enn frekari (og betri) staðfestingu á gögnum
async function validateUser(username, password) {
  if (typeof username !== 'string' || username.length < 2) {
    return 'Notendanafn verður að vera amk 2 stafir';
  }

  const user = await getUserByName(username);

  // Villa frá findByUsername
  if (user === null) {
    return 'Gat ekki athugað notendanafn';
  }

  if (user) {
    return 'Notendanafn er þegar skráð';
  }

  if (typeof password !== 'string' || password.length < 6) {
    return 'Lykilorð verður að vera amk 6 stafir';
  }

  return null;
}

async function register(req, res, next) {
  const { username, password } = req.body;

  const validationMessage = await validateUser(username, password);

  if (validationMessage) {
    return res.send(`
      <p>${validationMessage}</p>
      <a href="/register">Reyna aftur</a>
    `);
  }

  await createUser(username, password);

  // næsta middleware mun sjá um að skrá notanda inn því hann verður til
  // og `username` og `password` verða ennþá sett sem rétt í `req`
  return next();
}

routerUsers.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

routerUsers.get('/admin', ensureLoggedIn, (req, res) => {
  res.redirect('/');
});
