import { Router } from 'express'
import registerController from '../controllers/register.controller'
import { checkDuplicateUsernameOrEmail } from '../middlewares/verifySignup'

export const router = Router()

router.post(
  '/',
  [checkDuplicateUsernameOrEmail],
  registerController.handleNewUser
)
