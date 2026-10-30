import express from 'express'

import upload from '../config/upload.js'
import AuthController from '../controllers/auth.controller.js'
import FakultasController from '../controllers/fakultas.controller.js'
import ProdiController from '../controllers/prodi.controller.js'
import UploadController from '../controllers/upload.controller.js'
import UserController from '../controllers/user.controller.js'
import WelcomeController from '../controllers/welcome.controller.js'
import { authenticateJwt } from '../middleware/auth.js'
import logMiddleware from '../middleware/log.middleware.js'

const router = express.Router()

router.use(logMiddleware)

router.post('/register', AuthController.register)
router.post('/login',AuthController.login)

router.use(authenticateJwt)

router.get('/welcome', WelcomeController.welcome)
router.post('/users', UserController.store)
router.post('/upload', upload.single('file'), UploadController.store)

router.get('/fakultas', FakultasController.index)
router.get('/fakultas/:id', FakultasController.show)
router.post('/fakultas', FakultasController.store)
router.put('/fakultas/:id', FakultasController.update)
router.patch('/fakultas/:id', FakultasController.update)
router.delete('/fakultas/:id', FakultasController.delete)

router.get('/prodi', ProdiController.index)
router.post('/prodi', ProdiController.store)
router.put('/prodi/:id', ProdiController.update)
router.delete('/prodi/:id', ProdiController.delete)

export default router
