import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { getUserByID } from './users.js';

export default passport;

dotenv.config();

const {
  JWT_SECRET: jwtSecret,
  JWT_TOKENLIFETIME: tokenLifetime = 3600,
} = process.env;

if (!jwtSecret) {
  console.error('Vantar jwt secret í .env');
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  // fáum id gegnum data sem geymt er í token
  const user = await getUserByID(data.id);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

export function createTokenForUser(id) {
  const payload = { id };
  const tokenOptions = { expiresIn: tokenLifetime };
  const token = jwt.sign(payload, jwtSecret, tokenOptions);
  return token;
}

export function optionalAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user) => {
      req.user = user;
      return next();
    },
  )(req, res, next);
}

export function requireAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
        return res.status(401).json({ error });
      }

      req.user = user;
      return next();
    },
  )(req, res, next);
}

export function requireAdminAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
        return res.status(401).json({ error });
      }
      if (!user.role) {
        return res.status(401).json({ error: 'user is not admin' });
      }

      req.user = user;
      return next();
    },
  )(req, res, next);
}
