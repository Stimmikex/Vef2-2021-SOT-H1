import express from 'express';

export const routerUsers = express.Router();

/**
 * /users/
 * skilar síðu af notendum, aðeins ef notandi sem framkvæmir er stjórnandi
 */
routerUsers.get('/users', (req, res) => {
  
});

/**
 * /users/:id
 * skilar notanda, aðeins ef notandi sem framkvæmir er stjórnandi
 */
routerUsers.get('/users/:data?', (req, res) => {
  
});

/**
 * breytir hvort notandi sé stjórnandi eða ekki, aðeins ef notandi sem framkvæmir er
 * stjórnandi og er ekki að breyta sér sjálfum
 */

routerUsers.patch('/users/:data?', (req, res) => {
  
});

/**
 * /users/register
 * staðfestir og býr til notanda. Skilar auðkenni og netfangi. Notandi sem búinn er til skal aldrei vera
 */
routerUsers.get('/users/register', (req, res) => {
  
});

/**
 * /users/login
 * með netfangi og lykilorði skilar token ef gögn rétt
 */
routerUsers.post('/users/login', (req, res) => {
  
});

/**
 * /users/me
 * skilar upplýsingum um notanda sem á token, auðkenni og netfangi, aðeins ef notandi innskráður
 */
routerUsers.get('/users/me', (req, res) => {
  
});
/**
 * uppfærir netfang, lykilorð eða bæði ef gögn rétt, aðeins ef notandi innskráður
 */
routerUsers.patch('/users/me', (req, res) => {
  
});