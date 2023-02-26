import { Router } from 'express'
import organizationController from '../../controllers/organization.controller'

export const router = Router()

router.get('/', organizationController.getOrganizationByEmployee)
