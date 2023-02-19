import { Router } from 'express'
import handleRefreshToken from '../controllers/refreshToken.controller'

export const router = Router()

router.get('/', handleRefreshToken)
