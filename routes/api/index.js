const router = require('express').Router();

router.use('/membros', require('./membros'));

module.exports = router;
