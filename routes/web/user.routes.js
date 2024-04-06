import express from "express";
import * as UserController from '../../controllers/user_controller.js';
// const authJwt = require('../../../middleware/authJwt');

const router = express.Router();

router.get('/users', UserController.getAllUsers);
router.post('/registration', UserController.registration);
router.post('/loginUser', UserController.loginUser);


export default router;
