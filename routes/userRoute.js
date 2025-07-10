const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.list);
router.get('/create', userController.createForm);
router.post('/create', userController.create);
router.get('/edit/:id', userController.editForm);
router.post('/edit/:id', userController.update);
router.post('/delete/:id', userController.delete);

module.exports = router;
