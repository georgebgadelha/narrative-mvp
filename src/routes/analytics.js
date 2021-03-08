const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analytics');

router.get('/', analyticsController.index);
router.post('/', analyticsController.create);

module.exports = router;