const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load Admin model
const Administrador = require('../models/Administrador');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'senha' },
      (email, password, done) => {
        // Match User
        Administrador.findOne({ where: { email: email } })
          .then(admin => {
            if (!admin) {
              return done(null, false, {
                message: 'Esse email não está cadastrado',
              });
            }

            // Match password
            bcrypt.compare(password, admin.dataValues.senha, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, admin.dataValues);
              } else {
                return done(null, false, { message: 'Senha incorreta' });
              }
            });
          })
          .catch(err => console.log(err));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Administrador.findByPk(id)
      .then(admin => {
        done(null, admin);
      })
      .catch(err => console.log(err));
  });
};
