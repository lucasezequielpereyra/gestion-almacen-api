import { Router } from 'express'
import authController from '../controllers/auth.controller'

export const router = Router()

router.post('/', authController.handleLogin)
router.get('/', authController.handleLogout)
