module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.status(401).json({ message: 'Faça Login para acessar esse conteúdo' });
  },
};
