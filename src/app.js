import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';

import { routerUsers } from './routes/users.js';
import { routerTV } from './routes/tvShow.js';
import { routerUserXtv } from './routes/usersXtv.js';

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

if (!connectionString) {
  console.error('Vantar DATABASE_URL!');
  process.exit(1);
}

const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const app = express();

// Það sem verður notað til að dulkóða session gögnin
const sessionSecret = 'leyndarmál';

// Erum að vinna með form, verðurm að nota body parser til að fá aðgang
// að req.body
app.use(express.urlencoded({ extended: true }));

// Passport mun verða notað með session
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  maxAge: 20 * 1000, // 20 sek
}));

app.use(routerUsers);
app.use(routerTV);
app.use(routerUserXtv);

const port = 4000;

app.listen(port, () => {
  console.info(`Server running at http://127.0.0.1:${port}/`);
});
