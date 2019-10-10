const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const db = require('../database/dbConfig.js');

const server = express();

// need one more step to execute this library
const KnexSessionSotre = connectSessionKnex(session);

const sessionConfig = {
  name: 'trackpad life', // sessionid (sid)
  // THIS SHOULD NOT BE HARD CODED IN <- save in env
  secret: 'lambdasecret', 
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    secure: false,
    httpOnly: true // the browser can't access via JS
  },
  resave: false,
  saveUninitialized: false, // GDPR law !important
  store: new KnexSessionSotre({
    knex: db,
    tablename: 'session',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60
  }) // you can check this table from sqliteStudio ==> session being stored in DB
}
// if you restart the server, the session/cookie are not valid bc session is stroed at server 
// deleting cookie does not remove session as well, the session will be still in the server

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
