const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

router.get('/', usersController.index);
router.post('/', usersController.create);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.remove);

module.exports = router;