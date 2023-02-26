import { Router } from 'express'
import employeeController from '../../controllers/employee.controller'

export const router = Router()

router.post('/', employeeController.handleNewEmployee)
router.put('/:id', employeeController.handleUpdateEmployee)