import { Router } from 'express'
import organizationController from '../../controllers/organization.controller'
import { verifyOwner } from '../../middlewares/verifyJwt'

export const router = Router()

router.get('/', organizationController.getOrganizationByEmployee)
