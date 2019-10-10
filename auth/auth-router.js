const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      // ADD INFO ABOUT OUR USER TO THE SESSION thanks to the middleware (express-session)
      // created a session
      // send back a cookie that corresponds to the session
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // ADD INFO ABOUT OUR USER TO THE SESSION thanks to the middleware (express-session)
        // created a session ==> express-session will take care, just save it
        // send back a cookie that corresponds to the session        
        req.session.user = user;
        res.status(200).json({
          message: `Welcome ${user.username}!, have a cookie!`,
        }); // cookie is generated
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json({
          message: "you can checkout but you can't leave"
        });
      } else {
        res.end();
        // will return nothing ('no body returned for response')
      }
    })
  }
})

module.exports = router;
