import express from "express";
import * as UserController from '../../controllers/user_controller.js';
import * as authJWT from '../../middleware/authJWT.js';


const router = express.Router();

router.get('/users',authJWT.verifyToken, UserController.getAllUsers);
router.get('/usersAdmin',authJWT.verifyAdmin, UserController.getAllUsersAdmin);
router.get('/user/:id',authJWT.verifyToken, UserController.getUserById);

router.put('/user/:id',authJWT.verifyToken, UserController.updateUser);
router.put('/changeUserType/:id',authJWT.verifyToken, UserController.changeType);

router.post('/registration', UserController.registration);
router.post('/loginUser', UserController.loginUser);


export default router;
