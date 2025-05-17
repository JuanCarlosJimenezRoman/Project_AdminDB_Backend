const express = require ('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser); //crear
router.get('/users', userController.getAllUsers); //obtener todos
router.get('/users/:id', userController.getUserById); //obtener por id
router.put('/users/:id', userController.updateUser); //actualizar
router.delete('/users/:id', userController.deleteUser); //eliminar

module.exports = router;
