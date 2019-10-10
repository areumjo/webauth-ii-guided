const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  // AS LONG AS SOMEONE HAS A USER/PASSWORD THAT WE HAVE ALREADY VALIDATED ==> THEY SHOULD HAVE ACCESS
  // just check if session and use from the session exist

  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Invalid Credentials' });
  }


  // // this shouldn't happen ==> grabbing a cookie
  // const { username, password } = req.headers;

  // // make sure the cookie is valid
  // if (username && password) {
  //   Users.findBy({ username })
  //     .first()
  //     .then(user => {
  //       // WE NEVER NEED TO CHECK THE PASSWORD
  //       if (user && bcrypt.compareSync(password, user.password)) {
  //         next();
  //       } else {
  //         res.status(401).json({ message: 'Invalid Credentials' });
  //       }
  //     })
  //     .catch(error => {
  //       res.status(500).json({ message: 'Ran into an unexpected error' });
  //     });
  // } else {
  //   res.status(400).json({ message: 'No credentials provided' });
  // }
};
