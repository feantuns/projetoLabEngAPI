const router = require('express').Router();

router.use('/membros', require('./membros'));
router.use('/admin', require('./administradores'));

module.exports = router;
