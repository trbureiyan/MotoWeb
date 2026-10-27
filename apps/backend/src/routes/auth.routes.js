import {Router} from 'express';
import { register, login, logout, profile } from '../controllers/auth.controller.js';

import { authRequired } from '../middlewares/validate.token.js';

import {validateSchema} from '../middlewares/validate.middleware.js';

import { registerSchema, loginSchema } from '../schema/auth.schema.js';
const router = Router()

router.post('/register', validateSchema(registerSchema), register)
// la primera parte es la ruta, la segunda es el controlador que se va a ejecutar cuando se haga una petición a esa ruta.
router.post('/login', validateSchema(loginSchema), login)

router.post('/logout', logout)

router.get('/profile', authRequired, profile)


export default router



