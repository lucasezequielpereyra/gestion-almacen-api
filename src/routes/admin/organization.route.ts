import { Router } from 'express'
import organizationController from '../../controllers/organization.controller'
import { checkDuplicateOrganizationName } from '../../middlewares/verifyNewOrg'

export const router = Router()

router.post(
  '/',
  [checkDuplicateOrganizationName],
  organizationController.handleNewOrganization
)

router.put('/', organizationController.handleNewEmployee)
