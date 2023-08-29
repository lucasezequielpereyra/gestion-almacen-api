import { Router } from 'express'
import ownerController from '../../controllers/owner.controller'
import { checkDuplicateUsernameOrEmail } from '../../middlewares/verifySignup'

export const router = Router()

router.get('/employees', ownerController.getOrgazationEmployees)
router.get('/employees/inactive', ownerController.getInactiveEmployees)
router.post(
  '/employees',
  [checkDuplicateUsernameOrEmail],
  ownerController.handleNewEmployee
)
router.put('/employees', ownerController.handleUpdateEmployee)
router.delete('/employees', ownerController.handleDeleteLogicalEmployee)
