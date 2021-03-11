import express from 'express';
import users from '../dataOut/users.js'

export const routerUsers = express.Router();

/**
 * /users/
 * skilar síðu af notendum, aðeins ef notandi sem framkvæmir er stjórnandi
 */
routerUsers.get('/users', (req, res) => {
    const data = users.getUsers();
    res.json(data);
});

/**
 * /users/:id
 * skilar notanda, aðeins ef notandi sem framkvæmir er stjórnandi
 */
routerUsers.get('/users/:data?', (req, res) => {
  const id = req.params.data;
  const data = users.getUserByID(id);
  return res.json(data);
});

/**
 * breytir hvort notandi sé stjórnandi eða ekki, aðeins ef notandi sem framkvæmir er
 * stjórnandi og er ekki að breyta sér sjálfum
 */

routerUsers.patch('/users/:data?', (req, res) => {
  const id = req.params.data;
  let bool = true;
  // updates users role
  if(req.user.boolean === false) {
    bool = false;
  }
  await users.updateUserByID(id, bool);
  // gets the user by id
  const data = await users.getUserByID(id);
  return res.json(data);
});

/**
 * /users/register
 * staðfestir og býr til notanda. Skilar auðkenni og netfangi. Notandi sem búinn er til skal aldrei vera
 */
routerUsers.get('/users/register', (req, res) => {
  // not complete
  await users.makeUser("data")
  return res.json(req.user)
});

/**
 * /users/login
 * með netfangi og lykilorði skilar token ef gögn rétt
 */
routerUsers.post('/users/login', (req, res) => {
  // ræna frá fyrrum verkefnum.
});

/**
 * /users/me
 * skilar upplýsingum um notanda sem á token, auðkenni og netfangi, aðeins ef notandi innskráður
 */
routerUsers.get('/users/me', (req, res) => {
  return res.json(req.user)
});
/**
 * uppfærir netfang, lykilorð eða bæði ef gögn rétt, aðeins ef notandi innskráður
 */
routerUsers.patch('/users/me', (req, res) => {
  const {
    email,
    password,
  } = req.user
});