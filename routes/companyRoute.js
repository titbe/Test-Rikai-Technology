const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.get('/', companyController.list);
router.get('/create', companyController.createForm);
router.post('/create', companyController.create);
router.get('/edit/:id', companyController.editForm);
router.post('/edit/:id', companyController.update);
router.post('/delete/:id', companyController.delete);

module.exports = router;
