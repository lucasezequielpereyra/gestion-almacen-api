import { Router } from 'express'
import handleLogin from '../controllers/auth.controller'

export const router = Router()

router.post('/', handleLogin)
